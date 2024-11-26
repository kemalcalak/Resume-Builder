import {
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { documentTable } from "./document";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projectTable = pgTable("project", {
  id: serial("id").notNull().primaryKey(),
  docId: integer("document_id").references(() => documentTable.id, {
    onDelete: "cascade",
  }),
  projectName: varchar("project_name", { length: 255 }),
  projectSummary: text("project_summary"),
  startDate: date("start_date"),
  endDate: date("end_date"),
});

export const projectRelations = relations(projectTable, ({ one }) => ({
  document: one(documentTable, {
    fields: [projectTable.docId],
    references: [documentTable.id],
  }),
}));

export const projectTableSchema = createInsertSchema(projectTable, {
  id: z.number().optional(),
}).pick({
  id: true,
  projectName: true,
  projectSummary: true,
  startDate: true,
  endDate: true,
});

export type ProjectSchema = z.infer<typeof projectTableSchema>;