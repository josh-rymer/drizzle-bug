import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const code = pgTable(
    'code',
    {
        id: uuid().defaultRandom().primaryKey(),
        value: text().notNull(),
        name: text().notNull()
    }
)
