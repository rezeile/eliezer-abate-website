// src/pages/index.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

// Archive section component
function ArchiveSection({
  title,
  posts
}: {
  title: string;
  posts: { title: string; slug: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-gray-700 hover:text-gray-900 transition-colors text-sm"
      >
        <span>{title}</span>
        <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <ul className="mt-3 space-y-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="text-gray-600 hover:text-blue-700 transition-colors text-sm"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  const ethiopiaArchive = [
    { title: 'The Untold Story of a TPLF Hostage Crisis', slug: 'the-untold-story-of-a-tplf-hostage-crisis' },
    { title: 'A Secret Israeli Operation out of Tigray', slug: 'a-secret-israeli-operation-out-of-tigray' },
    { title: 'A Conversation with Dr. Tirusew Asefa', slug: 'gerd-q-a-with-dr-tirusew-asefa' },
    { title: 'The Character Assassination of Ethiopia', slug: 'the-character-assassination-of-ethiopia' },
  ];

  const engineeringArchive = [
    { title: 'Binary Search & Algorithmic Patterns', slug: 'binary-search' },
    { title: 'System Design Resources', slug: 'system-design-blogs' },
    { title: 'Visualizing Graph Traversals (DFS/BFS)', slug: 'dfs-bfs' },
  ];

  const personalArchive = [
    { title: 'Thank You Kobe', slug: 'thank-you-kobe' },
    { title: 'Things to Consider Before Going All In on Your Startup', slug: 'things-to-consider-before-going-all-in-on-your-first-startup' },
  ];

  return (
    <Layout>
      <div className="py-20 max-w-xl mx-auto">

        {/* Hero */}
        <section className="mb-10">
          <h1 className="text-4xl font-serif text-gray-900 mb-1">Eliezer Abate</h1>
          <p className="text-gray-600 mb-6">Engineer. Writer. Builder.</p>
          <p className="text-gray-800 leading-relaxed mb-4">
            I build maps and visual essays on Ethiopia's modern state—how borders shift, power concentrates, and crises unfold to make Ethiopia's recent history legible.
          </p>
          <div>
            <a
              href="https://graspwell.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 transition-colors font-semibold"
            >
              View GraspWell →
            </a>
            <p className="text-gray-500 text-sm mt-1">Interactive maps and visual essays.</p>
          </div>
        </section>

        {/* Selected Artifacts */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Selected artifacts</h2>
          <div className="divide-y divide-gray-200">
            {/* The Abiy Years */}
            <div className="py-4 first:pt-0">
              <h3 className="text-base font-semibold text-gray-900 mb-1">The Abiy Years</h3>
              <p className="text-gray-600 text-sm mb-2">An interactive timeline of Ethiopia's political rupture (2015–2026).</p>
              <a href="https://graspwell.com/the-abiy-years/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition-colors text-sm">Explore →</a>
            </div>

            {/* The Irrational Map */}
            <div className="py-4 last:pb-0">
              <h3 className="text-base font-semibold text-gray-900 mb-1">The Irrational Map</h3>
              <p className="text-gray-600 text-sm mb-2">Why borders stopped following geography—and what it broke downstream.</p>
              <a href="https://graspwell.com/the-irrational-map/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition-colors text-sm">View map →</a>
            </div>
          </div>
        </section>

        {/* Writing & Notes */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Writing & Notes</h2>
          <p className="text-gray-600 text-sm mb-4">Selected archives from different seasons of my writing.</p>
          <div>
            <ArchiveSection title="On Ethiopia (2020–2022)" posts={ethiopiaArchive} />
            <ArchiveSection title="Engineering Notes" posts={engineeringArchive} />
            <ArchiveSection title="Personal" posts={personalArchive} />
          </div>
          <div className="mt-4">
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              View all posts →
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contact</h2>
          <p className="text-gray-600 text-sm">eliezer [at] graspwell [dot] com</p>
        </section>

      </div>
    </Layout>
  );
}
