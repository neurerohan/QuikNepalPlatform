import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { getCategory, getArticlesByCategory } from '@/lib/sanity-client';
import SEO from '@/components/sanity/SEO';
import ArticleList from '@/components/sanity/ArticleList';
import { urlFor } from '@/lib/sanity-client';
import { Link } from 'wouter';

const Category: React.FC = () => {
  const [, params] = useRoute('/category/:slug');
  const slug = params?.slug;
  
  const [category, setCategory] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryData = await getCategory(slug);
        
        if (!categoryData) {
          setError('Category not found');
          return;
        }
        
        setCategory(categoryData);
        
        // Fetch articles in this category
        const articlesData = await getArticlesByCategory(slug);
        setArticles(articlesData || []);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
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

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="mb-6">{error || 'Category not found'}</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const { title, description, seoImage } = category;

  return (
    <>
      <SEO
        title={`${title} - QuikNepal`}
        description={description || `Browse all articles in the ${title} category on QuikNepal`}
        image={seoImage}
        canonicalUrl={`https://quiknepal.com/category/${slug}`}
      />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          {category.icon && (
            <div className="mb-4 flex justify-center">
              <img 
                src={urlFor(category.icon).width(80).height(80).url()} 
                alt={title} 
                className="w-16 h-16"
              />
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          
          {description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>
          )}
        </header>

        {/* Articles */}
        <ArticleList
          articles={articles}
          layout="grid"
          showFeatured={true}
        />
        
        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found in this category.</p>
            <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">
              Return to Homepage
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
