import { Helmet } from 'react-helmet';
import { getKathmanduTime } from '@/lib/nepaliDateConverter';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  publishedDate?: string;
  modifiedDate?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCardType?: string;
  schemaType?: string;
  children?: React.ReactNode;
  hrefLangs?: Array<{ lang: string; url: string }>;
  pathname?: string;
}

const SEO = ({
  title,
  description,
  keywords = "date converter, convert nepali date into english, translate nepali date into english, date converter english",
  publishedDate = "2024-01-01",
  modifiedDate,
  canonicalUrl = "https://quiknepal.com",
  ogImage = "https://quiknepal.com/og-image.jpg",
  ogType = "website",
  twitterCardType = "summary_large_image",
  schemaType = "WebPage",
  children,
  hrefLangs = [
    { lang: "en", url: "https://quiknepal.com/en" },
    { lang: "ne", url: "https://quiknepal.com/ne" }
  ],
  pathname = "",
}: SEOProps) => {
  const fullTitle = title.includes('QuikNepal') ? title : `${title} | QuikNepal`;
  const currentDate = new Date().toISOString();
  const kathmanduTime = getKathmanduTime();
  const modifiedDateValue = modifiedDate || kathmanduTime.toISOString();
  const fullCanonicalUrl = `${canonicalUrl}${pathname}`;

  // Generate schema markup based on the type
  const generateSchemaMarkup = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": title,
      "description": description,
      "url": fullCanonicalUrl,
      "datePublished": publishedDate,
      "dateModified": modifiedDateValue,
      "inLanguage": "en-US",
      "publisher": {
        "@type": "Organization",
        "name": "QuikNepal",
        "logo": {
          "@type": "ImageObject",
          "url": "https://quiknepal.com/logo.png"
        }
      }
    };

    // Additional schema based on type
    if (schemaType === "WebPage") {
      return {
        ...baseSchema,
        "potentialAction": {
          "@type": "ReadAction",
          "target": [fullCanonicalUrl]
        }
      };
    } else if (schemaType === "Article") {
      return {
        ...baseSchema,
        "headline": title,
        "image": [ogImage],
        "author": {
          "@type": "Organization",
          "name": "QuikNepal"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullCanonicalUrl
        }
      };
    } else if (schemaType === "FAQPage") {
      return {
        ...baseSchema,
        "mainEntity": []
      };
    } else if (schemaType === "BreadcrumbList") {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": canonicalUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": title,
            "item": fullCanonicalUrl
          }
        ]
      };
    } else if (schemaType === "HowTo") {
      return {
        ...baseSchema,
        "step": []
      };
    } else if (schemaType === "Service") {
      return {
        ...baseSchema,
        "provider": {
          "@type": "Organization",
          "name": "QuikNepal"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Nepal"
        }
      };
    } else if (schemaType === "SoftwareApplication") {
      return {
        ...baseSchema,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };
    } else if (schemaType === "Tool") {
      return {
        ...baseSchema,
        "@type": "WebApplication",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web"
      };
    }

    return baseSchema;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="QuikNepal" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Hreflang Tags */}
      {hrefLangs.map((lang) => (
        <link key={lang.lang} rel="alternate" hrefLang={lang.lang} href={lang.url} />
      ))}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="QuikNepal" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="ne_NP" />
      <meta property="og:updated_time" content={modifiedDateValue} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@quiknepal" />
      
      {/* Article Specific Meta Tags */}
      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDateValue} />
      <meta property="article:section" content="Tools" />
      <meta property="article:tag" content={keywords} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchemaMarkup())}
      </script>
      
      {/* Additional Schema Markup for Date Converter */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Nepali Date Converter Tool",
          "description": "Convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars. Translate nepali date into english and vice versa.",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>
      
      {/* BreadcrumbList Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": canonicalUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Tools",
              "item": `${canonicalUrl}/tools`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Date Converter",
              "item": fullCanonicalUrl
            }
          ]
        })}
      </script>
      
      {/* HowTo Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Convert Nepali Date to English",
          "description": "Step by step guide to convert nepali date into english date using our date converter tool.",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Select Conversion Type",
              "text": "Choose 'BS to AD' for converting from Nepali date to English date."
            },
            {
              "@type": "HowToStep",
              "name": "Select Nepali Date",
              "text": "Select the Nepali date you want to convert into English."
            },
            {
              "@type": "HowToStep",
              "name": "View Result",
              "text": "The equivalent English date will be displayed instantly."
            }
          ]
        })}
      </script>
      
      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I convert Nepali date into English date?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To convert a Nepali date into English, select 'BS to AD' conversion type, then choose the Nepali year, month, and day. The equivalent English date will be displayed instantly."
              }
            },
            {
              "@type": "Question",
              "name": "What is Bikram Sambat (BS) calendar?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Bikram Sambat is the official calendar of Nepal, approximately 56.7 years ahead of the Gregorian (AD) calendar. It has 12 months with varying days per month."
              }
            },
            {
              "@type": "Question",
              "name": "Why do Nepali dates change every year relative to English dates?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The Nepali calendar is based on lunar cycles and solar positions, making it different from the Gregorian calendar. This causes the dates to shift slightly each year."
              }
            },
            {
              "@type": "Question",
              "name": "Can I translate English dates to Nepali dates?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, our date converter tool allows you to translate English dates to Nepali dates by selecting 'AD to BS' conversion type."
              }
            }
          ]
        })}
      </script>
      
      {/* LocalBusiness Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "QuikNepal",
          "description": "Your Essential Nepali Information Hub providing tools like date converter to translate nepali date into english.",
          "url": canonicalUrl,
          "logo": `${canonicalUrl}/logo.png`,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "Nepal"
          }
        })}
      </script>
      
      {/* Service Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Date Conversion Tool",
          "name": "Nepali to English Date Converter",
          "description": "Free online tool to convert nepali date into english and english date into nepali.",
          "provider": {
            "@type": "Organization",
            "name": "QuikNepal"
          }
        })}
      </script>
      
      {/* Dataset Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": "Nepali-English Date Conversion Dataset",
          "description": "Comprehensive dataset for converting between Nepali (Bikram Sambat) and English (Gregorian) calendar dates.",
          "keywords": ["date converter", "nepali date", "english date", "bikram sambat", "gregorian calendar"],
          "creator": {
            "@type": "Organization",
            "name": "QuikNepal"
          },
          "temporalCoverage": "1970/2100"
        })}
      </script>
      
      {children}
    </Helmet>
  );
};

export default SEO;
