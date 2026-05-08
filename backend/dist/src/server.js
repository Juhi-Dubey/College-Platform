"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const college_routes_1 = __importDefault(require("./routes/college.routes"));
const saved_routes_1 = __importDefault(require("./routes/saved.routes"));
const comparison_routes_1 = __importDefault(require("./routes/comparison.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/colleges', college_routes_1.default);
app.use('/api/saved', saved_routes_1.default);
app.use('/api/comparisons', comparison_routes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
