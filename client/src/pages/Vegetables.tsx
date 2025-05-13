import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVegetables } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import DataTable from '@/components/ui/DataTable';
import FadeIn from '@/components/ui/FadeIn';
import { Input } from '@/components/ui/input';

const Vegetables = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['vegetables'],
    queryFn: getVegetables,
    staleTime: 3600000 // 1 hour
  });

  const filteredData = data?.filter((item: any) => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name_nepali?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Map API data to our component expected format
  const formattedData = filteredData.map((item: any) => ({
    name: item.name_nepali ? `${item.name} (${item.name_nepali})` : item.name,
    unit: item.unit,
    minPrice: parseFloat(item.min_price),
    maxPrice: parseFloat(item.max_price),
    avgPrice: parseFloat(item.avg_price),
    priceTrend: calculateTrend(parseFloat(item.min_price), parseFloat(item.max_price))
  }));

  function calculateTrend(min: number, max: number): string {
    // Simple placeholder logic - could be replaced with actual trend data
    const diff = max - min;
    if (diff > 20) return 'up';
    if (diff < 10) return 'down';
    return 'stable';
  }

  const vegetableColumns = [
    { header: 'Item', accessor: 'name' },
    { header: 'Unit', accessor: 'unit' },
    { header: 'Min Price', accessor: 'minPrice', cell: (value: number) => `Rs. ${value}` },
    { header: 'Max Price', accessor: 'maxPrice', cell: (value: number) => `Rs. ${value}` },
    { header: 'Avg Price', accessor: 'avgPrice', cell: (value: number) => `Rs. ${value}` },
    { 
      header: 'Trend', 
      accessor: 'priceTrend', 
      cell: (value: string) => {
        if (value === 'up') return <i className="ri-arrow-up-line text-red-500"></i>;
        if (value === 'down') return <i className="ri-arrow-down-line text-green-500"></i>;
        return <i className="ri-subtract-line text-gray-500"></i>;
      } 
    },
  ];

  return (
    <MainLayout
      title="Vegetable Prices"
      description="Track current vegetable prices from Kalimati market to make informed shopping decisions."
    >
      <FadeIn>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-primary font-poppins mb-4 text-center">Vegetable Prices</h1>
            <p className="text-center text-neutral mb-8 max-w-2xl mx-auto">
              Current vegetable prices from Kalimati market to help you make informed shopping decisions.
            </p>
          </div>
        </section>
      </FadeIn>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-primary">Today's Vegetable Prices</h2>
                <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Search vegetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            {error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-800 mb-6">
                Failed to load vegetable prices. Please try again later.
              </div>
            ) : (
              <DataTable
                columns={vegetableColumns}
                data={formattedData}
                isLoading={isLoading}
              />
            )}

            <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">Price Legend:</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <i className="ri-arrow-up-line text-red-500 mr-1"></i>
                  <span>Price increasing</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-arrow-down-line text-green-500 mr-1"></i>
                  <span>Price decreasing</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-subtract-line text-gray-500 mr-1"></i>
                  <span>Price stable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Vegetables;
