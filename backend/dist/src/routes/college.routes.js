"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const college_controller_1 = require("../controllers/college.controller");
const router = (0, express_1.Router)();
router.get('/', college_controller_1.getColleges);
router.get('/:id', college_controller_1.getCollegeById);
exports.default = router;
