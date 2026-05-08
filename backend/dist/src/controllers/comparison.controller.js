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
exports.removeComparison = exports.getSavedComparisons = exports.saveComparison = void 0;
const db_1 = __importDefault(require("../config/db"));
const saveComparison = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { colleges } = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const sortedColleges = [...colleges].sort();
        const existingComparison = yield db_1.default.savedComparison.findFirst({
            where: {
                userId,
                colleges: {
                    equals: sortedColleges,
                },
            },
        });
        if (existingComparison) {
            return res.status(400).json({
                error: 'Comparison already saved',
            });
        }
        const comparison = yield db_1.default.savedComparison.create({
            data: {
                userId,
                colleges: sortedColleges,
                // colleges,
            },
        });
        res.status(201).json(comparison);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save comparison' });
    }
});
exports.saveComparison = saveComparison;
const getSavedComparisons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const comparisons = yield db_1.default.savedComparison.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        const formattedComparisons = yield Promise.all(comparisons.map((comparison) => __awaiter(void 0, void 0, void 0, function* () {
            const colleges = yield db_1.default.college.findMany({
                where: {
                    id: {
                        in: comparison.colleges,
                    },
                },
            });
            return {
                id: comparison.id,
                colleges,
                createdAt: comparison.createdAt,
            };
        })));
        res.json(formattedComparisons);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch comparisons' });
    }
});
exports.getSavedComparisons = getSavedComparisons;
const removeComparison = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const comparisonId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        yield db_1.default.savedComparison.deleteMany({
            where: {
                id: comparisonId,
                userId,
            },
        });
        return res.json({
            message: 'Comparison removed successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to remove comparison',
        });
    }
});
exports.removeComparison = removeComparison;
