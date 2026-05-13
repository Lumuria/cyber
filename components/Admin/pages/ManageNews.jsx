import { useState } from 'react';
import { useContent } from '../../Context/ContentContext';

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
      recommendationsAr: (item.recommendations || []).map((x) => x?.ar || '').join('\n'),
      recommendationsEn: (item.recommendations || []).map((x) => x?.en || '').join('\n'),
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
    const recommendations = recAr.map((ar, i) => ({ ar, en: recEn[i] || recEn[0] || ar }));

    return {
      title: { ar: form.titleAr.trim(), en: form.titleEn.trim() },
      summary: { ar: form.summaryAr.trim(), en: form.summaryEn.trim() },
      content: { ar: form.contentAr.trim(), en: form.contentEn.trim() },
      category: { ar: form.categoryAr.trim(), en: form.categoryEn.trim() },
      severity: { ar: form.severityAr.trim(), en: form.severityEn.trim() },
      source: { ar: form.sourceAr.trim(), en: form.sourceEn.trim() },
      date: form.date || new Date().toISOString().slice(0, 10),
      recommendations,
    };
  };

  const save = () => {
    if (!form.titleAr.trim() || !form.titleEn.trim()) return;
    const payload = buildPayload();

    if (editingId) updateItem('news', editingId, payload);
    else addItem('news', payload);

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div style={container}>
      <h2 style={titleStyle}>Manage News</h2>
      <button type="button" style={addBtn} onClick={openCreate}>
        + Add News
      </button>

      <div style={list}>
        {news.length === 0 && <p>No news yet.</p>}

        {news.map((item) => (
          <div key={item.id} style={card}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px' }}>{item.title?.en || item.title?.ar}</h4>
              <p style={{ color: '#555', margin: '0 0 8px' }}>{item.summary?.en || '-'}</p>
              <small style={{ color: '#94a3b8' }}>{item.date || '-'}</small>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => openEdit(item)} style={editBtn}>
                Edit
              </button>
              <button type="button" onClick={() => deleteItem('news', item.id)} style={deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={overlay} role="presentation" onClick={() => setShowModal(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit News' : 'Add News'}</h3>

            <div style={grid2}>
              <input style={input} placeholder="Title (AR)" value={form.titleAr} onChange={(e) => set('titleAr', e.target.value)} />
              <input style={input} placeholder="Title (EN)" value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
              <input style={input} placeholder="Category (AR)" value={form.categoryAr} onChange={(e) => set('categoryAr', e.target.value)} />
              <input style={input} placeholder="Category (EN)" value={form.categoryEn} onChange={(e) => set('categoryEn', e.target.value)} />
              <input style={input} placeholder="Severity (AR)" value={form.severityAr} onChange={(e) => set('severityAr', e.target.value)} />
              <input style={input} placeholder="Severity (EN)" value={form.severityEn} onChange={(e) => set('severityEn', e.target.value)} />
              <input style={input} placeholder="Source (AR)" value={form.sourceAr} onChange={(e) => set('sourceAr', e.target.value)} />
              <input style={input} placeholder="Source (EN)" value={form.sourceEn} onChange={(e) => set('sourceEn', e.target.value)} />
              <input style={input} type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>

            <textarea style={textarea} placeholder="Summary (AR)" value={form.summaryAr} onChange={(e) => set('summaryAr', e.target.value)} />
            <textarea style={textarea} placeholder="Summary (EN)" value={form.summaryEn} onChange={(e) => set('summaryEn', e.target.value)} />
            <textarea style={textarea} placeholder="Content (AR)" value={form.contentAr} onChange={(e) => set('contentAr', e.target.value)} />
            <textarea style={textarea} placeholder="Content (EN)" value={form.contentEn} onChange={(e) => set('contentEn', e.target.value)} />
            <textarea style={textarea} placeholder="Recommendations (AR, one per line)" value={form.recommendationsAr} onChange={(e) => set('recommendationsAr', e.target.value)} />
            <textarea style={textarea} placeholder="Recommendations (EN, one per line)" value={form.recommendationsEn} onChange={(e) => set('recommendationsEn', e.target.value)} />

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={save} style={saveBtn}>
                Save
              </button>
              <button type="button" onClick={() => setShowModal(false)} style={cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const container = { maxWidth: '900px', margin: '0 auto' };
const titleStyle = { marginBottom: '20px', textAlign: 'center' };
const addBtn = {
  marginBottom: '20px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '10px',
  cursor: 'pointer',
};
const list = { display: 'flex', flexDirection: 'column', gap: '12px' };
const card = {
  background: '#fff',
  padding: '15px',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  gap: 12,
};
const editBtn = {
  background: '#0ea5e9',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
};
const deleteBtn = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
};
const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};
const modal = {
  background: '#fff',
  padding: '20px',
  borderRadius: '12px',
  width: 'min(900px, 96vw)',
  maxHeight: '90vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};
const grid2 = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 8,
};
const input = { padding: '10px', borderRadius: '8px', border: '1px solid #ccc' };
const textarea = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  minHeight: 80,
  resize: 'vertical',
};
const saveBtn = {
  background: '#22c55e',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
};
const cancelBtn = {
  background: '#ccc',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
};

export default ManageNews;
