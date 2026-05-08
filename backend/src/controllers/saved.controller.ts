import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const saveCollege = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { collegeId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const existingSave = await prisma.savedCollege.findUnique({
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

    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId,
        collegeId,
      },
    });

    res.status(201).json(savedCollege);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save college' });
  }
};

export const getSavedColleges = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: true,
      },
    });

    res.json(savedColleges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved colleges' });
  }
};

export const removeSavedCollege = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const collegeId = req.params.collegeId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.savedCollege.deleteMany({
      where: {
        userId,
        collegeId,
      },
    });

    return res.json({ message: 'Removed successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove saved college' });
  }
};