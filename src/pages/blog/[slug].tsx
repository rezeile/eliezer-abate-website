// src/pages/blog/[slug].tsx
import React from 'react';
import Layout from '../../components/Layout';
import { MDXRemote } from 'next-mdx-remote';
import { getAllPosts, getPostBySlug } from '../../lib/mdx';
import { format } from 'date-fns';
import { MDXPost } from '../../types';
// import CodeBlock from '../../components/CodeBlock';

interface PostPageProps {
  post: MDXPost;
}

// Custom components for MDX
const components = {
  pre: (props: React.HTMLProps<HTMLDivElement>) => <div {...props} />,
  // code: CodeBlock,
};

const PostPage: React.FC<PostPageProps> = ({ post }) => {
  return (
    <Layout title={`${post.title} | Eliezer Abate`} description={post.excerpt}>
      <article className="py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-serif mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500">
            {post.date && format(new Date(post.date), 'MMMM d, yyyy')}
          </p>
        </header>
        
        <div className="prose prose-blue max-w-none">
          <MDXRemote {...post.source} components={components} scope={{}} />
        </div>
      </article>
    </Layout>
  );
};

export async function getStaticPaths() {
  const posts = await getAllPosts();
  
  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: {
      post,
    },
  };
}

export default PostPage;