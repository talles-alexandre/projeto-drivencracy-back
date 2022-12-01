import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let db;

const mongoClient = new MongoClient(process.env.MONGO_URL);

try {
  await mongoClient.connect();
  db = mongoClient.db(process.env.MONGO_DB);
  console.log("Banco de Dados conectado");
} catch (error) {
  console.log("Erro ao conectar o banco de dados");
}

db = mongoClient.db(process.env.MONGO_DB);

export default db;
