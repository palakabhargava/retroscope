import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  ogType?: 'website' | 'video.movie' | 'video.tv_show' | 'video.other';
  ogImage?: string;
  canonicalPath?: string;
  schema?: Record<string, any>;
}

export function SEOHelper({
  title,
  description,
  ogType = 'video.movie',
  ogImage = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop', // Proper fallback image
  canonicalPath,
  schema
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to set meta tag content dynamically in the DOM
    const setMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const selector = isProperty 
        ? `meta[property="${nameOrProperty}"]` 
        : `meta[name="${nameOrProperty}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', nameOrProperty);
        } else {
          el.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Set Meta Tags
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', ogImage, true);
    
    const currentUrl = window.location.origin + (canonicalPath || window.location.pathname);
    setMeta('og:url', currentUrl, true);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // 3. Set Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // 4. Set Schema JSON-LD Script
    let schemaScript = document.getElementById('seo-schema-jsonld') as HTMLScriptElement;
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-schema-jsonld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(schema);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

    return () => {
      // Clean up JSON-LD on unmount to prevent page bleed
      const script = document.getElementById('seo-schema-jsonld');
      if (script) script.remove();
    };
  }, [title, description, ogType, ogImage, canonicalPath, schema]);

  return null; // Component does not render physical DOM trees
}
