import { foreignKey, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { person } from '@db/schemas/person'
import { code } from '@db/schemas/code'

export const personCode = pgTable(
    'person_code',
    {
        id: uuid().defaultRandom().primaryKey(),
        personId: uuid().notNull(),
        codeId: uuid().notNull(),
        type: text().notNull()
    },
    (table) => [
        foreignKey({
            columns: [table.personId],
            foreignColumns: [person.id],
            name: 'person_code_person_fk',
        }),
        foreignKey({
            columns: [table.codeId],
            foreignColumns: [code.id],
            name: 'person_code_code_fk',
        }),
    ],
)
