import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          id: z.string(),
          name: z.string(),
        }),
      },
    },
    async (request) => {
      const { id, name } = request.body

      return {
        id,
        name,
      }
    },
  )
}
