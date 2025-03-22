import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface Post {
  slug: string;
  title: string;
  date: string;
  coverImage?: string;
  excerpt: string;
  category: string;
  tags: string[];
  content: string;
  [key: string]: unknown;
}

export interface MDXPost extends Post {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
}