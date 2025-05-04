import { users, type User, type InsertUser, companies, type Company, type InsertCompany, emissionData, type EmissionData, type InsertEmissionData, emissionDetails, type EmissionDetail, type InsertEmissionDetail, reports, type Report, type InsertReport } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";
import { eq, asc, desc } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Company methods
  getCompany(id: number): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<Company>): Promise<Company | undefined>;
  
  // Emission data methods
  getEmissionData(id: number): Promise<EmissionData | undefined>;
  getEmissionDataByCompany(companyId: number): Promise<EmissionData[]>;
  createEmissionData(emissionData: InsertEmissionData): Promise<EmissionData>;
  updateEmissionData(id: number, emissionData: Partial<EmissionData>): Promise<EmissionData | undefined>;
  
  // Emission detail methods
  getEmissionDetails(emissionDataId: number): Promise<EmissionDetail[]>;
  createEmissionDetail(emissionDetail: InsertEmissionDetail): Promise<EmissionDetail>;
  
  // Report methods
  getReport(id: number): Promise<Report | undefined>;
  getReportsByCompany(companyId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Initialize the session store with PostgreSQL
    this.sessionStore = new PostgresSessionStore({
      pool, 
      createTableIfMissing: true,
      tableName: 'session',  // Nom explicite de la table
      schemaName: 'public'   // Schéma PostgreSQL
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const now = new Date();
      // Ajout des valeurs par défaut
      const userWithDefaults = {
        ...insertUser,
        lastLogin: now,
        consentDataProcessing: insertUser.consentDataProcessing || false,
        isActive: true,
      };
      
      const [user] = await db.insert(users).values(userWithDefaults).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set(userUpdate)
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    try {
      const [company] = await db.select().from(companies).where(eq(companies.id, id));
      return company;
    } catch (error) {
      console.error("Error fetching company:", error);
      return undefined;
    }
  }
  
  async getCompanies(): Promise<Company[]> {
    try {
      return await db.select().from(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      return [];
    }
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    try {
      const [company] = await db.insert(companies).values(insertCompany).returning();
      return company;
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  }
  
  async updateCompany(id: number, companyUpdate: Partial<Company>): Promise<Company | undefined> {
    try {
      const [updatedCompany] = await db
        .update(companies)
        .set(companyUpdate)
        .where(eq(companies.id, id))
        .returning();
      return updatedCompany;
    } catch (error) {
      console.error("Error updating company:", error);
      return undefined;
    }
  }

  // Emission data methods
  async getEmissionData(id: number): Promise<EmissionData | undefined> {
    try {
      const [data] = await db.select().from(emissionData).where(eq(emissionData.id, id));
      return data;
    } catch (error) {
      console.error("Error fetching emission data:", error);
      return undefined;
    }
  }
  
  async getEmissionDataByCompany(companyId: number): Promise<EmissionData[]> {
    try {
      return await db
        .select()
        .from(emissionData)
        .where(eq(emissionData.companyId, companyId))
        .orderBy(desc(emissionData.submittedAt));
    } catch (error) {
      console.error("Error fetching company emission data:", error);
      return [];
    }
  }
  
  async createEmissionData(insertEmissionData: InsertEmissionData): Promise<EmissionData> {
    try {
      const now = new Date();
      const totalEmissions = 
        (insertEmissionData.scope1Total || 0) + 
        (insertEmissionData.scope2Total || 0) + 
        (insertEmissionData.scope3Total || 0);
      
      const emissionDataWithDefaults = {
        ...insertEmissionData,
        submittedAt: now,
        status: "draft",
        submittedBy: null,
        validatedBy: null,
        validatedAt: null,
        totalEmissions
      };
      
      const [data] = await db.insert(emissionData).values(emissionDataWithDefaults).returning();
      return data;
    } catch (error) {
      console.error("Error creating emission data:", error);
      throw error;
    }
  }
  
  async updateEmissionData(id: number, emissionDataUpdate: Partial<EmissionData>): Promise<EmissionData | undefined> {
    try {
      // Si l'un des champs scope est mis à jour, recalculer le total
      if (emissionDataUpdate.scope1Total !== undefined || 
          emissionDataUpdate.scope2Total !== undefined || 
          emissionDataUpdate.scope3Total !== undefined) {
        
        const [currentData] = await db.select().from(emissionData).where(eq(emissionData.id, id));
        
        if (currentData) {
          const scope1 = emissionDataUpdate.scope1Total !== undefined ? emissionDataUpdate.scope1Total : currentData.scope1Total || 0;
          const scope2 = emissionDataUpdate.scope2Total !== undefined ? emissionDataUpdate.scope2Total : currentData.scope2Total || 0;
          const scope3 = emissionDataUpdate.scope3Total !== undefined ? emissionDataUpdate.scope3Total : currentData.scope3Total || 0;
          
          emissionDataUpdate.totalEmissions = scope1 + scope2 + scope3;
        }
      }
      
      const [updatedData] = await db
        .update(emissionData)
        .set(emissionDataUpdate)
        .where(eq(emissionData.id, id))
        .returning();
      return updatedData;
    } catch (error) {
      console.error("Error updating emission data:", error);
      return undefined;
    }
  }

  // Emission detail methods
  async getEmissionDetails(emissionDataId: number): Promise<EmissionDetail[]> {
    try {
      return await db
        .select()
        .from(emissionDetails)
        .where(eq(emissionDetails.emissionDataId, emissionDataId));
    } catch (error) {
      console.error("Error fetching emission details:", error);
      return [];
    }
  }
  
  async createEmissionDetail(insertEmissionDetail: InsertEmissionDetail): Promise<EmissionDetail> {
    try {
      // Ensure unit has a value
      const detailWithDefaults = {
        ...insertEmissionDetail,
        unit: insertEmissionDetail.unit || "tCO2e"
      };
      
      const [detail] = await db.insert(emissionDetails).values(detailWithDefaults).returning();
      return detail;
    } catch (error) {
      console.error("Error creating emission detail:", error);
      throw error;
    }
  }

  // Report methods
  async getReport(id: number): Promise<Report | undefined> {
    try {
      const [report] = await db.select().from(reports).where(eq(reports.id, id));
      return report;
    } catch (error) {
      console.error("Error fetching report:", error);
      return undefined;
    }
  }
  
  async getReportsByCompany(companyId: number): Promise<Report[]> {
    try {
      return await db
        .select()
        .from(reports)
        .where(eq(reports.companyId, companyId))
        .orderBy(desc(reports.createdAt));
    } catch (error) {
      console.error("Error fetching company reports:", error);
      return [];
    }
  }
  
  async createReport(insertReport: InsertReport): Promise<Report> {
    try {
      const now = new Date();
      const reportWithDefaults = {
        ...insertReport,
        createdAt: now,
        status: "draft",
        createdBy: null
      };
      
      const [report] = await db.insert(reports).values(reportWithDefaults).returning();
      return report;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }
  
  async updateReport(id: number, reportUpdate: Partial<Report>): Promise<Report | undefined> {
    try {
      const [updatedReport] = await db
        .update(reports)
        .set(reportUpdate)
        .where(eq(reports.id, id))
        .returning();
      return updatedReport;
    } catch (error) {
      console.error("Error updating report:", error);
      return undefined;
    }
  }


}

// Créer une classe MemStorage pour maintenir la rétrocompatibilité
export class MemStorage implements IStorage {
  private userStore: Map<number, User>;
  private companyStore: Map<number, Company>;
  private emissionDataStore: Map<number, EmissionData>;
  private emissionDetailStore: Map<number, EmissionDetail>;
  private reportStore: Map<number, Report>;
  
  private currentUserId: number;
  private currentCompanyId: number;
  private currentEmissionDataId: number;
  private currentEmissionDetailId: number;
  private currentReportId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.userStore = new Map();
    this.companyStore = new Map();
    this.emissionDataStore = new Map();
    this.emissionDetailStore = new Map();
    this.reportStore = new Map();
    
    this.currentUserId = 3;
    this.currentCompanyId = 2;
    this.currentEmissionDataId = 1;
    this.currentEmissionDetailId = 1;
    this.currentReportId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
    
    // Créer des utilisateurs de démonstration avec mot de passe simplifié
    const demoUser = {
      id: 1,
      username: "demo",
      password: "demo",
      firstName: "Utilisateur",
      lastName: "Démo",
      email: "demo@carbonos.fr",
      role: "user",
      consentDataProcessing: true,
      isActive: true,
      companyId: 1,
      lastLogin: new Date()
    };
    
    const adminUser = {
      id: 2,
      username: "admin",
      password: "demo", 
      firstName: "Administrateur",
      lastName: "Système",
      email: "admin@carbonos.fr",
      role: "admin",
      consentDataProcessing: true,
      isActive: true,
      companyId: 1,
      lastLogin: new Date()
    };
    
    this.userStore.set(demoUser.id, demoUser);
    this.userStore.set(adminUser.id, adminUser);
    
    const demoCompany = {
      id: 1,
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
    };
    
    this.companyStore.set(demoCompany.id, demoCompany);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id } as User;
    this.userStore.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const user = this.userStore.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userUpdate };
    this.userStore.set(id, updatedUser);
    return updatedUser;
  }

  // Company methods
  async getCompany(id: number): Promise<Company | undefined> {
    return this.companyStore.get(id);
  }
  
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companyStore.values());
  }
  
  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const company = { ...insertCompany, id } as Company;
    this.companyStore.set(id, company);
    return company;
  }
  
  async updateCompany(id: number, companyUpdate: Partial<Company>): Promise<Company | undefined> {
    const company = this.companyStore.get(id);
    if (!company) return undefined;
    
    const updatedCompany = { ...company, ...companyUpdate };
    this.companyStore.set(id, updatedCompany);
    return updatedCompany;
  }

  // Emission data methods
  async getEmissionData(id: number): Promise<EmissionData | undefined> {
    return this.emissionDataStore.get(id);
  }
  
  async getEmissionDataByCompany(companyId: number): Promise<EmissionData[]> {
    return Array.from(this.emissionDataStore.values())
      .filter(data => data.companyId === companyId);
  }
  
  async createEmissionData(insertEmissionData: InsertEmissionData): Promise<EmissionData> {
    const id = this.currentEmissionDataId++;
    const now = new Date();
    const emissionData = { 
      ...insertEmissionData, 
      id,
      submittedAt: now,
      status: "draft",
      submittedBy: null,
      validatedBy: null,
      validatedAt: null,
      totalEmissions: (insertEmissionData.scope1Total || 0) + 
                     (insertEmissionData.scope2Total || 0) + 
                     (insertEmissionData.scope3Total || 0)
    } as EmissionData;
    this.emissionDataStore.set(id, emissionData);
    return emissionData;
  }
  
  async updateEmissionData(id: number, emissionDataUpdate: Partial<EmissionData>): Promise<EmissionData | undefined> {
    const data = this.emissionDataStore.get(id);
    if (!data) return undefined;
    
    const updatedData = { ...data, ...emissionDataUpdate };
    this.emissionDataStore.set(id, updatedData);
    return updatedData;
  }

  // Emission detail methods
  async getEmissionDetails(emissionDataId: number): Promise<EmissionDetail[]> {
    return Array.from(this.emissionDetailStore.values())
      .filter(detail => detail.emissionDataId === emissionDataId);
  }
  
  async createEmissionDetail(insertEmissionDetail: InsertEmissionDetail): Promise<EmissionDetail> {
    const id = this.currentEmissionDetailId++;
    const emissionDetail = { 
      ...insertEmissionDetail, 
      id,
      unit: insertEmissionDetail.unit || "tCO2e"
    } as EmissionDetail;
    this.emissionDetailStore.set(id, emissionDetail);
    return emissionDetail;
  }

  // Report methods
  async getReport(id: number): Promise<Report | undefined> {
    return this.reportStore.get(id);
  }
  
  async getReportsByCompany(companyId: number): Promise<Report[]> {
    return Array.from(this.reportStore.values())
      .filter(report => report.companyId === companyId);
  }
  
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const now = new Date();
    const report = { 
      ...insertReport, 
      id,
      createdAt: now,
      status: "draft",
      createdBy: null
    } as Report;
    this.reportStore.set(id, report);
    return report;
  }
  
  async updateReport(id: number, reportUpdate: Partial<Report>): Promise<Report | undefined> {
    const report = this.reportStore.get(id);
    if (!report) return undefined;
    
    const updatedReport = { ...report, ...reportUpdate };
    this.reportStore.set(id, updatedReport);
    return updatedReport;
  }
}

// Remplacer l'implémentation par celle basée sur la base de données
export const storage = new DatabaseStorage();
