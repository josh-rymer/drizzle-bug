import { drizzle } from 'drizzle-orm/node-postgres'
import { exit } from 'node:process'
import { person } from '@db/schemas/person'
import { code } from '@db/schemas/code'
import { faker } from '@faker-js/faker'

const main = async () => {
    const db = drizzle('postgres://postgres:admin@localhost:5432/db', { casing: 'snake_case' })

    const personSeed = {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName()
    }

    const codeSeed = {
        id: faker.string.uuid(),
        personId: personSeed.id,
        code: 'code value'
    }

    try {
        await db.insert(person).values(personSeed)
        await db.insert(code).values(codeSeed)
    } catch (e) {
        console.log('Error: ', e)
    }


    exit(0)
}

await main()
