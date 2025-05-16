import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { getCategory, getArticlesByCategory } from '@/lib/sanity-client';
import ArticleList from '@/components/sanity/ArticleList';
import SEO from '@/components/sanity/SEO';

const Category: React.FC = () => {
  const [, params] = useRoute('/category/:slug');
  const slug = params?.slug;
  
  const [category, setCategory] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        // Fetch category details
        const categoryData = await getCategory(slug);
        if (categoryData) {
          setCategory(categoryData);
          
          // Fetch articles in this category
          const articlesData = await getArticlesByCategory(slug, 10, 0);
          if (articlesData) {
            setArticles(articlesData);
          }
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8 mx-auto animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-100 rounded-lg h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-8">The category you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={`${category.title} - QuikNepal`}
        description={category.description || `Browse all articles in the ${category.title} category`}
        image={category.seoImage}
        url={`/category/${category.slug.current}`}
      />

      <div className="text-center mb-12">
        {category.icon && (
          <img 
            src={category.icon} 
            alt={category.title}
            className="w-16 h-16 mx-auto mb-4"
          />
        )}
        <h1 className={`text-3xl font-bold mb-4 ${
          category.color ? `text-${category.color}-700` : ''
        }`}>
          {category.title}
        </h1>
        {category.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      <ArticleList 
        initialArticles={articles}
        categorySlug={slug}
      />
    </div>
  );
};

export default Category;
