import { foreignKey, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { person } from '@db/schemas/person'

export const code = pgTable(
    'code',
    {
        id: uuid().defaultRandom().primaryKey(),
        personId: uuid().notNull(),
        code: text().notNull()
    },
    (table) => [
        foreignKey({
            columns: [table.personId],
            foreignColumns: [person.id],
            name: 'person_code_fk',
        })
    ],
)
