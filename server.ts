import fastify from "fastify"
import crypto from "node:crypto" // Biblioteca nativa do Node.js, colocar node: antes do nome da biblioteca

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
})

const courses = [
  { id: "1", name: "JavaScript Basics" },
  { id: "2", name: "Advanced Node.js" },
  { id: "3", name: "React for Beginners" },
]

server.get("/courses", () => {
  return { courses }
})

server.get("/courses/:id", (request, reply) => {
  type Params = {
    id: string
  }

  const params = request.params as Params
  const courseId = params.id

  const course = courses.find((course) => course.id === courseId)

  if (!course) {
    return reply.status(404).send()
  }

  return { course }
})

server.post("/courses", (request, reply) => {
  type CourseBody = {
    name: string
  }

  const body = request.body as CourseBody

  const courseId = crypto.randomUUID()
  const courseName = body.name

  if (!courseName) {
    return reply.status(400).send({ message: "Nome obrigatório" })
  }

  courses.push({
    id: courseId,
    name: courseName,
  })

  return reply.status(201).send({ courseId })
})

server.delete("/courses/:id", (request, reply) => {
  type Params = {
    id: string
  }

  const params = request.params as Params
  const courseId = params.id

  const courseIndex = courses.findIndex((course) => course.id === courseId)

  if (courseIndex === -1) {
    return reply.status(404).send()
  }

  courses.splice(courseIndex, 1)

  return reply.status(204).send()
})

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server is running on http://localhost:3333")
  })
