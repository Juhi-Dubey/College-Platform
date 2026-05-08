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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const collegesData = [
    {
        name: 'Indian Institute of Technology Bombay',
        location: 'Mumbai, Maharashtra',
        fees: 1200000,
        rating: 4.9,
        placementPercentage: 98,
        image: '/colleges/iitb.jpg',
        courses: ['B.Tech Computer Science', 'B.Tech Electrical', 'B.Tech Mechanical'],
    },
    {
        name: 'Indian Institute of Technology Delhi',
        location: 'New Delhi, Delhi',
        fees: 1100000,
        rating: 4.8,
        placementPercentage: 97,
        image: '/colleges/iitd.jpg',
        courses: ['B.Tech Computer Science', 'B.Tech Civil', 'B.Tech Mathematics'],
    },
    {
        name: 'Birla Institute of Technology and Science',
        location: 'Pilani, Rajasthan',
        fees: 2000000,
        rating: 4.7,
        placementPercentage: 95,
        image: '/colleges/bitsp.jpg',
        courses: ['B.E. Computer Science', 'B.E. Electronics', 'B.E. Chemical'],
    },
    {
        name: 'National Institute of Technology Trichy',
        location: 'Tiruchirappalli, Tamil Nadu',
        fees: 800000,
        rating: 4.6,
        placementPercentage: 94,
        image: '/colleges/nitt.jpg',
        courses: ['B.Tech Computer Science', 'B.Tech Instrumentation', 'B.Tech Production'],
    },
    {
        name: 'Vellore Institute of Technology',
        location: 'Vellore, Tamil Nadu',
        fees: 1500000,
        rating: 4.3,
        placementPercentage: 85,
        image: '/colleges/vit.jpg',
        courses: ['B.Tech Computer Science', 'B.Tech Information Technology', 'B.Tech Biotech'],
    },
    {
        name: 'Delhi Technological University',
        location: 'New Delhi, Delhi',
        fees: 900000,
        rating: 4.5,
        placementPercentage: 92,
        image: '/colleges/dtu.jpg',
        courses: ['B.Tech Software Engineering', 'B.Tech IT', 'B.Tech Mechanical'],
    },
    {
        name: 'Manipal Institute of Technology',
        location: 'Manipal, Karnataka',
        fees: 1800000,
        rating: 4.2,
        placementPercentage: 80,
        image: '/colleges/mit.jpg',
        courses: ['B.Tech Computer Science', 'B.Tech Data Science', 'B.Tech Electronics'],
    },
];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding database...');
        for (const c of collegesData) {
            yield prisma.college.create({
                data: {
                    name: c.name,
                    location: c.location,
                    fees: c.fees,
                    rating: c.rating,
                    placementPercentage: c.placementPercentage,
                    courses: {
                        create: c.courses.map((courseName) => ({
                            name: courseName,
                        })),
                    },
                },
            });
        }
        console.log('Seeding complete.');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
