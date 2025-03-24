import { users, type User, type InsertUser, companies, type Company, type InsertCompany, emissionData, type EmissionData, type InsertEmissionData, emissionDetails, type EmissionDetail, type InsertEmissionDetail, reports, type Report, type InsertReport } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

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
  
  sessionStore: session.SessionStore;

  constructor() {
    this.userStore = new Map();
    this.companyStore = new Map();
    this.emissionDataStore = new Map();
    this.emissionDetailStore = new Map();
    this.reportStore = new Map();
    
    this.currentUserId = 1;
    this.currentCompanyId = 1;
    this.currentEmissionDataId = 1;
    this.currentEmissionDetailId = 1;
    this.currentReportId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 1 day
    });
    
    // Initialize with a sample company
    this.createCompany({
      name: "Entreprise Exemple",
      sector: "Industrie manufacturière",
      sectorCode: "C",
      employeeCount: 250,
      address: "123 Rue de l'Industrie",
      postalCode: "75001",
      city: "Paris",
      country: "France",
      siret: "12345678900012",
      dpoName: "Jean Dupont",
      dpoEmail: "jean.dupont@exemple.fr",
      dpoPhone: "+33123456789",
      dpoIsExternal: false
    });
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
    const user: User = { ...insertUser, id };
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
    const company: Company = { ...insertCompany, id };
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
    const emissionData: EmissionData = { 
      ...insertEmissionData, 
      id,
      submittedAt: now,
      totalEmissions: insertEmissionData.scope1Total + insertEmissionData.scope2Total + insertEmissionData.scope3Total
    };
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
    const emissionDetail: EmissionDetail = { ...insertEmissionDetail, id };
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
    const report: Report = { 
      ...insertReport, 
      id,
      createdAt: now
    };
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

export const storage = new MemStorage();
