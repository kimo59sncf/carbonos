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
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "carbon-os-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    name: "carbonos.sid", 
    cookie: {
      secure: false, // Pas de HTTPS en développement
      httpOnly: true, 
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 jour
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

    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      if (!user) {
        console.log("Login failed: user not authenticated");
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error("Login session error:", err);
          return next(err);
        }
        
        console.log("Login successful, session established");
        console.log("Login - Session ID after login:", req.sessionID);
        console.log("Login - Session after login:", req.session);
        console.log("Login - User is authenticated:", req.isAuthenticated());
        
        // Force session save to ensure data is persisted immediately
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return next(err);
          }
          console.log("Session saved successfully");
          return res.status(200).json(user);
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("GET /api/user - Session ID:", req.sessionID);
    console.log("GET /api/user - Is authenticated:", req.isAuthenticated());
    console.log("GET /api/user - User:", req.user);
    console.log("GET /api/user - Session:", req.session);
    console.log("GET /api/user - Cookies:", req.headers.cookie);
    
    if (!req.isAuthenticated()) {
      console.log("GET /api/user - Not authenticated, returning 401");
      return res.sendStatus(401);
    }
    
    console.log("GET /api/user - Authenticated, returning user data");
    res.json(req.user);
  });
}
