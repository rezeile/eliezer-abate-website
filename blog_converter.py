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
import hashlib
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
import requests

# Directory for downloaded images
IMAGES_DIR = "public/images/blog"

def download_image(image_url, slug):
    """Download an image and return the local path."""
    try:
        # Create images directory if it doesn't exist
        os.makedirs(IMAGES_DIR, exist_ok=True)

        # Get the image
        response = requests.get(image_url, timeout=30)
        response.raise_for_status()

        # Determine file extension from content-type or URL
        content_type = response.headers.get('content-type', '')
        if 'jpeg' in content_type or 'jpg' in content_type:
            ext = '.jpg'
        elif 'png' in content_type:
            ext = '.png'
        elif 'gif' in content_type:
            ext = '.gif'
        elif 'webp' in content_type:
            ext = '.webp'
        else:
            # Try to get from URL
            parsed = urlparse(image_url)
            path_ext = os.path.splitext(parsed.path)[1].lower()
            ext = path_ext if path_ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] else '.jpg'

        # Create a unique filename based on URL hash
        url_hash = hashlib.md5(image_url.encode()).hexdigest()[:8]
        original_name = os.path.splitext(os.path.basename(urlparse(image_url).path))[0]
        # Clean the original name
        original_name = re.sub(r'[^a-zA-Z0-9_-]', '', original_name)[:30]
        filename = f"{slug}-{original_name}-{url_hash}{ext}"

        local_path = os.path.join(IMAGES_DIR, filename)

        # Save the image
        with open(local_path, 'wb') as f:
            f.write(response.content)

        # Return the path relative to public (for use in markdown)
        return f"/images/blog/{filename}"
    except Exception as e:
        print(f"Warning: Failed to download image {image_url}: {e}")
        return None


def extract_and_download_images(content, slug):
    """Find all images in content, download them, and update references."""
    # Pattern to match markdown images: ![alt](url)
    md_img_pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
    # Pattern to match HTML img tags
    html_img_pattern = r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>'

    downloaded = {}

    # Find and download markdown images
    for match in re.finditer(md_img_pattern, content):
        alt_text, url = match.groups()
        if url.startswith('http') and url not in downloaded:
            local_path = download_image(url, slug)
            if local_path:
                downloaded[url] = local_path
                print(f"  Downloaded: {url} -> {local_path}")

    # Find and download HTML img tags
    for match in re.finditer(html_img_pattern, content):
        url = match.group(1)
        if url.startswith('http') and url not in downloaded:
            local_path = download_image(url, slug)
            if local_path:
                downloaded[url] = local_path
                print(f"  Downloaded: {url} -> {local_path}")

    # Replace URLs in content
    for old_url, new_path in downloaded.items():
        content = content.replace(old_url, new_path)

    return content, len(downloaded)


def extract_images_from_html(url, slug):
    """Extract images directly from the HTML source and download them.

    Returns a dict mapping original URLs to local paths, and the hero image path if found.
    """
    print("Fetching HTML to extract images...")
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    downloaded = {}
    hero_image = None

    # First, check for hero banner image (Webflow uses hero-blog class with background-image)
    hero_div = soup.find('div', class_='hero-blog')
    if hero_div:
        style = hero_div.get('style', '')
        match = re.search(r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)', style)
        if match:
            src = match.group(1).replace('&quot;', '')
            if src.startswith('http'):
                local_path = download_image(src, slug)
                if local_path:
                    downloaded[src] = local_path
                    hero_image = local_path
                    print(f"  Downloaded hero image: {src[:60]}...")

    # Find the main content area (w-richtext class is Webflow's rich text container)
    content_div = soup.find('div', class_='w-richtext')
    if not content_div:
        content_div = soup.find('div', class_='blog-post')
    if not content_div:
        content_div = soup  # Fall back to whole page

    # Find all img tags in the content
    for img in content_div.find_all('img'):
        src = img.get('src', '')
        if src and src.startswith('http') and 'author' not in src.lower():
            if src not in downloaded:
                local_path = download_image(src, slug)
                if local_path:
                    downloaded[src] = local_path
                    # Get alt text or caption for context
                    alt = img.get('alt', '')
                    figcaption = img.find_parent('figure')
                    caption = ''
                    if figcaption:
                        cap_elem = figcaption.find('figcaption')
                        if cap_elem:
                            caption = cap_elem.get_text(strip=True)
                    print(f"  Downloaded: {src[:60]}...")
                    if caption:
                        print(f"    Caption: {caption}")

    # Also check for background images in style attributes within content
    for elem in content_div.find_all(style=True):
        style = elem.get('style', '')
        # Extract URL from background-image:url("...")
        match = re.search(r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)', style)
        if match:
            src = match.group(1)
            if src.startswith('http') and src not in downloaded:
                local_path = download_image(src, slug)
                if local_path:
                    downloaded[src] = local_path
                    print(f"  Downloaded background: {src[:60]}...")

    return downloaded, hero_image


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

def clean_markdown(input_file, output_file, title, date, url, slug, image_map, hero_image=None):
    """Clean the markdown file, removing extraneous content."""
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove header navigation - everything before the title
    content = re.sub(r'^.*?(?=# ' + re.escape(title) + '|^# )', '', content, flags=re.DOTALL)
    if not content.strip().startswith('# '):
        content = '# ' + title + '\n\n' + content

    # Remove sections that come after the main content
    section_patterns = [
        r'## Related Posts.*$',
        r'## Stay Updated.*$',
        r'## Comments.*$',
        r'## Newsletter.*$',
        r'## Subscribe.*$',
    ]

    for pattern in section_patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)

    # Remove HTML tags with specific classes (Webflow cruft)
    html_patterns = [
        r'<a[^>]*class="[^"]*blog-category[^"]*"[^>]*>.*?</a>',  # Blog category links
        r'<a[^>]*class="[^"]*author-link[^"]*"[^>]*>.*?</a>',   # Author links
        r'<a[^>]*class="[^"]*author-name[^"]*"[^>]*>.*?</a>',   # Author name links
        r'<a[^>]*class="[^"]*thumbnail-wrapper[^"]*"[^>]*>.*?</a>',  # Thumbnail wrappers
        r'<a[^>]*data-w-expand[^>]*>.*?</a>',  # Webflow expand links
        r'<img[^>]*class="[^"]*author-photo[^"]*"[^>]*/>',  # Author photos
        r'<img[^>]*class="[^"]*author-img[^"]*"[^>]*/?>',   # Author images
    ]

    for pattern in html_patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL | re.IGNORECASE)

    # Remove standalone date lines at the beginning (like "January 26, 2021")
    content = re.sub(r'^# .*?\n+\s*\w+ \d{1,2}, \d{4}\s*\n', lambda m: m.group(0).split('\n')[0] + '\n\n', content)

    # Extract just the main content
    main_content = ''
    in_content = False

    for line in content.split('\n'):
        # Start capturing after the title
        if line.startswith('# '):
            in_content = True
            continue

        # Stop at footer sections
        if in_content and any(marker in line.lower() for marker in [
            '## related', '## stay updated', '## comments', '## newsletter',
            'thank you! your submission', 'oops! something went wrong'
        ]):
            break

        # Skip lines that are just dates at the start (before main content begins)
        if in_content and len(main_content.strip()) < 50:
            if re.match(r'^\s*\w+ \d{1,2},?\s*\d{4}\s*$', line):
                continue
            # Skip category labels like "Reflections"
            if re.match(r'^\s*(Reflections|Ethiopia|Tech|Life|Politics)\s*$', line, re.IGNORECASE):
                continue

        if in_content:
            main_content += line + '\n'

    # Convert HTML <a> tags to markdown links before removing HTML
    # Pattern: <a href="URL" ...>text</a> -> [text](URL)
    def convert_link(match):
        full_tag = match.group(0)
        href_match = re.search(r'href=["\']([^"\']+)["\']', full_tag)
        if href_match:
            url = href_match.group(1)
            # Extract text between > and </a>
            text_match = re.search(r'>([^<]+)</a>', full_tag, re.IGNORECASE | re.DOTALL)
            if text_match:
                # Clean up line breaks and extra whitespace in link text
                text = text_match.group(1).strip()
                text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
                return f'[{text}]({url})'
        return match.group(0)

    main_content = re.sub(r'<a\s[^>]*>.*?</a>', convert_link, main_content, flags=re.DOTALL | re.IGNORECASE)

    # Remove other HTML span tags but keep their content
    main_content = re.sub(r'<span[^>]*>([^<]*)</span>', r'\1', main_content, flags=re.IGNORECASE)

    # Remove remaining HTML div wrappers
    main_content = re.sub(r'<div[^>]*>', '', main_content, flags=re.IGNORECASE)
    main_content = re.sub(r'</div>', '', main_content, flags=re.IGNORECASE)

    # Clean up remaining HTML artifacts
    main_content = re.sub(r'<[^>]+>', '', main_content)  # Remove any remaining HTML tags

    # Remove Webflow's zero-width spaces and weird characters
    main_content = main_content.replace('\u200d', '')  # Zero-width joiner
    main_content = main_content.replace('\u200b', '')  # Zero-width space

    # Clean up excessive whitespace
    main_content = re.sub(r'\n{3,}', '\n\n', main_content)

    # Remove trailing backslashes
    main_content = re.sub(r'\\$', '', main_content, flags=re.MULTILINE)

    # Replace any image URLs that were extracted from HTML
    for old_url, new_path in image_map.items():
        main_content = main_content.replace(old_url, new_path)

    # Also try to download any remaining images in the markdown content
    main_content, num_extra = extract_and_download_images(main_content, slug)

    # If we have images from HTML but they're not in the content (pandoc dropped them),
    # we need to add them back. Look for captions that might indicate where they go.
    if image_map and not any(path in main_content for path in image_map.values()):
        # Fetch the original HTML to get captions
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        content_div = soup.find('div', class_='w-richtext') or soup.find('div', class_='blog-post')

        if content_div:
            for img in content_div.find_all('img'):
                src = img.get('src', '')
                if src in image_map:
                    local_path = image_map[src]
                    alt = img.get('alt', '')
                    figcaption = img.find_parent('figure')
                    caption = ''
                    if figcaption:
                        cap_elem = figcaption.find('figcaption')
                        if cap_elem:
                            caption = cap_elem.get_text(strip=True)

                    # Try to find the caption in the content and add the image before it (only first occurrence)
                    if caption and caption in main_content:
                        img_md = f'\n\n![{alt}]({local_path})\n\n'
                        main_content = main_content.replace(caption, img_md + '*' + caption + '*', 1)
                    else:
                        # Append image at a logical place (after first paragraph)
                        paragraphs = main_content.split('\n\n')
                        if len(paragraphs) > 1:
                            img_md = f'\n\n![{alt}]({local_path})'
                            if caption:
                                img_md += f'\n*{caption}*'
                            # Insert after blockquote or first paragraph
                            insert_pos = 1
                            for i, p in enumerate(paragraphs):
                                if p.strip().startswith('>'):
                                    insert_pos = i + 1
                                    break
                            paragraphs.insert(insert_pos, img_md)
                            main_content = '\n\n'.join(paragraphs)

    # Generate excerpt from cleaned content (before adding hero image)
    excerpt = generate_excerpt(main_content)

    # Add hero image at the beginning if present
    if hero_image:
        main_content = f'![{title}]({hero_image})\n\n' + main_content
    # Escape single quotes in excerpt for YAML
    excerpt = excerpt.replace("'", "''")

    # Create frontmatter
    frontmatter = f"""---
title: '{title.replace("'", "''")}'
date: '{date}'
excerpt: '{excerpt}'
---
"""

    # Combine and write to output file
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

    # Output to content/blog directory
    output_dir = "content/blog"
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f"{slug}.mdx")

    print(f"Converting: {url}")
    print(f"Slug: {slug}")

    # Get title and date
    title = get_title_from_html(url)
    date = get_date_from_html(url)
    print(f"Title: {title}")
    print(f"Date: {date}")

    # Extract and download images from HTML before pandoc processes it
    image_map, hero_image = extract_images_from_html(url, slug)
    if image_map:
        print(f"Downloaded {len(image_map)} image(s) from HTML")
    else:
        print("No content images found in HTML")

    # Run pandoc with GFM (GitHub Flavored Markdown) for table support
    try:
        subprocess.run(
            ["pandoc", "-s", "-f", "html", "-t", "gfm", "-o", temp_file, url],
            check=True
        )
    except subprocess.CalledProcessError as e:
        print(f"Error running pandoc: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("Error: pandoc is not installed or not in PATH")
        sys.exit(1)

    # Clean and process the markdown
    clean_markdown(temp_file, output_file, title, date, url, slug, image_map, hero_image)

    # Remove temporary file
    os.remove(temp_file)

    print(f"\nDone! Output: {output_file}")

if __name__ == "__main__":
    main()