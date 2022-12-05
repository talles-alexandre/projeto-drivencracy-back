import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;

const mongoClient = new MongoClient(process.env.MONGODB_URL);

try {
  await mongoClient.connect();
  console.log("Banco de Dados conectado");
} catch (error) {
  console.log("Erro ao conectar o banco de dados");
}

db = mongoClient.db("drivencracy");

export default db;
