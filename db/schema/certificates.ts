import {
  date,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { documentTable } from "./document";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const certificateTable = pgTable("certificate", {
  id: serial("id").notNull().primaryKey(),
  docId: integer("document_id").references(() => documentTable.id, {
    onDelete: "cascade",
  }),
  certificateName: varchar("certificate_name", { length: 255 }),
  whoGave: varchar("who_gave", { length: 255 }),
  teacher: varchar("teacher", { length: 255 }),
  issueDate: date("issue_date"),
});

export const certificateRelations = relations(certificateTable, ({ one }) => ({
  document: one(documentTable, {
    fields: [certificateTable.docId],
    references: [documentTable.id],
  }),
}));

export const certificateTableSchema = createInsertSchema(certificateTable, {
  id: z.number().optional(),
}).pick({
  id: true,
  certificateName: true,
  whoGave: true,
  teacher: true,
  issueDate: true,
});

export type CertificateSchema = z.infer<typeof certificateTableSchema>;
