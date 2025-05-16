import React, { useEffect, useState } from 'react';
import { getArticles, getCategories } from '@/lib/sanity-client';
import ArticleList from '@/components/sanity/ArticleList';
import SEO from '@/components/sanity/SEO';
import { Link } from 'wouter';

const News: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch articles
        const articlesData = await getArticles(10, 0);
        
        if (articlesData && articlesData.length > 0) {
          // Find a featured article if available
          const featured = articlesData.find((article: { isFeatured: boolean }) => article.isFeatured);
          
          if (featured) {
            setFeaturedArticle(featured);
            // Remove the featured article from the main list
            setArticles(articlesData.filter((article: { _id: string }) => article._id !== featured._id));
          } else {
            // Use the first article as featured
            setFeaturedArticle(articlesData[0]);
            setArticles(articlesData.slice(1));
          }
        } else {
          setArticles([]);
        }
        
        // Fetch categories
        const categoriesData = await getCategories();
        if (categoriesData) {
          setCategories(categoriesData.filter((cat: { featured: boolean }) => cat.featured));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Latest News - QuikNepal"
        description="Stay updated with the latest news and articles from Nepal and around the world."
        url="/news"
      />

      <h1 className="text-3xl font-bold mb-8 text-center">Latest News</h1>

      {/* Featured Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <Link 
              key={category._id}
              href={`/category/${category.slug.current}`}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category.color 
                  ? `bg-${category.color}-100 text-${category.color}-800 hover:bg-${category.color}-200` 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.title}
            </Link>
          ))}
        </div>
      )}

      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-12">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <Link href={`/news/${featuredArticle.slug.current}`}>
              <div className="relative aspect-[16/9]">
                <img 
                  src={featuredArticle.mainImage} 
                  alt={featuredArticle.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={featuredArticle.mainImageHotspot 
                    ? { objectPosition: `${featuredArticle.mainImageHotspot.x * 100}% ${featuredArticle.mainImageHotspot.y * 100}%` }
                    : {}
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {featuredArticle.categories && featuredArticle.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {featuredArticle.categories.slice(0, 2).map((category: any) => (
                      <span 
                        key={category.slug.current}
                        className="px-2 py-1 text-xs font-semibold bg-white/20 rounded-full backdrop-blur-sm"
                      >
                        {category.title}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{featuredArticle.title}</h2>
                {featuredArticle.excerpt && (
                  <p className="text-white/80 mb-3 line-clamp-2">{featuredArticle.excerpt}</p>
                )}
                <div className="flex items-center text-sm text-white/70">
                  {featuredArticle.author && (
                    <>
                      <span className="mr-2">{featuredArticle.author.name}</span>
                      <span className="mx-1">•</span>
                    </>
                  )}
                  <time dateTime={featuredArticle.publishedAt}>
                    {formatDate(featuredArticle.publishedAt)}
                  </time>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Article List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
        <ArticleList initialArticles={articles} />
      </div>
    </div>
  );
};

export default News;
