import { drizzle } from 'drizzle-orm/node-postgres'
import {
    type SelectedFields,
    type Column,
    type ColumnBaseConfig,
    type ColumnDataType,
    type Table,
    type TableConfig,
    type SQL,
    sql,
    is,
} from 'drizzle-orm'
import { PgTimestampString } from 'drizzle-orm/pg-core'
import { type SelectResultFields } from 'drizzle-orm/query-builders/select.types'
import { person } from '@db/schemas/person'
import { personCode } from '@db/schemas/personCode'
import { code } from '@db/schemas/code'

export const db = drizzle({
    connection: 'postgres://postgres:admin@localhost:5432/db',
    casing: 'snake_case',
    schema: {
        person,
        personCode,
        code
    },
})

type Columns = SelectedFields<
    Column<ColumnBaseConfig<ColumnDataType, string>, object, object>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Table<TableConfig<Column<any, object, object>>>
>

const getSqlChunks = <T extends Columns>(shape: T, columnRename?: [string, string]) => {
    const chunks: SQL[] = []

    Object.entries(shape).forEach(([key, value]) => {
        if (chunks.length > 0) {
            chunks.push(sql.raw(`,`))
        }

        chunks.push(sql.raw(`'${key}',`))

        // json_build_object formats to ISO 8601 ...
        if (is(value, PgTimestampString)) {
            chunks.push(sql`timezone('UTC', ${value})`)
        } else if (columnRename && columnRename[0] === key) {
            chunks.push(sql.raw(`${columnRename[1]}`))
        } else {
            chunks.push(sql`${value}`)
        }
    })

    return sql.join(chunks)
}

export const jsonBuildObject = <T extends Columns>(as: string, shape: T, columnRename?: [string, string]) => {
    const columns = getSqlChunks(shape, columnRename)
    return sql<SelectResultFields<T>>`jsonb_build_object(${columns})`.as(as)
}
