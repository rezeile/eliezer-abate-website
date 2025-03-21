// src/pages/index.tsx
import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getAllPosts } from '../lib/mdx';
import { Post } from '../types';
import { format } from 'date-fns';

interface HomeProps {
  recentPosts: Post[];
}

export default function Home({ recentPosts }: HomeProps) {
  return (
    <Layout>
      <div className="py-12">
        <h1 className="text-3xl font-serif mb-4">Eliezer Abate</h1>
        <p className="text-lg text-gray-700 mb-8">
          Software Engineer and Educator. I write about algorithms, system design, and web development.
        </p>
        
        <h2 className="text-xl font-medium mt-12 mb-6">Recent Posts</h2>
        <div className="space-y-6">
          {recentPosts.map((post) => (
            <div key={post.slug}>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-lg font-medium hover:text-blue-600 transition-colors"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {post.date && format(new Date(post.date), 'MMMM d, yyyy')}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all posts →
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllPosts();
  
  return {
    props: {
      recentPosts: allPosts.slice(0, 3),
    },
  };
}