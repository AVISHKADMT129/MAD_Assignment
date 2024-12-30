import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
