import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/" 
          className="text-primary hover:text-primary-hover mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-4 text-foreground">Blog</h1>
        <p className="text-muted-foreground">
          Thoughts, tutorials, and insights from my development journey.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No blog posts yet.</p>
          <p className="text-muted-foreground mt-2 opacity-75">
            Check the START_HERE.md guide to learn how to add your first post!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-border pb-8">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                  {post.title}
                </h2>
              </Link>
              
              <div className="flex items-center text-sm text-muted-foreground mb-3">
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
                <p className="text-foreground mb-4">{post.excerpt}</p>
              )}
              
              <Link 
                href={`/blog/${post.slug}`}
                className="text-primary hover:text-primary-hover font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
