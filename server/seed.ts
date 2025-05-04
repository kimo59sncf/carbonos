import { db } from './db';
import { users, companies } from '@shared/schema';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  try {
    console.log("Début de l'initialisation de la base de données...");
    
    // Vérifier si l'entreprise de démo existe déjà
    const existingCompanies = await db.select().from(companies).where(eq(companies.name, "CarbonOS Démo"));
    
    let companyId = 1;
    
    if (existingCompanies.length === 0) {
      console.log("Création de l'entreprise de démonstration...");
      
      // Créer l'entreprise de démo
      const [demoCompany] = await db.insert(companies).values({
        name: "CarbonOS Démo",
        sector: "Technologies de l'information",
        sectorCode: "J.62",
        employeeCount: 120,
        address: "123 Rue de l'Innovation",
        postalCode: "75008",
        city: "Paris",
        country: "France",
        siret: "98765432100012",
        dpoName: "Sophie Martin",
        dpoEmail: "dpo@carbonos.fr",
        dpoPhone: "+33123456789",
        dpoIsExternal: false
      }).returning();
      
      companyId = demoCompany.id;
      console.log("Entreprise de démonstration créée avec l'id:", companyId);
    } else {
      companyId = existingCompanies[0].id;
      console.log("Entreprise de démonstration existante trouvée avec l'id:", companyId);
    }
    
    // Vérifier si les utilisateurs de démo existent déjà
    const existingUsers = await db.select().from(users).where(eq(users.username, "demo"));
    
    if (existingUsers.length === 0) {
      console.log("Création des utilisateurs de démonstration...");
      
      // Mot de passe spécial pour le démo: "demo"
      // Dans auth.ts, il y a une vérification spéciale pour ce mot de passe
      const demoPassword = "demo";
      
      // Créer l'utilisateur de démo
      await db.insert(users).values({
        username: "demo",
        password: demoPassword,
        firstName: "Utilisateur",
        lastName: "Démo",
        email: "demo@carbonos.fr",
        role: "user",
        consentDataProcessing: true,
        isActive: true,
        companyId: companyId,
        lastLogin: new Date()
      });
      
      // Créer l'utilisateur admin
      await db.insert(users).values({
        username: "admin",
        password: demoPassword,
        firstName: "Administrateur",
        lastName: "Système",
        email: "admin@carbonos.fr",
        role: "admin",
        consentDataProcessing: true,
        isActive: true,
        companyId: companyId,
        lastLogin: new Date()
      });
      
      console.log("Utilisateurs de démonstration créés avec succès!");
    } else {
      console.log("Les utilisateurs de démonstration existent déjà dans la base de données.");
    }
    
    console.log("Initialisation de la base de données terminée avec succès!");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
  }
}

// Exécuter la fonction d'initialisation
seedDatabase()
  .then(() => {
    console.log("Script d'initialisation terminé!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Erreur lors de l'exécution du script d'initialisation:", err);
    process.exit(1);
  });