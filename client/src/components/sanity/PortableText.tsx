import React from 'react';
import { PortableText as SanityPortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity-client';

// Define custom components for Portable Text
const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      
      return (
        <figure className="my-6">
          <img
            src={urlFor(value)
              .width(800)
              .height(value.hotspot ? Math.round(800 / value.hotspot.width * value.hotspot.height) : 600)
              .fit('crop')
              .auto('format')
              .url()}
            alt={value.alt || ''}
            className="rounded-lg w-full"
            loading="lazy"
            style={{
              // If we have a hotspot, use it for more intelligent cropping
              objectPosition: value.hotspot
                ? `${value.hotspot.x * 100}% ${value.hotspot.y * 100}%`
                : 'center',
            }}
          />
          {value.caption && (
            <figcaption className="text-sm text-gray-600 mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined;
      
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-blue-600 hover:underline"
          target={!value.href.startsWith('/') ? '_blank' : undefined}
        >
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }: any) => {
      return (
        <a href={value.slug ? `/${value.slug}` : '/'} className="text-blue-600 hover:underline">
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
    normal: ({ children }: any) => <p className="mb-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },
};

interface PortableTextProps {
  value: any;
  className?: string;
}

const PortableText: React.FC<PortableTextProps> = ({ value, className = '' }) => {
  if (!value) {
    return null;
  }

  return (
    <div className={`portable-text ${className}`}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
};

export default PortableText;
