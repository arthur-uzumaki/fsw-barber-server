import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function createBooking(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.withTypeProvider<ZodTypeProvider>().post(
    '/bookings/:serviceId',
    {
      schema: {
        params: z.object({
          serviceId: z.string().uuid(),
        }),
        body: z.object({
          date: z.coerce.date(),
        }),
      },
    },
    async (request, replay) => {
      const { serviceId } = request.params
      const { date } = request.body

      if (!request.user) {
        return replay.status(401).send({ error: 'User not authenticated' })
      }

      const service = await prisma.barbershopservice.findUnique({
        where: {
          id: serviceId,
        },
      })

      if (!service) {
        throw new Error('Service not found')
      }

      const booking = await prisma.booke.create({
        data: {
          userId: request.user.sub,
          serviceId,
          date,
        },
      })

      return replay.status(201).send(booking)
    },
  )
}
