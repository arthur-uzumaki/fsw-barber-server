import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function deleteBooking(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/bookings/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const booking = await prisma.booke.findUnique({
        where: {
          id,
        },
      })

      if (!booking) {
        throw new Error('Booking not found')
      }

      await prisma.booke.delete({
        where: {
          id,
        },
      })
    },
  )
}
