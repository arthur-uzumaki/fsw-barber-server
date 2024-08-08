import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function search(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/search-barbershops',
    {
      schema: {
        querystring: z.object({
          title: z.string().optional(),
          service: z.string().optional(),
        }),
      },
    },
    async (request) => {
      const { title, service } = request.query
      const barberShops = await prisma.barbershop.findMany({
        where: {
          OR: [
            title
              ? {
                  name: {
                    contains: title,
                    mode: 'insensitive',
                  },
                }
              : {},
            service
              ? {
                  services: {
                    some: {
                      name: {
                        contains: service,
                        mode: 'insensitive',
                      },
                    },
                  },
                }
              : {},
          ],
        },
      })

      return {
        barberShops,
      }
    },
  )
}
