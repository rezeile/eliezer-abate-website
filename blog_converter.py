#!/usr/bin/env python3
"""
Blog Post Converter - Converts eliezerabate.com blog posts to clean markdown files

Usage:
    python blog_converter.py [URL]

Example:
    python blog_converter.py http://eliezerabate.com/blog/thank-you-kobe
"""

import os
import re
import sys
import subprocess
import datetime
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import requests

def extract_blog_slug(url):
    """Extract the blog slug from the URL."""
    path = urlparse(url).path
    return path.split('/')[-1]

def get_title_from_html(url):
    """Extract the blog title from the HTML."""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Try to get the title from the meta tags first
    og_title = soup.find('meta', property='og:title')
    if og_title and og_title.get('content'):
        return og_title.get('content')
    
    # Fallback to the page title
    title_tag = soup.find('title')
    if title_tag:
        title = title_tag.text
        # Remove website name if present
        return title.split(' | ')[0].strip()
    
    # Fallback to h1
    h1 = soup.find('h1')
    if h1:
        return h1.text.strip()
    
    return "Unknown Title"

def get_date_from_html(url):
    """Extract the publication date from the HTML."""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Try to get the date from meta tags
    for meta in soup.find_all('meta'):
        if meta.get('property') in ['article:published_time', 'og:published_time']:
            date_str = meta.get('content')
            if date_str:
                try:
                    date_obj = datetime.datetime.fromisoformat(date_str.split('T')[0])
                    return date_obj.strftime('%Y-%m-%d')
                except ValueError:
                    pass
    
    # Look for date patterns in the content
    date_patterns = [
        r'(\w+ \d{1,2}, \d{4})',  # January 26, 2021
        r'(\d{1,2}/\d{1,2}/\d{4})',  # 01/26/2021
        r'(\d{4}-\d{2}-\d{2})'  # 2021-01-26
    ]
    
    for pattern in date_patterns:
        text = soup.get_text()
        match = re.search(pattern, text)
        if match:
            date_str = match.group(1)
            try:
                # Try different date formats
                for fmt in ['%B %d, %Y', '%m/%d/%Y', '%Y-%m-%d']:
                    try:
                        date_obj = datetime.datetime.strptime(date_str, fmt)
                        return date_obj.strftime('%Y-%m-%d')
                    except ValueError:
                        continue
            except Exception:
                pass
    
    # Default to current date if not found
    return datetime.datetime.now().strftime('%Y-%m-%d')

def generate_excerpt(content, max_length=150):
    """Generate a brief excerpt from the content."""
    # Strip any markdown formatting
    content = re.sub(r'[#*_`\[\]\(\)]', '', content)
    
    # Get the first paragraph
    paragraphs = content.split('\n\n')
    first_para = next((p for p in paragraphs if p.strip()), '')
    
    # Truncate and add ellipsis if needed
    if len(first_para) > max_length:
        return first_para[:max_length].strip() + '...'
    return first_para.strip()

def clean_markdown(input_file, output_file, title, date, url):
    """Clean the markdown file, removing extraneous content."""
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove header navigation
    content = re.sub(r'^.*?(?=# ' + re.escape(title) + '|^# )', '', content, flags=re.DOTALL)
    if not content.strip().startswith('# '):
        content = '# ' + title + '\n\n' + content
    
    # Remove footer, comments, etc. (adjust these patterns based on the actual content)
    patterns_to_remove = [
        r'## Comments.*$',  # Comments section
        r'Share this:.*$',  # Share buttons
        r'Like this:.*$',   # Like buttons
        r'Related:.*$',     # Related posts
        r'About the author.*$',  # Author bio
        r'Categories:.*$',  # Categories
        r'Tags:.*$',        # Tags
        r'Copyright © .*$'  # Copyright
    ]
    
    for pattern in patterns_to_remove:
        content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Extract just the main content
    main_content = ''
    in_content = False
    for line in content.split('\n'):
        if line.startswith('# '):
            in_content = True
            # Skip the title line as we'll add it in the frontmatter
            continue
        
        if in_content and any(line.startswith(p) for p in ['---', '## Comments', 'Share this:']):
            break
            
        if in_content:
            main_content += line + '\n'
    
    # Generate excerpt
    excerpt = generate_excerpt(main_content)
    
    # Create frontmatter
    frontmatter = f"""---
title: '{title}'
date: '{date}'
excerpt: '{excerpt}'
---
"""
    
    # Combine and write to output file
    main_content = re.sub(r'\\$', '', main_content, flags=re.MULTILINE)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(frontmatter + '\n' + main_content.strip() + '\n')
    
    print(f"Successfully converted {url} to {output_file}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python blog_converter.py [URL]")
        sys.exit(1)
    
    url = sys.argv[1]
    
    # Validate URL
    if not url.startswith('http'):
        print("Error: URL must start with http:// or https://")
        sys.exit(1)
    
    # Extract blog slug
    slug = extract_blog_slug(url)
    temp_file = f"{slug}_temp.md"
    output_file = f"{slug}.md"
    
    # Get title and date
    title = get_title_from_html(url)
    date = get_date_from_html(url)
    
    # Run pandoc
    try:
        subprocess.run(
            ["pandoc", "-s", "-f", "html", "-t", "markdown_strict", "-o", temp_file, url],
            check=True
        )
    except subprocess.CalledProcessError as e:
        print(f"Error running pandoc: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("Error: pandoc is not installed or not in PATH")
        sys.exit(1)
    
    # Clean and process the markdown
    clean_markdown(temp_file, output_file, title, date, url)
    
    # Remove temporary file
    os.remove(temp_file)

if __name__ == "__main__":
    main()