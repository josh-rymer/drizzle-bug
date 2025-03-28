import { drizzle } from 'drizzle-orm/node-postgres'
import { person } from '@db/schemas/person'
import { code } from '@db/schemas/code'

export const db = drizzle({
    connection: 'postgres://postgres:admin@localhost:5432/db',
    casing: 'snake_case',
    schema: {
        person,
        code
    },
})

