import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

interface Movie {
  Title: string;
  Year: string;
  Runtime: string;
  Poster?: string;
}

interface FilterOptions {
  searchTerm: string;
  sortBy: 'Title' | 'Year' | 'Runtime';
}

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    sortBy: 'Title'
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://my-json-server.typicode.com/horizon-code-academy/fake-movies-api/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value as any }));
  };

  const getRuntime = (runtime: string) => {
    const minutes = parseInt(runtime);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;
  };

  const filteredMovies = movies
    .filter(movie => 
      movie.Title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (filters.sortBy === 'Year') {
        return parseInt(b.Year) - parseInt(a.Year);
      }
      if (filters.sortBy === 'Runtime') {
        const runtimeA = parseInt(a.Runtime);
        const runtimeB = parseInt(b.Runtime);
        return runtimeB - runtimeA;
      }
      return a.Title.localeCompare(b.Title);
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Movie Database
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Title">Sort by Title</option>
                <option value="Year">Sort by Year</option>
                <option value="Runtime">Sort by Runtime</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map(movie => (
            <div 
              key={movie.Title} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-96 bg-gray-200">
                {movie.Poster ? (
                  <img 
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-lg">No Poster Available</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2">
                  {movie.Title}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p className="flex justify-between items-center">
                    <span className="text-gray-500">Year</span>
                    <span className="font-medium">{movie.Year}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="text-gray-500">Runtime</span>
                    <span className="font-medium">{getRuntime(movie.Runtime)}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No movies found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;