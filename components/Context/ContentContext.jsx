import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import attacksDefault from '../../data/attacksData';
import preventionDefault from '../../data/preventionData';
import { incidentsData as incidentsDefault } from '../../data/incidentsData';
import { awarenessTracksData as awarenessDefault } from '../../data/awarenessTracksData';
import { newsData as newsDefault } from '../../data/newsData';
import { toolsContentData as toolsDefault } from '../../data/toolsContentData';

const STORAGE_KEY = 'threatiq_content_v1';

const defaults = {
  news: newsDefault,
  attacks: attacksDefault,
  prevention: preventionDefault,
  incidents: incidentsDefault,
  awareness: awarenessDefault,
  tools: toolsDefault,
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return deepClone(defaults);
    const parsed = JSON.parse(raw);
    return {
      news: Array.isArray(parsed.news) ? parsed.news : deepClone(defaults.news),
      attacks: Array.isArray(parsed.attacks) ? parsed.attacks : deepClone(defaults.attacks),
      prevention: Array.isArray(parsed.prevention)
        ? parsed.prevention
        : deepClone(defaults.prevention),
      incidents: Array.isArray(parsed.incidents)
        ? parsed.incidents
        : deepClone(defaults.incidents),
      awareness: Array.isArray(parsed.awareness)
        ? parsed.awareness
        : deepClone(defaults.awareness),
      tools: Array.isArray(parsed.tools) ? parsed.tools : deepClone(defaults.tools),
    };
  } catch {
    return deepClone(defaults);
  }
}

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [state, setState] = useState(() => loadContent());

  const commit = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addItem = useCallback(
    (collection, item) => {
      const id = `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const newItem = { id, ...item };
      commit((s) => ({ ...s, [collection]: [newItem, ...(s[collection] || [])] }));
      return newItem;
    },
    [commit]
  );

  const updateItem = useCallback(
    (collection, id, patch) => {
      commit((s) => ({
        ...s,
        [collection]: (s[collection] || []).map((item) =>
          String(item.id) === String(id) ? { ...item, ...patch, id: item.id } : item
        ),
      }));
    },
    [commit]
  );

  const deleteItem = useCallback(
    (collection, id) => {
      commit((s) => ({
        ...s,
        [collection]: (s[collection] || []).filter((item) => String(item.id) !== String(id)),
      }));
    },
    [commit]
  );

  const value = useMemo(
    () => ({
      ...state,
      addItem,
      updateItem,
      deleteItem,
    }),
    [state, addItem, updateItem, deleteItem]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
