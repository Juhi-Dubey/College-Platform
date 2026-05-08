'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
}

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [savingComparison, setSavingComparison] = useState(false);

  useEffect(() => {
    const loadAllColleges = async () => {
      try {
        const response = await fetchAPI('/colleges?limit=100');
        setColleges(response.data);
      } catch (error) {
        console.error('Failed to load colleges', error);
      } finally {
        setLoading(false);
      }
    };
    loadAllColleges();
  }, []);

  useEffect(() => {
    const ids = searchParams.get('ids');

    if (ids) {
      const parsedIds = ids.split(',');

      setSelectedIds([
        parsedIds[0] || '',
        parsedIds[1] || '',
        parsedIds[2] || '',
      ]);
    }
  }, [searchParams]);

  const handleSelect = (index: number, id: string) => {
    const newSelected = [...selectedIds];
    newSelected[index] = id;
    setSelectedIds(newSelected);
  };

  const handleSaveComparison = async () => {
    setSavingComparison(true);
    try {
      const ids = selectedColleges
        .filter(Boolean)
        .map((college) => college!.id);

      await fetchAPI('/comparisons', {
        method: 'POST',
        body: JSON.stringify({
          colleges: ids,
        }),
      });

      toast.success('Comparison saved!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save comparison');
    } finally {
      setSavingComparison(false);
    }
  };
  const selectedColleges = selectedIds.map(id => colleges.find(c => c.id === id) || null);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-72 bg-gray-800 rounded-xl"></div>

        <div className="bg-gray-900 border border-indigo-500/20 rounded-2xl p-6 overflow-hidden">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map((item) => (
              <div
                key={item}
                className="h-12 bg-gray-800 rounded-lg"
              ></div>
            ))}
          </div>

          <div className="space-y-4">
            {[1,2,3,4].map((row) => (
              <div
                key={row}
                className="grid grid-cols-4 gap-4"
              >
                {[1,2,3,4].map((col) => (
                  <div
                    key={col}
                    className="h-14 bg-gray-800 rounded-lg"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 text-center py-6">
        <h1 className="text-3xl font-bold text-white">Compare Colleges</h1>
        <p className="text-white mt-2">Select up to 3 colleges to compare side-by-side.</p>
      </div>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={handleSaveComparison}
          disabled={
            savingComparison ||
            selectedColleges.filter(Boolean).length < 2
          }  
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {savingComparison ? 'Saving...' : 'Save Comparison'}
          
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-5 bg-gray-100 text-gray-800 font-semibold">Features</th>
              {[0, 1, 2].map((index) => (
                <th key={index} className="p-5 border-b border-l border-gray-200 bg-white w-1/4 align-top">
                  <select
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={selectedIds[index]}
                    onChange={(e) => handleSelect(index, e.target.value)}
                  >
                    <option value="" className="text-gray-500">
                      Select a College
                    </option>
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id} disabled={selectedIds.filter(Boolean).includes(c.id) && selectedIds[index] !== c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">Location</td>
              {selectedColleges.map((college, idx) => (
                <td
                  key={idx}
                  className={`p-4 border-b border-l border-gray-200 text-gray-800 ${
                    college ? 'bg-indigo-100' : ''
                  }`}
                >
                  {college ? college.location : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">Rating</td>
              {selectedColleges.map((college, idx) => (
                <td
                  key={idx}
                  className={`p-4 border-b border-l border-gray-200 text-gray-800 ${
                    college ? 'bg-indigo-100' : ''
                  }`}
                >
                  {college ? `★ ${college.rating}` : '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">Annual Fees</td>
              {selectedColleges.map((college, idx) => (
                <td
                  key={idx}
                  className={`p-4 border-b border-l border-gray-200 text-gray-800 ${
                    college ? 'bg-indigo-100' : ''
                  }`}
                >
                  {college?.fees ? `₹${college.fees.toLocaleString('en-IN')}` : '-' }
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">Placement Percentage</td>
              {selectedColleges.map((college, idx) => (
                <td
                  key={idx}
                  className={`p-4 border-b border-l border-gray-200 font-bold text-green-600 ${
                    college ? 'bg-indigo-100' : ''
                  }`}
                >
                  {college ? `${college.placementPercentage}%` : '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
