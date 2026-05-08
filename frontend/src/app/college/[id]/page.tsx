'use client';


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
}

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  courses: Course[];
}

export default function CollegeDetailPage() {
  const { id } = useParams();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCollege = async () => {
      try {
        const data = await fetchAPI(`/colleges/${id}`);
        setCollege(data.data);
      } catch (err) {
        setError('Failed to load college details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadCollege();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetchAPI('/saved', {
        method: 'POST',
        body: JSON.stringify({ collegeId: id }),
      });
      setSaved(true);
      toast.success('College saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save college.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
        <p className="font-bold text-lg">{error || 'College not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{college.name}</h1>
            <p className="text-gray-500 mt-2 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {college.location}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              saved
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save College'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Rating</p>
            <p className="text-2xl font-bold text-gray-900">★ {college.rating}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Annual Fees</p>
            <p className="text-2xl font-bold text-gray-900">₹{college.fees.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-green-600 text-sm mb-1 uppercase tracking-wider">Placements</p>
            <p className="text-2xl font-bold text-green-700">{college.placementPercentage}%</p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses Offered</h2>
        {college.courses && college.courses.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {college.courses.map((course) => (
              <div
                key={course.id}
                className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 text-sm font-medium transition hover:bg-indigo-500/20"
              >
                {course.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses information available.</p>
        )}
      </div>

      {/* Reviews Section (Mock Data) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-6">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg mr-3">A</div>
              <div>
                <p className="font-bold text-gray-900">Amit Kumar</p>
                <p className="text-xs text-gray-500">Alumni</p>
              </div>
            </div>
            <p className="text-gray-700">"Excellent faculty and amazing campus life. The placement cell is very active and brings top companies."</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg mr-3">P</div>
              <div>
                <p className="font-bold text-gray-900">Priya Sharma</p>
                <p className="text-xs text-gray-500">Current Student</p>
              </div>
            </div>
            <p className="text-gray-700">"The infrastructure is top-notch. Course curriculum is regularly updated to match industry standards."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
