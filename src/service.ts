import { eq, getTableColumns, getViewSelectedFields, sql } from "drizzle-orm"
import { db } from "@/db"
import { personWithCode } from "@db/views/personWithCode"
import { person } from "@db/schemas/person"
import { code } from "@db/schemas/code"

/**
 * Query build using only drizzle typed values
 * 
 * @param codeValue 
 * @returns 
 */
export const breaks = async (codeValue: string) => {

    try {
        const query = db
            .select()
            .from(personWithCode)
            .where(eq(personWithCode.code, codeValue))

        console.log(query.toSQL())

        /**
         * Will get a postgres error that column person_with_code.undefined does not exist
         * This is referring to the personWithCode.code column. I did some cross referencing and discoverd any view joined
         * columns will appear undefined in this query.
         * 
         * If you check the DB, you will see 'code' column absolutely exists on the personWithCode view
         * 
         * If you take the SQL printed from the toSQL() function and drop it against postgres directly, clean it up by replacing 'undefined' with 'code' and setting
         * the WHERE to = 'code value' you will see this query runs properly.
         * 
         * select "id", "email", "first_name", "last_name", "code"
         * from "person_with_code"
         * where "person_with_code"."code" = 'code value'
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

    try {
        return await db
            .select({
                ...personColumns,
                code: code.code
            })
            .from(person)
            .innerJoin(code, eq(code.personId, person.id))
            .where(eq(code.code, codeValue))
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
    const { code: _code, ...personColumns } = getViewSelectedFields(personWithCode)

    try {
        const query = db
            .select({
                ...personColumns,
                code: sql`"person_with_code"."code"`
            })
            .from(personWithCode)
            .where(eq(sql`"person_with_code"."code"`, codeValue))
        /**
         * If we force drizzle to use the view.column we want, it works just fine.
         */
        return await query
    } catch (e) {
        return e
    }
}
