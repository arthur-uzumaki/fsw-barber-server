import fastify from 'fastify'
import cors from '@fastify/cors'
import { Env } from '@/env/env'
import jwt from '@fastify/jwt'

import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { fetchBarberShop } from '@/routers/fetch-barber-shop'
import { fetchBarberShopDetail } from '@/routers/fetch-barber-shop-details'
import { authRoute } from '@/routers/auth'
import { search } from '@/routers/search'
import { createBooking } from '@/routers/create-booking'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: Env.WEB_BASE_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
})

app.register(jwt, { secret: 'fwsbarber' })

app.register(authRoute)
app.register(fetchBarberShop)
app.register(fetchBarberShopDetail)
app.register(search)
app.register(createBooking)

app
  .listen({
    host: '0.0.0.0',
    port: Env.PORT,
  })
  .then(() => {
    console.log(`Running http://localhost:${Env.PORT}`)
  })
