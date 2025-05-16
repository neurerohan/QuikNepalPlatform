import React from 'react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { urlFor } from '@/lib/sanity-client';
import { getKathmanduTime } from '@/lib/nepaliDateConverter';

interface Category {
  title: string;
  slug: { current: string };
  color?: string;
}

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    slug: { current: string };
    excerpt?: string;
    mainImage?: any;
    publishedAt: string;
    isBreakingNews?: boolean;
    isFeatured?: boolean;
    authorName?: string;
    authorSlug?: string;
    authorImage?: any;
    categories?: Category[];
  };
  variant?: 'default' | 'featured' | 'compact';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'default' }) => {
  const {
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    isBreakingNews,
    authorName,
    authorSlug,
    categories,
  } = article;

  // Format the date using Nepal's time zone
  const formattedDate = publishedAt 
    ? format(new Date(publishedAt), 'MMM d, yyyy')
    : format(getKathmanduTime(), 'MMM d, yyyy');

  // Generate article URL
  const articleUrl = `/news/${slug.current}`;

  // Determine image size based on variant
  const getImageDimensions = () => {
    switch (variant) {
      case 'featured':
        return { width: 800, height: 450 };
      case 'compact':
        return { width: 120, height: 80 };
      default:
        return { width: 400, height: 225 };
    }
  };

  const { width, height } = getImageDimensions();

  return (
    <article 
      className={`article-card ${variant} bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg ${
        variant === 'featured' ? 'lg:flex' : ''
      } ${variant === 'compact' ? 'flex items-center p-3' : 'flex flex-col'}`}
    >
      {/* Image */}
      {mainImage && (
        <Link href={articleUrl} className={variant === 'compact' ? 'flex-shrink-0 mr-3' : ''}>
          <div className={`article-image ${variant === 'featured' ? 'lg:w-1/2' : 'w-full'}`}>
            <img
              src={urlFor(mainImage)
                .width(width)
                .height(height)
                .fit('crop')
                .auto('format')
                .url()}
              alt={title}
              className={`w-full h-auto object-cover ${variant === 'compact' ? 'w-24 h-16 rounded' : 'aspect-video'}`}
              loading="lazy"
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className={`article-content p-4 ${variant === 'compact' ? 'p-0' : ''} ${variant === 'featured' ? 'lg:w-1/2' : 'w-full'}`}>
        {/* Categories */}
        {categories && categories.length > 0 && variant !== 'compact' && (
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.slice(0, 2).map((category) => (
              <Link
                key={category.slug.current}
                href={`/category/${category.slug.current}`}
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  category.color ? `bg-[${category.color}]` : 'bg-blue-100 text-blue-800'
                }`}
              >
                {category.title}
              </Link>
            ))}
          </div>
        )}

        {/* Breaking News Badge */}
        {isBreakingNews && (
          <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
            Breaking News
          </span>
        )}

        {/* Title */}
        <h3 className={`font-bold ${variant === 'featured' ? 'text-2xl' : variant === 'compact' ? 'text-base' : 'text-lg'} mb-2`}>
          <Link href={articleUrl} className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && variant !== 'compact' && (
          <p className="text-gray-600 mb-3 line-clamp-2">{excerpt}</p>
        )}

        {/* Author and Date */}
        <div className="flex items-center text-sm text-gray-500">
          {authorName && variant !== 'compact' && (
            <>
              <Link href={`/author/${authorSlug}`} className="hover:text-blue-600 mr-2">
                {authorName}
              </Link>
              <span className="mx-1">•</span>
            </>
          )}
          <time dateTime={publishedAt}>{formattedDate}</time>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
