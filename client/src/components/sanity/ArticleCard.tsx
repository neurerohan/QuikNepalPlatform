import React from 'react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { getKathmanduTime } from '@/lib/nepaliDateConverter';

interface ArticleCardProps {
  article: {
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
  };
  variant?: 'small' | 'medium' | 'large';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  variant = 'medium' 
}) => {
  const {
    title,
    slug,
    excerpt,
    mainImage,
    mainImageHotspot,
    publishedAt,
    isBreakingNews,
    isFeatured,
    author,
    categories
  } = article;

  // Format the published date in Nepal time zone
  const formattedDate = publishedAt 
    ? format(new Date(publishedAt), 'MMM d, yyyy')
    : '';

  // Get image style based on hotspot if available
  const imageStyle = mainImageHotspot 
    ? { objectPosition: `${mainImageHotspot.x * 100}% ${mainImageHotspot.y * 100}%` }
    : {};

  // Default image if none provided
  const defaultImage = '/images/default-article.jpg';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg ${
      variant === 'large' ? 'flex flex-col' : 
      variant === 'small' ? 'flex flex-row' : ''
    }`}>
      {/* Breaking news or featured badge */}
      {(isBreakingNews || isFeatured) && (
        <div className={`absolute top-2 left-2 z-10 px-2 py-1 text-xs font-bold text-white rounded ${
          isBreakingNews ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {isBreakingNews ? 'Breaking News' : 'Featured'}
        </div>
      )}

      {/* Article image */}
      <Link href={`/news/${slug.current}`} className={`block ${
        variant === 'small' ? 'w-1/3' : 
        variant === 'large' ? 'h-48' : 'h-40'
      } relative`}>
        <img
          src={mainImage || defaultImage}
          alt={title}
          className="w-full h-full object-cover"
          style={imageStyle}
        />
      </Link>

      {/* Article content */}
      <div className={`p-4 ${variant === 'small' ? 'w-2/3' : ''}`}>
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.slice(0, 2).map((category) => (
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
        <Link href={`/news/${slug.current}`}>
          <h3 className={`font-bold text-gray-900 hover:text-blue-600 ${
            variant === 'large' ? 'text-xl mb-2' : 
            variant === 'small' ? 'text-sm mb-1' : 'text-lg mb-2'
          }`}>
            {title}
          </h3>
        </Link>

        {/* Excerpt for medium and large variants */}
        {excerpt && variant !== 'small' && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {excerpt}
          </p>
        )}

        {/* Author and date */}
        <div className="flex items-center text-xs text-gray-500">
          {author && (
            <>
              {author.image && (
                <img 
                  src={author.image} 
                  alt={author.name}
                  className="w-5 h-5 rounded-full mr-2"
                />
              )}
              <Link 
                href={`/author/${author.slug.current}`}
                className="mr-2 hover:text-blue-600"
              >
                {author.name}
              </Link>
              <span className="mx-1">•</span>
            </>
          )}
          <time dateTime={publishedAt}>{formattedDate}</time>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
