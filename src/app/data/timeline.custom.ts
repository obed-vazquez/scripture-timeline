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
          // Una sección cerrada: de lejos se ve la portada; al acercarse se abre en el video,
          // la portada con sus números y la cronología que cuenta el video.
          type: 'group',
          id: 'historia-rv',
          title: 'La historia de la Reina-Valera',
          caption: 'Acércate para abrir: el video, la portada de 1569 y la cronología.',
          cover: { src: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Biblia_del_Oso.png', alt: 'Portada de la Biblia del Oso, 1569' },
          w: 1520,
          h: 1280,
          items: [
            {
              x: 0, y: 0, w: 740, h: 509,
              block: {
                  type: 'video',
                  id: 'video-rv',
                  youtube: 'rrRswC3wZ3Y',
                  title: 'Historia de la versión Reina-Valera',
                  caption: 'Video de BITE (YouTube).',
                },
            },
            {
              x: 780, y: 0, w: 740, h: 434,
              block: {
                  type: 'lineage',
                  id: 'portada-oso',
                  style: 'pins',
                  title: 'La portada de 1569',
                  caption: 'Acércate a cada número para ver qué dice la portada.',
                  image: {
                    src: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Biblia_del_Oso.png',
                    alt: 'Portada de la Biblia del Oso, 1569',
                    x: 805, y: 20, w: 575, h: 780,
                    credit: 'Imagen: Wikimedia Commons (dominio público).',
                  },
                  nodes: [
                    { id: 'titulo', label: 'El título', year: '1569', x: 829, y: 110,
                      detail: '«La Biblia, que es, los sacros libros del Viejo y Nuevo Testamento. Trasladada en Español.»' },
                    { id: 'oso', label: 'El oso y la miel', year: '1569', x: 1020, y: 520,
                      detail: 'Un oso alcanza la miel de un panal en el tronco de un árbol; sobre su cabeza cuelga un mazo y al pie hay un libro abierto. Era el emblema del impresor Matthias Apiarius (apiarius, en latín, es «apicultor»): una imagen sin símbolos religiosos.' },
                    { id: 'lema', label: 'El lema', year: 'Is 40.8', x: 860, y: 668,
                      detail: 'En hebreo y luego en español: «La Palabra del Dios nuestro permanece para siempre» (Isaías 40.8).' },
                    { id: 'anio', label: 'El año', year: '1569', x: 905, y: 772, event: 'biblia-del-oso',
                      detail: 'M. D. LXIX: 1569 en números romanos (M = 1000, D = 500, LXIX = 69). Se publicó en Basilea, Suiza.' },
                  ],
                  edges: [],
                },
            },
            {
              x: 0, y: 580, w: 1520, h: 700,
              block: {
                type: 'chronicle',
                id: 'cronologia-rv',
                title: 'Cronología',
                caption: 'Según el video de BITE.',
                entries: [
                  { id: 'e1542', year: '1542', text: 'Francisco de Encinas publica un Nuevo Testamento en español.', note: 'Otras fuentes dan 1543.' },
                  { id: 'e1550', year: '1550', text: 'Julián Hernández, «Julianillo», empieza a meter Biblias y libros protestantes en España; en Sevilla los guarda Juan Ponce de León.' },
                  { id: 'e1553', year: '1553', text: 'Dos judíos publican en Ferrara una versión del Antiguo Testamento.' },
                  { id: 'e1557a', year: '1557', text: 'Juan Pérez de Pineda publica otra versión del Nuevo Testamento.' },
                  { id: 'e1557b', year: '1557', text: 'Huyen monjes del monasterio de San Isidoro del Campo, en Sevilla; entre ellos Casiodoro de Reina, Cipriano de Valera y Antonio del Corro.' },
                  { id: 'e1558', year: '1558', text: 'Casiodoro llega a Ginebra y ese año pasa a Fráncfort, decidido a traducir la Biblia al español.' },
                  { id: 'e1559', year: '1559', text: 'Juan Ponce de León muere en la hoguera. Casiodoro llega a Londres, se reúne con Valera y es pastor de refugiados españoles.' },
                  { id: 'e1560', year: '1560', text: 'El 22 de diciembre, Julián Hernández muere en la hoguera.' },
                  { id: 'e1564', year: '1564', text: 'Casiodoro pasa por Amberes y Fráncfort y llega a Francia; la duquesa de Ferrara lo protege en su castillo, donde se reúne con Pérez de Pineda.', note: 'El video nombra el castillo de forma poco clara; sería Montargis.' },
                  { id: 'e1565', year: '1565', text: 'Se establece en Fráncfort; como comerciante de telas viaja a Estrasburgo y Basilea, y termina su traducción.' },
                  { id: 'e1567', year: '1567', text: 'Juan Pérez de Pineda muere en París y deja fondos para imprimir la Biblia.', note: 'El video no da el año.' },
                  { id: 'e1568', year: '1568', text: 'Muere el impresor de Basilea, Juan Oporino, y se pierde el adelanto.', note: 'El video no da el año.' },
                  { id: 'e1569', year: '1569', text: 'Con nueva ayuda de amigos, en agosto se termina la Biblia del Oso.', event: 'biblia-del-oso' },
                  { id: 'e1594', year: '1594', text: 'Muere Casiodoro de Reina.' },
                  { id: 'e1602', year: '1602', text: 'Cipriano de Valera publica su revisión: nace la Reina-Valera.', event: 'biblia-del-cantaro' },
                  { id: 'e1865', year: '1865', text: 'La Sociedad Bíblica Americana financia una revisión dirigida por un misionero español y uno estadounidense.', event: 'rv-1865' },
                  { id: 'e1909', year: '1909', text: 'Un comité de las sociedades bíblicas americana y británica, formado en 1907, publica la RV 1909.', event: 'rv-1909' },
                  { id: 'e1960', year: '1960', text: 'Biblistas de varios países hispanos hacen la revisión más conocida: la RV 1960.', event: 'rv-1960' },
                ],
              },
            },
          ],
        },
      ],
      steps: [
        { focus: 'historia-rv' },
        { focus: 'video-rv' },
        { focus: 'portada-oso' },
        { focus: 'portada-oso::oso' },
        { focus: 'cronologia-rv' },
      ],
    },
    'biblia-del-cantaro': {
      blocks: [
        {
          type: 'lineage',
          id: 'arbol-rv',
          title: 'La familia Reina-Valera',
          caption: 'De la traducción de Reina a las revisiones de hoy. Acércate a un punto para ver cada revisión.',
          nodes: [
            { id: 'reina', label: 'Reina', year: '1569', x: 140, y: 330, event: 'biblia-del-oso',
              detail: 'Casiodoro de Reina publica en Basilea la primera Biblia completa en español.' },
            { id: 'valera', label: 'Valera', year: '1602', x: 390, y: 330, event: 'biblia-del-cantaro',
              detail: 'Cipriano de Valera revisa la traducción de Reina; de ahí el nombre «Reina-Valera».' },
            { id: 'rv1865', label: 'RV 1865', year: '1865', x: 650, y: 330, event: 'rv-1865',
              detail: 'Revisión del Dr. Ángel H. de Mora para la American Bible Society.' },
            { id: 'rv1909', label: 'RV 1909', year: '1909', x: 900, y: 330, event: 'rv-1909',
              detail: '«La Antigua»: muy apreciada, y criticada hoy por admitir lecturas del Texto Crítico.' },
            { id: 'rv1960', label: 'RV 1960', year: '1960', x: 1220, y: 330, event: 'rv-1960',
              detail: 'Revisión de las Sociedades Bíblicas Unidas a partir de la 1909; la más difundida en el mundo hispano.' },
            { id: 'p1602', label: '1602 Purificada', year: '2001 – 2008', x: 520, y: 620, event: 'rv-1602-purificada', startsHidden: true,
              detail: 'Revisión bautista hecha en Monterrey que vuelve al texto de Valera de 1602.' },
            { id: 'rvg', label: 'RVG', year: '2004 – 2010', x: 1000, y: 620, event: 'rvg', startsHidden: true,
              detail: 'Revisión de Humberto Gómez (2004) que coteja la RV 1909 con el Textus Receptus y la King James. Sus críticos dicen que se ajustó a la King James; sus defensores, que es la 1909 sin lecturas del Texto Crítico.' },
            { id: 'sbt', label: 'RV SBT', year: '2020+', x: 1250, y: 620, event: 'rv-sbt', startsHidden: true,
              detail: 'La Sociedad Bíblica Trinitaria revisa la RV 1909 sobre los textos originales.' },
          ],
          edges: [
            ['reina', 'valera'],
            ['valera', 'rv1865'],
            ['rv1865', 'rv1909'],
            ['rv1909', 'rv1960'],
            ['valera', 'p1602'],
            ['rv1909', 'rvg'],
            ['rv1909', 'sbt'],
          ],
        },
      ],
      steps: [
        { focus: 'arbol-rv' },
        { focus: 'arbol-rv', show: ['p1602'] },
        { focus: 'arbol-rv', show: ['rvg', 'sbt'] },
      ],
    },
    lutero: {
      blocks: [
        {
          type: 'lineage',
          id: 'mapa-reforma',
          style: 'pins',
          title: 'El mapa de la Reforma',
          caption: 'Dónde ocurrieron los eventos de esta época. Acércate a un número.',
          image: {
            src: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Europe_blank_laea_location_map.svg',
            alt: 'Mapa de Europa occidental y central',
            x: 620, y: 40, w: 760, h: 615,
            crop: { x: 238, y: 585, w: 415, h: 336, naturalW: 1401, naturalH: 1198 },
            credit: 'Mapa: Wikimedia Commons (CC BY-SA 3.0).',
          },
          nodes: [
            { id: 'maguncia', label: 'Maguncia', year: '1454 / 1455', x: 1051, y: 295, event: 'gutenberg',
              detail: 'Gutenberg imprime la Biblia de 42 líneas con tipos móviles.' },
            { id: 'basilea', label: 'Basilea', year: '1516 · 1569', x: 1022, y: 437, event: 'erasmo',
              detail: 'Erasmo publica su Nuevo Testamento griego (1516). En 1569 se publica aquí la Biblia del Oso.' },
            { id: 'wittenberg', label: 'Wittenberg', year: '1517', x: 1214, y: 184, event: 'lutero',
              detail: 'Lutero da a conocer sus 95 tesis.' },
            { id: 'ginebra', label: 'Ginebra', year: '1536', x: 960, y: 515, event: 'calvino',
              detail: 'Calvino llega en 1536 y reforma la ciudad. Después trabajan aquí Beza y, desde 1550, Stephanus.' },
            { id: 'trento', label: 'Trento', year: '1545 – 1563', x: 1164, y: 526, event: 'trento',
              detail: 'Concilio de la Iglesia Católica en respuesta a la Reforma.' },
            { id: 'amsterdam', label: 'Ámsterdam', year: '1602', x: 934, y: 150, event: 'biblia-del-cantaro',
              detail: 'Cipriano de Valera publica su revisión de la Biblia de Reina.' },
            { id: 'londres', label: 'Londres', year: '1611', x: 748, y: 181, event: 'king-james',
              detail: 'Se publica la King James.' },
            { id: 'dordrecht', label: 'Dordrecht', year: '1618 – 1619', x: 925, y: 182, event: 'dort',
              detail: 'El Sínodo de Dort responde a los Remonstrantes.' },
          ],
          edges: [],
        },
      ],
      steps: [{ focus: 'mapa-reforma' }],
    },
    'rv-1960': {
      blocks: [
        {
          type: 'compare',
          id: 'cmp-rv60',
          title: 'La RV 1960 frente a los manuscritos',
          caption: 'Qué hacen tres códices antiguos y la RV 1960 con algunas lecturas del Texto Mayoritario. Da clic en una fila para leer su nota.',
          witnesses: [
            { id: 'm', label: 'M', detail: 'Texto Mayoritario' },
            { id: 'v', label: 'V', detail: 'Códice Vaticano, s. IV' },
            { id: 's', label: 'S', detail: 'Códice Sinaítico, s. IV' },
            { id: 'a', label: 'A', detail: 'Códice Alejandrino, s. V' },
            { id: 'rv60', label: 'RV 1960', detail: 'Reina-Valera 1960' },
          ],
          rows: [
            { id: '1jn57', ref: '1 Jn 5.7–8', text: '«en el cielo: el Padre, el Verbo y el Espíritu Santo; y estos tres son uno. Y tres son los que dan testimonio en la tierra»',
              marks: ['same', 'missing', 'missing', 'missing', 'same'], notes: ['', '', '', '', '†'],
              note: 'Comma Johanneum. Ausente en toda la tradición griega antigua; presente solo en manuscritos tardíos y en la Vulgata. La RV 1960 lo incluye, con nota al pie en ediciones de estudio.' },
            { id: 'mr16', ref: 'Mr 16.9–20', text: 'El final largo de Marcos (12 versículos): la resurrección, las apariciones y la Gran Comisión.',
              marks: ['same', 'missing', 'missing', 'same', 'same'], notes: ['', '', '', '', '†'],
              note: 'Citado por Ireneo (s. II) y Taciano; conocido por Justino Mártir. La RV 1960 lo incluye, con nota al pie en ediciones de estudio.' },
            { id: 'hch837', ref: 'Hch 8.37', text: '«Felipe dijo: Si crees de todo tu corazón, bien puedes. Y respondiendo, dijo: Creo que Jesucristo es el Hijo de Dios»',
              marks: ['same', 'missing', 'missing', 'missing', 'same'],
              note: 'Los tres códices omiten el versículo completo; la RV 1960 lo conserva.' },
            { id: 'ro51', ref: 'Ro 5.1', text: '«tenemos paz con Dios» (ἔχομεν, indicativo)',
              marks: ['same', 'changed', 'changed', 'changed', 'same'],
              note: 'V, S y A leen «tengamos paz» (ἔχωμεν, subjuntivo). Una sola letra en griego cambia una declaración por una exhortación. La RV 1960 conserva «tenemos paz».' },
            { id: 'mt522', ref: 'Mt 5.22', text: '«el que se enoje contra su hermano sin causa» (εἰκῇ)', startsHidden: true,
              marks: ['same', 'partial', 'partial', 'lost', 'partial'],
              note: 'V omite «sin causa»; S también la omitía y un corrector posterior la añadió encima del renglón. A no conserva esta parte de Mateo. La RV 1960 omite «sin causa».' },
            { id: 'mr217', ref: 'Mr 2.17', text: '«no he venido a llamar a justos, sino a pecadores al arrepentimiento»', startsHidden: true,
              marks: ['same', 'partial', 'partial', 'partial', 'partial'],
              note: 'V, S y A omiten «al arrepentimiento» (εἰς μετάνοιαν). La RV 1960 también lo omite.' },
            { id: 'mt1720', ref: 'Mt 17.20', text: '«a causa de vuestra incredulidad» (ἀπιστίαν)', startsHidden: true,
              marks: ['same', 'changed', 'changed', 'lost', 'changed'],
              note: 'V y S leen «poca fe» (ὀλιγοπιστίαν). A no conserva esta parte de Mateo. La RV 1960 sigue a V y S: «poca fe».' },
          ],
          footnote: '† Incluido con nota al pie en ediciones de estudio.',
        },
      ],
      steps: [
        { focus: 'cmp-rv60' },
        { focus: 'cmp-rv60', show: ['mt522', 'mr217', 'mt1720'] },
      ],
    },
  },
};
