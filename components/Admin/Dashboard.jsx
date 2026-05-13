import React, { useMemo } from 'react';
import { usePosts } from '../Context/PostsContext';
import { getAllUsers } from '../../services/userAccounts';
import { useContent } from '../Context/ContentContext';

const Dashboard = () => {
  const { posts } = usePosts();
  const { news, attacks, prevention, incidents, awareness } = useContent();

  const usersCount = useMemo(() => getAllUsers().length, []);

  const cards = [
    { title: 'News', value: String(news.length), hint: 'Create, edit, and publish updates.' },
    { title: 'Users', value: String(usersCount), hint: 'Verified accounts with login control.' },
    { title: 'Posts', value: String(posts.length), hint: 'Community feed items visible to visitors.' },
    { title: 'Sections', value: String(attacks.length + prevention.length + incidents.length + awareness.length), hint: 'All section records are editable from admin.' },
  ];

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Admin Dashboard</h1>

      <div style={cardsContainer}>
        {cards.map((card) => (
          <article key={card.title} style={cardStyle}>
            <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>{card.title}</h3>
            <strong style={{ fontSize: 24, color: '#1d4ed8' }}>{card.value}</strong>
            <p style={{ margin: '8px 0 0', color: '#64748b' }}>{card.hint}</p>
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
  fontWeight: 'bold',
  color: '#0f172a',
};

const cardsContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '18px',
  width: '100%',
  maxWidth: 980,
};

const cardStyle = {
  background: '#ffffff',
  padding: '22px',
  borderRadius: '15px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  textAlign: 'start',
};

export default Dashboard;
