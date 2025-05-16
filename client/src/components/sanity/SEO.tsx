import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  structuredData?: string;
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  article = false,
  publishedTime,
  modifiedTime,
  author,
  structuredData,
  canonicalUrl
}) => {
  // Default values
  const defaultTitle = 'QuikNepal - Nepal\'s Premier Information Platform';
  const defaultDescription = 'Get the latest news, Nepali calendar, date converter, gold prices, vegetable prices, forex rates, and more from Nepal.';
  const defaultImage = '/images/quiknepal-og.jpg'; // Default OG image
  const siteUrl = 'https://quiknepal.com';

  // Final values
  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: url ? `${siteUrl}${url}` : siteUrl,
  };

  // Structured data as JSON-LD
  const jsonLd = structuredData || {
    '@context': 'https://schema.org',
    '@type': article ? 'Article' : 'WebPage',
    headline: seo.title,
    description: seo.description,
    image: seo.image,
    url: seo.url,
    ...(article && publishedTime ? { datePublished: publishedTime } : {}),
    ...(article && modifiedTime ? { dateModified: modifiedTime } : {}),
    ...(article && author ? {
      author: {
        '@type': 'Person',
        name: author
      }
    } : {})
  };

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph tags */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content="QuikNepal" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      
      {/* Article specific tags */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {typeof structuredData === 'string' 
          ? structuredData 
          : JSON.stringify(jsonLd)
        }
      </script>
    </Helmet>
  );
};

export default SEO;
