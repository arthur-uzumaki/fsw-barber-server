import { Env } from '@/env/env'
import { prisma } from '@/lib/prisma'
import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function authRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        body: z.object({
          code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { code } = request.body

      console.log('Code:', code)
      console.log('Google Client ID:', Env.GOOGLE_CLIENT_ID)
      console.log('Google Secret:', Env.GOOGLE_SECRET)

      try {
        const accessTokenResponse = await axios.post(
          'https://oauth2.googleapis.com/token',
          null,
          {
            params: {
              client_id: Env.GOOGLE_CLIENT_ID,
              client_secret: Env.GOOGLE_SECRET,
              code,
              grant_type: 'authorization_code',
              redirect_uri: 'http://localhost:3000/api/auth/callback', // Substitua pelo seu redirect URI
            },
            headers: {
              Accept: 'application/json',
            },
          },
        )

        const { access_token } = accessTokenResponse.data

        const userResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        )

        console.log('User Response:', userResponse.data)

        const userSchema = z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          login: z.string().optional(),
          avatar_url: z.string().optional(),
        })

        const userInfo = userSchema.parse({
          ...userResponse.data,
          login: userResponse.data.given_name || '',
          avatar_url: userResponse.data.picture || '',
        })

        let user = await prisma.user.findUnique({
          where: {
            googleId: userInfo.id,
          },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: userInfo.id,
              name: userInfo.name,
              login: userInfo.login || '',
              email: userInfo.email,
              avatarUrl: userInfo.avatar_url || '',
            },
          })
        }

        const token = app.jwt.sign(
          {
            name: user?.name,
            avatar_url: user?.avatarUrl,
            email: user.email,
          },
          {
            sub: user?.id,
            expiresIn: '7 days',
          },
        )

        console.log('Generated Token:', token)

        return reply.send({ token })
      } catch (error) {
        if (error instanceof Error) {
          return reply.status(500).send({
            statusCode: 500,
            code: 'ERR_BAD_REQUEST',
            error: 'Internal Server Error',
            message: error.message,
          })
        }
      }
    },
  )
}
