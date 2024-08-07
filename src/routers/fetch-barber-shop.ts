import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function fetchBarberShop(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/barbershops',
    {
      schema: {
        response: {
          200: z.object({
            barbershops: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                address: z.string(),
                phones: z.array(z.string()),
                description: z.string(),
                imageUrl: z.string(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              }),
            ),
          }),
        },
      },
    },
    async (_, reply) => {
      const barbershops = await prisma.barbershop.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          phones: true,
          description: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return reply.status(200).send({ barbershops })
    },
  )
}
