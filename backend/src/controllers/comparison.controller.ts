import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const saveComparison = async (req: AuthRequest, res: Response) => {
  try {  
    const userId = req.user?.id;
    const { colleges } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sortedColleges = [...colleges].sort();

    const existingComparison =
      await prisma.savedComparison.findFirst({
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

    const comparison = await prisma.savedComparison.create({
      data: {
        userId,
        colleges: sortedColleges,
        // colleges,
      },
    });

    res.status(201).json(comparison);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save comparison' });
  }
};


export const getSavedComparisons = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const comparisons = await prisma.savedComparison.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const formattedComparisons = await Promise.all(
      comparisons.map(async (comparison) => {
        const colleges = await prisma.college.findMany({
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
      })
    );

    res.json(formattedComparisons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch comparisons' });
  }
};


export const removeComparison = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const comparisonId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.savedComparison.deleteMany({
      where: {
        id: comparisonId,
        userId,
      },
    });

    return res.json({
      message: 'Comparison removed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to remove comparison',
    });
  }
};