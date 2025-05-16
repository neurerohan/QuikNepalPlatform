import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { getArticle, getArticles } from '@/lib/sanity-client';
import PortableText from '@/components/sanity/PortableText';
import SEO from '@/components/sanity/SEO';
import ArticleCard from '@/components/sanity/ArticleCard';
import { Link } from 'wouter';
import { format } from 'date-fns';

const Article: React.FC = () => {
  const [, params] = useRoute('/news/:slug');
  const slug = params?.slug;
  
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        const articleData = await getArticle(slug);
        
        if (articleData) {
          setArticle(articleData);
          
          // Fetch related articles from the same category
          if (articleData.categories && articleData.categories.length > 0) {
            const { getArticlesByCategory } = await import('@/lib/sanity-client');
            const categorySlug = articleData.categories[0].slug.current;
            const related = await getArticlesByCategory(categorySlug, 3, 0);
            
            // Filter out the current article
            setRelatedArticles(
              related.filter((a: any) => a._id !== articleData._id)
            );
          } else {
            // If no categories, just get recent articles
            const recent = await getArticles(3, 0);
            setRelatedArticles(
              recent.filter((a: any) => a._id !== articleData._id)
            );
          }
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/news" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Return to News
        </Link>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        image={article.openGraphImage || article.mainImage}
        url={`/news/${article.slug.current}`}
        type="article"
        article={true}
        publishedTime={article.publishedAt}
        modifiedTime={article.updatedAt}
        author={article.author?.name}
        structuredData={article.structuredData}
        canonicalUrl={article.canonicalUrl}
      />

      <article className="max-w-3xl mx-auto">
        {/* Article header */}
        <header className="mb-8">
          {/* Categories */}
          {article.categories && article.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map((category: any) => (
                <Link 
                  key={category.slug.current}
                  href={`/category/${category.slug.current}`}
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          )}

          {/* Author and date */}
          <div className="flex items-center mb-6">
            {article.author && (
              <div className="flex items-center mr-4">
                {article.author.image && (
                  <img 
                    src={article.author.image} 
                    alt={article.author.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <Link 
                    href={`/author/${article.author.slug.current}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {article.author.name}
                  </Link>
                  {article.author.role && (
                    <p className="text-sm text-gray-500">{article.author.role}</p>
                  )}
                </div>
              </div>
            )}
            <div className="text-gray-500 text-sm">
              <time dateTime={article.publishedAt}>
                Published: {formatDate(article.publishedAt)}
              </time>
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <div>
                  <time dateTime={article.updatedAt}>
                    Updated: {formatDate(article.updatedAt)}
                  </time>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Featured image */}
        {article.mainImage && (
          <figure className="mb-8">
            <img 
              src={article.mainImage} 
              alt={article.title}
              className="w-full rounded-lg"
              style={article.mainImageHotspot 
                ? { objectPosition: `${article.mainImageHotspot.x * 100}% ${article.mainImageHotspot.y * 100}%` }
                : {}
              }
            />
          </figure>
        )}

        {/* Article content */}
        <div className="prose max-w-none">
          {article.body && <PortableText value={article.body} />}
        </div>

        {/* Author bio */}
        {article.author && article.author.bio && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              {article.author.image && (
                <img 
                  src={article.author.image} 
                  alt={article.author.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
              <div>
                <h3 className="font-bold text-lg mb-2">About {article.author.name}</h3>
                <p className="text-gray-700 mb-3">{article.author.bio}</p>
                
                {/* Social media links */}
                {article.author.socialMedia && (
                  <div className="flex gap-3">
                    {Object.entries(article.author.socialMedia).map(([platform, url]) => {
                      return url ? (
                        <a 
                          key={platform}
                          href={url as string} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          {platform}
                        </a>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map(article => (
              <ArticleCard 
                key={article._id} 
                article={article}
                variant="medium"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
