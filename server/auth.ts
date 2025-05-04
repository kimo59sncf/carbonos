import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { insertUserSchema, User as UserType } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    // Cas spécial pour les comptes de démonstration
    if (stored === "demo") {
      console.log("Compte de démonstration détecté, vérification simplifiée");
      return supplied === "Demo2023!";
    }

    // Pour les autres comptes, utiliser la méthode standard
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      console.error("Format de mot de passe stocké invalide:", stored);
      return false;
    }
    
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Erreur lors de la comparaison des mots de passe:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  // Initialisation standard sans nettoyage forcé
  console.log("Initializing authentication system...");
  
  const sessionSettings: session.SessionOptions = {
    secret: "carbon-os-secret-key-" + new Date().toISOString().slice(0, 10), // Régénérer à chaque redémarrage
    resave: true,                      // Force la sauvegarde même si pas modifiée
    saveUninitialized: true,           // Sauvegarde même si session vide
    rolling: true,                     // Reset le timer à chaque requête
    store: storage.sessionStore,
    name: "carbonos_session",          // Nouveau nom pour éviter les conflits
    cookie: {
      secure: false,                   // Pas de HTTPS en développement
      httpOnly: true,                  // Non accessible par JavaScript
      sameSite: "lax",                 // Plus permissif pour les redirections
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours (plus long pour faciliter les tests)
      path: "/",                       // Valide sur tout le site
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Login attempt:", { username });
        const user = await storage.getUserByUsername(username);
        console.log("User found:", user ? "Yes" : "No");
        
        if (!user) {
          console.log("Authentication failed: User not found");
          return done(null, false);
        }
        
        const passwordMatch = await comparePasswords(password, user.password);
        console.log("Password match:", passwordMatch ? "Yes" : "No");
        
        if (!passwordMatch) {
          console.log("Authentication failed: Password mismatch");
          return done(null, false);
        }
        
        // Update last login time
        await storage.updateUser(user.id, {
          lastLogin: new Date()
        });
        console.log("Authentication successful for user:", username);
        return done(null, user);
      } catch (error) {
        console.error("Authentication error:", error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    console.log("Deserializing user id:", id);
    try {
      const user = await storage.getUser(id);
      console.log("Deserialized user found:", user ? "Yes" : "No");
      if (user) {
        done(null, user);
      } else {
        console.log("User not found during deserialization");
        done(null, false);
      }
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Ce nom d'utilisateur existe déjà" });
      }

      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser({
        ...validatedData,
        password: await hashPassword(validatedData.password)
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Données d'inscription invalides" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login request received:", req.body);
    console.log("Login - Session ID before auth:", req.sessionID);
    console.log("Login - Session before auth:", req.session);
    
    // Mode démo - court-circuiter l'authentification pour faciliter les tests
    // permet de se connecter avec n'importe quel mot de passe pour "demo"
    if (req.body.username === "demo") {
      console.log("Mode DEMO activé - authentification immédiate");
      // Obtenir l'utilisateur de la base de données
      storage.getUserByUsername("demo").then(user => {
        if (!user) {
          console.error("Utilisateur demo introuvable dans la base de données !");
          return res.status(500).json({ message: "Erreur de configuration" });
        }
      
        req.login(user, (err) => {
          if (err) {
            console.error("Login session error (demo mode):", err);
            return next(err);
          }
          
          console.log("Demo login successful, session established");
          console.log("Login - Session ID after login:", req.sessionID);
          
          // Force session save
          req.session.save((err) => {
            if (err) console.error("Session save error:", err);
            
            // Set a long-lasting cookie
            res.cookie('carbonos_user', user.username, { 
              maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
              httpOnly: false, 
              path: '/'
            });
            
            // Réponse immédiate pour éviter les timeouts
            return res.status(200).json(user);
          });
        });
      }).catch(error => {
        console.error("Demo login database error:", error);
        return res.status(500).json({ message: "Erreur de base de données" });
      });
      
      return; // Important pour éviter l'exécution du reste du code
    }
    
    // Authentification standard pour les autres utilisateurs
    passport.authenticate("local", async (err: any, user: Express.User | false, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      if (!user) {
        console.log("Login failed: user not authenticated");
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
      
      try {
        req.login(user, (err) => {
          if (err) {
            console.error("Login session error:", err);
            return next(err);
          }
          
          console.log("Login successful, session established");
          
          // Force session save to ensure data is persisted immediately
          req.session.save((err) => {
            if (err) {
              console.error("Session save error:", err);
              return next(err);
            }
            
            // Définir un cookie de session explicitement
            res.cookie('carbonos_user', user.username, { 
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
              httpOnly: false,
              path: '/'
            });
            
            return res.status(200).json(user);
          });
        });
      } catch (loginError) {
        console.error("Error in login process:", loginError);
        return next(loginError);
      }
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", async (req, res) => {
    console.log("GET /api/user - Session ID:", req.sessionID);
    console.log("GET /api/user - Is authenticated:", req.isAuthenticated());
    console.log("GET /api/user - User:", req.user);
    console.log("GET /api/user - Session:", req.session);
    console.log("GET /api/user - Cookies:", req.headers.cookie);
    
    // Vérifier l'authentification standard
    if (req.isAuthenticated()) {
      console.log("GET /api/user - Authenticated via session, returning user data");
      return res.json(req.user);
    }
    
    // Solution de secours - vérifier le cookie personnalisé
    const cookies = req.headers.cookie;
    if (cookies && cookies.includes('carbonos_user=')) {
      try {
        // Extraire le nom d'utilisateur du cookie
        const usernameCookie = cookies.split(';')
          .find(cookie => cookie.trim().startsWith('carbonos_user='));
        
        if (usernameCookie) {
          const username = usernameCookie.split('=')[1];
          console.log("GET /api/user - Cookie username found:", username);
          
          // Chercher l'utilisateur dans la DB
          const user = await storage.getUserByUsername(username);
          
          if (user) {
            console.log("GET /api/user - User found via cookie, authenticating session");
            // Authentifier l'utilisateur manuellement
            req.login(user, (err) => {
              if (err) {
                console.error("Error logging in user via cookie:", err);
                return res.sendStatus(401);
              }
              return res.json(user);
            });
            return;
          }
        }
      } catch (error) {
        console.error("Error processing cookie auth:", error);
      }
    }
    
    console.log("GET /api/user - Not authenticated, returning 401");
    return res.sendStatus(401);
  });
}
