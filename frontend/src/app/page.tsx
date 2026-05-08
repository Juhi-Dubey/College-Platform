'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';


interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  image?: string;
}

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const collegesPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFees, setSelectedFees] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedPlacement, setSelectedPlacement] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  
  const loadColleges = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (location) query.append('location', location);
      if (selectedFees) {
        query.append('maxFees', selectedFees);
      }
      if (selectedCourses.length > 0) {
        query.append(
          'courses',
          selectedCourses.join(',')
        );
      }
      if (selectedPlacement) {
        query.append('placements', selectedPlacement);
      }

      if (selectedRating) {
        query.append('ratings', selectedRating);
      }

      const response = await fetchAPI(`/colleges?${query.toString()}`);
      const imageMap: Record<string, string> = {
        'Indian Institute of Technology Bombay': '/colleges/iitb.jpg',
        'Indian Institute of Technology Delhi': '/colleges/iitd.jpg',
        'Birla Institute of Technology and Science': '/colleges/bitsp.jpg',
        'National Institute of Technology Trichy': '/colleges/nitt.jpg',
        'Vellore Institute of Technology': '/colleges/vit.jpg',
        'Delhi Technological University': '/colleges/dtu.jpg',
        'Manipal Institute of Technology': '/colleges/mit.jpg',
      };

      const collegesWithImages = response.data.map((college: any) => {
        const matchedImage = imageMap[college.name];

        return {
          ...college,
          image: matchedImage || '/colleges/default.jpg',
        };
      });

      setColleges(collegesWithImages);
    } catch (error) {
      console.error('Failed to load colleges', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, [search, location, selectedFees, selectedCourses, selectedPlacement, selectedRating]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, selectedFees, selectedCourses, selectedPlacement, selectedRating]);

  const indexOfLastCollege = currentPage * collegesPerPage;
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage;

  const currentColleges = colleges.slice(
    indexOfFirstCollege,
    indexOfLastCollege
  );

  const totalPages = Math.ceil(colleges.length / collegesPerPage);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-12 px-4"
    >
      {/* Sidebar Filters */}
      <aside className="w-full md:w-80 flex-shrink-0 md:-ml-6 self-start sticky top-24">
        <div className="bg-gradient-to-b from-gray-900 to-black p-6 pb-8 rounded-2xl shadow-2xl border border-indigo-500/20 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white
           mb-4">Filters</h2>
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Delhi"
                className="w-full rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Fees Range
              </label>

              <div className="space-y-3">
                {[
                  { label: 'Under ₹10 Lakhs', value: '1000000' },
                  { label: 'Under ₹15 Lakhs', value: '1500000' },
                  { label: 'Under ₹20 Lakhs', value: '2000000' },
                ].map((fee) => (
                  <label
                    key={fee.value}
                    className="flex items-center gap-3 text-gray-300 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="fees"
                      checked={selectedFees === fee.value}
                      onChange={() => setSelectedFees(fee.value)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-indigo-500"
                    />

                    {fee.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Courses
              </label>

              <div className="space-y-3">
                {[
                  'Computer Science',
                  'Electronics',
                  'Mechanical',
                  'Civil',
                ].map((course) => (
                  <label
                    key={course}
                    className="flex items-center gap-3 text-gray-200 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourses((prev) => [
                            ...prev,
                            course,
                          ]);
                        } else {
                          setSelectedCourses((prev) =>
                            prev.filter((item) => item !== course)
                          );
                        }
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-indigo-500"
                    />

                    {course}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Placement Rate
              </label>

              <div className="space-y-3">
                {[
                  '90% and above',
                  '80% and above',
                  '70% and above',
                ].map((placement) => (
                  <label
                    key={placement}
                    className="flex items-center gap-3 text-gray-200 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="placement"
                      checked={selectedPlacement === placement}
                      onChange={() => setSelectedPlacement(placement)}
                      className="w-4 h-4 border-white/20 bg-white/5 accent-indigo-500"
                    />
                    {placement}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Ratings
              </label>

              <div className="space-y-3">
                {[
                  '4.5+ Rating',
                  '4.0+ Rating',
                  '3.5+ Rating',
                  '3.0+ Rating',
                ].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 text-gray-200 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                      className="w-4 h-4 border-white/20 bg-white/5 accent-indigo-500"
                    />
                    {rating}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setLocation('');
                setSelectedFees('');
                setSelectedCourses([]);
                setCurrentPage(1);
                setSelectedPlacement('');
                setSelectedRating('');
              }}
              className="text-sm text-gray-200 font-medium hover:text-indigo-400 transition mt-3"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-gray-900 to-black px-8 py-12 mb-12 shadow-2xl border border-indigo-500/20">

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#6366f1,_transparent_40%)]"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Discover Top Colleges
            </h1>

            <p className="text-gray-300 mt-5 text-lg max-w-lg">
              Compare colleges, explore placements, save favorites,
              and make smarter academic decisions.
            </p>
            
            <div className="mt-8 max-w-lg">  
              <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden shadow-xl">
                <input
                  type="text"
                  placeholder="Search colleges like IIT Bombay, DTU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full min-w-0 bg-transparent px-4 py-4 text-white placeholder-gray-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="group flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white rounded-xl transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30"
                >
                  <Search
                    size={22}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  />
                </button>

              </div>
            </div>
            <div className="mt-6">
            {/* <div className="flex items-center bg-white/10 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden shadow-xl"></div> */}
             <Link
                href="#featured-colleges"
                
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:scale-105 hover:brightness-100 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 font-semibold"
              >
                  Explore Colleges
              </Link>
            </div>
          </div>
        </div>
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <div id="featured-colleges"
          className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Featured Colleges
            </h2>

            <p className="text-gray-300 mt-1">
              Explore top-rated institutions across India.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

          
        ) : colleges.length > 0 ? (
          <>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >  
            {currentColleges.map((college) => (
              <CollegeCard key={college.id} college={college}/>
            ))}
          </div>

          {totalPages > 1 && (
            
            <div className="border-t border-white/10 pt-8 mt-10 flex justify-center items-center gap-3 flex-wrap">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-gray-900 border border-indigo-500/20 text-white hover:bg-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-xl transition ${
                      currentPage === index + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-gray-900 border border-indigo-500/20 text-white hover:bg-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>

            </div>
          )}
          </>
        
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black p-12 text-center rounded-3xl border border-indigo-500/20 shadow-2xl"> 
            <h3 className="text-xl font-bold text-white mb-2">No colleges found</h3>
            <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
            <button 
              type='button'
              onClick={() => { 
                setSearch(''); 
                setLocation(''); 
                setSelectedFees(''); 
                setSelectedCourses([]); 
                setSelectedPlacement('');
                setSelectedRating('');
              }}
              className="mt-4 text-indigo-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      </div>
    </motion.div>
  );
  
}
