import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { getArticles } from '@/lib/sanity-client';
import ArticleCard from './ArticleCard';

interface HomeNewsSectionProps {
  className?: string;
}

const HomeNewsSection: React.FC<HomeNewsSectionProps> = ({ className = '' }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // Fetch only the latest 4 articles for the homepage
        const articlesData = await getArticles(4);
        setArticles(articlesData || []);
      } catch (err) {
        console.error('Error fetching articles for homepage:', err);
        setError('Failed to load latest news');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className={`home-news-section ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show errors on the homepage, just hide the section
  }

  if (articles.length === 0) {
    return null; // Don't show empty section
  }

  return (
    <div className={`home-news-section ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Latest News</h2>
        <Link href="/news" className="text-blue-600 hover:underline">
          View All News
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default HomeNewsSection;
