import type { Customization } from '../models/custom.models';

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *   PERSONALIZACIÓN DEL DIAGRAMA  —  lo mantiene el implementador
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Aquí va lo que el usuario pide agregar a cada evento conforme crece el
 * proyecto: gráficas, videos, pasos de presentación, guías y recorrido.
 * Se indexa por el id del evento (el mismo de timeline.data.ts).
 *
 * Un evento que no aparece aquí usa la presentación por defecto:
 * portada (imagen, año, título, categorías, resumen) y el texto completo
 * dentro de ella, que se lee al acercarse.
 *
 * Los textos de este archivo están en español; su traducción va en timeline.en.ts
 * con la clave  custom.<id-del-bloque>.<campo>.
 */
export const TIMELINE_CUSTOM: Customization = {
  // ── Guías temáticas (los menús de la vista general) ─────────
  // Con `tag`, la guía lista en orden cronológico todos los eventos de esa categoría.
  // Con `items`, lista exactamente esos eventos, en ese orden.
  guides: [
    {
      id: 'biblia',
      tag: 'biblia',
      title: 'La Biblia y sus versiones',
      description: 'De la Septuaginta a las revisiones modernas de la Reina-Valera.',
      color: '#c9963a',
    },
    {
      id: 'doctrina',
      tag: 'doctrina',
      title: 'Teología y doctrina',
      description: 'Credos, confesiones y controversias que definieron la fe.',
      color: '#9b7fe0',
    },
    {
      id: 'historia',
      tag: 'historia',
      title: 'Historia y cultura',
      description: 'Los hechos que marcaron a las iglesias y a su tiempo.',
      color: '#3fa58f',
    },
    {
      id: 'roma',
      tag: 'roma',
      title: 'La Iglesia Católica Romana',
      description: 'Cómo la iglesia unida al Estado llegó a ser la Iglesia de Roma.',
      color: '#d65d72',
    },
  ],

  // ── Recorrido (botones Siguiente / Anterior) ─────────────────
  // null = orden cronológico: cada era y, dentro de ella, sus eventos.
  tour: null,

  // ── Personalización por evento ───────────────────────────────
  events: {
    beza: {
      blocks: [
        {
          type: 'lineage',
          id: 'linea-tr',
          title: 'La línea del Textus Receptus',
          caption: 'Cada edición se apoyó en la anterior. Acércate a un punto para ver su aporte.',
          nodes: [
            { id: 'erasmo', label: 'Erasmo', year: '1516', x: 170, y: 300, event: 'erasmo',
              detail: 'Primer Nuevo Testamento griego impreso, a partir de manuscritos de la tradición bizantina.' },
            { id: 'stephanus', label: 'Stephanus', year: '1550 · 1551', x: 480, y: 300, event: 'stephanus',
              detail: 'La edición "regia" de 1550 y, en 1551, la primera división del texto en versículos.' },
            { id: 'beza', label: 'Beza', year: '1565 – 1598', x: 800, y: 300, event: 'beza',
              detail: 'Nueve ediciones que fijan la forma final del Textus Receptus.' },
            { id: 'kjv', label: 'King James', year: '1611', x: 1200, y: 300, event: 'king-james', startsHidden: true,
              detail: 'Traducida sobre las ediciones de Beza: la cumbre del Textus Receptus en inglés.' },
            { id: 'reina', label: 'Biblia del Oso', year: '1569', x: 640, y: 610, event: 'biblia-del-oso', startsHidden: true,
              detail: 'Casiodoro de Reina traduce el Nuevo Testamento sobre Erasmo y Stephanus.' },
            { id: 'valera', label: 'Biblia del Cántaro', year: '1602', x: 1000, y: 610, event: 'biblia-del-cantaro', startsHidden: true,
              detail: 'Cipriano de Valera revisa la obra de Reina con las ediciones estables del Textus Receptus.' },
          ],
          edges: [
            ['erasmo', 'stephanus'],
            ['stephanus', 'beza'],
            ['beza', 'kjv'],
            ['stephanus', 'reina'],
            ['reina', 'valera'],
          ],
        },
      ],
      steps: [
        { focus: 'linea-tr' },
        { focus: 'linea-tr', show: ['kjv'] },
        { focus: 'linea-tr', show: ['reina', 'valera'] },
      ],
    },
    'biblia-del-oso': {
      blocks: [
        {
          type: 'video',
          id: 'video-rv',
          youtube: 'rrRswC3wZ3Y',
          title: 'Historia de la versión Reina-Valera',
          caption: 'Video de BITE (YouTube).',
        },
      ],
      steps: [{ focus: 'video-rv' }],
    },
  },
};
