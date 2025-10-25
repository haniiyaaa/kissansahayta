import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import Routes from "./routes/Routes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api/users", userRoutes);


app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);
