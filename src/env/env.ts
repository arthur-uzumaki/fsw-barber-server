import {z} from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  WEB_BASE_URL: z.string().url()

})

export const Env = envSchema.parse(process.env)
