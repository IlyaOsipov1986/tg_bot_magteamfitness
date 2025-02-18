import mysql from "mysql2";
import { config } from "dotenv";
import { IAddNewUser } from "../types/database.interface.js";

const { parsed } = config();

const dotEnvDataBase = parsed;

const pool = mysql.createPool({
    host: dotEnvDataBase?.MYSQL_HOST,
    user: dotEnvDataBase?.MYSQL_USER,
    password: dotEnvDataBase?.MYSQL_PASSWORD,
    database: dotEnvDataBase?.MYSQL_DATABASE,
}).promise();

export async function getGuides() {    
    const [guides] = await pool.query("SELECT * FROM guides")
    return guides;
}

export async function getSingleGuide(id: number) {
    const [guides]: any = await pool.query(`
        SELECT * 
        FROM guides
        WHERE id = ?
    `, [id])
    return guides[0];
}

export async function findGuide(title: string) {
    const [guides]: any = await pool.query(`
        SELECT * 
        FROM guides
        WHERE title = '${title}'
    `, [title])
    return guides[0];
}

export async function createGuide(title: string, contents: string) {
    const result = await pool.query(`
        INSERT 
        INTO guides (title, contents)
        VALUES (?, ?)    
    `, [title, contents])
    return result;
}

export async function deleteGuide(title: string) {
    const result = await pool.query(`
        DELETE 
        FROM guides
        WHERE title = '${title}'`, [title])
    return result;
}

export async function setMainGuide(title: string) {
    const result = await pool.query(`
            UPDATE guides
            SET mainGuide = title = '${title}'`, [title]) 
    return result;
}

export async function findUser(id: number) {
    const [users]: any = await pool.query(`
        SELECT * 
        FROM users
        WHERE user_id = ?
    `, [id])
    return users[0];
}

export async function createUser(user: IAddNewUser) {
    const newUser = await pool.query(`
        INSERT 
        INTO users (user_id, last_name, first_name, email, password)
        VALUES (?, ?, ?, ?, ?)    
    `, [user.user_id, user.last_name, user.first_name, user.email, user.password])
    return newUser; 
}

export async function getUsers() {    
    const [users] = await pool.query("SELECT * FROM users")
    return users;
}
