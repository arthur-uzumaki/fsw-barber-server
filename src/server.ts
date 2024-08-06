import fastify from 'fastify'
import cors from '@fastify/cors'
import { Env } from '@/env/env'

import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createUser } from './routers/user'
import { fetchBarberShop } from './routers/fetch-barber-shop'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: Env.WEB_BASE_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
})

app.register(createUser)
app.register(fetchBarberShop)

app
  .listen({
    host: '0.0.0.0',
    port: Env.PORT,
  })
  .then(() => {
    console.log(`Running http://localhost:${Env.PORT}`)
  })
