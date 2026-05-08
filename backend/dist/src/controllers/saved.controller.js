"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSavedCollege = exports.getSavedColleges = exports.saveCollege = void 0;
const db_1 = __importDefault(require("../config/db"));
const saveCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { collegeId } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const existingSave = yield db_1.default.savedCollege.findUnique({
            where: {
                userId_collegeId: {
                    userId,
                    collegeId,
                },
            },
        });
        if (existingSave) {
            return res.status(400).json({ error: 'College already saved' });
        }
        const savedCollege = yield db_1.default.savedCollege.create({
            data: {
                userId,
                collegeId,
            },
        });
        res.status(201).json(savedCollege);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save college' });
    }
});
exports.saveCollege = saveCollege;
const getSavedColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const savedColleges = yield db_1.default.savedCollege.findMany({
            where: { userId },
            include: {
                college: true,
            },
        });
        res.json(savedColleges);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch saved colleges' });
    }
});
exports.getSavedColleges = getSavedColleges;
const removeSavedCollege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const collegeId = req.params.collegeId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        yield db_1.default.savedCollege.deleteMany({
            where: {
                userId,
                collegeId,
            },
        });
        return res.json({ message: 'Removed successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to remove saved college' });
    }
});
exports.removeSavedCollege = removeSavedCollege;
