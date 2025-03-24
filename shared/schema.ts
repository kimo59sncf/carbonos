import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  companyId: integer("company_id"),
  lastLogin: timestamp("last_login"),
  consentDataProcessing: boolean("consent_data_processing").default(false),
  isActive: boolean("is_active").default(true),
});

// Companies table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
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
  dpoIsExternal: boolean("dpo_is_external"),
});

// Emission data table
export const emissionData = pgTable("emission_data", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  reportingPeriod: text("reporting_period").notNull(),
  reportingYear: integer("reporting_year").notNull(),
  submittedBy: integer("submitted_by"),
  submittedAt: timestamp("submitted_at"),
  validatedBy: integer("validated_by"),
  validatedAt: timestamp("validated_at"),
  status: text("status").default("draft"),
  scope1Total: integer("scope1_total").default(0),
  scope2Total: integer("scope2_total").default(0),
  scope3Total: integer("scope3_total").default(0),
  totalEmissions: integer("total_emissions").default(0),
  methodologyNotes: text("methodology_notes"),
});

// Emission details table
export const emissionDetails = pgTable("emission_details", {
  id: serial("id").primaryKey(),
  emissionDataId: integer("emission_data_id").notNull(),
  source: text("source").notNull(),
  scope: text("scope").notNull(),
  category: text("category"),
  value: integer("value").notNull(),
  unit: text("unit").notNull().default("tCO2e"),
  notes: text("notes"),
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  year: integer("year").notNull(),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at"),
  status: text("status").default("draft"),
  data: json("data"),
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
});

export const insertCompanySchema = createInsertSchema(companies);

export const insertEmissionDataSchema = createInsertSchema(emissionData).pick({
  companyId: true,
  reportingPeriod: true,
  reportingYear: true,
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
