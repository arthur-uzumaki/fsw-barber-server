import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { ClientError } from './errors/client-error'

type FastifyErrorHandle = FastifyInstance['errorHandler']

export const erroHandle: FastifyErrorHandle = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(200).send({
      message: 'Erro during validation',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  return reply.status(500).send({ message: 'Internal server error' })
}
