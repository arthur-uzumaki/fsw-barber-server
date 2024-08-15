import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { endOfDay, startOfDay } from 'date-fns'
import z from 'zod'
import { ClientError } from '@/errors/client-error'

export async function fetchBookingsByDate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/bookings/:serviceId',
    {
      schema: {
        summary: 'fetch booking by date',
        tags: ['booking'],
        params: z.object({
          serviceId: z.string().uuid(),
        }),
        querystring: z.object({
          date: z.coerce.date(),
        }),
        response: {
          200: z.object({
            bookings: z
              .object({
                id: z.string().uuid(),
                userId: z.string().uuid(),
                serviceId: z.string().uuid(),
                date: z.coerce.date(),
                createdAt: z.coerce.date(),
                updatedAt: z.coerce.date(),
              })
              .array(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { serviceId } = request.params
      const { date } = request.query

      const service = await prisma.barbershopservice.findUnique({
        where: {
          id: serviceId,
        },
      })

      if (!service) {
        throw new ClientError('Services not found')
      }

      const bookings = await prisma.booke.findMany({
        where: {
          date: {
            lte: endOfDay(date),
            gte: startOfDay(date),
          },
        },
      })

      return reply.status(200).send({ bookings })
    },
  )
}
