import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const task = await storage.createTask(result.data);
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = insertTaskSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const task = await storage.updateTask(id, result.data);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const success = await storage.deleteTask(id);
    if (!success) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ success: true });
  });

  return createServer(app);
}
