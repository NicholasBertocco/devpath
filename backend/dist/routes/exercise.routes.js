"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExerciseController_1 = require("../controllers/ExerciseController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Todas as rotas de exercícios requerem autenticação
router.use(auth_middleware_1.authenticate);
// Alunos, Instrutores e Admins podem listar os exercícios
router.get('/', ExerciseController_1.getExercises);
router.get('/:id', ExerciseController_1.getExerciseById);
// Apenas Instrutores e Admins podem criar exercícios
router.post('/', (0, role_middleware_1.authorizeRole)(['INSTRUCTOR', 'ADMIN']), ExerciseController_1.createExercise);
exports.default = router;
