import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import attacksDefault from '../../data/attacksData';
import preventionDefault from '../../data/preventionData';
import { incidentsData as incidentsDefault } from '../../data/incidentsData';
import { awarenessTracksData as awarenessDefault } from '../../data/awarenessTracksData';
import { newsData as newsDefault } from '../../data/newsData';
import { toolsContentData as toolsDefault } from '../../data/toolsContentData';
import { API_URL } from '../../services/apiConfig';

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

    if (!raw) {
      return deepClone(defaults);
    }

    const parsed = JSON.parse(raw);

    return {
      news: Array.isArray(parsed.news)
        ? parsed.news
        : deepClone(defaults.news),

      attacks: Array.isArray(parsed.attacks)
        ? parsed.attacks
        : deepClone(defaults.attacks),

      prevention: Array.isArray(parsed.prevention)
        ? parsed.prevention
        : deepClone(defaults.prevention),

      incidents: Array.isArray(parsed.incidents)
        ? parsed.incidents
        : deepClone(defaults.incidents),

      awareness: Array.isArray(parsed.awareness)
        ? parsed.awareness
        : deepClone(defaults.awareness),

      tools: Array.isArray(parsed.tools)
        ? parsed.tools
        : deepClone(defaults.tools),
    };
  } catch (error) {
    console.error(
      'Failed to load local content:',
      error
    );

    return deepClone(defaults);
  }
}

/* =========================
   ATTACKS
========================= */

function formatAttack(item) {
  if (!item) {
    return null;
  }

  const translations = Array.isArray(
    item.translations
  )
    ? item.translations.reduce(
        (result, translation) => {
          if (translation?.language) {
            result[translation.language] =
              translation;
          }

          return result;
        },
        {}
      )
    : {};

  const ar = translations.ar || {};
  const en = translations.en || {};

  return {
    id: item.id,

    name: item.name ?? '',

    color: item.color ?? '',

    title: {
      ar:
        ar.title ??
        item.title?.ar ??
        '',

      en:
        en.title ??
        item.title?.en ??
        '',
    },

    date: {
      ar:
        ar.date ??
        item.date?.ar ??
        '',

      en:
        en.date ??
        item.date?.en ??
        '',
    },

    type: {
      ar:
        ar.type ??
        item.type?.ar ??
        '',

      en:
        en.type ??
        item.type?.en ??
        '',
    },

    target: {
      ar:
        ar.target ??
        item.target?.ar ??
        '',

      en:
        en.target ??
        item.target?.en ??
        '',
    },

    damage: {
      ar:
        ar.damage ??
        item.damage?.ar ??
        '',

      en:
        en.damage ??
        item.damage?.en ??
        '',
    },

    description: {
      ar:
        ar.description ??
        item.description?.ar ??
        '',

      en:
        en.description ??
        item.description?.en ??
        '',
    },

    prevention: {
      ar:
        ar.prevention ??
        item.prevention?.ar ??
        '',

      en:
        en.prevention ??
        item.prevention?.en ??
        '',
    },

    detection: {
      ar:
        ar.detection ??
        item.detection?.ar ??
        '',

      en:
        en.detection ??
        item.detection?.en ??
        '',
    },

    solution: {
      ar:
        ar.solution ??
        item.solution?.ar ??
        '',

      en:
        en.solution ??
        item.solution?.en ??
        '',
    },

    severity: {
      ar:
        ar.severity ??
        item.severity?.ar ??
        '',

      en:
        en.severity ??
        item.severity?.en ??
        '',
    },
  };
}

/* =========================
   NEWS
========================= */

function formatNews(item) {
  if (!item) {
    return null;
  }

  let recommendations = item.recommendations;

  if (typeof recommendations === 'string') {
    try {
      recommendations = JSON.parse(
        recommendations
      );
    } catch (error) {
      console.error(
        'Failed to parse news recommendations:',
        error
      );

      recommendations = [];
    }
  }

  if (!Array.isArray(recommendations)) {
    recommendations = [];
  }

  return {
    id: item.id,

    title: {
      ar:
        item.title?.ar ??
        item.title_ar ??
        '',

      en:
        item.title?.en ??
        item.title_en ??
        '',
    },

    summary: {
      ar:
        item.summary?.ar ??
        item.summary_ar ??
        '',

      en:
        item.summary?.en ??
        item.summary_en ??
        '',
    },

    content: {
      ar:
        item.content?.ar ??
        item.content_ar ??
        '',

      en:
        item.content?.en ??
        item.content_en ??
        '',
    },

    category: {
      ar:
        item.category?.ar ??
        item.category_ar ??
        '',

      en:
        item.category?.en ??
        item.category_en ??
        '',
    },

    severity: {
      ar:
        item.severity?.ar ??
        item.severity_ar ??
        '',

      en:
        item.severity?.en ??
        item.severity_en ??
        '',
    },

    source: {
      ar:
        item.source?.ar ??
        item.source_ar ??
        '',

      en:
        item.source?.en ??
        item.source_en ??
        '',
    },

    date: item.date ?? '',

    recommendations:
      recommendations.map(
        (recommendation) => ({
          ar: recommendation?.ar ?? '',
          en: recommendation?.en ?? '',
        })
      ),
  };
}

function prepareNewsPayload(item) {
  return {
    title: {
      ar:
        item?.title?.ar ??
        item?.title_ar ??
        '',

      en:
        item?.title?.en ??
        item?.title_en ??
        '',
    },

    summary: {
      ar:
        item?.summary?.ar ??
        item?.summary_ar ??
        '',

      en:
        item?.summary?.en ??
        item?.summary_en ??
        '',
    },

    content: {
      ar:
        item?.content?.ar ??
        item?.content_ar ??
        '',

      en:
        item?.content?.en ??
        item?.content_en ??
        '',
    },

    category: {
      ar:
        item?.category?.ar ??
        item?.category_ar ??
        '',

      en:
        item?.category?.en ??
        item?.category_en ??
        '',
    },

    severity: {
      ar:
        item?.severity?.ar ??
        item?.severity_ar ??
        '',

      en:
        item?.severity?.en ??
        item?.severity_en ??
        '',
    },

    source: {
      ar:
        item?.source?.ar ??
        item?.source_ar ??
        '',

      en:
        item?.source?.en ??
        item?.source_en ??
        '',
    },

    date:
      item?.date ??
      new Date()
        .toISOString()
        .slice(0, 10),

    recommendations:
      Array.isArray(
        item?.recommendations
      )
        ? item.recommendations.map(
            (recommendation) => ({
              ar:
                recommendation?.ar ??
                '',

              en:
                recommendation?.en ??
                '',
            })
          )
        : [],
  };
}

/* =========================
   INCIDENTS
========================= */

function formatIncident(incident) {
  if (!incident) {
    return null;
  }

  return {
    id: incident.id,

    year:
      incident.year ||
      (incident.created_at
        ? new Date(
            incident.created_at
          ).getFullYear()
        : ''),

    level: (
      incident.severity_en ||
      incident.severity?.en ||
      incident.level ||
      ''
    )
      .toString()
      .toLowerCase(),

    title: {
      ar:
        incident.type_ar ||
        incident.type?.ar ||
        incident.title?.ar ||
        '',

      en:
        incident.type_en ||
        incident.type?.en ||
        incident.title?.en ||
        '',
    },

    impact: {
      ar:
        incident.description_ar ||
        incident.description?.ar ||
        incident.impact?.ar ||
        '',

      en:
        incident.description_en ||
        incident.description?.en ||
        incident.impact?.en ||
        '',
    },

    lesson: {
      ar:
        incident.status_ar ||
        incident.status?.ar ||
        incident.lesson?.ar ||
        '',

      en:
        incident.status_en ||
        incident.status?.en ||
        incident.lesson?.en ||
        '',
    },
  };
}

function prepareIncidentPayload(item) {
  return {
    type: {
      ar:
        item?.type?.ar ??
        item?.type_ar ??
        item?.title?.ar ??
        '',

      en:
        item?.type?.en ??
        item?.type_en ??
        item?.title?.en ??
        '',
    },

    severity: {
      ar:
        item?.severity?.ar ??
        item?.severity_ar ??
        item?.level?.ar ??
        item?.level ??
        '',

      en:
        item?.severity?.en ??
        item?.severity_en ??
        item?.level?.en ??
        item?.level ??
        '',
    },

    status: {
      ar:
        item?.status?.ar ??
        item?.status_ar ??
        item?.lesson?.ar ??
        '',

      en:
        item?.status?.en ??
        item?.status_en ??
        item?.lesson?.en ??
        '',
    },

    description: {
      ar:
        item?.description?.ar ??
        item?.description_ar ??
        item?.impact?.ar ??
        '',

      en:
        item?.description?.en ??
        item?.description_en ??
        item?.impact?.en ??
        '',
    },
  };
}

/* =========================
   AWARENESS
========================= */

function formatAwareness(item) {
  if (!item) {
    return null;
  }

  let modules = item.modules;

  if (typeof modules === 'string') {
    try {
      modules = JSON.parse(modules);
    } catch (error) {
      console.error(
        'Failed to parse awareness modules:',
        error
      );

      modules = [];
    }
  }

  if (!Array.isArray(modules)) {
    modules = [];
  }

  return {
    id: item.id,

    title: {
      ar:
        item.title?.ar ??
        item.title_ar ??
        '',

      en:
        item.title?.en ??
        item.title_en ??
        '',
    },

    duration: {
      ar:
        item.duration?.ar ??
        item.duration_ar ??
        '',

      en:
        item.duration?.en ??
        item.duration_en ??
        '',
    },

    modules:
      modules.map(
        (module) => ({
          ar: module?.ar ?? '',
          en: module?.en ?? '',
        })
      ),
  };
}

function prepareAwarenessPayload(item) {
  return {
    title: {
      ar:
        item?.title?.ar ??
        item?.title_ar ??
        '',

      en:
        item?.title?.en ??
        item?.title_en ??
        '',
    },

    duration: {
      ar:
        item?.duration?.ar ??
        item?.duration_ar ??
        '',

      en:
        item?.duration?.en ??
        item?.duration_en ??
        '',
    },

    modules:
      Array.isArray(item?.modules)
        ? item.modules.map(
            (module) => ({
              ar:
                module?.ar ??
                '',

              en:
                module?.en ??
                '',
            })
          )
        : [],
  };
}

/* =========================
   PREVENTION
========================= */

function itemToPreventionPayload(item) {
  return {
    category:
      item?.category || {
        ar:
          item?.category_ar ||
          '',

        en:
          item?.category_en ||
          '',
      },

    importance:
      item?.importance || {
        ar:
          item?.importance_ar ||
          '',

        en:
          item?.importance_en ||
          '',
      },

    difficulty:
      item?.difficulty || {
        ar:
          item?.difficulty_ar ||
          '',

        en:
          item?.difficulty_en ||
          '',
      },

    title:
      item?.title || {
        ar: '',
        en: '',
      },

    description:
      item?.description || {
        ar: '',
        en: '',
      },

    tips:
      item?.tips || {
        ar: [],
        en: [],
      },
  };
}

/* =========================
   TOOLS
========================= */

function formatTool(item) {
  if (!item) {
    return null;
  }

  return {
    id: item.id,

    title: {
      ar:
        item.title?.ar ??
        item.title_ar ??
        '',

      en:
        item.title?.en ??
        item.title_en ??
        '',
    },

    description: {
      ar:
        item.description?.ar ??
        item.description_ar ??
        '',

      en:
        item.description?.en ??
        item.description_en ??
        '',
    },
  };
}

function prepareToolPayload(item) {
  return {
    title: {
      ar:
        item?.title?.ar ??
        item?.title_ar ??
        '',

      en:
        item?.title?.en ??
        item?.title_en ??
        '',
    },

    description: {
      ar:
        item?.description?.ar ??
        item?.description_ar ??
        '',

      en:
        item?.description?.en ??
        item?.description_en ??
        '',
    },
  };
}

/* =========================
   CONTEXT
========================= */

const ContentContext =
  createContext(null);

export function ContentProvider({
  children,
}) {
  const [state, setState] =
    useState(() => loadContent());

  /* =========================
     LOAD NEWS
  ========================= */

  useEffect(() => {
    const loadNewsFromAPI =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/news`
            );

          if (!response.ok) {
            throw new Error(
              `Failed to load news. HTTP ${response.status}`
            );
          }

          const data =
            await response.json();

          if (Array.isArray(data)) {
            const formattedNews =
              data
                .map(formatNews)
                .filter(Boolean);

            setState((prev) => ({
              ...prev,
              news: formattedNews,
            }));
          }
        } catch (error) {
          console.error(
            'Failed to load news from Laravel API:',
            error
          );
        }
      };

    loadNewsFromAPI();
  }, []);

  /* =========================
     LOAD ATTACKS
  ========================= */

  useEffect(() => {
    const loadAttacksFromAPI =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/attacks`
            );

          if (!response.ok) {
            throw new Error(
              `Failed to load attacks. HTTP ${response.status}`
            );
          }

          const data =
            await response.json();

          if (Array.isArray(data)) {
            const formattedAttacks =
              data
                .map(formatAttack)
                .filter(Boolean);

            setState((prev) => ({
              ...prev,
              attacks:
                formattedAttacks,
            }));
          }
        } catch (error) {
          console.error(
            'Failed to load attacks from Laravel API:',
            error
          );
        }
      };

    loadAttacksFromAPI();
  }, []);

  /* =========================
     LOAD PREVENTION
  ========================= */

  useEffect(() => {
    const loadPreventionFromAPI =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/preventions`
            );

          if (!response.ok) {
            throw new Error(
              `Failed to load prevention. HTTP ${response.status}`
            );
          }

          const data =
            await response.json();

          if (Array.isArray(data)) {
            setState((prev) => ({
              ...prev,
              prevention: data,
            }));
          }
        } catch (error) {
          console.error(
            'Failed to load prevention from Laravel API:',
            error
          );
        }
      };

    loadPreventionFromAPI();
  }, []);

  /* =========================
     LOAD INCIDENTS
  ========================= */

  useEffect(() => {
    const loadIncidentsFromAPI =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/incidents`
            );

          if (!response.ok) {
            throw new Error(
              `Failed to load incidents. HTTP ${response.status}`
            );
          }

          const data =
            await response.json();

          if (Array.isArray(data)) {
            const formattedIncidents =
              data
                .map(formatIncident)
                .filter(Boolean);

            setState((prev) => ({
              ...prev,
              incidents:
                formattedIncidents,
            }));
          }
        } catch (error) {
          console.error(
            'Failed to load incidents from Laravel API:',
            error
          );
        }
      };

    loadIncidentsFromAPI();
  }, []);

  /* =========================
     LOAD AWARENESS
  ========================= */

  useEffect(() => {
    const loadAwarenessFromAPI =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/awareness`
            );

          if (!response.ok) {
            throw new Error(
              `Failed to load awareness. HTTP ${response.status}`
            );
          }

          const data =
            await response.json();

          if (Array.isArray(data)) {
            const formattedAwareness =
              data
                .map(formatAwareness)
                .filter(Boolean);

            setState((prev) => ({
              ...prev,
              awareness:
                formattedAwareness,
            }));
          }
        } catch (error) {
          console.error(
            'Failed to load awareness from Laravel API:',
            error
          );
        }
      };

    loadAwarenessFromAPI();
  }, []);

  /* =========================
     LOAD TOOLS
  ========================= */

  useEffect(() => {
    const loadToolsFromAPI =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/tools`
            );

          if (!response.ok) {
            throw new Error(
              `Failed to load tools. HTTP ${response.status}`
            );
          }

          const data =
            await response.json();

          if (Array.isArray(data)) {
            const formattedTools =
              data
                .map(formatTool)
                .filter(Boolean);

            setState((prev) => ({
              ...prev,
              tools: formattedTools,
            }));
          }
        } catch (error) {
          console.error(
            'Failed to load tools from Laravel API:',
            error
          );
        }
      };

    loadToolsFromAPI();
  }, []);

  /* =========================
     LOCAL STORAGE COMMIT
  ========================= */

  const commit = useCallback(
    (updater) => {
      setState((prev) => {
        const next =
          typeof updater === 'function'
            ? updater(prev)
            : updater;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(next)
        );

        return next;
      });
    },
    []
  );

  /* =========================
     ADD ITEM
  ========================= */

  const addItem = useCallback(
    async (collection, item) => {
      const token =
        localStorage.getItem(
          'auth_token'
        );

      /* NEWS */

      if (collection === 'news') {
        try {
          const payload =
            prepareNewsPayload(item);

          const response =
            await fetch(
              `${API_URL}/news`,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to add news.'
            );
          }

          const savedNews =
            data.news || data;

          const formattedNews =
            formatNews(
              savedNews
            );

          setState((prev) => ({
            ...prev,

            news: [
              formattedNews,
              ...(prev.news || []),
            ],
          }));

          return formattedNews;
        } catch (error) {
          console.error(
            'Add news failed:',
            error
          );

          throw error;
        }
      }

      /* ATTACKS */

      if (collection === 'attacks') {
        try {
          const response =
            await fetch(
              `${API_URL}/attacks`,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    item
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to add attack.'
            );
          }

          const savedAttack =
            data.attack || data;

          const formattedAttack =
            formatAttack(
              savedAttack
            );

          setState((prev) => ({
            ...prev,

            attacks: [
              formattedAttack,
              ...(prev.attacks || []),
            ],
          }));

          return formattedAttack;
        } catch (error) {
          console.error(
            'Add attack failed:',
            error
          );

          throw error;
        }
      }

      /* PREVENTION */

      if (collection === 'prevention') {
        try {
          const response =
            await fetch(
              `${API_URL}/preventions`,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    item
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to add prevention.'
            );
          }

          const savedPrevention =
            data.prevention ||
            data;

          setState((prev) => ({
            ...prev,

            prevention: [
              savedPrevention,
              ...(prev.prevention ||
                []),
            ],
          }));

          return savedPrevention;
        } catch (error) {
          console.error(
            'Add prevention failed:',
            error
          );

          throw error;
        }
      }

      /* INCIDENTS */

      if (collection === 'incidents') {
        try {
          const payload =
            prepareIncidentPayload(
              item
            );

          const response =
            await fetch(
              `${API_URL}/incidents`,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to add incident.'
            );
          }

          const savedIncident =
            data.incident ||
            data;

          const formattedIncident =
            formatIncident(
              savedIncident
            );

          setState((prev) => ({
            ...prev,

            incidents: [
              formattedIncident,
              ...(prev.incidents ||
                []),
            ],
          }));

          return formattedIncident;
        } catch (error) {
          console.error(
            'Add incident failed:',
            error
          );

          throw error;
        }
      }

      /* AWARENESS */

      if (collection === 'awareness') {
        try {
          const payload =
            prepareAwarenessPayload(
              item
            );

          const response =
            await fetch(
              `${API_URL}/awareness`,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to add awareness.'
            );
          }

          const savedAwareness =
            data.awareness ||
            data;

          const formattedAwareness =
            formatAwareness(
              savedAwareness
            );

          setState((prev) => ({
            ...prev,

            awareness: [
              formattedAwareness,
              ...(prev.awareness ||
                []),
            ],
          }));

          return formattedAwareness;
        } catch (error) {
          console.error(
            'Add awareness failed:',
            error
          );

          throw error;
        }
      }

      /* TOOLS */

      if (collection === 'tools') {
        try {
          const payload =
            prepareToolPayload(
              item
            );

          const response =
            await fetch(
              `${API_URL}/tools`,
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to add tool.'
            );
          }

          const savedTool =
            data.tool || data;

          const formattedTool =
            formatTool(
              savedTool
            );

          setState((prev) => ({
            ...prev,

            tools: [
              formattedTool,
              ...(prev.tools || []),
            ],
          }));

          return formattedTool;
        } catch (error) {
          console.error(
            'Add tool failed:',
            error
          );

          throw error;
        }
      }

      /* FALLBACK */

      const id =
        `${collection}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

      const newItem = {
        id,
        ...item,
      };

      commit((s) => ({
        ...s,

        [collection]: [
          newItem,
          ...(s[collection] || []),
        ],
      }));

      return newItem;
    },
    [commit]
  );

  /* =========================
     UPDATE ITEM
  ========================= */

  const updateItem = useCallback(
    async (
      collection,
      id,
      patch
    ) => {
      const token =
        localStorage.getItem(
          'auth_token'
        );

      /* NEWS */

      if (collection === 'news') {
        try {
          const payload =
            prepareNewsPayload(
              patch
            );

          const response =
            await fetch(
              `${API_URL}/news/${id}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to update news.'
            );
          }

          const savedNews =
            data.news || data;

          const formattedNews =
            formatNews(
              savedNews
            );

          setState((prev) => ({
            ...prev,

            news: (
              prev.news || []
            ).map(
              (item) =>
                String(item.id) ===
                String(id)
                  ? formattedNews
                  : item
            ),
          }));

          return formattedNews;
        } catch (error) {
          console.error(
            'Update news failed:',
            error
          );

          throw error;
        }
      }

      /* ATTACKS */

      if (collection === 'attacks') {
        try {
          const response =
            await fetch(
              `${API_URL}/attacks/${id}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    patch
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to update attack.'
            );
          }

          const savedAttack =
            data.attack || data;

          const formattedAttack =
            formatAttack(
              savedAttack
            );

          setState((prev) => ({
            ...prev,

            attacks: (
              prev.attacks || []
            ).map(
              (item) =>
                String(item.id) ===
                String(id)
                  ? formattedAttack
                  : item
            ),
          }));

          return formattedAttack;
        } catch (error) {
          console.error(
            'Update attack failed:',
            error
          );

          throw error;
        }
      }

      /* PREVENTION */

      if (collection === 'prevention') {
        try {
          const payload =
            itemToPreventionPayload(
              patch
            );

          const response =
            await fetch(
              `${API_URL}/preventions/${id}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to update prevention.'
            );
          }

          const savedPrevention =
            data.prevention ||
            data;

          setState((prev) => ({
            ...prev,

            prevention: (
              prev.prevention ||
              []
            ).map(
              (item) =>
                String(item.id) ===
                String(id)
                  ? savedPrevention
                  : item
            ),
          }));

          return savedPrevention;
        } catch (error) {
          console.error(
            'Update prevention failed:',
            error
          );

          throw error;
        }
      }

      /* INCIDENTS */

      if (collection === 'incidents') {
        try {
          const payload =
            prepareIncidentPayload(
              patch
            );

          const response =
            await fetch(
              `${API_URL}/incidents/${id}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to update incident.'
            );
          }

          const savedIncident =
            data.incident ||
            data;

          const formattedIncident =
            formatIncident(
              savedIncident
            );

          setState((prev) => ({
            ...prev,

            incidents: (
              prev.incidents ||
              []
            ).map(
              (item) =>
                String(item.id) ===
                String(id)
                  ? formattedIncident
                  : item
            ),
          }));

          return formattedIncident;
        } catch (error) {
          console.error(
            'Update incident failed:',
            error
          );

          throw error;
        }
      }

      /* AWARENESS */

      if (collection === 'awareness') {
        try {
          const payload =
            prepareAwarenessPayload(
              patch
            );

          const response =
            await fetch(
              `${API_URL}/awareness/${id}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to update awareness.'
            );
          }

          const savedAwareness =
            data.awareness ||
            data;

          const formattedAwareness =
            formatAwareness(
              savedAwareness
            );

          setState((prev) => ({
            ...prev,

            awareness: (
              prev.awareness ||
              []
            ).map(
              (item) =>
                String(item.id) ===
                String(id)
                  ? formattedAwareness
                  : item
            ),
          }));

          return formattedAwareness;
        } catch (error) {
          console.error(
            'Update awareness failed:',
            error
          );

          throw error;
        }
      }

      /* TOOLS */

      if (collection === 'tools') {
        try {
          const payload =
            prepareToolPayload(
              patch
            );

          const response =
            await fetch(
              `${API_URL}/tools/${id}`,
              {
                method: 'PUT',

                headers: {
                  'Content-Type':
                    'application/json',

                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to update tool.'
            );
          }

          const savedTool =
            data.tool || data;

          const formattedTool =
            formatTool(
              savedTool
            );

          setState((prev) => ({
            ...prev,

            tools: (
              prev.tools || []
            ).map(
              (item) =>
                String(item.id) ===
                String(id)
                  ? formattedTool
                  : item
            ),
          }));

          return formattedTool;
        } catch (error) {
          console.error(
            'Update tool failed:',
            error
          );

          throw error;
        }
      }

      /* FALLBACK */

      commit((s) => ({
        ...s,

        [collection]: (
          s[collection] || []
        ).map(
          (item) =>
            String(item.id) ===
            String(id)
              ? {
                  ...item,
                  ...patch,
                  id: item.id,
                }
              : item
        ),
      }));
    },
    [commit]
  );

  /* =========================
     DELETE ITEM
  ========================= */

  const deleteItem = useCallback(
    async (
      collection,
      id
    ) => {
      const token =
        localStorage.getItem(
          'auth_token'
        );

      /* NEWS */

      if (collection === 'news') {
        try {
          const response =
            await fetch(
              `${API_URL}/news/${id}`,
              {
                method: 'DELETE',

                headers: {
                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to delete news.'
            );
          }

          setState((prev) => ({
            ...prev,

            news: (
              prev.news || []
            ).filter(
              (item) =>
                String(item.id) !==
                String(id)
            ),
          }));

          return true;
        } catch (error) {
          console.error(
            'Delete news failed:',
            error
          );

          throw error;
        }
      }

      /* ATTACKS */

      if (collection === 'attacks') {
        try {
          const response =
            await fetch(
              `${API_URL}/attacks/${id}`,
              {
                method: 'DELETE',

                headers: {
                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to delete attack.'
            );
          }

          setState((prev) => ({
            ...prev,

            attacks: (
              prev.attacks || []
            ).filter(
              (item) =>
                String(item.id) !==
                String(id)
            ),
          }));

          return true;
        } catch (error) {
          console.error(
            'Delete attack failed:',
            error
          );

          throw error;
        }
      }

      /* PREVENTION */

      if (collection === 'prevention') {
        try {
          const response =
            await fetch(
              `${API_URL}/preventions/${id}`,
              {
                method: 'DELETE',

                headers: {
                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to delete prevention.'
            );
          }

          setState((prev) => ({
            ...prev,

            prevention: (
              prev.prevention ||
              []
            ).filter(
              (item) =>
                String(item.id) !==
                String(id)
            ),
          }));

          return true;
        } catch (error) {
          console.error(
            'Delete prevention failed:',
            error
          );

          throw error;
        }
      }

      /* INCIDENTS */

      if (collection === 'incidents') {
        try {
          const response =
            await fetch(
              `${API_URL}/incidents/${id}`,
              {
                method: 'DELETE',

                headers: {
                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to delete incident.'
            );
          }

          setState((prev) => ({
            ...prev,

            incidents: (
              prev.incidents ||
              []
            ).filter(
              (item) =>
                String(item.id) !==
                String(id)
            ),
          }));

          return true;
        } catch (error) {
          console.error(
            'Delete incident failed:',
            error
          );

          throw error;
        }
      }

      /* AWARENESS */

      if (collection === 'awareness') {
        try {
          const response =
            await fetch(
              `${API_URL}/awareness/${id}`,
              {
                method: 'DELETE',

                headers: {
                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to delete awareness.'
            );
          }

          setState((prev) => ({
            ...prev,

            awareness: (
              prev.awareness ||
              []
            ).filter(
              (item) =>
                String(item.id) !==
                String(id)
            ),
          }));

          return true;
        } catch (error) {
          console.error(
            'Delete awareness failed:',
            error
          );

          throw error;
        }
      }

      /* TOOLS */

      if (collection === 'tools') {
        try {
          const response =
            await fetch(
              `${API_URL}/tools/${id}`,
              {
                method: 'DELETE',

                headers: {
                  Accept:
                    'application/json',

                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                'Failed to delete tool.'
            );
          }

          setState((prev) => ({
            ...prev,

            tools: (
              prev.tools || []
            ).filter(
              (item) =>
                String(item.id) !==
                String(id)
            ),
          }));

          return true;
        } catch (error) {
          console.error(
            'Delete tool failed:',
            error
          );

          throw error;
        }
      }

      /* FALLBACK */

      commit((s) => ({
        ...s,

        [collection]: (
          s[collection] || []
        ).filter(
          (item) =>
            String(item.id) !==
            String(id)
        ),
      }));
    },
    [commit]
  );

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value = useMemo(
    () => ({
      ...state,

      addItem,
      updateItem,
      deleteItem,
    }),
    [
      state,
      addItem,
      updateItem,
      deleteItem,
    ]
  );

  return (
    <ContentContext.Provider
      value={value}
    >
      {children}
    </ContentContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useContent() {
  const ctx =
    useContext(ContentContext);

  if (!ctx) {
    throw new Error(
      'useContent must be used within ContentProvider'
    );
  }

  return ctx;
}