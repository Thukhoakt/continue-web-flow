import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  created_at: string;
  published: boolean;
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allPosts, setAllPosts] = useState<SearchResult[]>([]);
  const { isAdmin } = useAuth();

  // Fetch all posts on mount
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        let query = supabase
          .from('posts')
          .select('id, title, excerpt, featured_image, created_at, published')
          .order('created_at', { ascending: false });

        if (!isAdmin) {
          query = query.eq('published', true);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        setAllPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchAllPosts();
  }, [isAdmin]);

  // Client-side search với debounce
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(query))
    );
  }, [searchQuery, allPosts]);

  // Update results khi query thay đổi
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [filteredResults]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch,
    hasResults: searchResults.length > 0,
    hasQuery: searchQuery.trim().length > 0
  };
};