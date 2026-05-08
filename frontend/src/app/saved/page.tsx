'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import { toast } from 'sonner';

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
      image?: string;
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
        const imageMap: Record<string, string> = {
          'Indian Institute of Technology Bombay': '/colleges/iitb.jpg',
          'Indian Institute of Technology Delhi': '/colleges/iitd.jpg',
          'Birla Institute of Technology and Science': '/colleges/bitsp.jpg',
          'National Institute of Technology Trichy': '/colleges/nitit.jpg',
          'Vellore Institute of Technology': '/colleges/vit.jpg',
          'Delhi Technological University': '/colleges/dtu.jpg',
          'Manipal Institute of Technology': '/colleges/mit.jpg',
        };

        const savedWithImages = data.map((saved: any) => ({
          ...saved,
          college: {
            ...saved.college,
            image:
              imageMap[saved.college.name] || '/colleges/default.jpg',
          },
        }));

        setSavedColleges(savedWithImages);
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
      toast.success('College removed successfully');
    } catch (err) {
      toast.error('Failed to remove college');
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
        <h1 className="text-3xl font-bold text-white">Your Saved Colleges</h1>
        <p className="text-gray-300 mt-2">Manage and review your shortlisted institutions.</p>
      </div>

      {savedColleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((saved) => (
            <div key={saved.id} className="relative group">
              <CollegeCard 
                college={saved.college}
                hideSaveButton={true}
              />
              <button
                disabled={removingId === saved.college.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(saved.college.id);
                }}
                className="absolute bottom-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 z-10 group-hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {removingId === saved.college.id ? (
                  <div className="flex justify-center items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Remove'
                )}
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
