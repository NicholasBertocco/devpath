"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const exercise_routes_1 = __importDefault(require("./routes/exercise.routes"));
const submission_routes_1 = __importDefault(require("./routes/submission.routes"));
const ranking_routes_1 = __importDefault(require("./routes/ranking.routes"));
const badge_routes_1 = __importDefault(require("./routes/badge.routes"));
const lesson_routes_1 = __importDefault(require("./routes/lesson.routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3333;
// Segurança: Proteção de headers HTTP
app.use((0, helmet_1.default)());
// Segurança: Rate Limiting (Evita ataques de força bruta/DDoS)
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita a 100 requisições por IP por janela
    message: {
        error: "Muitas requisições deste IP. Tente novamente mais tarde.",
    },
});
app.use("/api", limiter);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/exercises", exercise_routes_1.default);
app.use("/api/submissions", submission_routes_1.default);
app.use("/api/ranking", ranking_routes_1.default);
app.use("/api/badges", badge_routes_1.default);
app.use("/api/lessons", lesson_routes_1.default);
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "API is running" });
});
exports.default = app; // Exportando para facilitar testes
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
