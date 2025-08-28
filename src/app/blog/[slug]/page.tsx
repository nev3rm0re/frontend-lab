import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="text-primary hover:text-primary-hover mb-4 inline-block"
        >
          ← Back to Blog
        </Link>
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{post.title}</h1>
          
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <time dateTime={post.date}>{post.date}</time>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="mx-2">•</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>
      </div>

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <footer className="mt-12 pt-8 border-t border-border">
        <Link 
          href="/blog"
          className="text-primary hover:text-primary-hover font-medium"
        >
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
