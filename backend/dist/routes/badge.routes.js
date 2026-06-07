"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BadgeController_1 = require("../controllers/BadgeController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', BadgeController_1.getUserBadges);
exports.default = router;
