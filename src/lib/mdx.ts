// src/lib/mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { Post, MDXPost } from '../types';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export const getPostSlugs = (): string[] => {
  const slugs = fs.readdirSync(postsDirectory);
  return slugs;
};

export const getPostBySlug = async (slug: string): Promise<MDXPost> => {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism, rehypeSlug],
    },
    scope: data,
  });

  return {
    slug: realSlug,
    source: mdxSource,
    content,
    ...data,
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
  } as MDXPost;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const slugs = getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPostBySlug(slug);
      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        content: post.content,
      };
    })
  );

  // Sort posts by date in descending order
  return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
};