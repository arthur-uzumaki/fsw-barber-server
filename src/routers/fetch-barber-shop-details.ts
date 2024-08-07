import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function fetchBarberShopDetail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/barbershops/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({
            barbershop: z.object({
              id: z.string().uuid(),
              name: z.string(),
              address: z.string(),
              phones: z.array(z.string()),
              description: z.string(),
              imageUrl: z.string(),
              createdAt: z.coerce.date(),
              updatedAt: z.coerce.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const barbershop = await prisma.barbershop.findUnique({
        where: {
          id,
        },
      })

      if (!barbershop) {
        throw new Error('Barber Shop not found')
      }

      return reply.status(200).send({ barbershop })
    },
  )
}
