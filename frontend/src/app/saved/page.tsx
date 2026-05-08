'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';

export default function SavedCollegesPage() {

  interface SavedCollege {
    id: string;
    college: {
      id: string;
      name: string;
      location: string;
      fees: number;
      rating: number;
      placementPercentage: number;
    };
  }

  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState('');

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const data = await fetchAPI('/saved');
        setSavedColleges(data);
      } catch (err: any) {
        setError(err.error || 'Failed to load saved colleges');
      } finally {
        setRemovingId('');
        setLoading(false);
      }
    };
    loadSaved();
  }, []);

  const handleRemove = async (collegeId: string) => {
    try {
      setRemovingId(collegeId);
      await fetchAPI(`/saved/${collegeId}`, {
        method: 'DELETE',
      });

      setSavedColleges((prev) =>
        prev.filter((saved) => saved.college.id !== collegeId)
      );
    } catch (err) {
      console.error('Failed to remove college');
    }
    finally {
      setRemovingId('');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse"
          >
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>

            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>

            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-100 rounded"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
        <p className="text-gray-500 mb-4">You need to be logged in to view your saved colleges.</p>
        <Link href="/auth/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-400">Your Saved Colleges</h1>
        <p className="text-gray-300 mt-2">Manage and review your shortlisted institutions.</p>
      </div>

      {savedColleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((saved) => (
            <div key={saved.id} className="relative">
              <CollegeCard college={saved.college} />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(saved.college.id);
                }}
                className="absolute bottom-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition z-10"
              >
                {removingId === saved.college.id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No saved colleges yet</h3>
          <p className="text-gray-500 mb-4">Explore the directory and save the ones you like.</p>
          <Link href="/" className="inline-block text-indigo-600 font-medium hover:underline">
            Browse Colleges
          </Link>
        </div>
      )}
    </div>
  );
}
