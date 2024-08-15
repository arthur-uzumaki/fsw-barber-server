import { ClientError } from '@/errors/client-error'
import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function deleteBooking(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/bookings/:id',
    {
      schema: {
        summary: 'delete booking',
        tags: ['booking'],
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { id } = request.params

      const booking = await prisma.booke.findUnique({
        where: {
          id,
        },
      })

      if (!booking) {
        throw new ClientError('Booking not found')
      }

      await prisma.booke.delete({
        where: {
          id,
        },
      })
    },
  )
}
