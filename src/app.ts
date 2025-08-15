import fastify from "fastify"
import { fastifySwagger } from "@fastify/swagger"
import scalarAPIReference from "@scalar/fastify-api-reference"
// import crypto from "node:crypto" // Biblioteca nativa do Node.js, colocar node: antes do nome da biblioteca

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"

import { createCourseRoute } from "../src/routes/create-course.ts"
import { getCourseByIdRoute } from "../src/routes/get-course-by-id.ts"
import { getCoursesRoute } from "../src/routes/get-courses.ts"

import { deleteCourseRoute } from "../src/routes/delete-course.ts"

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hosttitle",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Desafio Node.js",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  })

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
  })
}

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(createCourseRoute)
server.register(getCourseByIdRoute)
server.register(getCoursesRoute)
server.register(deleteCourseRoute)

export { server }
