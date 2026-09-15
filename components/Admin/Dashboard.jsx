import { useEffect, useState } from 'react';
import { usePosts } from '../Context/PostsContext';
import { getAllUsers } from '../../services/userAccounts';
import { useContent } from '../Context/ContentContext';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const { posts } = usePosts();

  const {
    news,
    attacks,
    prevention,
    incidents,
    awareness,
  } = useContent();

  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadUsersCount = async () => {
      const users = await getAllUsers();

      if (mounted) {
        setUsersCount(
          Array.isArray(users) ? users.length : 0
        );
      }
    };

    loadUsersCount();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = [
    {
      title: t('adminPanel.news'),
      value: String(news.length),
      hint: t('adminPanel.news_hint'),
    },
    {
      title: t('adminPanel.users'),
      value: String(usersCount),
      hint: t('adminPanel.users_hint'),
    },
    {
      title: t('adminPanel.posts'),
      value: String(posts.length),
      hint: t('adminPanel.posts_hint'),
    },
    {
      title: t('adminPanel.sections'),
      value: String(
        attacks.length +
        prevention.length +
        incidents.length +
        awareness.length
      ),
      hint: t('adminPanel.sections_hint'),
    },
  ];

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        {t('adminPanel.dashboard_title')}
      </h1>

      <div style={cardsContainer}>
        {cards.map((card) => (
          <article
            key={card.title}
            style={cardStyle}
          >
            <h3 style={cardTitleStyle}>
              {card.title}
            </h3>

            <strong style={valueStyle}>
              {card.value}
            </strong>

            <p style={hintStyle}>
              {card.hint}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: '80vh',
  textAlign: 'center',
};

const titleStyle = {
  marginBottom: '30px',
  fontSize: '28px',
  fontWeight: '700',
  color: '#1e293b',
};

const cardsContainer = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '18px',
  width: '100%',
  maxWidth: 980,
};

const cardStyle = {
  background: '#ffffff',
  padding: '22px',
  borderRadius: '15px',
  boxShadow:
    '0 4px 15px rgba(0, 0, 0, 0.08)',
  textAlign: 'start',
  border: '1px solid #e2e8f0',
};

const cardTitleStyle = {
  margin: '0 0 8px',
  color: '#1e293b',
  fontSize: '17px',
  fontWeight: '700',
};

const valueStyle = {
  fontSize: '24px',
  color: '#1d4ed8',
  fontWeight: '700',
};

const hintStyle = {
  margin: '8px 0 0',
  color: '#475569',
  fontSize: '14px',
  lineHeight: '1.5',
};

export default Dashboard;