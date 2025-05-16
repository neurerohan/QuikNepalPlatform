import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { getArticles } from '@/lib/sanity-client';

interface ArticleListProps {
  initialArticles?: any[];
  categorySlug?: string;
  authorSlug?: string;
  tag?: string;
  limit?: number;
}

const ArticleList: React.FC<ArticleListProps> = ({
  initialArticles,
  categorySlug,
  authorSlug,
  tag,
  limit = 10
}) => {
  const [articles, setArticles] = useState<any[]>(initialArticles || []);
  const [loading, setLoading] = useState(!initialArticles);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!initialArticles) {
      fetchArticles();
    }
  }, [initialArticles, categorySlug, authorSlug, tag]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let result;
      const offset = (page - 1) * limit;
      
      if (categorySlug) {
        const { getArticlesByCategory } = await import('@/lib/sanity-client');
        result = await getArticlesByCategory(categorySlug, limit, offset);
      } else if (authorSlug) {
        const { getArticlesByAuthor } = await import('@/lib/sanity-client');
        result = await getArticlesByAuthor(authorSlug, limit, offset);
      } else if (tag) {
        const { getArticlesByTag } = await import('@/lib/sanity-client');
        result = await getArticlesByTag(tag, limit, offset);
      } else {
        result = await getArticles(limit, offset);
      }
      
      if (result && result.length > 0) {
        if (page === 1) {
          setArticles(result);
        } else {
          setArticles(prev => [...prev, ...result]);
        }
        setHasMore(result.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchArticles();
  };

  if (loading && articles.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-100 rounded-lg h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (articles.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700">No articles found</h3>
        <p className="text-gray-500 mt-2">
          Check back later for new content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleCard 
            key={article._id} 
            article={article}
            variant={index === 0 ? 'large' : 'medium'}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
