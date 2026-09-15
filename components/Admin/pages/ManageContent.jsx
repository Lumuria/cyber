import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContent } from '../../Context/ContentContext';

const COLLECTIONS = [
  {
    key: 'attacks',
    labelKey: 'adminPanel.attacks_tab',
  },
  {
    key: 'prevention',
    labelKey: 'adminPanel.prevention_tab',
  },
  {
    key: 'incidents',
    labelKey: 'adminPanel.incidents_tab',
  },
  {
    key: 'awareness',
    labelKey: 'adminPanel.awareness_tab',
  },
  {
    key: 'tools',
    labelKey: 'adminPanel.tools_tab',
  },
];

const TEMPLATES = {
  attacks: {
    name: 'NewAttack',
    title: {
      ar: 'عنوان عربي',
      en: 'English title',
    },
    date: {
      ar: 'مايو 2026',
      en: 'May 2026',
    },
    type: {
      ar: 'نوع',
      en: 'Type',
    },
    target: {
      ar: 'الهدف',
      en: 'Target',
    },
    damage: {
      ar: 'الأثر',
      en: 'Impact',
    },
    description: {
      ar: 'وصف',
      en: 'Description',
    },
    prevention: {
      ar: 'وقاية',
      en: 'Prevention',
    },
    detection: {
      ar: 'كشف',
      en: 'Detection',
    },
    solution: {
      ar: 'حلول',
      en: 'Solutions',
    },
    severity: {
      ar: 'عالية',
      en: 'High',
    },
    color: 'bg-red-500',
  },

  prevention: {
    title: {
      ar: 'عنوان عربي',
      en: 'English title',
    },
    category: {
      ar: 'فئة',
      en: 'Category',
    },
    description: {
      ar: 'وصف',
      en: 'Description',
    },
    tips: [
      {
        ar: 'نصيحة 1',
        en: 'Tip 1',
      },
    ],
    importance: {
      ar: 'عالية',
      en: 'High',
    },
    difficulty: {
      ar: 'متوسط',
      en: 'Medium',
    },
  },

  incidents: {
    year: 2026,
    title: {
      ar: 'عنوان عربي',
      en: 'English title',
    },
    impact: {
      ar: 'الأثر',
      en: 'Impact',
    },
    lesson: {
      ar: 'الدرس المستفاد',
      en: 'Lesson learned',
    },
    level: 'high',
  },

  awareness: {
    title: {
      ar: 'عنوان عربي',
      en: 'English title',
    },
    duration: {
      ar: '7 أيام',
      en: '7 days',
    },
    modules: [
      {
        ar: 'موضوع',
        en: 'Module',
      },
    ],
  },

  tools: {
    title: {
      ar: 'عنوان',
      en: 'Title',
    },
    description: {
      ar: 'وصف',
      en: 'Description',
    },
  },
};

function getLabel(item) {
  if (item?.title?.en) {
    return item.title.en;
  }

  if (item?.title?.ar) {
    return item.title.ar;
  }

  if (item?.name) {
    return item.name;
  }

  return String(item?.id || 'Untitled');
}

export default function ManageContent() {
  const { t } = useTranslation();

  const {
    attacks,
    prevention,
    incidents,
    awareness,
    tools,
    addItem,
    updateItem,
    deleteItem,
  } = useContent();

  const [active, setActive] = useState('attacks');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  const dataByKey = useMemo(
    () => ({
      attacks,
      prevention,
      incidents,
      awareness,
      tools,
    }),
    [
      attacks,
      prevention,
      incidents,
      awareness,
      tools,
    ]
  );

  const currentList = dataByKey[active] || [];

  const getActiveLabel = () => {
    const collection = COLLECTIONS.find(
      (item) => item.key === active
    );

    return collection
      ? t(collection.labelKey)
      : active;
  };

  const openAdd = () => {
    setEditingId(null);
    setError('');

    setJsonText(
      JSON.stringify(
        TEMPLATES[active],
        null,
        2
      )
    );

    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setError('');

    const clone = {
      ...item,
    };

    delete clone.id;

    setJsonText(
      JSON.stringify(
        clone,
        null,
        2
      )
    );

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setJsonText('');
    setError('');
    setEditingId(null);
  };

  const save = async () => {
    try {
      const parsed = JSON.parse(jsonText);

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      ) {
        setError(
          t('adminPanel.json_object_error')
        );
        return;
      }

      setError('');

      if (editingId) {
        await updateItem(
          active,
          editingId,
          parsed
        );
      } else {
        await addItem(
          active,
          parsed
        );
      }

      closeModal();
    } catch (err) {
      console.error(
        'Save content failed:',
        err
      );

      setError(
        err?.message ||
          t('adminPanel.server_connection_error')
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t('adminPanel.delete_confirm') ||
        'Are you sure you want to delete this item?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteItem(
        active,
        id
      );
    } catch (err) {
      console.error(
        'Delete content failed:',
        err
      );

      window.alert(
        err?.message ||
          t('adminPanel.server_connection_error')
      );
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>
        {t('adminPanel.manage_sections')}
      </h2>

      <p style={hint}>
        {t(
          'adminPanel.sections_manage_hint'
        )}
      </p>

      <div style={tabs}>
        {COLLECTIONS.map((collection) => (
          <button
            type="button"
            key={collection.key}
            onClick={() =>
              setActive(collection.key)
            }
            style={{
              ...tabBtn,
              ...(active === collection.key
                ? tabBtnActive
                : {}),
            }}
          >
            {t(collection.labelKey)}
          </button>
        ))}
      </div>

      <button
        type="button"
        style={addBtn}
        onClick={openAdd}
      >
        + {t('adminPanel.add_item')}{' '}
        {getActiveLabel()}
      </button>

      <div style={list}>
        {currentList.length === 0 && (
          <p style={emptyText}>
            {t('adminPanel.no_items')}
          </p>
        )}

        {currentList.map((item) => (
          <div
            key={item.id}
            style={card}
          >
            <div style={itemInfo}>
              <h4 style={itemTitle}>
                {getLabel(item)}
              </h4>

              <small style={itemId}>
                ID: {String(item.id)}
              </small>
            </div>

            <div style={actions}>
              <button
                type="button"
                style={editBtn}
                onClick={() =>
                  openEdit(item)
                }
              >
                {t('adminPanel.edit')}
              </button>

              <button
                type="button"
                style={deleteBtn}
                onClick={() =>
                  handleDelete(item.id)
                }
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
          onClick={closeModal}
        >
          <div
            style={modal}
            role="dialog"
            aria-modal="true"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <h3 style={modalTitle}>
              {editingId
                ? t('adminPanel.edit_item')
                : t('adminPanel.add_item')}
            </h3>

            <p style={modalHint}>
              {t('adminPanel.json_hint')}{' '}
              <strong>ar</strong>{' '}
              {t('adminPanel.and')}{' '}
              <strong>en</strong>{' '}
              {t('adminPanel.values')}.
            </p>

            <textarea
              style={textarea}
              value={jsonText}
              onChange={(event) =>
                setJsonText(
                  event.target.value
                )
              }
            />

            {error && (
              <p style={errorText}>
                {error}
              </p>
            )}

            <div style={modalActions}>
              <button
                type="button"
                style={saveBtn}
                onClick={save}
              >
                {t('adminPanel.save')}
              </button>

              <button
                type="button"
                style={cancelBtn}
                onClick={closeModal}
              >
                {t('adminPanel.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const container = {
  maxWidth: '920px',
  margin: '0 auto',
};

const title = {
  margin: '0 0 8px',
  color: '#0f172a',
  fontSize: 24,
  fontWeight: 700,
};

const hint = {
  marginTop: 0,
  marginBottom: 16,
  color: '#334155',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: 1.6,
};

const tabs = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  marginBottom: 12,
};

const tabBtn = {
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#1e293b',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
};

const tabBtnActive = {
  background: '#2563eb',
  color: '#ffffff',
  borderColor: '#2563eb',
};

const addBtn = {
  marginBottom: 16,
  background: '#2563eb',
  color: '#ffffff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
};

const list = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const emptyText = {
  color: '#475569',
  fontSize: 14,
  fontWeight: 500,
};

const card = {
  background: '#ffffff',
  padding: 14,
  borderRadius: 12,
  boxShadow:
    '0 2px 10px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
};

const itemInfo = {
  display: 'flex',
  flexDirection: 'column',
};

const itemTitle = {
  margin: '0 0 6px',
  color: '#1e293b',
  fontWeight: 700,
  fontSize: 16,
};

const itemId = {
  color: '#475569',
  fontSize: 13,
  fontWeight: 500,
};

const actions = {
  display: 'flex',
  gap: 8,
};

const editBtn = {
  background: '#0ea5e9',
  color: '#ffffff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const deleteBtn = {
  background: '#ef4444',
  color: '#ffffff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const overlay = {
  position: 'fixed',
  inset: 0,
  background:
    'rgba(15, 23, 42, 0.55)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1100,
  padding: 20,
};

const modal = {
  background: '#ffffff',
  borderRadius: 12,
  width: 'min(760px, 95vw)',
  padding: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  boxShadow:
    '0 10px 35px rgba(0, 0, 0, 0.2)',
};

const modalTitle = {
  margin: '0 0 2px',
  color: '#0f172a',
  fontSize: 20,
  fontWeight: 700,
};

const modalHint = {
  margin: 0,
  color: '#475569',
  fontSize: 13,
  lineHeight: 1.6,
};

const textarea = {
  width: '100%',
  minHeight: 320,
  boxSizing: 'border-box',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: 10,
  fontFamily:
    'Consolas, "Courier New", monospace',
  fontSize: 13,
  color: '#0f172a',
  background: '#f8fafc',
  outline: 'none',
  resize: 'vertical',
};

const modalActions = {
  display: 'flex',
  gap: 10,
  marginTop: 4,
};

const saveBtn = {
  background: '#16a34a',
  color: '#ffffff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const cancelBtn = {
  background: '#e2e8f0',
  color: '#1e293b',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
};

const errorText = {
  color: '#dc2626',
  margin: 0,
  fontSize: 13,
  fontWeight: 500,
};