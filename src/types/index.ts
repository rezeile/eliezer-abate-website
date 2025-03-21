import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  [key: string]: unknown;
}

export interface MDXPost extends Post {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
}