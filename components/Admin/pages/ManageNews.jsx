import { useState } from 'react';
import { useContent } from '../../Context/ContentContext';
import { useTranslation } from 'react-i18next';

const emptyForm = {
  titleAr: '',
  titleEn: '',
  summaryAr: '',
  summaryEn: '',
  contentAr: '',
  contentEn: '',
  categoryAr: '',
  categoryEn: '',
  severityAr: 'عالية',
  severityEn: 'High',
  sourceAr: '',
  sourceEn: '',
  date: '',
  recommendationsAr: '',
  recommendationsEn: '',
};

const ManageNews = () => {
  const { t } = useTranslation();
  const { news, addItem, updateItem, deleteItem } = useContent();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);

    setForm({
      titleAr: item.title?.ar || '',
      titleEn: item.title?.en || '',
      summaryAr: item.summary?.ar || '',
      summaryEn: item.summary?.en || '',
      contentAr: item.content?.ar || '',
      contentEn: item.content?.en || '',
      categoryAr: item.category?.ar || '',
      categoryEn: item.category?.en || '',
      severityAr: item.severity?.ar || 'عالية',
      severityEn: item.severity?.en || 'High',
      sourceAr: item.source?.ar || '',
      sourceEn: item.source?.en || '',
      date: item.date || '',
      recommendationsAr: (item.recommendations || [])
        .map((x) => x?.ar || '')
        .join('\n'),
      recommendationsEn: (item.recommendations || [])
        .map((x) => x?.en || '')
        .join('\n'),
    });

    setShowModal(true);
  };

  const buildPayload = () => {
    const recAr = form.recommendationsAr
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

    const recEn = form.recommendationsEn
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

    const recommendations = recAr.map((ar, i) => ({
      ar,
      en: recEn[i] || recEn[0] || ar,
    }));

    return {
      title: {
        ar: form.titleAr.trim(),
        en: form.titleEn.trim(),
      },
      summary: {
        ar: form.summaryAr.trim(),
        en: form.summaryEn.trim(),
      },
      content: {
        ar: form.contentAr.trim(),
        en: form.contentEn.trim(),
      },
      category: {
        ar: form.categoryAr.trim(),
        en: form.categoryEn.trim(),
      },
      severity: {
        ar: form.severityAr.trim(),
        en: form.severityEn.trim(),
      },
      source: {
        ar: form.sourceAr.trim(),
        en: form.sourceEn.trim(),
      },
      date:
        form.date ||
        new Date().toISOString().slice(0, 10),
      recommendations,
    };
  };

  const save = () => {
    if (!form.titleAr.trim() || !form.titleEn.trim()) {
      return;
    }

    const payload = buildPayload();

    if (editingId) {
      updateItem('news', editingId, payload);
    } else {
      addItem('news', payload);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const set = (key, value) => {
    setForm((f) => ({
      ...f,
      [key]: value,
    }));
  };

  return (
    <div style={container}>
      <div style={pageHeader}>
        <div>
          <h2 style={titleStyle}>
            {t('adminPanel.manage_news_title')}
          </h2>

          <p style={hint}>
            {t('adminPanel.news_manage_hint')}
          </p>
        </div>

        <button
          type="button"
          style={addBtn}
          onClick={openCreate}
        >
          + {t('adminPanel.add_news')}
        </button>
      </div>

      <div style={list}>
        {news.length === 0 && (
          <div style={emptyState}>
            {t('adminPanel.no_news')}
          </div>
        )}

        {news.map((item) => (
          <div
            key={item.id}
            style={card}
          >
            <div style={contentArea}>
              <h4 style={cardTitle}>
                {item.title?.en || item.title?.ar}
              </h4>

              <p style={cardDescription}>
                {item.summary?.en || '-'}
              </p>

              <small style={dateStyle}>
                {item.date || '-'}
              </small>
            </div>

            <div style={actions}>
              <button
                type="button"
                onClick={() => openEdit(item)}
                style={editBtn}
              >
                {t('adminPanel.edit')}
              </button>

              <button
                type="button"
                onClick={() =>
                  deleteItem('news', item.id)
                }
                style={deleteBtn}
              >
                {t('adminPanel.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          style={overlay}
          role="presentation"
          onClick={() => setShowModal(false)}
        >
          <div
            style={modal}
            role="dialog"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div style={modalHeader}>
              <h3 style={modalTitle}>
                {editingId
                  ? t('adminPanel.edit_news')
                  : t('adminPanel.add_news_title')}
              </h3>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={closeBtn}
              >
                ×
              </button>
            </div>

            <div style={grid2}>
              <input
                style={input}
                placeholder={t('adminPanel.title_ar')}
                value={form.titleAr}
                onChange={(e) =>
                  set('titleAr', e.target.value)
                }
              />

              <input
                style={input}
                placeholder={t('adminPanel.title_en')}
                value={form.titleEn}
                onChange={(e) =>
                  set('titleEn', e.target.value)
                }
              />

              <input
                style={input}
                placeholder={t('adminPanel.category_ar')}
                value={form.categoryAr}
                onChange={(e) =>
                  set('categoryAr', e.target.value)
                }
              />

              <input
                style={input}
                placeholder={t('adminPanel.category_en')}
                value={form.categoryEn}
                onChange={(e) =>
                  set('categoryEn', e.target.value)
                }
              />

              <input
                style={input}
                placeholder={t('adminPanel.severity_ar')}
                value={form.severityAr}
                onChange={(e) =>
                  set('severityAr', e.target.value)
                }
              />

              <input
                style={input}
                placeholder={t('adminPanel.severity_en')}
                value={form.severityEn}
                onChange={(e) =>
                  set('severityEn', e.target.value)
                }
              />

              <input
                style={input}
                placeholder={t('adminPanel.source_ar')}
                value={form.sourceAr}
                onChange={(e) =>
                  set('sourceAr', e.target.value)
                }
              />

              <input
                style={input}
                placeholder={t('adminPanel.source_en')}
                value={form.sourceEn}
                onChange={(e) =>
                  set('sourceEn', e.target.value)
                }
              />

              <input
                style={input}
                type="date"
                value={form.date}
                onChange={(e) =>
                  set('date', e.target.value)
                }
              />
            </div>

            <textarea
              style={textarea}
              placeholder={t('adminPanel.summary_ar')}
              value={form.summaryAr}
              onChange={(e) =>
                set('summaryAr', e.target.value)
              }
            />

            <textarea
              style={textarea}
              placeholder={t('adminPanel.summary_en')}
              value={form.summaryEn}
              onChange={(e) =>
                set('summaryEn', e.target.value)
              }
            />

            <textarea
              style={textarea}
              placeholder={t('adminPanel.content_ar')}
              value={form.contentAr}
              onChange={(e) =>
                set('contentAr', e.target.value)
              }
            />

            <textarea
              style={textarea}
              placeholder={t('adminPanel.content_en')}
              value={form.contentEn}
              onChange={(e) =>
                set('contentEn', e.target.value)
              }
            />

            <textarea
              style={textarea}
              placeholder={t('adminPanel.recommendations_ar')}
              value={form.recommendationsAr}
              onChange={(e) =>
                set(
                  'recommendationsAr',
                  e.target.value
                )
              }
            />

            <textarea
              style={textarea}
              placeholder={t('adminPanel.recommendations_en')}
              value={form.recommendationsEn}
              onChange={(e) =>
                set(
                  'recommendationsEn',
                  e.target.value
                )
              }
            />

            <div style={modalActions}>
              <button
                type="button"
                onClick={save}
                style={saveBtn}
              >
                {t('adminPanel.save')}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={cancelBtn}
              >
                {t('adminPanel.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NAVY = '#0f172a';
const DARK = '#1e293b';
const TEXT = '#475569';
const MUTED = '#64748b';
const BORDER = '#e2e8f0';
const BLUE = '#2563eb';

const container = {
  maxWidth: '920px',
  margin: '0 auto',
};

const pageHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 20,
  marginBottom: 24,
};

const titleStyle = {
  margin: 0,
  color: NAVY,
  fontSize: 24,
  fontWeight: 700,
};

const hint = {
  margin: '6px 0 0',
  color: TEXT,
  fontSize: 14,
};

const addBtn = {
  background: BLUE,
  color: '#fff',
  border: 'none',
  padding: '11px 17px',
  borderRadius: 9,
  cursor: 'pointer',
  fontWeight: 600,
  boxShadow: '0 3px 8px rgba(37,99,235,0.20)',
};

const list = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const card = {
  background: '#fff',
  padding: 16,
  borderRadius: 12,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 16,
  border: `1px solid ${BORDER}`,
  boxShadow: '0 3px 12px rgba(15,23,42,0.06)',
};

const contentArea = {
  flex: 1,
  minWidth: 0,
};

const cardTitle = {
  margin: '0 0 8px',
  color: DARK,
  fontSize: 16,
  fontWeight: 700,
};

const cardDescription = {
  color: TEXT,
  margin: '0 0 8px',
  lineHeight: 1.6,
  fontSize: 14,
};

const dateStyle = {
  color: MUTED,
  fontSize: 12,
  fontWeight: 500,
};

const actions = {
  display: 'flex',
  gap: 8,
  flexShrink: 0,
};

const editBtn = {
  background: '#0284c7',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const deleteBtn = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const emptyState = {
  background: '#fff',
  border: `1px solid ${BORDER}`,
  borderRadius: 12,
  padding: 20,
  textAlign: 'center',
  color: MUTED,
};

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,23,42,0.55)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: 20,
};

const modal = {
  background: '#fff',
  padding: 22,
  borderRadius: 14,
  width: 'min(900px, 96vw)',
  maxHeight: '90vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  boxShadow: '0 20px 50px rgba(15,23,42,0.25)',
};

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const modalTitle = {
  margin: 0,
  color: NAVY,
  fontSize: 20,
};

const closeBtn = {
  border: 'none',
  background: '#f1f5f9',
  color: DARK,
  width: 34,
  height: 34,
  borderRadius: 8,
  fontSize: 22,
  cursor: 'pointer',
};

const grid2 = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 10,
};

const input = {
  padding: 11,
  borderRadius: 8,
  border: `1px solid ${BORDER}`,
  color: DARK,
  background: '#fff',
  outline: 'none',
  fontSize: 14,
};

const textarea = {
  padding: 11,
  borderRadius: 8,
  border: `1px solid ${BORDER}`,
  color: DARK,
  background: '#fff',
  minHeight: 80,
  resize: 'vertical',
  outline: 'none',
  fontSize: 14,
  lineHeight: 1.5,
};

const modalActions = {
  display: 'flex',
  gap: 10,
  marginTop: 4,
};

const saveBtn = {
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const cancelBtn = {
  background: '#e2e8f0',
  color: DARK,
  border: 'none',
  padding: '10px 15px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

export default ManageNews;