import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { getArticles } from '@/lib/sanity-client';
import { format } from 'date-fns';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: string;
  mainImageHotspot?: { x: number; y: number };
  publishedAt: string;
  isBreakingNews?: boolean;
  isFeatured?: boolean;
  author?: {
    name: string;
    slug: { current: string };
    image?: string;
  };
  categories?: Array<{
    title: string;
    slug: { current: string };
    color?: string;
  }>;
}

interface FeaturedNewsProps {
  limit?: number;
}

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ limit = 3 }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getArticles(limit, 0);
        if (data && data.length > 0) {
          setArticles(data);
        }
      } catch (error) {
        console.error('Error fetching featured news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <div 
          key={article._id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          {/* Article image */}
          <Link href={`/news/${article.slug.current}`} className="block h-40 relative">
            <img
              src={article.mainImage || '/images/default-article.jpg'}
              alt={article.title}
              className="w-full h-full object-cover"
              style={article.mainImageHotspot 
                ? { objectPosition: `${article.mainImageHotspot.x * 100}% ${article.mainImageHotspot.y * 100}%` }
                : {}
              }
            />
            {article.isBreakingNews && (
              <div className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">
                Breaking News
              </div>
            )}
          </Link>

          {/* Article content */}
          <div className="p-4">
            {/* Categories */}
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {article.categories.slice(0, 1).map((category) => (
                  <Link 
                    key={category.slug.current} 
                    href={`/category/${category.slug.current}`}
                    className={`text-xs px-2 py-0.5 rounded ${
                      category.color 
                        ? `bg-${category.color}-100 text-${category.color}-800` 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <Link href={`/news/${article.slug.current}`}>
              <h3 className="font-bold text-gray-900 hover:text-primary text-lg mb-2 line-clamp-2">
                {article.title}
              </h3>
            </Link>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {article.excerpt}
              </p>
            )}

            {/* Date */}
            <div className="text-xs text-gray-500">
              <time dateTime={article.publishedAt}>
                {format(new Date(article.publishedAt), 'MMM d, yyyy')}
              </time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedNews;
