import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const person = pgTable(
    'person',
    {
        id: uuid().defaultRandom().primaryKey(),
        email: text().notNull(),
        firstName: text().notNull(),
        lastName: text().notNull()
    }
)
