import React, { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { getAuthor, getArticlesByAuthor } from '@/lib/sanity-client';
import SEO from '@/components/sanity/SEO';
import PortableText from '@/components/sanity/PortableText';
import ArticleList from '@/components/sanity/ArticleList';
import { urlFor } from '@/lib/sanity-client';
import { Link } from 'wouter';

const Author: React.FC = () => {
  const [, params] = useRoute('/author/:slug');
  const slug = params?.slug;
  
  const [author, setAuthor] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Fetch author details
        const authorData = await getAuthor(slug);
        
        if (!authorData) {
          setError('Author not found');
          return;
        }
        
        setAuthor(authorData);
        
        // Fetch articles by this author
        const articlesData = await getArticlesByAuthor(slug);
        setArticles(articlesData || []);
      } catch (err) {
        console.error('Error fetching author data:', err);
        setError('Failed to load author');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mr-6"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-24 bg-gray-200 rounded mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="mb-6">{error || 'Author not found'}</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const { name, bio, image, role, email, socialMedia } = author;

  return (
    <>
      <SEO
        title={`${name} - Author at QuikNepal`}
        description={`Read articles by ${name} on QuikNepal`}
        image={image}
        canonicalUrl={`https://quiknepal.com/author/${slug}`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Author Profile */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {image && (
              <div className="mb-6 md:mb-0 md:mr-8">
                <img
                  src={urlFor(image).width(200).height(200).url()}
                  alt={name}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover"
                />
              </div>
            )}
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
              
              {role && (
                <p className="text-xl text-gray-600 mb-4">{role}</p>
              )}
              
              {/* Social Media Links */}
              {socialMedia && Object.keys(socialMedia).length > 0 && (
                <div className="flex justify-center md:justify-start space-x-4 mb-6">
                  {socialMedia.twitter && (
                    <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      Twitter
                    </a>
                  )}
                  {socialMedia.linkedin && (
                    <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                      LinkedIn
                    </a>
                  )}
                  {socialMedia.facebook && (
                    <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      Facebook
                    </a>
                  )}
                  {socialMedia.instagram && (
                    <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                      Instagram
                    </a>
                  )}
                  {socialMedia.website && (
                    <a href={socialMedia.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                      Website
                    </a>
                  )}
                </div>
              )}
              
              {email && (
                <p className="text-gray-600 mb-6">
                  <a href={`mailto:${email}`} className="hover:text-blue-600">
                    {email}
                  </a>
                </p>
              )}
              
              {/* Bio */}
              {bio && (
                <div className="prose max-w-none">
                  <PortableText value={bio} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Author's Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Articles by {name}</h2>
          
          <ArticleList
            articles={articles}
            layout="grid"
            showFeatured={false}
          />
          
          {articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found by this author.</p>
              <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">
                Return to Homepage
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Author;
