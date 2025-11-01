import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/districts", async (req, res) => {
    try {
      const districts = await storage.getAllDistricts();
      res.json(districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ error: "Failed to fetch districts" });
    }
  });

  app.get("/api/districts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const district = await storage.getDistrictById(id);
      
      if (!district) {
        return res.status(404).json({ error: "District not found" });
      }
      
      res.json(district);
    } catch (error) {
      console.error("Error fetching district:", error);
      res.status(500).json({ error: "Failed to fetch district" });
    }
  });

  app.get("/api/districts/:id/performance", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const history = await storage.getPerformanceHistory(id, 1);
      
      if (history.length === 0) {
        return res.status(404).json({ error: "No performance data found" });
      }
      
      res.json(history[0]);
    } catch (error) {
      console.error("Error fetching performance:", error);
      res.status(500).json({ error: "Failed to fetch performance data" });
    }
  });

  app.get("/api/districts/:id/trends", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const history = await storage.getPerformanceHistory(id, 12);
      res.json(history.reverse());
    } catch (error) {
      console.error("Error fetching trends:", error);
      res.status(500).json({ error: "Failed to fetch trends data" });
    }
  });

  app.get("/api/districts/:id/compare", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const comparison = await storage.getComparisonData(id);
      
      if (!comparison) {
        return res.status(404).json({ error: "Comparison data not found" });
      }
      
      res.json(comparison);
    } catch (error) {
      console.error("Error fetching comparison:", error);
      res.status(500).json({ error: "Failed to fetch comparison data" });
    }
  });

  app.get("/api/alerts/:districtId", async (req, res) => {
    try {
      const districtId = parseInt(req.params.districtId);
      const alerts = await storage.getAlertsByDistrict(districtId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
