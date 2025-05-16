import React from 'react';
import { cn } from '@/lib/utils';

// Types for portable text blocks
interface Block {
  _type: string;
  _key: string;
  style?: string;
  children?: any[];
  markDefs?: any[];
  listItem?: string;
  level?: number;
  [key: string]: any;
}

interface Mark {
  _type: string;
  _key: string;
  href?: string;
  [key: string]: any;
}

interface PortableTextProps {
  value: Block[];
  className?: string;
}

// Component to render portable text content from Sanity
const PortableText: React.FC<PortableTextProps> = ({ value, className }) => {
  if (!value || !Array.isArray(value)) {
    return null;
  }

  // Render a text span with marks
  const renderSpan = (text: string, marks: string[] = [], markDefs: Mark[] = []) => {
    if (!marks.length) return text;

    let result = <>{text}</>;

    // Apply marks in reverse to ensure proper nesting
    [...marks].reverse().forEach(mark => {
      // Handle link marks
      const linkMark = markDefs.find(m => m._key === mark && m._type === 'link');
      if (linkMark) {
        result = (
          <a 
            href={linkMark.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {result}
          </a>
        );
        return;
      }

      // Handle other marks
      switch (mark) {
        case 'strong':
          result = <strong>{result}</strong>;
          break;
        case 'em':
          result = <em>{result}</em>;
          break;
        case 'code':
          result = <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{result}</code>;
          break;
        case 'underline':
          result = <span className="underline">{result}</span>;
          break;
        case 'strike-through':
          result = <span className="line-through">{result}</span>;
          break;
        default:
          break;
      }
    });

    return result;
  };

  // Render a block of content
  const renderBlock = (block: Block) => {
    const { _type, style, children, markDefs, listItem, level } = block;

    // Handle different block types
    switch (_type) {
      case 'block':
        // Handle list items
        if (listItem) {
          return (
            <li key={block._key}>
              {children?.map((child, i) => (
                <React.Fragment key={i}>
                  {renderSpan(child.text, child.marks, markDefs)}
                </React.Fragment>
              ))}
            </li>
          );
        }

        // Handle regular blocks with different styles
        const BlockTag = style === 'normal' ? 'p' : style || 'p';
        return React.createElement(
          BlockTag,
          { key: block._key, className: getStyleClass(style) },
          children?.map((child, i) => (
            <React.Fragment key={i}>
              {renderSpan(child.text, child.marks, markDefs)}
            </React.Fragment>
          ))
        );

      case 'image':
        return (
          <figure key={block._key} className="my-8">
            <img 
              src={block.asset?.url} 
              alt={block.alt || ''} 
              className="w-full rounded-lg"
              style={block.hotspot ? getImageHotspotStyles(block.hotspot) : {}}
            />
            {block.caption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );

      default:
        return null;
    }
  };

  // Get CSS classes for different block styles
  const getStyleClass = (style?: string) => {
    switch (style) {
      case 'h1':
        return 'text-4xl font-bold mt-8 mb-4';
      case 'h2':
        return 'text-3xl font-bold mt-8 mb-4';
      case 'h3':
        return 'text-2xl font-bold mt-6 mb-3';
      case 'h4':
        return 'text-xl font-bold mt-4 mb-2';
      case 'blockquote':
        return 'border-l-4 border-gray-300 pl-4 italic my-4';
      default:
        return 'my-4';
    }
  };

  // Get styles for image hotspots
  const getImageHotspotStyles = (hotspot: { x: number; y: number }) => {
    return {
      objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%`,
      objectFit: 'cover' as 'cover'
    };
  };

  // Group blocks to handle lists
  const groupBlocks = (blocks: Block[]) => {
    const result: (Block | Block[])[] = [];
    let currentList: Block[] | null = null;
    let currentListType: string | null = null;

    blocks.forEach(block => {
      // Handle list items
      if (block.listItem) {
        // Start a new list if needed
        if (!currentList || currentListType !== block.listItem) {
          if (currentList) {
            result.push(currentList);
          }
          currentList = [block];
          currentListType = block.listItem;
        } else {
          // Add to existing list
          currentList.push(block);
        }
      } else {
        // End any current list
        if (currentList) {
          result.push(currentList);
          currentList = null;
          currentListType = null;
        }
        // Add regular block
        result.push(block);
      }
    });

    // Add the last list if there is one
    if (currentList) {
      result.push(currentList);
    }

    return result;
  };

  // Render a list of blocks
  const renderList = (blocks: Block[]) => {
    if (!blocks.length) return null;
    
    const listType = blocks[0].listItem;
    const ListTag = listType === 'bullet' ? 'ul' : 'ol';
    
    return React.createElement(
      ListTag,
      { 
        className: listType === 'bullet' ? 'list-disc pl-5 my-4' : 'list-decimal pl-5 my-4' 
      },
      blocks.map(block => renderBlock(block))
    );
  };

  // Group blocks and render them
  const groupedBlocks = groupBlocks(value);

  return (
    <div className={cn("prose max-w-none", className)}>
      {groupedBlocks.map((block, index) => {
        if (Array.isArray(block)) {
          return renderList(block);
        }
        return renderBlock(block);
      })}
    </div>
  );
};

export default PortableText;
