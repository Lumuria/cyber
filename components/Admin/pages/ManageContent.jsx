import { useMemo, useState } from 'react';
import { useContent } from '../../Context/ContentContext';

const COLLECTIONS = [
  { key: 'attacks', label: 'Attacks' },
  { key: 'prevention', label: 'Prevention' },
  { key: 'incidents', label: 'Incidents' },
  { key: 'awareness', label: 'Awareness' },
  { key: 'tools', label: 'Tools' },
];

const TEMPLATES = {
  attacks: {
    name: 'NewAttack',
    title: { ar: 'عنوان عربي', en: 'English title' },
    date: { ar: 'مايو 2026', en: 'May 2026' },
    type: { ar: 'نوع', en: 'Type' },
    target: { ar: 'الهدف', en: 'Target' },
    damage: { ar: 'الأثر', en: 'Impact' },
    description: { ar: 'وصف', en: 'Description' },
    prevention: { ar: 'وقاية', en: 'Prevention' },
    detection: { ar: 'كشف', en: 'Detection' },
    solution: { ar: 'حلول', en: 'Solutions' },
    severity: { ar: 'عالية', en: 'High' },
    color: 'bg-red-500',
  },
  prevention: {
    title: { ar: 'عنوان عربي', en: 'English title' },
    category: { ar: 'فئة', en: 'Category' },
    description: { ar: 'وصف', en: 'Description' },
    tips: [{ ar: 'نصيحة 1', en: 'Tip 1' }],
    importance: { ar: 'عالية', en: 'High' },
    difficulty: { ar: 'متوسط', en: 'Medium' },
  },
  incidents: {
    year: 2026,
    title: { ar: 'عنوان عربي', en: 'English title' },
    impact: { ar: 'الأثر', en: 'Impact' },
    lesson: { ar: 'الدرس المستفاد', en: 'Lesson learned' },
    level: 'high',
  },
  awareness: {
    title: { ar: 'عنوان عربي', en: 'English title' },
    duration: { ar: '7 أيام', en: '7 days' },
    modules: [{ ar: 'موضوع', en: 'Module' }],
  },
  tools: {
    title: { ar: 'عنوان', en: 'Title' },
    description: { ar: 'وصف', en: 'Description' },
  },
};

function getLabel(item) {
  if (item?.title?.en) return item.title.en;
  if (item?.title?.ar) return item.title.ar;
  if (item?.name) return item.name;
  return String(item?.id || 'Untitled');
}

export default function ManageContent() {
  const { attacks, prevention, incidents, awareness, tools, addItem, updateItem, deleteItem } =
    useContent();
  const [active, setActive] = useState('attacks');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  const dataByKey = useMemo(
    () => ({ attacks, prevention, incidents, awareness, tools }),
    [attacks, prevention, incidents, awareness, tools]
  );

  const currentList = dataByKey[active] || [];

  const openAdd = () => {
    setEditingId(null);
    setError('');
    setJsonText(JSON.stringify(TEMPLATES[active], null, 2));
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setError('');
    const clone = { ...item };
    delete clone.id;
    setJsonText(JSON.stringify(clone, null, 2));
    setShowModal(true);
  };

  const save = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setError('JSON must be an object.');
        return;
      }
      if (editingId) {
        updateItem(active, editingId, parsed);
      } else {
        addItem(active, parsed);
      }
      setShowModal(false);
      setJsonText('');
      setError('');
    } catch {
      setError('Invalid JSON format.');
    }
  };

  return (
    <div style={container}>
      <h2 style={{ marginBottom: 8 }}>Manage Sections Content</h2>
      <p style={hint}>
        Admin can add, edit, and delete all section records (Attacks, Prevention, Incidents,
        Awareness).
      </p>

      <div style={tabs}>
        {COLLECTIONS.map((c) => (
          <button
            type="button"
            key={c.key}
            onClick={() => setActive(c.key)}
            style={{
              ...tabBtn,
              ...(active === c.key ? tabBtnActive : {}),
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <button type="button" style={addBtn} onClick={openAdd}>
        + Add {active}
      </button>

      <div style={list}>
        {currentList.length === 0 && <p style={{ color: '#64748b' }}>No items yet.</p>}
        {currentList.map((item) => (
          <div key={item.id} style={card}>
            <div>
              <h4 style={{ margin: '0 0 6px' }}>{getLabel(item)}</h4>
              <small style={{ color: '#94a3b8' }}>ID: {String(item.id)}</small>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" style={editBtn} onClick={() => openEdit(item)}>
                Edit
              </button>
              <button type="button" style={deleteBtn} onClick={() => deleteItem(active, item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={overlay} role="presentation" onClick={() => setShowModal(false)}>
          <div style={modal} role="dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 10px' }}>{editingId ? 'Edit Item' : 'Add Item'}</h3>
            <p style={{ marginTop: 0, color: '#64748b', fontSize: 13 }}>
              Edit fields as JSON. Keep `ar` and `en` values for bilingual content.
            </p>

            <textarea
              style={textarea}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
            {error && <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" style={saveBtn} onClick={save}>
                Save
              </button>
              <button type="button" style={cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const container = { maxWidth: '920px', margin: '0 auto' };
const hint = { marginTop: 0, color: '#64748b', fontSize: 14 };
const tabs = { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 };
const tabBtn = {
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};
const tabBtnActive = { background: '#2563eb', color: '#fff', borderColor: '#2563eb' };
const addBtn = {
  marginBottom: '16px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '10px',
  cursor: 'pointer',
};
const list = { display: 'flex', flexDirection: 'column', gap: 12 };
const card = {
  background: '#fff',
  padding: 14,
  borderRadius: 12,
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
};
const editBtn = {
  background: '#0ea5e9',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
};
const deleteBtn = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
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
  zIndex: 1100,
};
const modal = {
  background: '#fff',
  borderRadius: 12,
  width: 'min(760px, 95vw)',
  padding: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};
const textarea = {
  width: '100%',
  minHeight: '320px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: 10,
  fontFamily: 'Consolas, monospace',
  fontSize: 13,
};
const saveBtn = {
  background: '#16a34a',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 8,
  cursor: 'pointer',
};
const cancelBtn = {
  background: '#e2e8f0',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 8,
  cursor: 'pointer',
};
