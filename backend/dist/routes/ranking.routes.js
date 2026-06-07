"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RankingController_1 = require("../controllers/RankingController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', RankingController_1.getLeaderboard);
exports.default = router;
