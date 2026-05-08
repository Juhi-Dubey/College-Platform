'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';


export default function SavedComparisonsPage() {
    const [comparisons, setComparisons] = useState<any[]>([]);
    const [removingId, setRemovingId] = useState('');
    const router = useRouter();

    const handleDelete = async (id: string) => {
        
        try {
            setRemovingId(id);
            await fetchAPI(`/comparisons/${id}`, {
            method: 'DELETE',
            });

            setComparisons((prev) =>
            prev.filter((comparison) => comparison.id !== id)
            );
        } catch (error) {
            console.error('Failed to delete comparison');
        } finally {
            setRemovingId('');
        }
    };

    useEffect(() => {
        const loadComparisons = async () => {
        try {
            const data = await fetchAPI('/comparisons');
            setComparisons(data);
        } catch (error) {
            console.error(error);
        }
        };

        loadComparisons();
    }, []);

    return (
        <div>
        <h1 className="text-3xl font-bold text-white mb-6">
            Saved Comparisons
        </h1>

        {comparisons.length > 0 ? (
        <div className="space-y-4">
            {comparisons.map((comparison) => (
            <div
                key={comparison.id}
                onClick={() =>
                router.push(
                    `/compare?ids=${comparison.colleges
                    .map((c: any) => c.id)
                    .join(',')}`
                )
                }
                className="bg-gradient-to-r from-gray-900 to-indigo-950 border border-indigo-500/30 p-6 rounded-xl shadow-lg hover:scale-[1.01] hover:border-indigo-400 transition-all duration-300 cursor-pointer"
            >
                <h2 className="text-indigo-300 font-semibold text-sm uppercase tracking-wider mb-3">
                Saved Comparison
                </h2>

                <div className="text-white font-medium text-lg leading-relaxed">
                {comparison.colleges
                    .map((college: any) => college.name)
                    .join(' vs ')}
                </div>

                <p className="text-gray-400 text-sm mt-3">
                Saved on{' '}
                {new Date(comparison.createdAt).toLocaleDateString()}
                </p>
                <button
                    disabled={removingId === comparison.id}
                    onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(comparison.id);
                    }}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {removingId === comparison.id ? 'Removing...' : 'Remove Comparison'}
                </button>
            </div>
            ))}
        </div>
        ) : (
        <div className="text-center py-20">
            <div className="text-6xl mb-4">⚖️</div>

            <h2 className="text-2xl font-bold text-white mb-2">
            No Saved Comparisons
            </h2>

            <p className="text-gray-400">
            Compare colleges and save them here.
            </p>
        </div>
        )}
        </div>
    );
}