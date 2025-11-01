import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const districts = pgTable("districts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameMarathi: text("name_marathi").notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
}, (table) => ({
  codeIdx: index("district_code_idx").on(table.code),
}));

export const monthlyPerformance = pgTable("monthly_performance", {
  id: serial("id").primaryKey(),
  districtId: integer("district_id").notNull().references(() => districts.id),
  month: varchar("month", { length: 7 }).notNull(),
  workersEmployed: integer("workers_employed").notNull().default(0),
  personDaysGenerated: integer("person_days_generated").notNull().default(0),
  wagesPaid: decimal("wages_paid", { precision: 15, scale: 2 }).notNull().default("0"),
  assetsCreated: integer("assets_created").notNull().default(0),
  workCompletionRate: decimal("work_completion_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  activeJobCards: integer("active_job_cards").notNull().default(0),
  averageWageDays: integer("average_wage_days").default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  districtMonthIdx: index("district_month_idx").on(table.districtId, table.month),
}));

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  districtId: integer("district_id").notNull().references(() => districts.id),
  type: varchar("type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  title: text("title").notNull(),
  titleMarathi: text("title_marathi").notNull(),
  description: text("description").notNull(),
  descriptionMarathi: text("description_marathi").notNull(),
  affectedMetric: varchar("affected_metric", { length: 50 }),
  value: text("value"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isActive: integer("is_active").notNull().default(1),
}, (table) => ({
  districtActiveIdx: index("district_active_idx").on(table.districtId, table.isActive),
}));

export const dataIngestionLogs = pgTable("data_ingestion_logs", {
  id: serial("id").primaryKey(),
  source: varchar("source", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  recordsProcessed: integer("records_processed").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertDistrictSchema = createInsertSchema(districts).omit({
  id: true,
});

export const insertMonthlyPerformanceSchema = createInsertSchema(monthlyPerformance).omit({
  id: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertDataIngestionLogSchema = createInsertSchema(dataIngestionLogs).omit({
  id: true,
  startedAt: true,
});

export type District = typeof districts.$inferSelect;
export type InsertDistrict = z.infer<typeof insertDistrictSchema>;

export type MonthlyPerformance = typeof monthlyPerformance.$inferSelect;
export type InsertMonthlyPerformance = z.infer<typeof insertMonthlyPerformanceSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type DataIngestionLog = typeof dataIngestionLogs.$inferSelect;
export type InsertDataIngestionLog = z.infer<typeof insertDataIngestionLogSchema>;

export type PerformanceMetric = {
  label: string;
  labelMarathi: string;
  value: number | string;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
  colorBand: "green" | "yellow" | "red";
  icon: string;
  explanation: string;
  explanationMarathi: string;
};

export type ComparisonData = {
  district: District;
  performance: MonthlyPerformance;
  stateAverage: Partial<MonthlyPerformance>;
  topDistricts: Array<{ district: District; performance: MonthlyPerformance }>;
  bottomDistricts: Array<{ district: District; performance: MonthlyPerformance }>;
};
