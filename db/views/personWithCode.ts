import { pgView } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm/sql'
import { code } from '@db/schemas/code'
import { person } from '@db/schemas/person'
import { getTableColumns } from 'drizzle-orm'

export const personWithCode = pgView('person_with_code').as((queryBuilder) => {
    const personColumns = getTableColumns(person)

    return queryBuilder
        .select({
            ...personColumns,
            code: code.code
        })
        .from(person)
        .innerJoin(code, eq(code.personId, person.id))
})
