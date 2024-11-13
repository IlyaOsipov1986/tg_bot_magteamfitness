import mysql from "mysql2";
import { config } from "dotenv";
import { IResultGuides } from "../commands/command.interface.js";

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


