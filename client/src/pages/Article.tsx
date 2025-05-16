import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { getArticle } from '@/lib/sanity-client';
import SEO from '@/components/sanity/SEO';
import PortableText from '@/components/sanity/PortableText';
import ArticleList from '@/components/sanity/ArticleList';
import { format } from 'date-fns';
import { urlFor } from '@/lib/sanity-client';
import { Link } from 'wouter';

const Article: React.FC = () => {
  const [, params] = useRoute('/news/:slug');
  const slug = params?.slug;
  
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const articleData = await getArticle(slug);
        
        if (!articleData) {
          setError('Article not found');
          return;
        }
        
        setArticle(articleData);
        
        // Fetch related articles from the same category (we could implement this)
        // This would require another API call, but for now we'll leave it empty
        setRelatedArticles([]);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="mb-6">{error || 'Article not found'}</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const {
    title,
    excerpt,
    mainImage,
    body,
    publishedAt,
    updatedAt,
    author,
    categories,
    metaTitle,
    metaDescription,
    openGraphImage,
    canonicalUrl,
    structuredData,
  } = article;

  // Format dates
  const formattedPublishDate = publishedAt ? format(new Date(publishedAt), 'MMMM d, yyyy') : '';
  const formattedUpdateDate = updatedAt ? format(new Date(updatedAt), 'MMMM d, yyyy') : '';

  return (
    <>
      <SEO
        title={metaTitle || title}
        description={metaDescription || excerpt}
        image={openGraphImage || mainImage}
        canonicalUrl={canonicalUrl || `https://quiknepal.com/news/${slug}`}
        structuredData={structuredData}
        article={true}
        publishedAt={publishedAt}
        updatedAt={updatedAt}
        author={author}
      />

      <article className="container mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category: any) => (
                <Link
                  key={category.slug.current}
                  href={`/category/${category.slug.current}`}
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    category.color ? `bg-[${category.color}]` : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-xl text-gray-600 mb-6">{excerpt}</p>
          )}

          {/* Author and Date */}
          <div className="flex items-center mb-6">
            {author && (
              <div className="flex items-center mr-6">
                {author.image && (
                  <img
                    src={urlFor(author.image).width(40).height(40).url()}
                    alt={author.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                <div>
                  <Link href={`/author/${author.slug.current}`} className="font-medium hover:text-blue-600">
                    {author.name}
                  </Link>
                  {author.role && (
                    <p className="text-sm text-gray-500">{author.role}</p>
                  )}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <time dateTime={publishedAt}>Published: {formattedPublishDate}</time>
              {updatedAt && updatedAt !== publishedAt && (
                <div>
                  <time dateTime={updatedAt}>Updated: {formattedUpdateDate}</time>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {mainImage && (
            <figure className="mb-8">
              <img
                src={urlFor(mainImage).width(1200).height(675).url()}
                alt={title}
                className="w-full h-auto rounded-lg"
              />
              {mainImage.caption && (
                <figcaption className="text-sm text-gray-500 mt-2 text-center">
                  {mainImage.caption}
                </figcaption>
              )}
            </figure>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <PortableText value={body} />
        </div>

        {/* Author Bio */}
        {author && author.bio && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              {author.image && (
                <img
                  src={urlFor(author.image).width(80).height(80).url()}
                  alt={author.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
              <div>
                <h3 className="text-xl font-bold mb-2">About {author.name}</h3>
                <div className="text-gray-700">
                  <PortableText value={author.bio} />
                </div>
                {author.socialMedia && (
                  <div className="mt-4 flex space-x-4">
                    {/* Social media links would go here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-12">
            <ArticleList
              title="Related Articles"
              articles={relatedArticles}
              layout="grid"
              showFeatured={false}
            />
          </div>
        )}
      </article>
    </>
  );
};

export default Article;
