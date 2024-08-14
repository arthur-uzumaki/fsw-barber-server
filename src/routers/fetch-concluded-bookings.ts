import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function fetchConcludedBookings(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.withTypeProvider<ZodTypeProvider>().get(
    '/bookings/concluded',
    {
      schema: {
        summary: 'fetch concluded booking',
        tags: ['booking'],
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
                service: z.object({
                  id: z.string(),
                  name: z.string(),
                  description: z.string(),
                  imageUrl: z.string(),
                  price: z.number().int().positive(),
                  barbershopId: z.string().uuid(),
                }),
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
              })
              .array(),
          }),
        },
      },
    },
    async (request, replay) => {
      const bookings = await prisma.booke.findMany({
        where: {
          userId: request.user.sub,
          date: {
            lt: new Date(),
          },
        },
        include: {
          service: {
            include: {
              barbershop: true,
            },
          },
        },
      })

      const normalizedBookings = bookings.map((booking) => ({
        ...booking,
        service: {
          ...booking.service,
          price: Number(booking.service.price),
        },
        barbershop: booking.service.barbershop,
      }))

      return replay.status(200).send({ bookings: normalizedBookings })
    },
  )
}
