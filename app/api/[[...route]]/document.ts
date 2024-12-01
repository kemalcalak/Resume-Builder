import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createDocumentTableSchema,
  DocumentSchema,
  documentTable,
  updateCombinedSchema,
  UpdateDocumentSchema,
} from "@/db/schema/document";
import { getAuthUser } from "@/lib/kinde";
import { generateDocUUID } from "@/lib/helper";
import { db } from "@/db";
import { desc, eq, ne, and } from "drizzle-orm";
import { z } from "zod";
import {
  educationTable,
  experienceTable,
  personalInfoTable,
  projectTable,
  certificateTable,
} from "@/db/schema";

const documentRoute = new Hono()
  .post(
    "/create",
    zValidator("json", createDocumentTableSchema),
    getAuthUser,
    async (c) => {
      try {
        const user = c.get("user");
        const { title } = c.req.valid("json") as DocumentSchema;
        const userId = user.id;
        const authorName = `${user.given_name} ${user?.family_name}`;
        const authorEmail = user.email as string;
        const documentId = generateDocUUID();

        const newDoc = {
          title: title,
          userId: userId,
          documentId: documentId,
          authorName: authorName,
          authorEmail: authorEmail,
        };

        const [data] = await db
          .insert(documentTable)
          .values(newDoc)
          .returning();
        return c.json(
          {
            success: "ok",
            data,
          },
          { status: 200 }
        );
      } catch (error) {
        return c.json(
          {
            success: false,
            message: "Failed to create document",
            error: error,
          },
          500
        );
      }
    }
  )
  .patch(
    "/update/:documentId",
    zValidator(
      "param",
      z.object({
        documentId: z.string(),
      })
    ),
    zValidator("json", updateCombinedSchema),
    getAuthUser,
    async (c) => {
      try {
        const user = c.get("user");
        const { documentId } = c.req.valid("param");

        const {
          title,
          status,
          summary,
          themeColor,
          thumbnail,
          currentPosition,
          personalInfo,
          experience,
          education,
          project,
          certificate,
        } = c.req.valid("json");
        const userId = user.id;

        if (!documentId) {
          return c.json(
            {
              error: "Document ID is required",
            },
            400
          );
        }
        await db.transaction(async (trx) => {
          const [existingDocument] = await trx
            .select()
            .from(documentTable)
            .where(
              and(
                eq(documentTable.documentId, documentId),
                eq(documentTable.userId, userId)
              )
            );
          const resumeUpdate = {} as UpdateDocumentSchema;
          if (title) resumeUpdate.title = title;
          if (status) resumeUpdate.status = status;
          if (summary) resumeUpdate.summary = summary;
          if (themeColor) resumeUpdate.themeColor = themeColor;
          if (thumbnail) resumeUpdate.thumbnail = thumbnail;
          if (currentPosition)
            resumeUpdate.currentPosition = currentPosition || 1;

          if (Object.keys(resumeUpdate)?.length > 0) {
            await trx
              .update(documentTable)
              .set(resumeUpdate)
              .where(
                and(
                  eq(documentTable.documentId, documentId),
                  eq(documentTable.userId, userId)
                )
              )
              .returning();
          }

          if (!existingDocument) {
            return c.json({ error: "Document not found" }, 404);
          }

          if (personalInfo) {
            if (!personalInfo?.firstName && !personalInfo?.lastName) {
              return;
            }
            const exists = await trx
              .select()
              .from(personalInfoTable)
              .where(eq(personalInfoTable.docId, existingDocument.id))
              .limit(1);

            if (exists.length > 0) {
              await trx
                .update(personalInfoTable)
                .set(personalInfo)
                .where(eq(personalInfoTable.docId, existingDocument.id));
            } else {
              await trx
                .insert(personalInfoTable)
                .values({ docId: existingDocument.id, ...personalInfo });
            }
          }

          if (experience && Array.isArray(experience)) {
            // Önce mevcut dökümanın tüm experience verilerini sil
            await trx
              .delete(experienceTable)
              .where(eq(experienceTable.docId, existingDocument.id));

            // Sonra yeni verileri ekle
            for (const exp of experience) {
              const { id, ...data } = exp;
              await trx.insert(experienceTable).values({
                docId: existingDocument.id,
                ...data,
              });
            }
          }

          if (education && Array.isArray(education)) {
            // Önce mevcut dökümanın tüm experience verilerini sil
            await trx
              .delete(educationTable)
              .where(eq(educationTable.docId, existingDocument.id));

            // Sonra yeni verileri ekle
            for (const edu of education) {
              const { id, ...data } = edu;
              await trx.insert(educationTable).values({
                docId: existingDocument.id,
                ...data,
              });
            }
          }

          if (project && Array.isArray(project)) {
            // Önce mevcut dökümanın tüm project verilerini sil
            await trx
              .delete(projectTable)
              .where(eq(projectTable.docId, existingDocument.id));

            // Sonra yeni verileri ekle
            for (const proj of project) {
              const { id, ...data } = proj;
              await trx.insert(projectTable).values({
                docId: existingDocument.id,
                ...data,
              });
            }
          }

          if (certificate && Array.isArray(certificate)) {
            // Önce mevcut dökümanın tüm certificate verilerini sil
            await trx
              .delete(certificateTable)
              .where(eq(certificateTable.docId, existingDocument.id));

            // Sonra yeni verileri ekle
            for (const cert of certificate) {
              const { id, ...data } = cert;
              await trx.insert(certificateTable).values({
                docId: existingDocument.id,
                ...data,
              });
            }
          }


          return c.json(
            {
              success: "ok",
              message: "Updated successfully",
            },
            { status: 200 }
          );
        });
      } catch (error) {
        return c.json(
          {
            success: false,
            message: "Failed to update document",
            error: error,
          },
          500
        );
      }
    }
  )
  .patch(
    "/restore/archive",
    zValidator(
      "json",
      z.object({
        documentId: z.string(),
        status: z.string(),
      })
    ),
    getAuthUser,
    async (c) => {
      try {
        const user = c.get("user");
        const userId = user.id;

        const { documentId, status } = c.req.valid("json");

        if (!documentId) {
          return c.json({ message: "DocumentId must provided" }, 400);
        }

        if (status !== "archived") {
          return c.json(
            { message: "Status must be archived before restore" },
            400
          );
        }

        const [documentData] = await db
          .update(documentTable)
          .set({
            status: "private",
          })
          .where(
            and(
              eq(documentTable.userId, userId),
              eq(documentTable.documentId, documentId),
              eq(documentTable.status, "archived")
            )
          )
          .returning();

        if (!documentData) {
          return c.json({ message: "Document not found" }, 404);
        }

        return c.json(
          {
            success: "ok",
            message: "Updated successfully",
            data: documentData,
          },
          { status: 200 }
        );
      } catch (error) {
        return c.json(
          {
            success: false,
            message: "Failed to retore document",
            error: error,
          },
          500
        );
      }
    }
  )
  .get("all", getAuthUser, async (c) => {
    try {
      const user = c.get("user");
      const userId = user.id;
      const documents = await db
        .select()
        .from(documentTable)
        .orderBy(desc(documentTable.updatedAt))
        .where(
          and(
            eq(documentTable.userId, userId),
            ne(documentTable.status, "archived")
          )
        );
      return c.json({
        success: true,
        data: documents,
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message: "Failed to fetch documents",
          error: error,
        },
        500
      );
    }
  })
  .get(
    "/:documentId",
    zValidator(
      "param",
      z.object({
        documentId: z.string(),
      })
    ),
    getAuthUser,
    async (c) => {
      try {
        const user = c.get("user");
        const { documentId } = c.req.valid("param");
        const userId = user?.id;
        const documentData = await db.query.documentTable.findFirst({
          where: and(
            eq(documentTable.userId, userId),
            eq(documentTable.documentId, documentId)
          ),
          with: {
            personalInfo: true,
            experiences: true,
            educations: true,
            projects: true,
            certificates: true,
          },
        });
        return c.json({
          success: true,
          data: documentData,
        });
      } catch (error) {
        return c.json(
          {
            success: false,
            message: "Failed to fetch document",
            error: error,
          },
          500
        );
      }
    }
  )
  .get(
    "public/doc/:documentId",
    zValidator(
      "param",
      z.object({
        documentId: z.string(),
      })
    ),
    async (c) => {
      try {
        const { documentId } = c.req.valid("param");
        const documentData = await db.query.documentTable.findFirst({
          where: and(
            eq(documentTable.status, "public"),
            eq(documentTable.documentId, documentId)
          ),
          with: {
            personalInfo: true,
            experiences: true,
            educations: true,
            projects: true,
            certificates: true,
          },
        });

        if (!documentData) {
          return c.json(
            {
              error: true,
              message: "unauthorized",
            },
            401
          );
        }
        return c.json({
          success: true,
          data: documentData,
        });
      } catch (error) {
        return c.json(
          {
            success: false,
            message: "Failed to fetch document",
            error: error,
          },
          500
        );
      }
    }
  )
  .get("/trash/all", getAuthUser, async (c) => {
    try {
      const user = c.get("user");
      const userId = user.id;
      const documents = await db
        .select()
        .from(documentTable)
        .where(
          and(
            eq(documentTable.userId, userId),
            eq(documentTable.status, "archived")
          )
        );
      return c.json({
        success: true,
        data: documents,
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message: "Failed to fetch documents",
          error: error,
        },
        500
      );
    }
  });

export default documentRoute;
