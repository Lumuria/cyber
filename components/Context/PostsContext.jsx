import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { API_URL } from '../../services/apiConfig';

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({});

  const [postsLoading, setPostsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const getToken = useCallback(() => {
    return localStorage.getItem('auth_token');
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      setPostsLoading(true);

      const response = await fetch(`${API_URL}/posts`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load posts');
      }

      const data = await response.json();

      const backendPosts = Array.isArray(data.posts)
        ? data.posts
        : [];

      const normalizedPosts = backendPosts.map((post) => ({
        id: post.id,
        title: post.title || '',
        body: post.body || '',
        createdAt: post.created_at
          ? new Date(post.created_at).getTime()
          : Date.now(),
        authorEmail: post.user?.email || '',
        authorName:
          post.user?.name ||
          post.user?.username ||
          '',
      }));

      setPosts(normalizedPosts);
    } catch (error) {
      console.error('Load posts error:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const loadComments = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setComments([]);
      return;
    }

    try {
      setCommentsLoading(true);

      const response = await fetch(`${API_URL}/comments`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load comments');
      }

      const data = await response.json();

      const backendComments = Array.isArray(
        data.comments
      )
        ? data.comments
        : [];

      const normalizedComments = backendComments.map(
        (comment) => ({
          id: comment.id,
          postId: comment.post_id,
          authorEmail:
            comment.user?.email ||
            comment.authorEmail ||
            '',
          authorName:
            comment.user?.name ||
            comment.user?.username ||
            '',
          text: comment.text || '',
          createdAt: comment.created_at
            ? new Date(
                comment.created_at
              ).getTime()
            : Date.now(),
        })
      );

      setComments(normalizedComments);
    } catch (error) {
      console.error('Load comments error:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const loadLikesForPost = useCallback(
    async (postId) => {
      try {
        const response = await fetch(
          `${API_URL}/posts/${postId}/likes`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load likes');
        }

        const data = await response.json();

        const emails = Array.isArray(data.likes)
          ? data.likes
          : [];

        setLikes((current) => ({
          ...current,
          [postId]: emails.map((email) =>
            String(email)
              .trim()
              .toLowerCase()
          ),
        }));

        return emails;
      } catch (error) {
        console.error('Load likes error:', error);
        return [];
      }
    },
    []
  );

  const loadAllLikes = useCallback(
    async (postsList) => {
      if (!Array.isArray(postsList)) {
        return;
      }

      for (const post of postsList) {
        await loadLikesForPost(post.id);
      }
    },
    [loadLikesForPost]
  );

  useEffect(() => {
    if (posts.length > 0) {
      loadAllLikes(posts);
    }
  }, [posts, loadAllLikes]);

  const addPost = useCallback(
    async (title, body) => {
      const token = getToken();

      if (!token) {
        console.error('No authentication token');
        return null;
      }

      const trimmedTitle = String(title || '').trim();
      const trimmedBody = String(body || '').trim();

      if (!trimmedTitle) {
        return null;
      }

      try {
        const response = await fetch(
          `${API_URL}/posts`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: trimmedTitle,
              body: trimmedBody,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error('Add post failed:', data);
          return null;
        }

        const post = data.post;

        if (!post) {
          await loadPosts();
          return null;
        }

        const normalizedPost = {
          id: post.id,
          title: post.title || '',
          body: post.body || '',
          createdAt: post.created_at
            ? new Date(
                post.created_at
              ).getTime()
            : Date.now(),
          authorEmail:
            post.user?.email || '',
          authorName:
            post.user?.name ||
            post.user?.username ||
            '',
        };

        setPosts((current) => [
          normalizedPost,
          ...current,
        ]);

        return normalizedPost;
      } catch (error) {
        console.error('Add post error:', error);
        return null;
      }
    },
    [getToken, loadPosts]
  );

  const updatePost = useCallback(
    async (postId, title, body) => {
      const token = getToken();

      if (!token) {
        console.error('No authentication token');
        return false;
      }

      const trimmedTitle = String(title || '').trim();
      const trimmedBody = String(body || '').trim();

      if (!trimmedTitle) {
        return false;
      }

      try {
        const response = await fetch(
          `${API_URL}/posts/${postId}`,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: trimmedTitle,
              body: trimmedBody,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            'Update post failed:',
            data
          );
          return false;
        }

        const post = data.post;

        if (!post) {
          await loadPosts();
          return false;
        }

        const normalizedPost = {
          id: post.id,
          title: post.title || '',
          body: post.body || '',
          createdAt: post.created_at
            ? new Date(
                post.created_at
              ).getTime()
            : Date.now(),
          authorEmail:
            post.user?.email || '',
          authorName:
            post.user?.name ||
            post.user?.username ||
            '',
        };

        setPosts((current) =>
          current.map((item) =>
            String(item.id) ===
            String(postId)
              ? normalizedPost
              : item
          )
        );

        return true;
      } catch (error) {
        console.error(
          'Update post error:',
          error
        );
        return false;
      }
    },
    [getToken, loadPosts]
  );

  const deletePost = useCallback(
    async (postId) => {
      const token = getToken();

      if (!token) {
        console.error('No authentication token');
        return false;
      }

      try {
        const response = await fetch(
          `${API_URL}/posts/${postId}`,
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          console.error(
            'Delete post failed:',
            data
          );
          return false;
        }

        setPosts((current) =>
          current.filter(
            (post) =>
              String(post.id) !==
              String(postId)
          )
        );

        setLikes((current) => {
          const next = {
            ...current,
          };

          delete next[postId];

          return next;
        });

        setComments((current) =>
          current.filter(
            (comment) =>
              String(comment.postId) !==
              String(postId)
          )
        );

        return true;
      } catch (error) {
        console.error(
          'Delete post error:',
          error
        );
        return false;
      }
    },
    [getToken]
  );

  const toggleLike = useCallback(
    async (postId, userEmail) => {
      if (!userEmail) {
        return false;
      }

      const token = getToken();

      if (!token) {
        console.error('No authentication token');
        return false;
      }

      try {
        const response = await fetch(
          `${API_URL}/posts/${postId}/like`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          console.error(
            'Toggle like failed:',
            data
          );
          return false;
        }

        const email = userEmail
          .trim()
          .toLowerCase();

        setLikes((current) => {
          const next = {
            ...current,
          };

          const currentList = Array.isArray(
            next[postId]
          )
            ? [...next[postId]]
            : [];

          if (data.liked) {
            if (!currentList.includes(email)) {
              currentList.push(email);
            }
          } else {
            const index =
              currentList.indexOf(email);

            if (index >= 0) {
              currentList.splice(index, 1);
            }
          }

          next[postId] = currentList;

          return next;
        });

        return data;
      } catch (error) {
        console.error(
          'Toggle like error:',
          error
        );
        return false;
      }
    },
    [getToken]
  );

  const addComment = useCallback(
    async (postId, userEmail, text) => {
      const trimmedText = String(text || '').trim();

      if (
        !postId ||
        !userEmail ||
        !trimmedText
      ) {
        return null;
      }

      const token = getToken();

      if (!token) {
        console.error('No authentication token');
        return null;
      }

      try {
        const response = await fetch(
          `${API_URL}/comments`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              post_id: postId,
              text: trimmedText,
            }),
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          console.error(
            'Add comment failed:',
            data
          );
          return null;
        }

        const comment = data.comment;

        if (!comment) {
          await loadComments();
          return null;
        }

        const normalizedComment = {
          id: comment.id,
          postId: comment.post_id,
          authorEmail:
            comment.user?.email ||
            userEmail,
          authorName:
            comment.user?.name ||
            comment.user?.username ||
            '',
          text: comment.text || '',
          createdAt: comment.created_at
            ? new Date(
                comment.created_at
              ).getTime()
            : Date.now(),
        };

        setComments((current) => [
          ...current,
          normalizedComment,
        ]);

        return normalizedComment;
      } catch (error) {
        console.error(
          'Add comment error:',
          error
        );
        return null;
      }
    },
    [getToken, loadComments]
  );

  const deleteComment = useCallback(
    async (commentId) => {
      const token = getToken();

      if (!token) {
        return false;
      }

      try {
        const response = await fetch(
          `${API_URL}/comments/${commentId}`,
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          console.error(
            'Delete comment failed:',
            data
          );
          return false;
        }

        setComments((current) =>
          current.filter(
            (comment) =>
              String(comment.id) !==
              String(commentId)
          )
        );

        return true;
      } catch (error) {
        console.error(
          'Delete comment error:',
          error
        );
        return false;
      }
    },
    [getToken]
  );

  const getCommentsForPost = useCallback(
    (postId) =>
      comments
        .filter(
          (comment) =>
            String(comment.postId) ===
            String(postId)
        )
        .sort(
          (a, b) =>
            a.createdAt - b.createdAt
        ),
    [comments]
  );

  const getLikeCount = useCallback(
    (postId) =>
      Array.isArray(likes[postId])
        ? likes[postId].length
        : 0,
    [likes]
  );

  const isLikedBy = useCallback(
    (postId, userEmail) => {
      if (!userEmail) {
        return false;
      }

      const list = likes[postId];

      if (!Array.isArray(list)) {
        return false;
      }

      return list.includes(
        userEmail.trim().toLowerCase()
      );
    },
    [likes]
  );

  const value = useMemo(
    () => ({
      posts,
      postsLoading,
      addPost,
      updatePost,
      deletePost,
      toggleLike,
      addComment,
      deleteComment,
      getCommentsForPost,
      getLikeCount,
      isLikedBy,
      commentsLoading,
      reloadPosts: loadPosts,
      reloadComments: loadComments,
      loadLikesForPost,
      loadAllLikes,
    }),
    [
      posts,
      postsLoading,
      addPost,
      updatePost,
      deletePost,
      toggleLike,
      addComment,
      deleteComment,
      getCommentsForPost,
      getLikeCount,
      isLikedBy,
      commentsLoading,
      loadPosts,
      loadComments,
      loadLikesForPost,
      loadAllLikes,
    ]
  );

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);

  if (!ctx) {
    throw new Error(
      'usePosts must be used within PostsProvider'
    );
  }

  return ctx;
}