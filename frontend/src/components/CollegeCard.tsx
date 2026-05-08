import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useState } from 'react';

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  image?: string;
}


export default function CollegeCard({ 
  college, 
  hideSaveButton = false,
}: { 
  college: College;
  hideSaveButton?: boolean;
}) {
  const [saving, setSaving] = useState(false);
  
  const handleSave = async (collegeId: string) => {
    try {
      setSaving(true);
      await fetchAPI('/saved', {
        method: 'POST',
        body: JSON.stringify({ collegeId }),
      });

      toast.success('College saved successfully');
    } catch (error: any) {
      toast.error(error.error || 'Failed to save college');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link 
      href={`/college/${college.id}`} 
      className="block h-full"
      aria-label={`View details of ${college.name}`}
    >
      <div className="group bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02] border border-gray-100 flex flex-col h-full cursor-pointer">

        <div className="relative">
          <img
            
            src={college.image || '/colleges/default.jpg'}
            alt={college.name}
            className="w-full h-52 object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/40 to-transparent rounded-t-xl"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl leading-tight font-bold leading-tight drop-shadow-lg">
              {college.name}
            </h3>
          </div>
        </div> 
        <div className="p-4 flex-grow">
          <div className="flex justify-end mb-4">
            
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md font-semibold px-2 py-1 rounded text-sm flex items-center">
              ★ {college.rating}
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-4 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {college.location}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-600 uppercase font-medium tracking-wider mb-1">Annual Fees</p>
              <p className="font-semibold text-gray-800">{college.fees ? `₹${college.fees.toLocaleString('en-IN')}` : 'N/A'}</p>
            </div>
            <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
              <p className="text-xs text-gray-600 uppercase font-medium tracking-wider mb-1">Placements</p>
              <p className="font-semibold text-green-600">{college.placementPercentage ?? 'N/A'}%</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          
          {!hideSaveButton && (
            <div className="flex gap-2">
              <button
                disabled={saving}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSave(college.id);
                }}
                className="px-4 py-1.5 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:scale-105 transition-all duration-500 ease-out shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex justify-center items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  '❤️ Save'
          )}
              </button>
            </div>
          )}
        </div>
    </div>
    </Link>
  );
}
