import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { breaks, works, noViews } from '@/service'

const app = new Hono()

app.post('/', async (c) => {
  const { codeValue } = await c.req.json()

  if (!codeValue) {
    return c.json({ error: 'no codeValue' }, 422)
  }

  const broken = await breaks(codeValue)
  const noView = await noViews(codeValue)
  const working = await works(codeValue)

  return c.json({ broken, working, noView }, 200)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
