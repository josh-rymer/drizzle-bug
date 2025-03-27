import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: 'postgres://postgres:admin@localhost:5432/db',
  },
  dialect: 'postgresql',
  out: './db', // Where our migrations will be outputted
  schema: ['./db/schemas/*.ts', './db/views/*.ts'],
})
