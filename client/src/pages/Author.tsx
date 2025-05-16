import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { getAuthor, getArticlesByAuthor } from '@/lib/sanity-client';
import ArticleList from '@/components/sanity/ArticleList';
import SEO from '@/components/sanity/SEO';

const Author: React.FC = () => {
  const [, params] = useRoute('/author/:slug');
  const slug = params?.slug;
  
  const [author, setAuthor] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        // Fetch author details
        const authorData = await getAuthor(slug);
        if (authorData) {
          setAuthor(authorData);
          
          // Fetch articles by this author
          const articlesData = await getArticlesByAuthor(slug, 10, 0);
          if (articlesData) {
            setArticles(articlesData);
          }
        }
      } catch (error) {
        console.error('Error fetching author data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
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

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Author Not Found</h1>
        <p className="text-gray-600 mb-8">The author you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={`${author.name} - Author at QuikNepal`}
        description={author.bio || `Articles written by ${author.name}`}
        image={author.image}
        url={`/author/${author.slug.current}`}
      />

      <div className="flex flex-col items-center mb-12">
        {author.image && (
          <img 
            src={author.image} 
            alt={author.name}
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
        {author.role && (
          <p className="text-gray-600 mb-4">{author.role}</p>
        )}
        {author.bio && (
          <p className="text-center max-w-2xl mb-4">{author.bio}</p>
        )}
        
        {/* Social media links */}
        {author.socialMedia && Object.keys(author.socialMedia).length > 0 && (
          <div className="flex gap-4 mt-2">
            {Object.entries(author.socialMedia).map(([platform, url]) => {
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

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Articles by {author.name}</h2>
        <ArticleList 
          initialArticles={articles}
          authorSlug={slug}
        />
      </div>
    </div>
  );
};

export default Author;
