// src/pages/blog/index.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllPosts } from '../../lib/mdx';
import { Post } from '../../types';
import { format } from 'date-fns';

interface BlogProps {
  posts: Post[];
}

const FILTERS = ['All', 'Ethiopia', 'Interviews', 'Translations', 'Engineering Notes', 'Personal'] as const;
type Filter = typeof FILTERS[number];

const FEATURED_SLUGS = [
  'the-untold-story-of-a-tplf-hostage-crisis',
  'a-secret-israeli-operation-out-of-tigray',
  'gerd-q-a-with-dr-tirusew-asefa',
  'thank-you-kobe',
];

// Map posts to categories based on slug
const getCategory = (slug: string): Filter => {
  if (['the-untold-story-of-a-tplf-hostage-crisis', 'a-secret-israeli-operation-out-of-tigray', 'whats-happening-in-tigray', 'the-character-assassination-of-ethiopia', 'ethiopia-egypt-and-the-abay-river'].includes(slug)) {
    return 'Ethiopia';
  }
  if (['gerd-q-a-with-dr-tirusew-asefa'].includes(slug)) {
    return 'Interviews';
  }
  if (['abiy-ahmed-parliament-speech'].includes(slug)) {
    return 'Translations';
  }
  if (['binary-search', 'dfs-bfs', 'sliding-window', 'two-pointers', 'arrays', 'sorting', 'topological-sort', 'union-find', 'bit-manipulation', 'math', 'design-x', 'system-design-blogs'].includes(slug)) {
    return 'Engineering Notes';
  }
  if (['thank-you-kobe', 'things-to-consider-before-going-all-in-on-your-first-startup', 'book-review-skunkworks'].includes(slug)) {
    return 'Personal';
  }
  return 'All';
};

const Blog: React.FC<BlogProps> = ({ posts }) => {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const featuredPosts = FEATURED_SLUGS
    .map(slug => posts.find(post => post.slug === slug))
    .filter(Boolean) as Post[];
  const filteredPosts = activeFilter === 'All'
    ? posts
    : posts.filter(post => getCategory(post.slug) === activeFilter);

  return (
    <Layout title="Archive | Eliezer Abate" description="Blog posts by Eliezer Abate">
      <div className="py-12 max-w-xl mx-auto">
        <h1 className="text-3xl font-serif mb-10">Writings from 2020–2022</h1>

        {/* Start Here */}
        <section className="mb-10">
          <div className="border border-gray-200 rounded-lg bg-white/60 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Start here</h2>
            <p className="text-gray-500 text-sm mb-4">Four pieces that represent the best of my archive.</p>
            <div className="space-y-3">
              {featuredPosts.map((post) => (
                <div key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-gray-900 hover:text-blue-700 transition-colors"
                  >
                    {post.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curations */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Curations</h2>
          <div className="space-y-3">
            <div>
              <a
                href="https://twitter.com/i/events/1329890313847357443"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-blue-700 transition-colors"
              >
                Collected Threads of Addis
              </a>
              <p className="text-gray-500 text-sm">Twitter threads on Ethiopian history and politics.</p>
            </div>
            <div>
              <a
                href="https://twitter.com/i/events/1329890313847357443"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-blue-700 transition-colors"
              >
                Articles on the Tigray Conflict
              </a>
              <p className="text-gray-500 text-sm">Curated reading list on the 2020–2022 conflict.</p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeFilter === filter
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">All posts</h2>
          <div className="space-y-5">
            {filteredPosts.map((post) => (
              <div key={post.slug} className="border-b border-gray-100 pb-5">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-gray-900 font-medium hover:text-blue-700 transition-colors"
                >
                  {post.title}
                </Link>
                <p className="text-gray-600 text-sm mt-1">{post.excerpt}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {post.date && format(new Date(post.date), 'MMMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </section>
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