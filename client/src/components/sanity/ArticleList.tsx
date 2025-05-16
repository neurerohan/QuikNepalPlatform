import React from 'react';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: any[];
  title?: string;
  layout?: 'grid' | 'list' | 'featured';
  showFeatured?: boolean;
  className?: string;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  title,
  layout = 'grid',
  showFeatured = true,
  className = '',
}) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No articles found.</p>
      </div>
    );
  }

  // Find featured article if needed
  const featuredArticle = showFeatured 
    ? articles.find(article => article.isFeatured) || articles[0]
    : null;
  
  // Filter out the featured article from the rest
  const remainingArticles = featuredArticle && showFeatured
    ? articles.filter(article => article._id !== featuredArticle._id)
    : articles;

  return (
    <div className={`article-list ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{title}</h2>
      )}

      {/* Featured Article */}
      {featuredArticle && showFeatured && (
        <div className="mb-8">
          <ArticleCard article={featuredArticle} variant="featured" />
        </div>
      )}

      {/* Remaining Articles */}
      <div className={`
        ${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
        ${layout === 'list' ? 'space-y-6' : ''}
        ${layout === 'featured' ? 'space-y-6' : ''}
      `}>
        {remainingArticles.map((article) => (
          <ArticleCard 
            key={article._id} 
            article={article} 
            variant={layout === 'list' ? 'compact' : 'default'} 
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
