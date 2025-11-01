import { 
  districts, 
  monthlyPerformance, 
  alerts,
  type District,
  type InsertDistrict, 
  type MonthlyPerformance,
  type InsertMonthlyPerformance,
  type Alert,
  type InsertAlert,
  type ComparisonData,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getAllDistricts(): Promise<District[]>;
  getDistrictById(id: number): Promise<District | undefined>;
  getDistrictByCode(code: string): Promise<District | undefined>;
  createDistrict(district: InsertDistrict): Promise<District>;
  
  getMonthlyPerformance(districtId: number, month: string): Promise<MonthlyPerformance | undefined>;
  getPerformanceHistory(districtId: number, limit?: number): Promise<MonthlyPerformance[]>;
  createMonthlyPerformance(performance: InsertMonthlyPerformance): Promise<MonthlyPerformance>;
  updateMonthlyPerformance(districtId: number, month: string, data: Partial<InsertMonthlyPerformance>): Promise<MonthlyPerformance | undefined>;
  
  getAlertsByDistrict(districtId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  
  getComparisonData(districtId: number): Promise<ComparisonData | null>;
  getStateAverage(month: string): Promise<Partial<MonthlyPerformance>>;
}

export class DatabaseStorage implements IStorage {
  async getAllDistricts(): Promise<District[]> {
    return await db.select().from(districts).orderBy(districts.name);
  }

  async getDistrictById(id: number): Promise<District | undefined> {
    const [district] = await db.select().from(districts).where(eq(districts.id, id));
    return district || undefined;
  }

  async getDistrictByCode(code: string): Promise<District | undefined> {
    const [district] = await db.select().from(districts).where(eq(districts.code, code));
    return district || undefined;
  }

  async createDistrict(insertDistrict: InsertDistrict): Promise<District> {
    const [district] = await db
      .insert(districts)
      .values(insertDistrict)
      .returning();
    return district;
  }

  async getMonthlyPerformance(districtId: number, month: string): Promise<MonthlyPerformance | undefined> {
    const [performance] = await db
      .select()
      .from(monthlyPerformance)
      .where(and(
        eq(monthlyPerformance.districtId, districtId),
        eq(monthlyPerformance.month, month)
      ));
    return performance || undefined;
  }

  async getPerformanceHistory(districtId: number, limit = 12): Promise<MonthlyPerformance[]> {
    return await db
      .select()
      .from(monthlyPerformance)
      .where(eq(monthlyPerformance.districtId, districtId))
      .orderBy(desc(monthlyPerformance.month))
      .limit(limit);
  }

  async createMonthlyPerformance(performance: InsertMonthlyPerformance): Promise<MonthlyPerformance> {
    const [created] = await db
      .insert(monthlyPerformance)
      .values(performance)
      .returning();
    return created;
  }

  async updateMonthlyPerformance(
    districtId: number, 
    month: string, 
    data: Partial<InsertMonthlyPerformance>
  ): Promise<MonthlyPerformance | undefined> {
    const [updated] = await db
      .update(monthlyPerformance)
      .set({ ...data, updatedAt: new Date() })
      .where(and(
        eq(monthlyPerformance.districtId, districtId),
        eq(monthlyPerformance.month, month)
      ))
      .returning();
    return updated || undefined;
  }

  async getAlertsByDistrict(districtId: number): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.districtId, districtId))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [created] = await db
      .insert(alerts)
      .values(alert)
      .returning();
    return created;
  }

  async getStateAverage(month: string): Promise<Partial<MonthlyPerformance>> {
    const [result] = await db
      .select({
        workersEmployed: sql<number>`CAST(AVG(${monthlyPerformance.workersEmployed}) AS INTEGER)`,
        personDaysGenerated: sql<number>`CAST(AVG(${monthlyPerformance.personDaysGenerated}) AS INTEGER)`,
        wagesPaid: sql<string>`CAST(AVG(CAST(${monthlyPerformance.wagesPaid} AS NUMERIC)) AS DECIMAL(15,2))`,
        assetsCreated: sql<number>`CAST(AVG(${monthlyPerformance.assetsCreated}) AS INTEGER)`,
        workCompletionRate: sql<string>`CAST(AVG(CAST(${monthlyPerformance.workCompletionRate} AS NUMERIC)) AS DECIMAL(5,2))`,
        activeJobCards: sql<number>`CAST(AVG(${monthlyPerformance.activeJobCards}) AS INTEGER)`,
      })
      .from(monthlyPerformance)
      .where(eq(monthlyPerformance.month, month));

    return result || {};
  }

  async getComparisonData(districtId: number): Promise<ComparisonData | null> {
    const district = await this.getDistrictById(districtId);
    if (!district) return null;

    const performanceHistory = await this.getPerformanceHistory(districtId, 1);
    const performance = performanceHistory[0];
    if (!performance) return null;

    const stateAverage = await this.getStateAverage(performance.month);

    const topDistrictsData = await db
      .select({
        district: districts,
        performance: monthlyPerformance,
      })
      .from(monthlyPerformance)
      .innerJoin(districts, eq(districts.id, monthlyPerformance.districtId))
      .where(eq(monthlyPerformance.month, performance.month))
      .orderBy(desc(monthlyPerformance.workersEmployed))
      .limit(3);

    const bottomDistrictsData = await db
      .select({
        district: districts,
        performance: monthlyPerformance,
      })
      .from(monthlyPerformance)
      .innerJoin(districts, eq(districts.id, monthlyPerformance.districtId))
      .where(eq(monthlyPerformance.month, performance.month))
      .orderBy(monthlyPerformance.workersEmployed)
      .limit(3);

    return {
      district,
      performance,
      stateAverage,
      topDistricts: topDistrictsData,
      bottomDistricts: bottomDistrictsData,
    };
  }
}

export const storage = new DatabaseStorage();
