import { pgView } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm/sql'
import { personCode } from '@db/schemas/personCode'
import { code } from '@db/schemas/code'

export const personCodeWithValue = pgView('person_code_with_value').as((queryBuilder) => {
    return queryBuilder
        .select({
            id: personCode.id,
            personId: personCode.personId,
            type: personCode.type,
            value: code.value,
            name: code.name,
        })
        .from(personCode)
        .innerJoin(code, eq(code.id, personCode.codeId))
})
