import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Define the structure of a blog post
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  published: boolean;
  content: string;
}

// Path to the content directory
const contentDirectory = path.join(process.cwd(), 'content', 'blog');

// Ensure content directory exists
function ensureContentDirectory() {
  if (!fs.existsSync(contentDirectory)) {
    fs.mkdirSync(contentDirectory, { recursive: true });
  }
}

// Get all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  ensureContentDirectory();
  
  // Check if directory exists and has files
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const markdownFiles = fileNames.filter(name => name.endsWith('.md'));

  if (markdownFiles.length === 0) {
    return [];
  }

  const posts = await Promise.all(markdownFiles.map(async (fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt,
      tags: data.tags || [],
      published: data.published !== false, // Default to true unless explicitly false
      content: await marked(content),
    };
  }));

  // Filter published posts and sort by date (newest first)
  return posts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  ensureContentDirectory();
  
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Don't return unpublished posts
    if (data.published === false) {
      return null;
    }

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      excerpt: data.excerpt,
      tags: data.tags || [],
      published: data.published !== false,
      content: await marked(content),
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

// Get all unique tags from all posts
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tagSet.add(tag));
    }
  });
  
  return Array.from(tagSet).sort();
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post => 
    post.tags && post.tags.includes(tag)
  );
}
