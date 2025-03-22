// src/pages/index.tsx (updated with cover image)
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <div className="py-16">
        <h1 className="text-3xl font-serif mb-6">Eliezer Abate</h1>
        <p className="text-lg text-gray-700 mb-12">
          Software Engineer and Educator. I write about algorithms, system design, and web development.
        </p>
        
        <h2 className="text-2xl font-medium mt-16 mb-8">Recent Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {recentPosts.map((post) => (
            <div key={post.slug} className="flex flex-col p-6 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
              {post.coverImage && (
                <div className="mb-4 overflow-hidden rounded">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative w-full h-48">
                    <Image 
                      src={post.coverImage} 
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Hide the image container if loading fails
                        const target = e.target as HTMLImageElement;
                        if (target.parentElement) {
                          target.parentElement.style.display = 'none';
                        }
                      }}
                    />
                  </div>
                </Link>
              </div>
              )}
              <Link 
                href={`/blog/${post.slug}`}
                className="text-xl font-medium hover:text-blue-600 transition-colors mb-2"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 mb-3">
                {post.date && format(new Date(post.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16">
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
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
      recentPosts: allPosts.slice(0, 4),
    },
  };
}