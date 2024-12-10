import mysql from "mysql2";
import { config } from "dotenv";

const { parsed } = config();

const dotEnvDataBase = parsed;

const pool = mysql.createPool({
    host: dotEnvDataBase?.MYSQL_HOST,
    user: dotEnvDataBase?.MYSQL_USER,
    password: dotEnvDataBase?.MYSQL_PASSWORD,
    database: dotEnvDataBase?.MYSQL_DATABASE
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
    await pool.query(`
        UPDATE guides
        SET mainGuide = false`)
    
    const result = await pool.query(`
        UPDATE guides
        SET mainGuide = true
        WHERE title = '${title}'`, [title])
    return result;
}


