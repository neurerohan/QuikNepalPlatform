import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Initialize Sanity client
export const client = createClient({
  projectId: '6rcrlnyc',
  dataset: 'production',
  apiVersion: '2023-05-03', // Use the latest API version
  useCdn: true, // Use the Content Delivery Network for faster response
});

// Initialize image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper function to fetch all articles
export async function getArticles(limit?: number) {
  const query = `*[_type == "article"] | order(publishedAt desc) ${limit ? `[0...${limit}]` : ''} {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "authorName": author->name,
    "authorSlug": author->slug.current,
    "authorImage": author->image,
    "categories": categories[]->{ title, slug, color }
  }`;
  
  return await client.fetch(query);
}

// Helper function to fetch a single article with SEO data
export async function getArticle(slug: string) {
  const query = `*[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    metaTitle,
    metaDescription,
    openGraphImage,
    canonicalUrl,
    structuredData,
    "author": author-> {
      name,
      slug,
      bio,
      image,
      email,
      role,
      socialMedia
    },
    "categories": categories[]-> {
      title,
      slug,
      description,
      icon,
      color,
      featured,
      seoImage
    }
  }`;
  
  return await client.fetch(query, { slug });
}

// Helper function to fetch articles by category
export async function getArticlesByCategory(categorySlug: string, limit?: number) {
  const query = `*[_type == "article" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) ${limit ? `[0...${limit}]` : ''} {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "authorName": author->name,
    "authorSlug": author->slug.current,
    "authorImage": author->image,
    "categories": categories[]->{ title, slug, color }
  }`;
  
  return await client.fetch(query, { categorySlug });
}

// Helper function to fetch articles by tag
export async function getArticlesByTag(tag: string, limit?: number) {
  const query = `*[_type == "article" && $tag in tags] | order(publishedAt desc) ${limit ? `[0...${limit}]` : ''} {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "authorName": author->name,
    "authorSlug": author->slug.current,
    "authorImage": author->image,
    "categories": categories[]->{ title, slug, color }
  }`;
  
  return await client.fetch(query, { tag });
}

// Helper function to fetch articles by author
export async function getArticlesByAuthor(authorSlug: string, limit?: number) {
  const query = `*[_type == "article" && author->slug.current == $authorSlug] | order(publishedAt desc) ${limit ? `[0...${limit}]` : ''} {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    updatedAt,
    isBreakingNews,
    isFeatured,
    "authorName": author->name,
    "authorSlug": author->slug.current,
    "authorImage": author->image,
    "categories": categories[]->{ title, slug, color }
  }`;
  
  return await client.fetch(query, { authorSlug });
}

// Helper function to fetch all categories
export async function getCategories() {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    featured,
    seoImage
  }`;
  
  return await client.fetch(query);
}

// Helper function to fetch a single category with SEO data
export async function getCategory(slug: string) {
  const query = `*[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    color,
    featured,
    seoImage
  }`;
  
  return await client.fetch(query, { slug });
}

// Helper function to fetch all authors
export async function getAuthors() {
  const query = `*[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    image,
    email,
    role,
    socialMedia
  }`;
  
  return await client.fetch(query);
}

// Helper function to fetch a single author with SEO data
export async function getAuthor(slug: string) {
  const query = `*[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    bio,
    image,
    email,
    role,
    socialMedia
  }`;
  
  return await client.fetch(query, { slug });
}
