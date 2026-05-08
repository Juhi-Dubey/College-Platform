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
exports.getCollegeById = exports.getColleges = void 0;
const db_1 = __importDefault(require("../config/db"));
const getColleges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, location, maxFees, courses, placements, ratings, page = 1, limit = 10, } = req.query;
        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        const take = limitNumber;
        const where = {};
        if (search) {
            where.name = { contains: String(search), mode: 'insensitive' };
        }
        if (location) {
            where.location = { contains: String(location), mode: 'insensitive' };
        }
        if (maxFees) {
            where.fees = { lte: Number(maxFees) };
        }
        if (courses) {
            const courseList = String(courses)
                .split(',');
            where.courses = {
                some: {
                    name: {
                        contains: courseList[0],
                        mode: 'insensitive',
                    },
                },
            };
        }
        if (placements) {
            const placementValues = String(placements)
                .split(',')
                .map((item) => { var _a; return Number((_a = item.match(/\d+/)) === null || _a === void 0 ? void 0 : _a[0]); });
            where.placementPercentage = {
                gte: Math.min(...placementValues),
            };
        }
        if (ratings) {
            const ratingValues = String(ratings)
                .split(',')
                .map((item) => { var _a; return Number((_a = item.match(/\d+(\.\d+)?/)) === null || _a === void 0 ? void 0 : _a[0]); });
            where.rating = {
                gte: Math.min(...ratingValues),
            };
        }
        const [colleges, total] = yield Promise.all([
            db_1.default.college.findMany({
                where,
                skip,
                take,
                orderBy: { rating: 'desc' },
            }),
            db_1.default.college.count({ where }),
        ]);
        res.json({
            data: colleges,
            meta: {
                total,
                page: pageNumber,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch colleges' });
    }
});
exports.getColleges = getColleges;
const getCollegeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.params.id);
        const college = yield db_1.default.college.findUnique({
            where: { id },
            include: { courses: true },
        });
        if (!college) {
            return res.status(404).json({ error: 'College not found' });
        }
        res.json({ data: college });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch college' });
    }
});
exports.getCollegeById = getCollegeById;
