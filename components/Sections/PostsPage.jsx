import { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../Context/AuthContext';
import { usePosts } from '../Context/PostsContext';
import '../Style/Posts.css';

export default function PostsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const {
    posts,
    toggleLike,
    addComment,
    getCommentsForPost,
    getLikeCount,
    isLikedBy,
  } = usePosts();
  const [drafts, setDrafts] = useState({});

  const setDraft = (postId, value) => {
    setDrafts((d) => ({ ...d, [postId]: value }));
  };

  const handleComment = (postId) => {
    const text = drafts[postId] || '';
    if (!user || !text.trim()) return;
    addComment(postId, user.email, text);
    setDraft(postId, '');
  };

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

  return (
    <div className="posts-page">
      <section className="posts-header">
        <MessageCircle className="posts-header-icon" aria-hidden />
        <h1>{t('postsPage.title')}</h1>
        <p>{t('postsPage.subtitle')}</p>
      </section>

      <section className="posts-list">
        {posts.length === 0 && (
          <p className="posts-empty">{t('postsPage.empty')}</p>
        )}

        {posts.map((post) => {
          const liked = isLikedBy(post.id, user?.email);
          const count = getLikeCount(post.id);
          const postComments = getCommentsForPost(post.id);

          return (
            <article key={post.id} className="post-card">
              <header className="post-card-head">
                <h2>{post.title}</h2>
                <div className="post-meta">
                  <span>
                    {t('postsPage.by')} {post.authorEmail}
                  </span>
                  <span>
                    {new Date(post.createdAt).toLocaleString(locale)}
                  </span>
                </div>
              </header>
              <div className="post-body">{post.body}</div>

              <div className="post-actions">
                <button
                  type="button"
                  className={`post-like ${liked ? 'post-like--active' : ''}`}
                  disabled={!user}
                  onClick={() => toggleLike(post.id, user?.email)}
                  aria-pressed={liked}
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                  <span>
                    {liked ? t('postsPage.unlike') : t('postsPage.like')}
                  </span>
                  <span className="post-like-count">{count}</span>
                </button>
              </div>

              {!user && (
                <p className="posts-login-hint">
                  <Link to="/login">{t('postsPage.login_to_interact')}</Link>
                </p>
              )}

              <div className="post-comments">
                <h3>{t('postsPage.comments')} ({postComments.length})</h3>
                {postComments.length === 0 && (
                  <p className="posts-no-comments">{t('postsPage.no_comments')}</p>
                )}
                <ul className="post-comment-list">
                  {postComments.map((c) => (
                    <li key={c.id}>
                      <strong>{c.authorEmail}</strong>
                      <span className="post-comment-time">
                        {new Date(c.createdAt).toLocaleString(locale)}
                      </span>
                      <p>{c.text}</p>
                    </li>
                  ))}
                </ul>

                {user && (
                  <div className="post-comment-form">
                    <textarea
                      rows={2}
                      placeholder={t('postsPage.placeholder')}
                      value={drafts[post.id] || ''}
                      onChange={(e) => setDraft(post.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="post-comment-submit"
                      onClick={() => handleComment(post.id)}
                    >
                      <Send size={18} />
                      {t('postsPage.submit')}
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
