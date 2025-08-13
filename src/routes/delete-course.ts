import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import z from "zod"
import { eq } from "drizzle-orm"

export const deleteCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Delete a course by ID",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.object({
            message: z.string().describe("Curso deletado com sucesso"),
          }),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Curso não encontrado"),
        },
      },
    },
    async (request, reply) => {
      const courseId = request.params.id

      await db.delete(courses).where(eq(courses.id, courseId))

      return reply.status(204).send({ message: "Curso deletado com sucesso" })
    }
  )
}
