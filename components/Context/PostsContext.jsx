import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'threatiq_community_posts';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { posts: [], comments: [], likes: {} };
    const data = JSON.parse(raw);
    return {
      posts: Array.isArray(data.posts) ? data.posts : [],
      comments: Array.isArray(data.comments) ? data.comments : [],
      likes: data.likes && typeof data.likes === 'object' ? data.likes : {},
    };
  } catch {
    return { posts: [], comments: [], likes: {} };
  }
}

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [state, setState] = useState(() => loadState());

  const commit = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const posts = state.posts;
  const comments = state.comments;
  const likes = state.likes;

  const addPost = useCallback(
    (title, body, authorEmail) => {
      const trimmedTitle = title.trim();
      const trimmedBody = body.trim();
      if (!trimmedTitle) return null;
      const post = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        title: trimmedTitle,
        body: trimmedBody,
        createdAt: Date.now(),
        authorEmail: authorEmail || 'admin',
      };
      commit((s) => ({
        ...s,
        posts: [post, ...s.posts],
      }));
      return post;
    },
    [commit]
  );

  const deletePost = useCallback(
    (postId) => {
      commit((s) => {
        const nextLikes = { ...s.likes };
        delete nextLikes[postId];
        return {
          posts: s.posts.filter((p) => p.id !== postId),
          comments: s.comments.filter((c) => c.postId !== postId),
          likes: nextLikes,
        };
      });
    },
    [commit]
  );

  const toggleLike = useCallback(
    (postId, userEmail) => {
      if (!userEmail) return;
      const email = userEmail.trim().toLowerCase();
      commit((s) => {
        const list = Array.isArray(s.likes[postId]) ? [...s.likes[postId]] : [];
        const idx = list.indexOf(email);
        if (idx >= 0) list.splice(idx, 1);
        else list.push(email);
        return {
          ...s,
          likes: { ...s.likes, [postId]: list },
        };
      });
    },
    [commit]
  );

  const addComment = useCallback(
    (postId, userEmail, text) => {
      const t = text.trim();
      if (!userEmail || !t) return null;
      const comment = {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        postId,
        authorEmail: userEmail.trim(),
        text: t,
        createdAt: Date.now(),
      };
      commit((s) => ({
        ...s,
        comments: [...s.comments, comment],
      }));
      return comment;
    },
    [commit]
  );

  const getCommentsForPost = useCallback(
    (postId) =>
      comments.filter((c) => c.postId === postId).sort((a, b) => a.createdAt - b.createdAt),
    [comments]
  );

  const getLikeCount = useCallback(
    (postId) => (Array.isArray(likes[postId]) ? likes[postId].length : 0),
    [likes]
  );

  const isLikedBy = useCallback(
    (postId, userEmail) => {
      if (!userEmail) return false;
      const list = likes[postId];
      if (!Array.isArray(list)) return false;
      return list.includes(userEmail.trim().toLowerCase());
    },
    [likes]
  );

  const value = useMemo(
    () => ({
      posts,
      addPost,
      deletePost,
      toggleLike,
      addComment,
      getCommentsForPost,
      getLikeCount,
      isLikedBy,
    }),
    [
      posts,
      addPost,
      deletePost,
      toggleLike,
      addComment,
      getCommentsForPost,
      getLikeCount,
      isLikedBy,
    ]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}
