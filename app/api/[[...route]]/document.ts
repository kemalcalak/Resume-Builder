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
import { error } from "console";

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
            const existingExperience = await trx
              .select()
              .from(experienceTable)
              .where(eq(experienceTable.docId, existingDocument.id));
            const existingExperienceMap = new Set(
              existingExperience.map((exp) => exp.id)
            );
            for (const exp of experience) {
              if (exp.id) {
                if (existingExperienceMap.has(exp.id)) {
                  const { id, ...updateData } = exp;
                  await trx
                    .update(experienceTable)
                    .set(updateData)
                    .where(
                      and(
                        eq(experienceTable.docId, existingDocument.id),
                        eq(experienceTable.id, id)
                      )
                    );
                } else {
                  const { id, ...insertData } = exp;
                  await trx
                    .insert(experienceTable)
                    .values({ docId: existingDocument.id, ...insertData });
                }
              }
            }
          }

          if (education && Array.isArray(education)) {
            const existingEducation = await trx
              .select()
              .from(educationTable)
              .where(eq(educationTable.docId, existingDocument.id));

            const existingEducationMap = new Set(
              existingEducation.map((edu) => edu.id)
            );

            for (const edu of education) {
              if (edu.id) {
                if (existingEducationMap.has(edu.id)) {
                  const { id, ...updateData } = edu;
                  await trx
                    .update(educationTable)
                    .set(updateData)
                    .where(
                      and(
                        eq(educationTable.docId, existingDocument.id),
                        eq(educationTable.id, id)
                      )
                    );
                } else {
                  const { id, ...insertData } = edu;
                  await trx.insert(educationTable).values({
                    docId: existingDocument.id,
                    ...insertData,
                  });
                }
              }
            }
          }

          if (project && Array.isArray(project)) {
            const existingProjects = await trx
              .select()
              .from(projectTable)
              .where(eq(projectTable.docId, existingDocument.id));
            const existingProjectsMap = new Set(
              existingProjects.map((proj) => proj.id)
            );

            for (const proj of project) {
              if (proj.id) {
                if (existingProjectsMap.has(proj.id)) {
                  const { id, ...updateData } = proj;
                  await trx
                    .update(projectTable)
                    .set(updateData)
                    .where(
                      and(
                        eq(projectTable.docId, existingDocument.id),
                        eq(projectTable.id, id)
                      )
                    );
                } else {
                  const { id, ...insertData } = proj;
                  await trx
                    .insert(projectTable)
                    .values({ docId: existingDocument.id, ...insertData });
                }
              }
            }
          }

          if (certificate && Array.isArray(certificate)) {
            const existingCertificates = await trx
              .select()
              .from(certificateTable)
              .where(eq(certificateTable.docId, existingDocument.id));
            const existingCertificatesMap = new Set(
              existingCertificates.map((cert) => cert.id)
            );

            for (const cert of certificate) {
              if (cert.id) {
                if (existingCertificatesMap.has(cert.id)) {
                  const { id, ...updateData } = cert;
                  await trx
                    .update(certificateTable)
                    .set(updateData)
                    .where(
                      and(
                        eq(certificateTable.docId, existingDocument.id),
                        eq(certificateTable.id, id)
                      )
                    );
                } else {
                  const { id, ...insertData } = cert;
                  await trx
                    .insert(certificateTable)
                    .values({ docId: existingDocument.id, ...insertData });
                }
              }
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
  );

export default documentRoute;
