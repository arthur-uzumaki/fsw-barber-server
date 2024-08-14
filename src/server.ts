import fastify from 'fastify'
import cors from '@fastify/cors'
import { Env } from '@/env/env'
import jwt from '@fastify/jwt'

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import { fetchBarberShop } from '@/routers/fetch-barber-shop'
import { fetchBarberShopDetail } from '@/routers/fetch-barber-shop-details'
import { authRoute } from '@/routers/auth'
import { search } from '@/routers/search'
import { createBooking } from '@/routers/create-booking'
import { fetchBookingsByDate } from '@/routers/fetch-bookings-by-date'
import { fetchBookingsUser } from '@/routers/fetch-bookings-user'
import { fetchConfirmedBookings } from '@/routers/fetch-confirme-bookings'
import { fetchConcludedBookings } from '@/routers/fetch-concluded-bookings'
import { deleteBooking } from '@/routers/delete-booking'

const app = fastify()

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'FSW-BARBER',
      description: 'Especificação da API para o back-end aplicação FSW-BARBER',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  prefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: Env.WEB_BASE_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
})

app.register(jwt, {
  secret: Env.JWT_TOKEN,
})

app.register(authRoute)
app.register(fetchBarberShop)
app.register(fetchBarberShopDetail)
app.register(search)
app.register(createBooking)
app.register(fetchBookingsByDate)
app.register(fetchBookingsUser)
app.register(fetchConfirmedBookings)
app.register(fetchConcludedBookings)
app.register(deleteBooking)

app
  .listen({
    host: '0.0.0.0',
    port: Env.PORT,
  })
  .then(() => {
    console.log(`Running http://localhost:${Env.PORT}`)
  })
