import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pollRoutes from "./routes/pollroute.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(pollRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});
