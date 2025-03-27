import { pgView } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm/sql'
import { personCode } from '@db/schemas/personCode'
import { code } from '@db/schemas/code'
import { getTableColumns } from 'drizzle-orm'
import { person } from '@db/schemas/person'
import { jsonBuildObject } from '@/db'

export const personWithCodeAndCodeValue = pgView('person_with_code_and_code_value').as((queryBuilder) => {
    const personColumns = getTableColumns(person)
    const personCodeColumns = getTableColumns(personCode)
    const codeColumns = getTableColumns(code)

    return queryBuilder
        .select({
            ...personColumns,
            personCode: jsonBuildObject('personCode', { ...personCodeColumns }),
            code: jsonBuildObject('code', { ...codeColumns })
        })
        .from(person)
        .innerJoin(personCode, eq(personCode.personId, person.id))
        .innerJoin(code, eq(code.id, personCode.codeId))
        .groupBy(person.id, personCode.id, code.id)
})
