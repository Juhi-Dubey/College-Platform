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
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("../config/db"));
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format").trim(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain 1 uppercase letter")
        .regex(/[0-9]/, "Must contain 1 number"),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format").trim(),
    password: zod_1.z.string().min(1, "Password is required"),
});
const getJWTSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not defined");
    }
    return process.env.JWT_SECRET;
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = signupSchema.parse({
            email: (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim(),
            password: req.body.password,
        });
        const normalizedEmail = email.toLowerCase();
        const existingUser = yield db_1.default.user.findUnique({ where: { email: normalizedEmail } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        const user = yield db_1.default.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, getJWTSecret(), { expiresIn: '7d' });
        return res.status(201).json({ token, user: { id: user.id, email: user.email } });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: error.issues.map(e => e.message) });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password } = loginSchema.parse({
            email: (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim(),
            password: req.body.password,
        });
        const normalizedEmail = email.toLowerCase();
        const user = yield db_1.default.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, getJWTSecret(), { expiresIn: '7d' });
        return res.status(200).json({ token, user: { id: user.id, email: user.email } });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ error: error.issues.map(e => e.message) });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
