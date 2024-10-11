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
    const [itemGuides] = await pool.query("SELECT * FROM guides")
    return itemGuides;
}


