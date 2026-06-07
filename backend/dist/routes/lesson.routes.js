"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LessonController_1 = require("../controllers/LessonController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Públicas para alunos
router.get('/', LessonController_1.getLessons);
router.get('/:id', LessonController_1.getLessonById);
router.post('/:id/complete', LessonController_1.completeLesson);
// Restritas para instrutores/admins
router.post('/', (0, role_middleware_1.authorizeRole)(['INSTRUCTOR', 'ADMIN']), LessonController_1.createLesson);
exports.default = router;
