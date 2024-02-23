import { Knex } from "knex";
import * as bcrypt from 'bcrypt';
import { uid } from 'uid';
require('dotenv').config();

export async function seed(knex: Knex): Promise<void> {
    //await knex("users").del();

    const salt = await bcrypt.genSalt();
    /*let testUsers: any = [
        {
            firstName: "Marko",
            surname: "Marković",
            email: "marko@mail.com",
            password: await bcrypt.hash('marko1234', salt),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            active: true,
            verified: true,
            verifyToken: uid(32)
        } 
    ]

    await knex("users").insert(testUsers); */
};
