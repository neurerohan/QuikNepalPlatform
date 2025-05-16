import React, { useEffect, useState } from 'react';
import { getArticles, getCategories } from '@/lib/sanity-client';
import SEO from '@/components/sanity/SEO';
import ArticleList from '@/components/sanity/ArticleList';
import { Link } from 'wouter';

const News: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch articles and categories in parallel
        const [articlesData, categoriesData] = await Promise.all([
          getArticles(),
          getCategories()
        ]);
        
        setArticles(articlesData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Error fetching news data:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="mb-6">{error}</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Return to Homepage
        </Link>
      </div>
    );
  }

  // Filter breaking news
  const breakingNews = articles.filter(article => article.isBreakingNews);

  return (
    <>
      <SEO
        title="News - QuikNepal"
        description="Latest news and updates from Nepal"
        canonicalUrl="https://quiknepal.com/news"
      />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Latest News</h1>
          <p className="text-xl text-gray-600">Stay updated with the latest news and stories from Nepal</p>
        </header>

        {/* Categories Navigation */}
        {categories.length > 0 && (
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <Link
                  key={category.slug.current}
                  href={`/category/${category.slug.current}`}
                  className={`whitespace-nowrap px-4 py-2 rounded-full border ${
                    category.color 
                      ? `bg-[${category.color}] border-[${category.color}]` 
                      : 'bg-white border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Breaking News */}
        {breakingNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Breaking News</h2>
            <ArticleList
              articles={breakingNews}
              layout="list"
              showFeatured={false}
            />
          </div>
        )}

        {/* All Articles */}
        <ArticleList
          articles={articles}
          layout="grid"
          showFeatured={true}
        />
        
        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default News;
