import React from 'react';
import { Helmet } from 'react-helmet';
import { urlFor } from '@/lib/sanity-client';

interface SEOProps {
  title?: string;
  description?: string;
  image?: any;
  canonicalUrl?: string;
  structuredData?: any;
  article?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  author?: {
    name: string;
  };
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  canonicalUrl,
  structuredData,
  article = false,
  publishedAt,
  updatedAt,
  author,
}) => {
  // Default values
  const defaultTitle = 'QuikNepal - Your Source for Nepal Information';
  const defaultDescription = 'Get the latest information on Nepal including calendar, date conversion, prices, and more.';
  const defaultImage = '/logo.png'; // Fallback image
  const siteUrl = 'https://quiknepal.com';

  // Use provided values or defaults
  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image ? urlFor(image).width(1200).height(630).url() : `${siteUrl}${defaultImage}`,
    url: canonicalUrl || siteUrl,
  };

  // Format JSON-LD structured data
  let jsonLd = structuredData;
  
  // If no structured data is provided but it's an article, create default article schema
  if (!jsonLd && article) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.title,
      image: [seo.image],
      description: seo.description,
      url: seo.url,
      ...(publishedAt && { datePublished: publishedAt }),
      ...(updatedAt && { dateModified: updatedAt }),
      ...(author && {
        author: {
          '@type': 'Person',
          name: author.name,
        },
      }),
      publisher: {
        '@type': 'Organization',
        name: 'QuikNepal',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
    };
  }

  // If no structured data is provided and it's not an article, create default website schema
  if (!jsonLd && !article) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'QuikNepal',
      url: siteUrl,
      description: defaultDescription,
    };
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content="QuikNepal" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      
      {/* Article specific meta tags */}
      {article && publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {article && updatedAt && <meta property="article:modified_time" content={updatedAt} />}
      {article && author && <meta property="article:author" content={author.name} />}
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SEO;
