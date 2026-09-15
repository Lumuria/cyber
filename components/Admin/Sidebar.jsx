import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
    const { t } = useTranslation();

    return (
        <div
            style={{
                width: '240px',
                background: '#0f172a',
                color: '#fff',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <h2
                style={{
                    marginBottom: '30px',
                    color: '#ffffff',
                    fontSize: '22px',
                    fontWeight: '700',
                }}
            >
                {t('adminPanel.title')}
            </h2>

            <Link to="/admin" style={linkStyle}>
                {t('adminPanel.dashboard')}
            </Link>

            <Link to="/admin/news" style={linkStyle}>
                {t('adminPanel.manage_news')}
            </Link>

            <Link to="/admin/posts" style={linkStyle}>
                {t('adminPanel.manage_posts')}
            </Link>

            <Link to="/admin/comments" style={linkStyle}>
                {t('adminPanel.manage_comments')}
            </Link>

            <Link to="/admin/users" style={linkStyle}>
                {t('adminPanel.manage_users')}
            </Link>

            <Link to="/admin/content" style={linkStyle}>
                {t('adminPanel.manage_sections')}
            </Link>
        </div>
    );
};

const linkStyle = {
    color: '#cbd5f5',
    textDecoration: 'none',
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '8px',
};

export default Sidebar;