import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  companyId: integer("company_id"),
  lastLogin: integer("last_login", { mode: 'timestamp' }),
  consentDataProcessing: integer("consent_data_processing", { mode: 'boolean' }).default(false),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
});

// Companies table
export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sector: text("sector"),
  sectorCode: text("sector_code"),
  employeeCount: integer("employee_count"),
  address: text("address"),
  postalCode: text("postal_code"),
  city: text("city"),
  country: text("country").default("France"),
  siret: text("siret"),
  dpoName: text("dpo_name"),
  dpoEmail: text("dpo_email"),
  dpoPhone: text("dpo_phone"),
  dpoIsExternal: integer("dpo_is_external", { mode: 'boolean' }),
});

// Emission data table
export const emissionData = sqliteTable("emission_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyId: integer("company_id").notNull(),
  reportingPeriod: text("reporting_period").notNull(),
  reportingYear: integer("reporting_year").notNull(),
  submittedBy: integer("submitted_by"),
  submittedAt: integer("submitted_at", { mode: 'timestamp' }),
  validatedBy: integer("validated_by"),
  validatedAt: integer("validated_at", { mode: 'timestamp' }),
  status: text("status").default("draft"),
  scope1Total: integer("scope1_total").default(0),
  scope2Total: integer("scope2_total").default(0),
  scope3Total: integer("scope3_total").default(0),
  totalEmissions: integer("total_emissions").default(0),
  methodologyNotes: text("methodology_notes"),
});

// Emission details table
export const emissionDetails = sqliteTable("emission_details", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  emissionDataId: integer("emission_data_id").notNull(),
  source: text("source").notNull(),
  scope: text("scope").notNull(),
  category: text("category"),
  value: integer("value").notNull(),
  unit: text("unit").notNull().default("tCO2e"),
  notes: text("notes"),
});

// Reports table
export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyId: integer("company_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  year: integer("year").notNull(),
  createdBy: integer("created_by"),
  createdAt: integer("created_at", { mode: 'timestamp' }),
  status: text("status").default("draft"),
  data: text("data", { mode: 'json' }),
});

// Create insert schemas for Zod validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  companyId: true,
  consentDataProcessing: true,
  isActive: true,
});

export const insertCompanySchema = createInsertSchema(companies);

export const insertEmissionDataSchema = createInsertSchema(emissionData).pick({
  companyId: true,
  reportingPeriod: true,
  reportingYear: true,
  submittedBy: true,
  scope1Total: true,
  scope2Total: true,
  scope3Total: true,
  totalEmissions: true,
  methodologyNotes: true,
});

export const insertEmissionDetailSchema = createInsertSchema(emissionDetails).pick({
  emissionDataId: true,
  source: true,
  scope: true,
  category: true,
  value: true,
  unit: true,
  notes: true,
});

export const insertReportSchema = createInsertSchema(reports).pick({
  companyId: true,
  name: true,
  type: true,
  year: true,
  createdBy: true,
  data: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type EmissionData = typeof emissionData.$inferSelect;
export type InsertEmissionData = z.infer<typeof insertEmissionDataSchema>;

export type EmissionDetail = typeof emissionDetails.$inferSelect;
export type InsertEmissionDetail = z.infer<typeof insertEmissionDetailSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
