import axios from 'axios';

// Sanity configuration
const config = {
  projectId: '6rcrlnyc',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
};

// Base URL for Sanity API
const baseUrl = `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/query/${config.dataset}`;

// Helper function to make Sanity API requests
const fetchSanity = async (query: string) => {
  try {
    const response = await axios.get(`${baseUrl}?query=${encodeURIComponent(query)}`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    return null;
  }
};

// Get all articles with basic fields
export const getArticles = async (limit = 10, offset = 0) => {
  const query = `*[_type == "article"] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage.asset->url,
    "mainImageHotspot": mainImage.hotspot,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "author": author->{name, slug, "image": image.asset->url},
    "categories": categories[]->{ title, slug, color }
  }`;
  
  return fetchSanity(query);
};

// Get a single article with full details including SEO data
export const getArticle = async (slug: string) => {
  const query = `*[_type == "article" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    "mainImage": mainImage.asset->url,
    "mainImageHotspot": mainImage.hotspot,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "author": author->{
      name, 
      slug,
      bio,
      "image": image.asset->url,
      email,
      role,
      socialMedia
    },
    "categories": categories[]->{ 
      title, 
      slug, 
      description,
      "icon": icon.asset->url,
      color,
      featured
    },
    metaTitle,
    metaDescription,
    "openGraphImage": openGraphImage.asset->url,
    canonicalUrl,
    structuredData
  }`;
  
  return fetchSanity(query);
};

// Get articles by category
export const getArticlesByCategory = async (categorySlug: string, limit = 10, offset = 0) => {
  const query = `*[_type == "article" && references(*[_type == "category" && slug.current == "${categorySlug}"]._id)] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage.asset->url,
    "mainImageHotspot": mainImage.hotspot,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "author": author->{name, slug, "image": image.asset->url},
    "categories": categories[]->{ title, slug, color }
  }`;
  
  return fetchSanity(query);
};

// Get articles by tag
export const getArticlesByTag = async (tag: string, limit = 10, offset = 0) => {
  const query = `*[_type == "article" && "${tag}" in tags] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage.asset->url,
    "mainImageHotspot": mainImage.hotspot,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "author": author->{name, slug, "image": image.asset->url},
    "categories": categories[]->{ title, slug, color }
  }`;
  
  return fetchSanity(query);
};

// Get articles by author
export const getArticlesByAuthor = async (authorSlug: string, limit = 10, offset = 0) => {
  const query = `*[_type == "article" && references(*[_type == "author" && slug.current == "${authorSlug}"]._id)] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage.asset->url,
    "mainImageHotspot": mainImage.hotspot,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "author": author->{name, slug, "image": image.asset->url},
    "categories": categories[]->{ title, slug, color }
  }`;
  
  return fetchSanity(query);
};

// Get all categories
export const getCategories = async () => {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "icon": icon.asset->url,
    color,
    featured,
    "seoImage": seoImage.asset->url
  }`;
  
  return fetchSanity(query);
};

// Get a single category with full details
export const getCategory = async (slug: string) => {
  const query = `*[_type == "category" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    description,
    "icon": icon.asset->url,
    color,
    featured,
    "seoImage": seoImage.asset->url
  }`;
  
  return fetchSanity(query);
};

// Get all authors
export const getAuthors = async () => {
  const query = `*[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    "image": image.asset->url,
    email,
    role,
    socialMedia
  }`;
  
  return fetchSanity(query);
};

// Get a single author with full details
export const getAuthor = async (slug: string) => {
  const query = `*[_type == "author" && slug.current == "${slug}"][0] {
    _id,
    name,
    slug,
    bio,
    "image": image.asset->url,
    email,
    role,
    socialMedia
  }`;
  
  return fetchSanity(query);
};
