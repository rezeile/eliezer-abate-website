// src/pages/blog/index.tsx
import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllPosts } from '../../lib/mdx';
import { Post } from '../../types';
import { format } from 'date-fns';

interface BlogProps {
  posts: Post[];
}

const Blog: React.FC<BlogProps> = ({ posts }) => {
  return (
    <Layout title="Blog | Eliezer Abate" description="Blog posts by Eliezer Abate">
      <div className="py-12">
        <h1 className="text-3xl font-serif mb-8">Blog</h1>
        
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.slug} className="border-b border-gray-100 pb-8">
              <Link 
                href={`/blog/${post.slug}`}
                className="text-xl font-medium hover:text-blue-600 transition-colors"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1 mb-3">
                {post.date && format(new Date(post.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-gray-700">{post.excerpt}</p>
              <div className="mt-3">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  const posts = await getAllPosts();
  
  return {
    props: {
      posts,
    },
  };
}

export default Blog;