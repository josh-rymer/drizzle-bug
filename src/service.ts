import { personWithCodeAndCodeValue } from "@db/views/personWithCodeAndCodeValue"
import { eq, getTableColumns, getViewSelectedFields, sql } from "drizzle-orm"
import { db } from "@/db"
import { personCodeWithValue } from "@db/views/personCodeWithValue"
import { person } from "@db/schemas/person"
import { personCode } from "@db/schemas/personCode"
import { code } from "@db/schemas/code"

/**
 * Query build using only drizzle typed values
 * 
 * @param codeValue 
 * @returns 
 */
export const breaks = async (codeValue: string) => {
    const personColumns = getViewSelectedFields(personWithCodeAndCodeValue)

    try {
        const query = db
            .select(personColumns)
            .from(personWithCodeAndCodeValue)
            .innerJoin(personCodeWithValue, eq(personCodeWithValue.personId, personWithCodeAndCodeValue.id))
            .where(eq(personCodeWithValue.value, codeValue))
        console.log(query.toSQL())
        /**
         * Will get a postgres error that column person_code_with_value.undefined does not exist
         * This is referring to the personCodeWithValue.value column. I did some cross referencing and discoverd any view joined
         * columns will appear undefined in this query.
         * 
         * If you check the DB, you will see 'value' column absolutely exists on the person_code_with_value view
         * 
         * If you take the SQL printed frmo the toSQL() function and drop it into a postgres GUI, clean it up by replacing 'undefined' with 'value' and setting
         * the WHERE to = 'code value' you will see this query runs properly.
         * 
         * See works() for counter example.
         */

        return await query
    } catch (e) {
        console.log(e)
        return e
    }
}

/**
 * Query build using only drizzle typed values but not using views
 * 
 * @param codeValue 
 * @returns 
 */
export const noViews = async (codeValue: string) => {
    const personColumns = getTableColumns(person)
    const personCodeColumns = getTableColumns(personCode)
    const codeColumns = getTableColumns(code)

    try {
        return await db
            .select({
                ...personColumns,
                personCode: personCodeColumns,
                code: codeColumns
            })
            .from(person)
            .innerJoin(personCode, eq(personCode.personId, person.id))
            .innerJoin(code, eq(code.id, personCode.codeId))
            .where(eq(code.value, codeValue))
    } catch (e) {
        return e
    }
}

/**
 * Query build using mostly drizzle type values but using raw sql on the troublesome column
 * 
 * @param codeValue 
 * @returns 
 */
export const works = async (codeValue: string) => {
    const personColumns = getViewSelectedFields(personWithCodeAndCodeValue)

    try {
        const query = db
            .select(personColumns)
            .from(personWithCodeAndCodeValue)
            .innerJoin(personCodeWithValue, eq(personCodeWithValue.personId, personWithCodeAndCodeValue.id))
            .where(eq(sql`"person_code_with_value"."value"`, codeValue))
        /**
         * If we force drizzle to use the view.column we want, it works just fine.
         */
        return await query
    } catch (e) {
        return e
    }
}
