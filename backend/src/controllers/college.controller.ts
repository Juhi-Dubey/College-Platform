
import { Request, Response } from 'express';
import prisma from '../config/db';
import { Prisma } from '@prisma/client';

export const getColleges = async (req: Request, res: Response) => {
  try {
    const {
      search,
      location,
      maxFees,
      courses,
      placements,
      ratings,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    const where: Prisma.CollegeWhereInput = {};

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
        .map((item) => Number(item.match(/\d+/)?.[0]));

      where.placementPercentage = {
        gte: Math.min(...placementValues),
      };
    }

    if (ratings) {
      const ratingValues = String(ratings)
        .split(',')
        .map((item) => Number(item.match(/\d+(\.\d+)?/)?.[0]));

      where.rating = {
        gte: Math.min(...ratingValues),
      };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take,
        orderBy: { rating: 'desc' },
      }),
      prisma.college.count({ where }),
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
};

export const getCollegeById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const college = await prisma.college.findUnique({
      where: { id },
      include: { courses: true },
    });

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.json({ data: college });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch college' });
  }
};