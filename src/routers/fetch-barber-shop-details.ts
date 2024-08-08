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
              services: z
                .object({
                  id: z.string(),
                  name: z.string(),
                  description: z.string(),
                  imageUrl: z.string(),
                  price: z.number().int().positive(),
                  barbershopId: z.string().uuid(),
                })
                .array(),
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
        include: {
          services: true,
        },
      })

      if (!barbershop) {
        throw new Error('Barber Shop not found')
      }

      const barbershopWithConvertedPrices = {
        ...barbershop,
        services: barbershop.services.map((service) => ({
          ...service,
          price: service.price.toNumber(),
        })),
      }

      return reply
        .status(200)
        .send({ barbershop: barbershopWithConvertedPrices })
    },
  )
}
