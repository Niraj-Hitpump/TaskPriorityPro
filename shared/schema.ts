import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const insertTaskSchema = createInsertSchema(tasks)
  .pick({
    title: true,
    priority: true,
    dueDate: true,
    completed: true,
  })
  .extend({
    title: z.string().min(1, "Title is required"),
    priority: z.enum(["low", "medium", "high"]),
    dueDate: z.coerce.date(),
  });

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
