import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import exerciseRoutes from "./routes/exercise.routes";
import submissionRoutes from "./routes/submission.routes";
import rankingRoutes from "./routes/ranking.routes";
import badgeRoutes from "./routes/badge.routes";
import lessonRoutes from "./routes/lesson.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

// Segurança: Proteção de headers HTTP
app.use(helmet());

// Segurança: Rate Limiting (Evita ataques de força bruta/DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 requisições por IP por janela
  message: { error: 'Muitas requisições deste IP. Tente novamente mais tarde.' }
});
app.use("/api", limiter);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/lessons", lessonRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

export default app; // Exportando para facilitar testes

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
