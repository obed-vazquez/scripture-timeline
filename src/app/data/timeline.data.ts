import type { TimelineItemData, TimelineTagData } from '../models/timeline.models';

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *   DATOS DE LA LÍNEA DEL TIEMPO  —  este es el archivo que edita el usuario
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Todo el contenido vive aquí, en español: categorías, eras y eventos.
 * El texto de los eventos conserva el formato de siempre (HTML sencillo con
 * <strong>, <em>, <ul class='modal-list'>, enlaces e imágenes).
 *
 * Cómo agregar un evento: copia un bloque { ... } y cambia sus datos.
 * El orden dentro del archivo no importa: la línea del tiempo se ordena sola.
 *
 *   id         Identificador fijo, en minúsculas y con guiones (ej. 'concilio-de-trento').
 *              NO lo cambies después de publicar: los enlaces y los QR impresos lo usan.
 *   year       Año o rango, en los formatos de siempre:
 *              '1517'  ·  '~250 a.C.'  ·  '382 – 405'  ·  '1545 – 1563'  ·  '2020+'
 *              Solo los años antes de Cristo llevan 'a.C.'; los demás van sin 'd.C.'.
 *              '~' marca un año aproximado (la barra se desvanece en ese extremo).
 *   title      Título del evento.
 *   tags       Categorías (ver CATEGORÍAS abajo): ['biblia', 'historia'].
 *   shortDesc  Resumen de una o dos líneas.
 *   fullDesc   Texto completo (entre comillas invertidas ` `).
 *   image      Dirección de la imagen principal. Puede quedar vacía: ''.
 *
 * Campos opcionales:
 *   parent         id del evento que lo contiene. Ej.: los eventos del reinado de
 *                  Constantino llevan parent: 'constantino', y aparecen DENTRO de él
 *                  al acercarse. Si no se pone, el evento va en la era que le toca
 *                  por su fecha.
 *   pendingReview  true = texto generado que el usuario aún no revisa. Quítalo
 *                  (o ponlo en false) cuando lo des por bueno.
 *   yearText       Texto del año que se muestra en lugar de 'year'; la línea del tiempo
 *                  sigue usando 'year'. Ej.: la era Antes de Cristo dice 'hasta ~4 a.C.'.
 *
 * Las eras son bloques con  era: true  y su rango de años. Un evento pertenece a
 * la era donde cae su año de inicio.
 *
 * Marcar un dato dudoso dentro del texto:  <mark class='dudoso'>...</mark>
 *
 * Enlazar a otro evento de la línea del tiempo (la cámara viaja a él):
 *   <a href='#calvino' class='inline-link' data-event='calvino'>Calvino</a>
 *
 * Citar la Biblia: siempre con su versión; de preferencia la 1602 Purificada (1602P):
 *   «Si no os circuncidáis, conforme a la costumbre de Moisés, no podéis ser salvos» (Hch 15.1, 1602P)
 *
 * Lo que NO va aquí (lo mantiene el implementador):
 *   - timeline.custom.ts → gráficas, videos, guías y recorrido.
 *   - timeline.en.ts     → traducciones al inglés.
 */

// ─────────────────────────────────────────────────────────────
// CATEGORÍAS (filtros)
// ─────────────────────────────────────────────────────────────
export const TIMELINE_TAGS: TimelineTagData[] = [
  { id: 'biblia', label: 'Versiones de la Biblia', color: '#c9963a' },
  { id: 'doctrina', label: 'Teología y Doctrina', color: '#9b7fe0' },
  { id: 'historia', label: 'Historia y Cultura', color: '#3fa58f' },
  { id: 'roma', label: 'Iglesia Católica Romana', color: '#d65d72' },
  { id: 'landmark', label: 'Historia landmarquista', color: '#4f86c6' },
];

// ─────────────────────────────────────────────────────────────
// ERAS Y EVENTOS
// ─────────────────────────────────────────────────────────────
export const TIMELINE_ITEMS: TimelineItemData[] = [

  // ════════════════════════════════════════════════
  //   ERA I · ANTES DE CRISTO (300 a.C. – ~4 a.C.)
  // ════════════════════════════════════════════════
  {
    id: 'antes-de-cristo',
    era: true,
    year: '300 a.C. – ~4 a.C.',
    yearText: 'hasta ~4 a.C.',
    title: 'Antes de Cristo',
    color: '#a88b67',
    shortDesc: 'Las Escrituras del Antiguo Testamento y su traducción al griego en el mundo helenístico.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Great_Isaiah_Scroll.jpg/1280px-Great_Isaiah_Scroll.jpg',
    pendingReview: true,
  },
  {
    id: 'septuaginta',
    year: '~250 a.C.',
    title: 'La Septuaginta (LXX)',
    tags: ['biblia', 'historia'],
    shortDesc: 'Eruditos judíos en Alejandría traducen la Torá al griego, iniciando una colección que se convertiría en la traducción más influyente de la antigüedad.',
    fullDesc: `La <a href='https://es.wikipedia.org/wiki/Septuaginta' target='_blank' class='inline-link' data-preview='Traducción griega del AT'>Septuaginta</a>
          (abreviada <strong>LXX</strong>) es, en teoría, la traducción del Antiguo Testamento hebreo al griego koiné iniciada en Alejandría, Egipto.
          Según la tradición (plasmada en la pseudoepigráfica <em>Carta de Aristeas</em>), 72 eruditos judíos fueron convocados por Ptolomeo II y tradujeron la ley milagrosamente en 72 días.
          Sin embargo, historiadores y eruditos modernos consideran este relato un <strong>mito o leyenda fundacional</strong>. La realidad histórica apunta a que
          solamente la Torá (el Pentateuco) fue traducida en el siglo III a.C., y el resto del Antiguo Testamento fue traducido esporádicamente por distintos autores a lo largo de los siglos siguientes.<br><br>
          <strong>📜 Importancia y debate histórico:</strong>
          <ul class='modal-list'>
            <li><strong>¿La Biblia de la Iglesia Primitiva?:</strong> A menudo se afirma categóricamente que fue la Biblia de los apóstoles 
            porque muchas de sus citas del AT en griego coinciden con copias de la LXX. 
            Sin embargo, esto es históricamente debatido. Una fuerte postura de preservación textual argumenta que Jesús y los apóstoles leían y citaban directamente del texto hebreo original 
            (traduciéndolo libremente al griego por inspiración divina). Según este argumento histórico, fueron eruditos posteriores (como Orígenes en Antioquía/Alejandría) quienes habrían alterado 
            las copias griegas del Antiguo Testamento que sobrevivieron para forzarlas a coincidir retrospectivamente con el Nuevo Testamento.</li>
            <li><strong>Los libros Apócrifos:</strong> Se afirma que la LXX agregó libros adicionales (apócrifos) al canon. 
            Sin embargo, <em>no existe ninguna evidencia ni manuscrito judío precristiano</em> de la Septuaginta que contenga estos libros. 
            Las copias completas de la LXX que los incluyen (como los códices católico-ortodoxos <em>Vaticanus</em> y <em>Sinaiticus</em>) fueron manufacturadas en los siglos IV y V d.C. —
            Fuentes importantes, como F.F. Bruce in <em>The Canon of Scripture</em> o Edward F. Hills, señalan que fueron los eclesiásticos alejandrinos posteriores quienes aglomeraron estos libros junto al canon inspirado.</li>
            <li>Fue la base del Antiguo Testamento en las antiguas traducciones <strong>Vetus Latina</strong>.</li>
          </ul>
          Hoy en día, la LXX sigue siendo un objeto de enorme estudio crítico y es el texto oficial del Antiguo Testamento en la Iglesia Católica Apostólica Ortodoxa.`,
    image: 'https://biteproject.com/wp-content/uploads/2025/03/LXX-Destacada-1024x576.webp',
  },

  // ════════════════════════════════════════════════
  //   ERA II · VIDA DE CRISTO (~4 a.C. – ~30)
  // ════════════════════════════════════════════════
  {
    id: 'vida-de-cristo',
    era: true,
    year: '~4 a.C. – ~30',
    title: 'Vida de Cristo',
    color: '#c98aa3',
    shortDesc: 'El Verbo hecho carne: nacimiento, ministerio, muerte y resurrección de Jesucristo.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Panorama_on_the_north_Shore_of_the_Sea_of_Galilee_%285796531006%29.jpg/1280px-Panorama_on_the_north_Shore_of_the_Sea_of_Galilee_%285796531006%29.jpg',
    pendingReview: true,
  },

  {
    id: 'jesucristo',
    year: '~4 a.C. – ~30',
    title: 'Jesucristo',
    tags: ['historia', 'landmark'],
    shortDesc: 'Jesús nace en Belén en días del rey Herodes, enseña y sana en Galilea y Judea, muere crucificado bajo Poncio Pilato y resucita al tercer día.',
    fullDesc: `Según los Evangelios, <a href='https://es.wikipedia.org/wiki/Jes%C3%BAs_de_Nazaret' target='_blank' class='inline-link'>Jesús de Nazaret</a>
          nació en Belén de Judea «en los días del rey <a href='https://es.wikipedia.org/wiki/Herodes_I_el_Grande' target='_blank' class='inline-link'>Herodes</a>» (Mt 2.1, 1602P).
          Como Herodes murió hacia el 4 a.C., el nacimiento suele fecharse entre el 6 y el 4 a.C.<br><br>
          <strong>📅 ¿Nacido «antes de Cristo»?</strong> La cuenta de los años «después de Cristo» la propuso el monje
          <a href='https://es.wikipedia.org/wiki/Dionisio_el_Exiguo' target='_blank' class='inline-link'>Dionisio el Exiguo</a> hacia el año 525,
          y su cálculo del nacimiento quedó corto por algunos años. Por eso las fechas de la vida de Cristo se escriben como aproximadas.<br><br>
          <strong>📜 Su vida en las Escrituras:</strong>
          <ul class='modal-list'>
            <li><strong>Bautismo:</strong> Juan el Bautista lo bautiza en el Jordán. Jesús comenzaba su ministerio «como de treinta años» (Lc 3.23, 1602P), en el año quince de Tiberio César (Lc 3.1), hacia el 28 o 29.</li>
            <li><strong>Ministerio:</strong> Enseña, sana y llama a sus discípulos en Galilea y Judea. El Evangelio de Juan menciona al menos tres Pascuas, por lo que su ministerio suele calcularse en unos tres años.</li>
            <li><strong>Muerte:</strong> Es crucificado en Jerusalén bajo <a href='https://es.wikipedia.org/wiki/Poncio_Pilato' target='_blank' class='inline-link'>Poncio Pilato</a>, prefecto de Judea entre el 26 y el 36. El año más citado es el <mark class='dudoso'>30</mark>; otros proponen el 33.</li>
            <li><strong>Resurrección:</strong> «Resucitó al tercer día, según las Escrituras» (1 Co 15.4, 1602P), y se presentó vivo a sus discípulos durante cuarenta días antes de ascender (Hch 1.3, 9).</li>
          </ul>
          Los Evangelios de Mateo, Marcos, Lucas y Juan son las fuentes principales de su vida.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Jerusalem_Modell_BW_2.JPG/1280px-Jerusalem_Modell_BW_2.JPG',
    pendingReview: true,
  },

  // ════════════════════════════════════════════════
  //   ERA III · LA IGLESIA DE LOS APÓSTOLES (~30 – ~100)
  // ════════════════════════════════════════════════
  {
    id: 'iglesia-apostolica',
    era: true,
    year: '~30 – ~100',
    title: 'La iglesia de los apóstoles',
    color: '#a9b35b',
    shortDesc: 'De Pentecostés a la muerte de Juan: los apóstoles predican, escriben el Nuevo Testamento y enfrentan las primeras persecuciones.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ephesus_Celsus_Library_Fa%C3%A7ade.jpg/1280px-Ephesus_Celsus_Library_Fa%C3%A7ade.jpg',
    pendingReview: true,
  },

  {
    id: 'concilio-de-jerusalen',
    year: '~49',
    title: 'Concilio de Jerusalén',
    tags: ['doctrina', 'landmark'],
    shortDesc: 'Los apóstoles y los ancianos, con toda la iglesia de Jerusalén, resuelven que los creyentes gentiles no necesitan circuncidarse para ser salvos.',
    fullDesc: `Algunos que venían de Judea enseñaban a los hermanos de Antioquía: «Si no os circuncidáis, conforme a la costumbre de Moisés, no podéis ser salvos» (Hch 15.1, 1602P).
          Pablo y Bernabé subieron a Jerusalén para tratar la cuestión con los apóstoles y los ancianos. Es el <a href='https://es.wikipedia.org/wiki/Concilio_de_Jerusal%C3%A9n' target='_blank' class='inline-link'>Concilio de Jerusalén</a>.<br><br>
          <strong>📜 Lo que narra Hechos 15:</strong>
          <ul class='modal-list'>
            <li><strong>Pedro:</strong> «Antes por la gracia del Señor Jesús Cristo creemos que seremos salvos, así como ellos» (Hch 15.11, 1602P).</li>
            <li><strong>Jacobo:</strong> Propone no inquietar a los gentiles que se convierten, sino escribirles «que se aparten de las contaminaciones de los ídolos, y de fornicación, y de lo ahogado, y de sangre» (Hch 15.19–20, 1602P).</li>
            <li><strong>La decisión:</strong> «Pareció bien a los apóstoles, y a los ancianos con toda la iglesia», enviar a Antioquía una carta con ese acuerdo (Hch 15.22–29, 1602P).</li>
          </ul>
          Hechos no da la fecha; la más citada es hacia el <mark class='dudoso'>49 o 50</mark>.`,
    image: '',
    pendingReview: true,
  },

  {
    id: 'muerte-de-juan',
    year: '~100',
    parent: 'iglesia-apostolica',
    title: 'Muere Juan, el último apóstol',
    tags: ['historia'],
    shortDesc: 'Según la tradición, el apóstol Juan muere en Éfeso hacia el año 100; con él termina la generación de los testigos directos de Cristo.',
    fullDesc: `Juan, hijo de Zebedeo, fue uno de los doce apóstoles (Mt 4.21–22). Según <a href='https://es.wikipedia.org/wiki/Ireneo_de_Lyon' target='_blank' class='inline-link'>Ireneo de Lyon</a>,
          que escribió a finales del siglo II, Juan vivió en Éfeso y permaneció allí «hasta los tiempos de Trajano», emperador desde el año 98
          (<em>Contra las herejías</em> II.22.5 y III.3.4).<br><br>
          <strong>📜 Lo que se sabe:</strong>
          <ul class='modal-list'>
            <li><strong>Patmos:</strong> El Apocalipsis dice que Juan estuvo en la isla de Patmos «por la palabra de Dios, y por el testimonio de Cristo Jesús» (Ap 1.9, 1602P).
            Ireneo sitúa la visión hacia el final del reinado de Domiciano, es decir, hacia el <mark class='dudoso'>95</mark> (<em>Contra las herejías</em> V.30.3).</li>
            <li><strong>Sus escritos:</strong> La tradición le atribuye el Evangelio de Juan, tres cartas y el Apocalipsis.</li>
            <li><strong>El último apóstol:</strong> Con su muerte, hacia el <mark class='dudoso'>año 100</mark>, termina la generación de los testigos directos de Cristo.
            Las fechas vienen de la tradición, no de un registro de la época.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/1488_Bosch_Der_Evangelist_Johannes_auf_der_Insel_Patmos_anagoria.JPG/960px-1488_Bosch_Der_Evangelist_Johannes_auf_der_Insel_Patmos_anagoria.JPG',
    pendingReview: true,
  },

  // ════════════════════════════════════════════════
  //   ERA IV · IGLESIAS PRIMITIVAS (~100 – 313)
  // ════════════════════════════════════════════════
  {
    id: 'iglesias-primitivas',
    era: true,
    year: '~100 – 313',
    title: 'Iglesias Primitivas',
    color: '#8fa86a',
    shortDesc: 'De la muerte del último apóstol a Constantino: las iglesias bajo persecución.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/The_Trail_of_Blood.jpg/1920px-The_Trail_of_Blood.jpg',
    pendingReview: true,
  },


  {
    id: 'neron',
    year: '54 – 68',
    title: 'Nerón es César',
    tags: ['historia'],
    shortDesc: 'Nerón gobierna el Imperio Romano: es el César ante quien Pablo apela y ante quien debe comparecer.',
    fullDesc: `<a href='https://es.wikipedia.org/wiki/Ner%C3%B3n' target='_blank' class='inline-link' data-preview='Emperador romano del 54 al 68'>Nerón</a> fue emperador de Roma del año 54 al 68. Es el "César" del libro de los Hechos:
          preso en Cesarea y en peligro de ser entregado a los judíos, Pablo apeló a César (Hch 25.11), y durante el naufragio rumbo a Roma un ángel le aseguró:
          <em>«es menester que seas presentado delante de César»</em> (Hch 27.24, 1602P). Era alrededor del año 59–60.<br><br>
          <strong>📜 Lo que marcó su gobierno para la iglesia:</strong>
          <ul class='modal-list'>
            <li><strong>Primeros años:</strong> Gobernó bajo la tutela del filósofo Séneca y del prefecto Burro, años recordados como relativamente estables.
            En ese periodo Pablo llegó a Roma y vivió dos años en una casa alquilada, predicando «sin que ninguno se lo estorbase» (Hch 28.30–31, 1602P).</li>
            <li><strong>El incendio de Roma (64):</strong> Tras el gran incendio, el historiador romano <a href='https://es.wikipedia.org/wiki/T%C3%A1cito' target='_blank' class='inline-link'>Tácito</a> (<em>Anales</em> XV.44) relata que Nerón
            culpó a los cristianos y los castigó con crueldad: algunos fueron cubiertos con pieles de animales y despedazados por perros, otros crucificados o quemados como antorchas.
            Es la primera persecución del Estado romano contra los cristianos.</li>
            <li><strong>Su final (68):</strong> Declarado enemigo público por el Senado, se quitó la vida en junio del 68. Con él terminó la dinastía Julio-Claudia.</li>
          </ul>
          La tradición de la iglesia antigua sitúa bajo su reinado la muerte de Pablo en Roma.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Nero_Glyptothek_Munich_321_%28cropped%29%282%29.jpg/960px-Nero_Glyptothek_Munich_321_%28cropped%29%282%29.jpg',
    pendingReview: true,
  },

  {
    id: 'muerte-de-pablo',
    year: '~64 – ~67',
    title: 'La muerte de Pablo',
    tags: ['historia'],
    shortDesc: 'La Biblia no narra la muerte de Pablo; la tradición de la iglesia antigua dice que fue decapitado en Roma bajo Nerón.',
    fullDesc: `El libro de los Hechos termina con <a href='https://es.wikipedia.org/wiki/Pablo_de_Tarso' target='_blank' class='inline-link' data-preview='El apóstol de los gentiles'>Pablo</a> preso en Roma, viviendo dos años en una casa alquilada y predicando (Hch 28.30–31),
          alrededor del año 62. <strong>La Biblia no narra su muerte.</strong> En su última carta, escrita desde una segunda prisión, Pablo la ve cercana:
          <em>"yo ya estoy para ser sacrificado, y el tiempo de mi partida está cercano"</em> (2 Tim 4.6).<br><br>
          <strong>📜 ¿De dónde sale el dato?</strong>
          <ul class='modal-list'>
            <li><strong>1 Clemente 5 (~96):</strong> La carta de la iglesia de Roma a la de Corinto dice que Pablo, después de predicar en oriente y occidente,
            "dio testimonio ante los gobernantes y así partió del mundo". Es la referencia más antigua, pero no da lugar, fecha ni forma de muerte.</li>
            <li><strong>Dionisio de Corinto (~170):</strong> Citado por Eusebio, afirma que Pedro y Pablo sufrieron el martirio en Italia por el mismo tiempo.</li>
            <li><strong><a href='https://es.wikipedia.org/wiki/Eusebio_de_Cesarea' target='_blank' class='inline-link' data-preview='Historiador de la iglesia antigua'>Eusebio de Cesarea</a> (<em>Historia eclesiástica</em> II.22 y II.25, ~325):</strong>
            Recoge la tradición de que Pablo fue decapitado en Roma bajo Nerón, algo coherente con su ciudadanía romana, que lo eximía de la crucifixión.</li>
          </ul>
          <strong>⚠️ Sobre la fecha:</strong> No se conoce con exactitud. Los años más citados van del 64, tras el incendio de Roma, al 67; el límite es la muerte de Nerón en junio del 68.
          Todo lo que va más allá de Hechos y de 2 Timoteo depende de la tradición posterior, no de las Escrituras.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/ElGrecoPaul_%28cropped%29.jpg/960px-ElGrecoPaul_%28cropped%29.jpg',
    pendingReview: true,
  },

  {
    id: 'vetus-latina',
    year: '~100 – 380',
    title: 'Las Vetus Latina',
    tags: ['biblia', 'roma'],
    shortDesc: 'Las primeras traducciones fragmentarias de la Biblia al latín que fueron usadas por la iglesia que posteriormente sería llamada católico-romana occidental.',
    fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/f/fc/Codex_Vercellensis_-_Old_Latin_gospel_%28John_ch._16%2C_v._23-30%29_%28The_S.S._Teacher%27s_Edition-The_Holy_Bible_-_Plate_XXXII%29.jpg'
          class='modal-inline-img' alt='Codex Vercellensis - Evangelio en latín antiguo' title='Codex Vercellensis: Ejemplo de manuscrito de la Vetus Latina (Juan 16:23-30)'>
          Desde el siglo II en adelante, distintas comunidades del occidente romano produjeron traducciones independientes y fragmentarias de las Escrituras
          al latín, conocidas colectivamente como las <a href='https://es.wikipedia.org/wiki/Vetus_Latina' target='_blank' class='inline-link' data-preview='Antiguas traducciones latinas'>Vetus Latina</a>
          ('Antiguo Latín'). No fue una obra unificada ni coordinada — cada región traducía con los manuscritos griegos que tenía a la mano, sin acceso a una colección centralizada.
          Esta fue la razón principal de que los textos variaran: los traductores locales rara vez tenían todas las fuentes a la mano, sino porciones u copias aisladas de distintos manuscritos. 
          A eso se sumaban variaciones secundarias propias de la traducción: vocabulario teológico inconsistente y versículos con fraseos distintos según el dominio del griego de cada traductor.<br><br>
          Traducidas desde manuscritos griegos para el Nuevo Testamento y desde la <strong>Septuaginta</strong> para el Antiguo Testamento.
          Su falta de uniformidad fue precisamente la razón que usó el Papa Dámaso I para encargar a Jerónimo producir una versión latina oficial y estandarizada,
          que unificara a toda la Iglesia Católica occidental bajo un solo texto.`,
    image: 'https://archesbookhouse.cdn.bibliopolis.com/pictures/402.jpg',
  },

  {
    id: 'ignacio-esmirniotas',
    year: '~107 – 110',
    title: 'Carta de Ignacio de Antioquía a los esmirniotas',
    tags: ['historia', 'roma', 'landmark'],
    shortDesc: 'Camino a su martirio, Ignacio escribe a la iglesia de Esmirna: aparece por primera vez la expresión "iglesia católica" y la orden de no hacer nada sin el obispo.',
    fullDesc: `<a href='https://es.wikipedia.org/wiki/Ignacio_de_Antioqu%C3%ADa' target='_blank' class='inline-link' data-preview='Obispo de Antioquía, mártir bajo Trajano'>Ignacio</a>, obispo de Antioquía, fue arrestado y llevado a Roma para morir en el circo bajo el emperador Trajano.
          En el camino escribió siete cartas a distintas iglesias; una de ellas, a la iglesia de <strong>Esmirna</strong>, cuyo obispo era
          <a href='https://es.wikipedia.org/wiki/Policarpo_de_Esmirna' target='_blank' class='inline-link'>Policarpo</a>.<br><br>
          <strong>📜 Qué dice la carta:</strong>
          <ul class='modal-list'>
            <li><strong>Contra los docetas:</strong> Defiende que Cristo nació, padeció y resucitó en carne real, contra quienes decían que su cuerpo era sólo apariencia.</li>
            <li><strong>"Nada sin el obispo" (8.1):</strong> Exige que no se haga nada de lo que pertenece a la iglesia sin el obispo, y que sólo se tenga por válida
            la Cena del Señor celebrada por el obispo o por quien él autorice.</li>
            <li><strong>"Iglesia católica" (8.2):</strong> <em>"Donde aparezca el obispo, allí esté la multitud; así como donde está Jesucristo, allí está la iglesia católica."</em>
            Es el primer uso conocido de la expresión. Aquí "católica" significa "universal"; todavía no designa una institución con sede en Roma.</li>
          </ul>
          <strong>⚠️ Por qué importa:</strong> En el Nuevo Testamento, "obispo" y "anciano" (presbítero) designan el mismo oficio (Hch 20.17, 28; Tit 1.5–7), y cada iglesia tenía varios.
          En Ignacio ya aparece un solo obispo por encima de los presbíteros y diáconos de cada ciudad. Es una de las primeras señales escritas del camino hacia la jerarquía
          que, siglos después, desembocaría en la Iglesia Católica Romana.<br><br>
          La fecha es aproximada: tradicionalmente se ubica entre 107 y 110, durante el reinado de Trajano (98–117);
          <mark class='dudoso'>algunos estudiosos proponen fechas más tardías</mark>.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Ignatius_of_Antiochie%2C_poss._by_Johann_Apakass_%2817th_c.%2C_Pushkin_museum%29.jpg/960px-Ignatius_of_Antiochie%2C_poss._by_Johann_Apakass_%2817th_c.%2C_Pushkin_museum%29.jpg',
    pendingReview: true,
  },

  {
    id: 'edicto-de-decio',
    year: '250',
    title: 'Edicto de Decio',
    tags: ['roma', 'historia'],
    shortDesc: 'Decio ordena a todos los habitantes del Imperio sacrificar a los dioses y obtener un certificado; muchos cristianos de iglesias relajadas ceden.',
    fullDesc: `Tras décadas de relativa paz, muchas iglesias se habían relajado: se recibían miembros sin evidencia de conversión, algunos pastores comenzaban a elevarse
          sobre otras iglesias y aparecían las primeras ideas de que el bautismo salva. En ese contexto, el emperador <a href='https://es.wikipedia.org/wiki/Decio' target='_blank' class='inline-link' data-preview='Emperador romano del 249 al 251'>Decio</a>
          (gobernó del 249 al 251) emitió, a finales del 249 o inicios del 250, un edicto que obligaba a <strong>todos los habitantes del Imperio</strong> a sacrificar a los dioses romanos.<br><br>
          <strong>📜 Cómo funcionaba:</strong>
          <ul class='modal-list'>
            <li><strong>Sin nombre propio:</strong> El texto del edicto no se conserva; se le conoce simplemente como "el edicto de Decio".</li>
            <li><strong>El certificado (<em>libellus</em>):</strong> Cada persona debía sacrificar, comer de la carne ofrecida y declarar ante una comisión local, que le entregaba un certificado.
            Se conservan decenas de estos <em>libelli</em> en papiros de Egipto.</li>
            <li><strong>Los <em>lapsi</em> («caídos»):</strong> Muchos cristianos cedieron: unos sacrificaron (<em>sacrificati</em>), otros compraron un certificado sin sacrificar (<em>libellatici</em>).
            Otros resistieron y murieron, como Fabián, obispo de Roma.</li>
          </ul>
          <strong>📌 La pregunta que dividió a las iglesias:</strong> ¿Se debe volver a recibir en comunión a quienes negaron la fe para salvar la vida?
          La respuesta a esa pregunta llevó al Sínodo de Roma del 251 y a la separación de los novacianos.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Emperor_Traianus_Decius_%28Mary_Harrsch%29.jpg',
    pendingReview: true,
  },

  {
    id: 'sinodo-de-roma-251',
    year: '251',
    title: 'Sínodo de Roma y los Novacianos',
    tags: ['roma', 'historia', 'landmark'],
    shortDesc: 'Unos 60 obispos respaldan a Cornelio como obispo de Roma, aceptan a los lapsi con penitencia y excomulgan a Novaciano.',
    fullDesc: `En junio del 251 Decio muere en batalla contra los godos y la persecución termina. Las iglesias quedan con un problema:
          qué hacer con los <strong><em>lapsi</em></strong> («caídos»), los que negaron la fe durante la persecución y ahora piden volver.<br><br>
          <strong>📜 Los hechos:</strong>
          <ul class='modal-list'>
            <li><strong>Cornelio (marzo del 251):</strong> Tras más de un año sin obispo en Roma, <a href='https://es.wikipedia.org/wiki/Cornelio' target='_blank' class='inline-link' data-preview='Obispo de Roma del 251 al 253'>Cornelio</a> es elegido obispo de Roma
            (hoy se le llamaría papa). Era partidario de recibir a los <em>lapsi</em> después de una penitencia.</li>
            <li><strong>Novaciano:</strong> El presbítero <a href='https://es.wikipedia.org/wiki/Novaciano' target='_blank' class='inline-link' data-preview='Presbítero romano, rigorista'>Novaciano</a>, que sostenía que la iglesia no podía devolver la comunión
            a quien había negado a Cristo. Sus opositores lo acusan de haberse hecho consagrar obispo de Roma cuando ya había uno elegido.</li>
            <li><strong>El sínodo:</strong> Según Eusebio (<em>Historia eclesiástica</em> VI.43), se reúnen en Roma unos <strong>60 obispos</strong>, mayormente italianos,
            y muchos más presbíteros y diáconos. Respaldan a Cornelio, confirman la línea del concilio de Cartago presidido por
            <a href='https://es.wikipedia.org/wiki/Cipriano_de_Cartago' target='_blank' class='inline-link'>Cipriano</a> (recibir a los <em>lapsi</em> con penitencia) y <strong>excomulgan a Novaciano</strong> y a quienes lo siguen, culpándolo de esa consagración y de no aceptar a los <em>lapsi</em> en comunión.</li>
          </ul>
          <strong>⚠️ Lectura de este evento:</strong> A Novaciano se le excluyó acusado de una consagración rival y por negarse a recibir a los <em>lapsi</em>.
          La mayoría reunida en sínodo establecía así que la comunión dependía de una penitencia regulada por los obispos. Las iglesias novacianas siguieron existiendo
          por siglos, separadas, y la historiografía bautista sucesionista las cuenta entre las iglesias que se mantuvieron fuera del sistema que daría origen a Roma.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Pope_Cornelius_%E2%80%93_Santa_Maria_in_Trastevere.jpg',
    pendingReview: true,
  },

  {
    id: 'gran-persecucion',
    year: '303 – 311',
    title: 'La Gran Persecución de Diocleciano',
    tags: ['roma', 'historia'],
    shortDesc: 'La persecución más dura del Imperio: se ordena destruir los lugares de reunión y entregar y quemar las Escrituras.',
    fullDesc: `A partir de febrero del 303, el emperador <a href='https://es.wikipedia.org/wiki/Diocleciano' target='_blank' class='inline-link' data-preview='Emperador romano del 284 al 305'>Diocleciano</a>, impulsado por su césar Galerio,
          emitió una serie de edictos contra los cristianos: la llamada <a href='https://es.wikipedia.org/wiki/Persecuci%C3%B3n_de_Diocleciano' target='_blank' class='inline-link' data-preview='La última y más dura persecución romana'>Gran Persecución</a>.<br><br>
          <strong>📜 Los edictos:</strong>
          <ul class='modal-list'>
            <li><strong>Primer edicto (303):</strong> Destruir los lugares de reunión, <strong>entregar y quemar las Escrituras</strong>, prohibir las reuniones y quitar derechos civiles a los cristianos.</li>
            <li><strong>Segundo y tercer edictos (303):</strong> Encarcelar al clero y liberarlo sólo si sacrificaba a los dioses.</li>
            <li><strong>Cuarto edicto (304):</strong> Todos los habitantes debían sacrificar, bajo pena de muerte.</li>
          </ul>
          <strong>📖 Los <em>traditores</em>:</strong> A quienes entregaron las Escrituras a las autoridades se les llamó <em>traditores</em> ("los que entregan").
          Esa palabra será el centro del cisma donatista pocos años después.<br><br>
          La intensidad varió por región: en occidente casi cesó hacia el 305, mientras que en oriente siguió con fuerza. Terminó formalmente con el edicto de Galerio en el 311,
          aunque Maximino Daya la continuó en sus territorios hasta el 313.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/The_Christian_Martyrs%27_Last_Prayer_GA%26C.jpg/960px-The_Christian_Martyrs%27_Last_Prayer_GA%26C.jpg',
    pendingReview: true,
  },

  {
    id: 'constantino',
    year: '306 – 337',
    title: 'Constantino es emperador',
    tags: ['roma'],
    shortDesc: 'Proclamado por sus tropas en el 306, Constantino llega a ser único emperador y lleva a la iglesia a una alianza con el Estado.',
    fullDesc: `<a href='https://es.wikipedia.org/wiki/Constantino_I' target='_blank' class='inline-link' data-preview='Emperador romano del 306 al 337'>Constantino</a> fue proclamado emperador por sus tropas en Eboracum (hoy York, Inglaterra) en el 306,
          a la muerte de su padre, Constancio Cloro. Su reinado transformó la relación entre la iglesia y el Imperio.<br><br>
          <strong>📜 Etapas de su gobierno:</strong>
          <ul class='modal-list'>
            <li><strong>306:</strong> Proclamado en Britania; gobierna en occidente compartiendo el poder con otros emperadores.</li>
            <li><strong>312:</strong> Vence a Majencio en el Puente Milvio y se vuelve dueño de occidente.</li>
            <li><strong>313:</strong> Con Licinio, emperador de oriente, acuerda el edicto de Milán.</li>
            <li><strong>324:</strong> Vence a Licinio y queda como único emperador.</li>
            <li><strong>337:</strong> Muere cerca de Nicomedia, bautizado en su lecho de muerte.</li>
          </ul>
          <strong>¿Y su edicto?</strong> Sí lo hubo: el <strong>edicto de Milán</strong> (313) fue más allá que el de Galerio, porque concedió libertad de culto a todos
          y ordenó devolver a los cristianos sus bienes confiscados.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Head_Constantine_Musei_Capitolini_MC1072.jpg/960px-Head_Constantine_Musei_Capitolini_MC1072.jpg',
    pendingReview: true,
  },

  {
    id: 'sueno-de-constantino',
    parent: 'constantino',
    year: '312',
    title: 'El sueño de Constantino y el Puente Milvio',
    tags: ['roma', 'historia'],
    shortDesc: 'Antes de la batalla contra Majencio, Constantino afirma haber recibido una señal de Cristo; gana y se vuelve dueño de occidente.',
    fullDesc: `El 28 de octubre del 312, Constantino venció a Majencio en la <a href='https://es.wikipedia.org/wiki/Batalla_del_Puente_Milvio' target='_blank' class='inline-link' data-preview='Batalla a las afueras de Roma'>batalla del Puente Milvio</a>,
          a las afueras de Roma. Antes de la batalla, según él mismo contó, recibió una señal de Cristo.<br><br>
          <strong>📜 Dos versiones que no coinciden:</strong>
          <ul class='modal-list'>
            <li><strong>Lactancio (<em>Sobre la muerte de los perseguidores</em>, ~315):</strong> En un sueño se le indicó marcar los escudos de sus soldados con el signo de Cristo, y así lo hizo.</li>
            <li><strong>Eusebio (<em>Vida de Constantino</em>, ~337):</strong> Escrita después de la muerte del emperador, dice que Constantino le juró haber visto, a mediodía y con todo su ejército,
            una cruz de luz en el cielo con la inscripción <em>"con este signo vencerás"</em>, y que esa noche Cristo se le apareció en sueños con la misma señal.</li>
          </ul>
          <strong>⚠️ Una conversión ambigua:</strong> Constantino siguió usando durante años títulos y símbolos paganos, como el de Pontífice Máximo (sumo sacerdote de la religión romana),
          y no se bautizó sino hasta su lecho de muerte. Lo que sí cambió de inmediato fue la posición de la iglesia: de perseguida pasó a ser favorecida por el hombre más poderoso del Imperio.`,
    image: '',
    pendingReview: true,
  },

  {
    id: 'edicto-de-milan',
    parent: 'constantino',
    year: '313',
    title: 'Unión de iglesia y estado: el edicto de Milán',
    tags: ['roma', 'landmark'],
    shortDesc: 'Constantino y Licinio dan libertad de culto y devuelven sus bienes a los cristianos; comienza el maridaje de la iglesia con el Estado romano.',
    fullDesc: `En el 313, Constantino y <a href='https://es.wikipedia.org/wiki/Licinio' target='_blank' class='inline-link' data-preview='Emperador romano de oriente'>Licinio</a> acordaron en Milán la política conocida como el
          <a href='https://es.wikipedia.org/wiki/Edicto_de_Mil%C3%A1n' target='_blank' class='inline-link' data-preview='Libertad de culto en el Imperio'>edicto de Milán</a>: libertad de culto para todos, cristianos incluidos, y la devolución de los lugares de reunión
          y bienes confiscados durante la persecución. El texto que se conserva es en realidad una carta de Licinio a los gobernadores de oriente.<br><br>
          Pero el 313 marca algo más que tolerancia: es el inicio del <strong>maridaje de la iglesia "cristiana" con el Estado</strong>. La religión pasa a ser auspiciada por el emperador.<br><br>
          <strong>📜 Qué significó ese maridaje:</strong>
          <ul class='modal-list'>
            <li><strong>Privilegios para el clero:</strong> Exención de los cargos públicos y de sus costos (313), que convirtió al clero en una clase privilegiada y atrajo a muchos por interés.</li>
            <li><strong>Dinero y edificios:</strong> Donaciones imperiales y grandes basílicas, como el palacio de Letrán, entregado al obispo de Roma.</li>
            <li><strong>El emperador en los asuntos de la iglesia:</strong> Constantino convoca sínodos y concilios (Arlés 314, Nicea 325) y hace cumplir sus decisiones con la fuerza del Estado.</li>
            <li><strong>Los obispos como funcionarios:</strong> Reciben facultades de jueces civiles (318).</li>
            <li><strong>Persecución a la inversa:</strong> Los grupos que no se sometían, como los donatistas, comenzaron a ser reprimidos por el Estado.</li>
          </ul>
          El cristianismo aún no era la religión oficial del Imperio; eso llegaría con el edicto de Tesalónica, en el 380.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Unknown_painter_-_The_Donation_of_Constantine_-_WGA23883.jpg',
    pendingReview: true,
  },

  {
    id: 'obispos-jueces',
    parent: 'constantino',
    year: '318',
    title: 'Los obispos se vuelven jueces civiles',
    tags: ['roma'],
    shortDesc: 'Una ley de Constantino permite llevar pleitos civiles ante el obispo, cuya sentencia vale como la de un juez del Estado.',
    fullDesc: `Una ley de Constantino conservada en el <a href='https://es.wikipedia.org/wiki/C%C3%B3digo_Teodosiano' target='_blank' class='inline-link' data-preview='Compilación de leyes imperiales'>Código Teodosiano</a> (I.27.1) estableció la llamada
          <strong><em>episcopalis audientia</em></strong> ("audiencia del obispo"): cualquier persona podía llevar un pleito civil ante el obispo, y la sentencia de este tendría
          la misma validez que la de un juez del Estado.<br><br>
          <strong>📜 Lo que implicó:</strong>
          <ul class='modal-list'>
            <li><strong>De pastores a magistrados:</strong> Los obispos asumen funciones del poder civil, y su autoridad se apoya en la ley imperial.</li>
            <li><strong>Poder sobre la ciudad:</strong> El obispo se vuelve una figura pública con autoridad sobre creyentes y no creyentes, no sólo sobre su congregación.</li>
            <li><strong>Contraste con las Escrituras:</strong> Pablo había pedido a los creyentes resolver sus diferencias entre hermanos, en la iglesia, en lugar de acudir a los tribunales
            (1 Co 6.1–6). Ahora era el Estado quien daba al obispo el lugar de juez.</li>
          </ul>
          <strong>⚠️ Sobre la fecha:</strong> La ley lleva fecha del 318, <mark class='dudoso'>pero los historiadores discuten esa fecha y el alcance exacto de la ley</mark>.<br><br>
          <strong>📌 Otras dos cosas asociadas a "318":</strong> hacia ese año comienza en Alejandría la controversia de Arrio, que llevaría al concilio de Nicea;
          y 318 es el número tradicional de obispos asistentes a ese concilio. Ambas se tratan en el evento de Nicea.`,
    image: '',
    pendingReview: true,
  },

  {
    id: 'nicea',
    year: '325',
    title: 'Concilio de Nicea',
    tags: ['roma', 'landmark'],
    shortDesc: 'Convocado por Constantino, el primer concilio "ecuménico" condena a Arrio y define la fe con el respaldo del Imperio.',
    fullDesc: `<strong>Antecedente:</strong> Hacia el 318, en Alejandría, el presbítero <a href='https://es.wikipedia.org/wiki/Arrio' target='_blank' class='inline-link' data-preview='Presbítero de Alejandría'>Arrio</a> comenzó a enseñar que el Hijo de Dios era una criatura,
          que "hubo un tiempo en que no existía". Su obispo, Alejandro, lo condenó, pero la disputa se extendió por todo el oriente.<br><br>
          En el 325, <strong>Constantino</strong> convocó a los obispos a <a href='https://es.wikipedia.org/wiki/Primer_Concilio_de_Nicea' target='_blank' class='inline-link' data-preview='El primer concilio ecuménico'>Nicea</a>, cerca de su residencia imperial,
          pagó sus viajes con los medios del Estado, inauguró el concilio y participó en sus sesiones. El número tradicional de asistentes es <strong>318 obispos</strong>
          ("los 318 padres"); Eusebio, que estuvo presente, habla de más de 250.<br><br>
          <strong>📜 Lo que decidió:</strong>
          <ul class='modal-list'>
            <li><strong>El Credo de Nicea:</strong> Afirmó que el Hijo es "Dios verdadero de Dios verdadero, engendrado, no hecho, de la misma sustancia (<em>homoousios</em>) que el Padre",
            y condenó a Arrio.</li>
            <li><strong>Otras decisiones:</strong> La fecha de la Pascua y una serie de cánones sobre la disciplina del clero y la precedencia entre las sedes de Alejandría, Roma y Antioquía (canon 6).</li>
            <li><strong>El brazo del Estado:</strong> Arrio y los obispos que no firmaron fueron desterrados por orden del emperador.</li>
          </ul>
          <strong>⚖️ La lectura bautista sucesionista:</strong> La deidad de Cristo no nació en Nicea: las iglesias la creían porque está en las Escrituras (Jn 1.1; Fil 2.6; Col 2.9).
          Lo nuevo de Nicea fue <strong>quién</strong> definía la fe y <strong>cómo</strong> se imponía: un emperador sin bautizar convocando a los obispos, y el poder del Estado castigando a los disidentes.
          Por eso esta historiografía ve en Nicea el nacimiento de la iglesia imperial, la iglesia "católica" unida al Estado, de la que surgiría la Iglesia Católica Romana.
          Las iglesias que se mantenían fuera de ese sistema no estuvieron en Nicea como iguales: a los novacianos el concilio los trató como un grupo a readmitir (canon 8).`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Nicaea_icon.jpg',
    pendingReview: true,
  },

  {
    id: 'constantinopla',
    parent: 'constantino',
    year: '330',
    title: 'Fundación de Constantinopla',
    tags: ['roma'],
    shortDesc: 'Constantino refunda la antigua Bizancio como nueva capital del Imperio; será el centro del cristianismo oriental por más de mil años.',
    fullDesc: `<strong>Bizancio</strong> era una antigua colonia griega fundada en el siglo VII a.C. a orillas del Bósforo, el estrecho que separa Europa de Asia.
          Su ubicación la hacía clave para el comercio y la defensa entre ambos continentes.<br><br>
          Tras vencer a Licinio en el 324, Constantino eligió ese lugar para su nueva capital, la reconstruyó a gran escala y la dedicó el <strong>11 de mayo del 330</strong>
          con el nombre de <a href='https://es.wikipedia.org/wiki/Constantinopla' target='_blank' class='inline-link' data-preview='La Nueva Roma'>Constantinopla</a>, "la ciudad de Constantino", también llamada la "Nueva Roma".<br><br>
          <strong>📜 Por qué importa:</strong>
          <ul class='modal-list'>
            <li><strong>Dos centros de poder:</strong> Con el emperador en oriente, el obispo de Roma ganó peso propio en occidente, mientras el de Constantinopla quedó junto al emperador.
            Esa rivalidad terminaría en la separación entre la iglesia de Roma y la ortodoxa oriental (1054).</li>
            <li><strong>El Imperio bizantino:</strong> Cuando cayó el occidente (476), Constantinopla siguió siendo la capital del
            <a href='https://es.wikipedia.org/wiki/Imperio_bizantino' target='_blank' class='inline-link' data-preview='El Imperio bizantino'>Imperio romano de oriente</a> hasta su caída ante los turcos otomanos en 1453.</li>
            <li><strong>El texto griego:</strong> En ese Imperio se copió y transmitió durante siglos el texto griego del Nuevo Testamento conocido como Texto Bizantino o Mayoritario,
            base del <em>Textus Receptus</em> de Erasmo.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/A_view_from_The_Sphendone_of_the_Hippodrome.jpg',
    pendingReview: true,
  },

  {
    id: 'muerte-de-constantino',
    parent: 'constantino',
    year: '337',
    title: 'Constantino se bautiza y muere',
    tags: ['roma'],
    shortDesc: 'En su lecho de muerte, Constantino recibe el bautismo de manos de Eusebio de Nicomedia, un obispo cercano a Arrio.',
    fullDesc: `En la primavera del 337, enfermo, Constantino pidió el bautismo cerca de Nicomedia. Lo bautizó <a href='https://es.wikipedia.org/wiki/Eusebio_de_Nicomedia' target='_blank' class='inline-link' data-preview='Obispo cercano a Arrio'>Eusebio de Nicomedia</a>,
          uno de los principales aliados de Arrio, que había sido desterrado después de Nicea y luego restituido. Constantino murió el <strong>22 de mayo del 337</strong>.<br><br>
          <strong>📜 Lo que revela su bautismo:</strong>
          <ul class='modal-list'>
            <li><strong>Un bautismo aplazado:</strong> Era común en la época posponer el bautismo hasta el final de la vida, por la creencia de que lavaba los pecados cometidos hasta ese momento.
            Es la idea de que "el bautismo salva", ya extendida en el siglo IV.</li>
            <li><strong>El emperador que gobernó la iglesia sin ser miembro:</strong> Convocó Nicea y decidió en disputas entre obispos sin haber sido bautizado.</li>
            <li><strong>El giro de sus últimos años:</strong> Favoreció al partido de Arrio: ordenó readmitir a Arrio y desterró a Atanasio, defensor de Nicea (335).</li>
          </ul>
          Sus hijos se repartieron el Imperio. Constancio II, en oriente, apoyó abiertamente al arrianismo, y las disputas que Nicea pretendía cerrar continuaron por décadas.`,
    image: '',
    pendingReview: true,
  },

  {
    id: 'edicto-de-galerio',
    year: '311',
    title: 'Edicto de Tolerancia de Galerio',
    tags: ['roma', 'historia'],
    shortDesc: 'Galerio, enfermo, reconoce que la persecución fracasó y permite a los cristianos existir y reunirse de nuevo.',
    fullDesc: `El 30 de abril del 311, el emperador <a href='https://es.wikipedia.org/wiki/Galerio' target='_blank' class='inline-link' data-preview='Emperador romano del 305 al 311'>Galerio</a>, el mismo que había impulsado la Gran Persecución,
          publicó en Nicomedia un edicto de tolerancia, también llamado edicto de Sérdica. Gravemente enfermo, murió pocos días después.
          El texto lo conservan <a href='https://es.wikipedia.org/wiki/Lactancio' target='_blank' class='inline-link'>Lactancio</a> y Eusebio.<br><br>
          <strong>📜 Lo que decía:</strong>
          <ul class='modal-list'>
            <li>Reconoce que el propósito de la persecución era que los cristianos volvieran a la religión de sus antepasados, y que <strong>no se logró</strong>:
            muchos ya no adoraban ni a los dioses ni a su propio Dios.</li>
            <li>Permite que <strong>los cristianos existan de nuevo</strong> y reconstruyan sus lugares de reunión, siempre que no actúen contra el orden público.</li>
            <li>Les pide <strong>orar a su Dios</strong> por la salud del emperador, por el Estado y por ellos mismos.</li>
            <li><strong>No</strong> devuelve los bienes confiscados; eso llegará con el edicto de Milán, en el 313.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Galerius_Edict_Sofia_Plaque_03.JPG/960px-Galerius_Edict_Sofia_Plaque_03.JPG',
    pendingReview: true,
  },

  {
    id: 'donatistas',
    year: '~311 – 313',
    title: 'Los donatistas y la iglesia de Roma se separan',
    tags: ['historia', 'landmark'],
    shortDesc: 'En el norte de África, un grupo rechaza al nuevo obispo de Cartago por haber sido consagrado por un supuesto traditor; en 313 un sínodo en Roma falla contra ellos y quedan separados de la iglesia de Roma.',
    fullDesc: `Al terminar la persecución, la iglesia de Cartago eligió como obispo a <strong>Ceciliano</strong>. Un grupo numeroso lo rechazó: uno de los obispos que lo consagraron,
          Félix de Aptunga, era acusado de haber sido <em>traditor</em>, es decir, de haber entregado las Escrituras durante la Gran Persecución.
          Eligieron un obispo rival, Mayorino, y a su muerte a <strong>Donato</strong>, de quien el movimiento tomó su nombre: el
          <a href='https://es.wikipedia.org/wiki/Donatismo' target='_blank' class='inline-link' data-preview='Movimiento del norte de África'>donatismo</a>.<br><br>
          <strong>📜 Semejanzas y diferencias con los novacianos:</strong>
          <ul class='modal-list'>
            <li><strong>Lo que comparten:</strong> Ambos exigían pureza a la iglesia y se negaron a recibir sin más a quienes habían fallado en la persecución.</li>
            <li><strong>Lo propio de los donatistas:</strong> Sostenían que un ministro que había sido <em>traditor</em> no podía realizar actos válidos,
            y por eso <strong>volvían a bautizar</strong> a quienes venían del otro bando.</li>
          </ul>
          <strong>⚠️ El primer conflicto con el Estado:</strong> Los donatistas apelaron al emperador Constantino. Un sínodo en Roma (313) y el concilio de Arlés (314)
          fallaron contra ellos, y Constantino terminó usando la fuerza del Imperio para reprimirlos. Fue la primera vez que el poder del Estado se usó contra cristianos
          por una disputa entre iglesias. Agustín de Hipona defendería esa coacción un siglo después.<br><br>
          La fecha exacta de la consagración de Ceciliano <mark class='dudoso'>está debatida (entre 307 y 312)</mark>.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Augustine_and_donatists.jpg',
    pendingReview: true,
  },

  // ═══════════════════════════════════════════════════════
  //   ERA V · IGLESIA IMPERIAL Y EDAD MEDIA (313 – 1453)
  // ═══════════════════════════════════════════════════════
  {
    id: 'iglesia-imperial',
    era: true,
    year: '313 – 1453',
    title: 'Iglesia Imperial y Edad Media',
    color: '#a088cf',
    shortDesc: 'La iglesia unida al Estado: concilios imperiales, la Vulgata, las cruzadas.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hagia_Sophia_%28228968325%29.jpeg/1280px-Hagia_Sophia_%28228968325%29.jpeg',
    pendingReview: true,
  },

  {
    id: 'edicto-de-tesalonica',
    year: '380',
    title: 'Edicto de Tesalónica',
    tags: ['roma', 'landmark'],
    shortDesc: 'Teodosio I hace del cristianismo niceno la religión obligatoria del Imperio: sólo sus seguidores son "cristianos católicos"; los demás, herejes.',
    fullDesc: `El 27 de febrero del 380, el emperador <a href='https://es.wikipedia.org/wiki/Teodosio_I_el_Grande' target='_blank' class='inline-link' data-preview='Emperador romano del 379 al 395'>Teodosio I</a>, junto con Graciano y Valentiniano II,
          promulgó el <a href='https://es.wikipedia.org/wiki/Edicto_de_Tesal%C3%B3nica' target='_blank' class='inline-link' data-preview='Cunctos populos'>edicto de Tesalónica</a> (<em>Cunctos populos</em>).<br><br>
          <strong>📜 Lo que ordenaba:</strong>
          <ul class='modal-list'>
            <li>Todos los pueblos del Imperio debían seguir la religión transmitida por el apóstol Pedro a los romanos, tal como la profesaban
            <strong>Dámaso, obispo de Roma</strong>, y <strong>Pedro, obispo de Alejandría</strong>.</li>
            <li>Sólo quienes la siguieran podían llamarse <strong>"cristianos católicos"</strong>.</li>
            <li>Los demás eran declarados <strong>herejes</strong>: sus lugares de reunión no podían llamarse iglesias, y quedaban expuestos al castigo divino y al del emperador.</li>
          </ul>
          <strong>⚖️ El final del camino iniciado en el 313:</strong> De ser tolerado (311) y favorecido (313), el cristianismo imperial pasó a ser <strong>obligatorio</strong>.
          La fe dejó de ser una decisión personal para convertirse en un deber civil, y quien disentía de la iglesia oficial pasó a ser también un delincuente ante el Estado.
          Es el mismo Dámaso que poco después encargaría a Jerónimo la Vulgata.`,
    image: '',
    pendingReview: true,
  },

  {
    id: 'vulgata',
    year: '382 – 405',
    title: 'La Vulgata Latina de Jerónimo',
    tags: ['biblia', 'roma'],
    shortDesc: 'Jerónimo de Estridón traduce la Biblia al latín por encargo del Papa Dámaso I, produciendo el texto oficial de la Iglesia Católica.',
    fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Amiatinus_Maiestas_Domini.jpg/960px-Amiatinus_Maiestas_Domini.jpg'
          class='modal-inline-img' alt='Maestà del Señor en el Codex Amiatinus' title='El Codex Amiatinus, una copia de la Vulgata'>
          Por encargo del Papa Dámaso I, <a href='https://es.wikipedia.org/wiki/Jer%C3%B3nimo_(santo)' target='_blank' class='inline-link' data-preview='Traductor de la obra'>Jerónimo de Estridón</a>
          produjo la <a href='https://es.wikipedia.org/wiki/Vulgata' target='_blank' class='inline-link' data-preview='Conoce más de la Vulgata Latina'>Vulgata Latina</a>,
          la traducción oficial de las Escrituras al latín para la Iglesia Católica occidental.<br><br>
          <strong>📚 Fuentes por sección:</strong>
          <ul class='modal-list'>
            <li><strong>Antiguo Testamento:</strong> Traducido directamente del 
            <a href='https://es.wikipedia.org/wiki/Texto_masor%C3%A9tico' target='_blank' class='inline-link' data-preview='El texto hebreo estándar'>Texto Masorético hebreo</a>.
              Jerónimo rechazó la <em>Septuaginta</em> griega por el principio de <em>Hebraica Veritas</em>: consideraba que solo el original hebreo
              era autoritativo, y que la Septuaginta era una traducción griega con imprecisiones — no el texto original.</li>
            <li><strong>Nuevo Testamento:</strong> Revisado desde las <strong>Vetus Latina</strong> (las antiguas traducciones latinas en circulación),
              cotejándolas con manuscritos griegos del siglo IV pertenecientes a la <strong>familia textual alejandrina</strong> — la misma tradición
              que quedó plasmada en códices como el <strong>Codex Vaticanus</strong> (resguardado en la Biblioteca Vaticana desde el siglo XV)
              y el <strong>Codex Sinaiticus</strong> (hallado en el monasterio católico-ortodoxo de Santa Catalina en el Sinaí), ambos manuscritos
              preservados y custodiados exclusivamente por instituciones católicas/ortodoxas. Hoy forman la base del
              <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'><strong>Texto Crítico</strong></a>. No existía aún un Nuevo Testamento griego compilado y estandarizado.</li>
            <li><strong>Apócrifos:</strong> Jerónimo <em>rechazaba</em> los libros deuterocanónicos como no canónicos — los marcó como tales en sus propios prólogos,
              siguiendo el canon hebreo (y contrario a lo que admitió la LXX). Sin embargo, la tradición eclesial y su presencia en la Vetus Latina lo presionaron
              a incluirlos. Los tradujo en parte de mala gana y bajo insistencia de colegas obispos. La Vulgata terminó incluyendo: Tobías, Judit,
              1–2 Macabeos, Sabiduría, Eclesiástico y Baruc. Siglos después, el Concilio de Trento (1546) los declararía formalmente canónicos para la Iglesia Católica.</li>
          </ul>
          La Vulgata se afianzó como el texto oficial eclesiástico en occidente durante toda la Edad Media. La ilustración muestra el
          <a href='https://es.wikipedia.org/wiki/Codex_Amiatinus' target='_blank' class='inline-link' data-preview='Códice completo más antiguo'>Codex Amiatinus</a>
          (siglo VIII), que es básicamente la copia completa más antigua de la Vulgata que sobrevive hasta nuestros días.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/D%C3%BCrer-Hieronymus-im-Geh%C3%A4us.jpg/1280px-D%C3%BCrer-Hieronymus-im-Geh%C3%A4us.jpg',
  },

  {
    id: 'cruzadas',
    year: '1095 – 1291',
    title: 'Las Cruzadas',
    tags: ['historia', 'roma'],
    shortDesc: 'Las cruzadas fueron campañas militares y religiosas promovidas por la Iglesia latina para recuperar o defender Tierra Santa.',
    fullDesc: `La primera gran ola de las <a href='https://es.wikipedia.org/wiki/Cruzadas' target='_blank' class='inline-link' data-preview='Conoce más sobre las Cruzadas'>cruzadas</a>
          comenzó en 1095 con la llamada de Urbano II y se extendió a varias expediciones posteriores para recuperar o defender Tierra Santa.
          Estas campañas combinaron motivos religiosos, políticos y militares, y marcaron profundas tensiones entre cristianos, musulmanes y judíos.<br><br>
          <ul class='modal-list'>
            <li><strong>Primera Cruzada (1095–1099):</strong> Fue la más conocida y terminó con la toma de Jerusalén.</li>
            <li><strong>Expediciones posteriores (1147–1291):</strong> Incluyeron nuevos intentos militares y diplomáticos, aunque con menor éxito general.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SiegeofAntioch.jpeg/960px-SiegeofAntioch.jpeg',
  },

  {
    id: 'concilio-de-constantinopla-381',
    year: '381',
    title: 'Primer Concilio de Constantinopla',
    tags: ['roma'],
    shortDesc: 'Convocado por Teodosio I, completa el credo de Nicea sobre el Espíritu Santo y pone al obispo de Constantinopla en segundo lugar, después del de Roma.',
    fullDesc: `Un año después del Edicto de Tesalónica, el emperador <a href='https://es.wikipedia.org/wiki/Teodosio_I_el_Grande' target='_blank' class='inline-link'>Teodosio I</a> reunió en Constantinopla a unos 150 obispos de oriente
          para cerrar la disputa arriana: el <a href='https://es.wikipedia.org/wiki/Primer_Concilio_de_Constantinopla' target='_blank' class='inline-link'>Primer Concilio de Constantinopla</a>.<br><br>
          <strong>📜 Lo que decidió:</strong>
          <ul class='modal-list'>
            <li><strong>La fe de Nicea:</strong> Confirmó el credo de Nicea y condenó a los arrianos y a quienes negaban la divinidad del Espíritu Santo.</li>
            <li><strong>El credo:</strong> Se le atribuye la forma ampliada del credo, con el artículo sobre el Espíritu Santo, «Señor y dador de vida»: el llamado Credo niceno-constantinopolitano.</li>
            <li><strong>El rango de los obispos:</strong> Su canon 3 da al obispo de Constantinopla «la primacía de honor después del obispo de Roma, porque es la nueva Roma».</li>
          </ul>
          Así como el Edicto de Tesalónica hizo ley del Imperio la fe nicena, este concilio la fijó como doctrina de la iglesia imperial.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Homilies_of_Gregory_the_Theologian_gr._510%2C_f_723.jpg/960px-Homilies_of_Gregory_the_Theologian_gr._510%2C_f_723.jpg',
    pendingReview: true,
  },

  {
    id: 'concilio-de-efeso',
    year: '431',
    title: 'Concilio de Éfeso',
    tags: ['roma'],
    shortDesc: 'Depone a Nestorio y proclama a María «Madre de Dios» (Theotokos), en una asamblea dominada por Cirilo de Alejandría.',
    fullDesc: `<a href='https://es.wikipedia.org/wiki/Nestorio' target='_blank' class='inline-link'>Nestorio</a>, obispo de Constantinopla, enseñaba que a María debía llamársele «madre de Cristo» y no «madre de Dios», porque distinguía con fuerza
          la humanidad y la divinidad de Cristo. Cirilo, obispo de Alejandría, lo acusó de dividir a Cristo en dos personas.<br><br>
          <strong>📜 Lo que pasó en el <a href='https://es.wikipedia.org/wiki/Concilio_de_%C3%89feso' target='_blank' class='inline-link'>Concilio de Éfeso</a>:</strong>
          <ul class='modal-list'>
            <li><strong>Dos reuniones:</strong> Convocado por el emperador Teodosio II, Cirilo lo abrió antes de que llegaran los obispos de Antioquía, que apoyaban a Nestorio.
            Esos obispos tuvieron su propia reunión y condenaron a Cirilo.</li>
            <li><strong>La decisión:</strong> Nestorio fue depuesto y María fue proclamada <em>Theotokos</em> («Madre de Dios»). También se condenó a los seguidores de Pelagio.</li>
            <li><strong>Después:</strong> El título <em>Theotokos</em>, pensado para afirmar que Cristo es Dios, alimentó con los siglos la devoción a María.
            La teología de Nestorio siguió viva en la Iglesia del Oriente, en Persia.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Third_Ecumenical_council_by_V.Surikov_%281876%29.jpg/960px-Third_Ecumenical_council_by_V.Surikov_%281876%29.jpg',
    pendingReview: true,
  },

  {
    id: 'concilio-de-calcedonia',
    year: '451',
    title: 'Concilio de Calcedonia',
    tags: ['roma'],
    shortDesc: 'Define que Cristo es una sola persona en dos naturalezas, divina y humana; las iglesias que lo rechazan se separan de la iglesia imperial.',
    fullDesc: `Convocado por el emperador Marciano, el <a href='https://es.wikipedia.org/wiki/Concilio_de_Calcedonia' target='_blank' class='inline-link'>Concilio de Calcedonia</a> fue el más concurrido de la antigüedad:
          <mark class='dudoso'>más de 500 obispos</mark>, casi todos de oriente.<br><br>
          <strong>📜 Lo que decidió:</strong>
          <ul class='modal-list'>
            <li><strong>Las dos naturalezas:</strong> Cristo es una sola persona «en dos naturalezas, sin confusión, sin cambio, sin división, sin separación».
            Rechazó a la vez a Nestorio y a Eutiques, que fundía las dos naturalezas en una.</li>
            <li><strong>El Tomo de León:</strong> Se leyó la carta del obispo de Roma, León I, y según las actas los obispos aclamaron: «Pedro ha hablado por boca de León».</li>
            <li><strong>Canon 28:</strong> Dio a Constantinopla los mismos privilegios que a Roma. León lo rechazó.</li>
          </ul>
          Las iglesias que no aceptaron Calcedonia, hoy llamadas coptas, armenias, siríacas y etíopes, se separaron de la iglesia imperial.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Fourth_ecumenical_council_of_chalcedon_-_1876.jpg/960px-Fourth_ecumenical_council_of_chalcedon_-_1876.jpg',
    pendingReview: true,
  },

  {
    id: 'segundo-concilio-de-nicea',
    year: '787',
    title: 'Segundo Concilio de Nicea',
    tags: ['roma'],
    shortDesc: 'Convocado por la emperatriz Irene, restaura la veneración de las imágenes frente a los iconoclastas.',
    fullDesc: `Durante buena parte del siglo VIII, emperadores de Constantinopla prohibieron y destruyeron las imágenes religiosas: la <a href='https://es.wikipedia.org/wiki/Iconoclasia' target='_blank' class='inline-link'>iconoclasia</a>.
          La emperatriz Irene convocó el <a href='https://es.wikipedia.org/wiki/Segundo_Concilio_de_Nicea' target='_blank' class='inline-link'>Segundo Concilio de Nicea</a>, el último que reconocen juntas las iglesias católica y ortodoxa.<br><br>
          <strong>📜 Lo que decidió:</strong>
          <ul class='modal-list'>
            <li><strong>Las imágenes:</strong> Ordenó poner en las iglesias imágenes de Cristo, de María, de los ángeles y de los santos, y honrarlas con besos, incienso y luces.</li>
            <li><strong>Veneración y adoración:</strong> Distinguió la «veneración» que se da a las imágenes de la «adoración» que solo corresponde a Dios,
            y afirmó que el honor que se da a la imagen pasa a quien representa.</li>
            <li><strong>En occidente:</strong> El Concilio de Fráncfort (794), bajo Carlomagno, rechazó lo decidido en Nicea, a partir de una mala traducción de sus actas.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Seventh_ecumenical_council_%28Icon%29.jpg',
    pendingReview: true,
  },

  {
    id: 'cuarto-concilio-de-letran',
    year: '1215',
    title: 'IV Concilio de Letrán',
    tags: ['roma', 'landmark'],
    shortDesc: 'Inocencio III reúne el mayor concilio de la Edad Media: define la transubstanciación, impone la confesión anual y ordena perseguir a los herejes.',
    fullDesc: `Convocado por <a href='https://es.wikipedia.org/wiki/Inocencio_III' target='_blank' class='inline-link'>Inocencio III</a> en la cumbre del poder papal, el <a href='https://es.wikipedia.org/wiki/Cuarto_Concilio_de_Letr%C3%A1n' target='_blank' class='inline-link'>IV Concilio de Letrán</a> reunió a
          <mark class='dudoso'>más de 400 obispos</mark>, cientos de abades y enviados de los reyes.<br><br>
          <strong>📜 Algunos de sus 71 cánones:</strong>
          <ul class='modal-list'>
            <li><strong>Canon 1:</strong> Usa por primera vez en un concilio la palabra <a href='https://es.wikipedia.org/wiki/Transustanciaci%C3%B3n' target='_blank' class='inline-link'>transubstanciación</a>: el pan y el vino se convierten en el cuerpo y la sangre de Cristo.</li>
            <li><strong>Canon 3:</strong> Ordena a las autoridades civiles «exterminar» (expulsar) de sus tierras a los herejes señalados por la iglesia, bajo pena de excomunión,
            y promete a quienes los combatan las mismas indulgencias que a los cruzados.</li>
            <li><strong>Canon 21:</strong> Todo fiel debe confesarse con su sacerdote al menos una vez al año y comulgar en Pascua.</li>
            <li><strong>Canon 68:</strong> Judíos y musulmanes deben llevar ropa que los distinga de los cristianos.</li>
          </ul>
          También convocó una nueva cruzada, la quinta.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Matthew_Paris_Chronica_Maiora_Fourth_Lateran_Council.jpg/960px-Matthew_Paris_Chronica_Maiora_Fourth_Lateran_Council.jpg',
    pendingReview: true,
  },

  {
    id: 'concilio-de-constanza',
    year: '1414 – 1418',
    title: 'Concilio de Constanza',
    tags: ['roma', 'historia'],
    shortDesc: 'Termina el Cisma de Occidente, que tenía a tres papas a la vez, y lleva a la hoguera a Jan Hus pese al salvoconducto del emperador.',
    fullDesc: `Desde 1378 la iglesia occidental tenía dos papas, y desde 1409 tres, cada uno con sus reinos aliados. El emperador Segismundo impulsó el
          <a href='https://es.wikipedia.org/wiki/Concilio_de_Constanza' target='_blank' class='inline-link'>Concilio de Constanza</a> para resolverlo.<br><br>
          <strong>📜 Lo que pasó:</strong>
          <ul class='modal-list'>
            <li><strong>De tres papas a uno:</strong> Depuso a Juan XXIII y a Benedicto XIII, aceptó la renuncia de Gregorio XII y eligió a Martín V (1417).</li>
            <li><strong>El concilio sobre el papa:</strong> Su decreto <em>Haec sancta</em> (1415) afirmó que el concilio recibe su autoridad directamente de Cristo y que aun el papa debe obedecerle.</li>
            <li><strong>Jan Hus:</strong> El reformador de Bohemia, <a href='https://es.wikipedia.org/wiki/Jan_Hus' target='_blank' class='inline-link'>Jan Hus</a>, llegó con un salvoconducto de Segismundo. Fue encarcelado, condenado como hereje
            y quemado el 6 de julio de 1415. Su compañero Jerónimo de Praga murió igual en 1416.</li>
            <li><strong>Wycliffe:</strong> Condenó también a Juan Wycliffe, muerto en 1384, y ordenó desenterrar y quemar sus restos, lo que se hizo en 1428.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Vaclav_Brozik_-_Hus.jpg/960px-Vaclav_Brozik_-_Hus.jpg',
    pendingReview: true,
  },

  // ══════════════════════════════════════════════════════
  //   ERA VI · RENACIMIENTO Y PRE-REFORMA (1453 – 1517)
  // ══════════════════════════════════════════════════════
  {
    id: 'renacimiento',
    era: true,
    year: '1453 – 1517',
    title: 'Renacimiento y Pre-Reforma',
    color: '#d3a34a',
    shortDesc: 'La imprenta, la Inquisición y el primer Nuevo Testamento griego impreso.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/View_of_Santa_Maria_del_Fiore_in_Florence.jpg/1280px-View_of_Santa_Maria_del_Fiore_in_Florence.jpg',
    pendingReview: true,
  },

  {
    id: 'gutenberg',
    year: '1454 / 1455',
    title: 'La Imprenta y la Biblia de Gutenberg',
    tags: ['historia', 'biblia'],
    shortDesc: 'Gutenberg cambia la historia al usar tipos móviles para imprimir exitosamente la Biblia de 42 líneas.',
    fullDesc: `En Maguncia, Johannes Gutenberg utiliza su imprenta de tipos móviles para imprimir el primer libro importante en Occidente a gran escala: la
          <a href='https://es.wikipedia.org/wiki/Biblia_de_Gutenberg' target='_blank' class='inline-link' data-preview='Primer libro impreso a gran escala'>Biblia de 42 líneas</a>
          (la versión Vulgata Latina). Este avance revolucionó la sociedad, facilitó la difusión de ideas y proveyó los cimientos tecnológicos vitales
          para el esparcimiento global de la Biblia y la inminente Reforma.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Gutenberg_Bible.jpg',
  },

  {
    id: 'inquisicion',
    year: '1478 – 1834',
    title: 'La Santa Inquisición',
    tags: ['historia', 'roma', 'landmark'],
    shortDesc: 'La Inquisición fue un tribunal eclesial para investigar herejías y proteger la ortodoxia católica.',
    fullDesc: `La <a href='https://es.wikipedia.org/wiki/Santa_Inquisici%C3%B3n' target='_blank' class='inline-link' data-preview='Conoce más sobre la Inquisición'>Santa Inquisición</a>
          surgió como un tribunal eclesial destinado a investigar sospechas de herejía y preservar la ortodoxia en la Iglesia latina.<br><br>
          <ul class='modal-list'>
            <li><strong>Inquisición Medieval (1184):</strong> Fundada originalmente en el sur de Francia (Languedoc) por el Papa Lucio III para combatir a los cátaros y valdenses.</li>
            <li><strong>Inquisición Española (1478):</strong> Establecida por los Reyes Católicos mediante bula papal, se enfocó fuertemente en identificar falsos conversos (judíos y musulmanes que practicaban su fe en secreto) y posteriormente en censurar literatura protestante.</li>
            <li><strong>Inquisición Romana (1542):</strong> El Papa Pablo III estableció la Congregación del Santo Oficio en Roma con el objetivo principal de frenar el alarmante avance del Protestantismo en la península itálica.</li>
            <li><strong>Modo de acción:</strong> Operó a través de juicios sistemáticos, tortura eclesiástica, quema de libros prohibidos (<em>Index Librorum Prohibitorum</em>) y castigos públicos masivos conocidos como <strong>Autos de Fe</strong>.</li>
            <li><strong>Abolición (1834):</strong> Fue oficialmente abolida en España por un real decreto bajo el reinado de Isabel II, tras un largo periodo de declive de su poder.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Pedro_Berruguete_Saint_Dominic_Presiding_over_an_Auto-da-fe_1495.jpg',
  },

  {
    id: 'erasmo',
    year: '1516',
    title: 'Erasmo compila el Textus Receptus',
    tags: ['biblia'],
    shortDesc: 'Erasmo de Rotterdam publica el Novum Instrumentum omne, base de las traducciones bíblicas futuras.',
    fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/9/9b/Justinian555AD.png'
          class='modal-inline-img img-large' alt='Mapa del Imperio Bizantino bajo Justiniano' title='El Imperio Bizantino en su máxima extensión (555 d.C.)'>
          Desiderio Erasmo de Rotterdam compila y publica bajo el título de <em>Novum Instrumentum omne</em> la primera versión impresa del Nuevo Testamento griego,
          acompañada de una nueva traducción al latín. Se basó en manuscritos griegos de la tradición
          <strong>Texto Mayoritario</strong> o <strong>Texto Bizantino</strong> — así llamado porque fue el texto del Nuevo Testamento copiado, preservado y
          transmitido durante siglos a lo largo del <a href='https://es.wikipedia.org/wiki/Imperio_bizantino' target='_blank' class='inline-link' data-preview='El Imperio que preservó el texto griego'>Imperio Bizantino</a>,
          el heredero cristiano oriental del Imperio Romano. Al ser el texto que circuló en la mayor parte de las iglesias griegas durante más de mil años,
          representa la tradición de la <strong>gran mayoría</strong> de manuscritos conocidos del Nuevo Testamento.<br><br>
          Este texto griego (denominado posteriormente <a href='https://es.wikipedia.org/wiki/Textus_Receptus' target='_blank' class='inline-link' data-preview='Texto Recibido en latín'>Textus Receptus</a>)
          sirvió de base innegable para las traducciones bíblicas a las lenguas vernáculas durante la época de la Reforma.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Holbein-erasmus.jpg/1280px-Holbein-erasmus.jpg',
  },

  // ═════════════════════════════════════════════════
  //   ERA VII · LA REFORMA PROTESTANTE (1517 – 1600)
  // ═════════════════════════════════════════════════
  {
    id: 'reforma',
    era: true,
    year: '1517 – 1600',
    title: 'La Reforma Protestante',
    color: '#d46a4f',
    shortDesc: 'Lutero, Calvino, Trento y la consolidación del Textus Receptus.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Europe_religions_1560.jpg',
    pendingReview: true,
  },

  {
    id: 'lutero',
    year: '1517',
    title: 'Martín Lutero y las 95 Tesis',
    tags: ['historia', 'doctrina', 'roma'],
    shortDesc: 'Lutero clava sus tesis en Wittenberg, encendiendo la chispa de la Reforma Protestante.',
    fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/9/9a/Ferdinand_Pauwels_-_Luther_hammers_his_95_theses_to_the_door.jpg'
          class='modal-inline-img' alt='Lutero clavando sus Tesis' title='Lutero clavando las 95 tesis'>
          El 31 de octubre de 1517, el monje Martín Lutero clava sus <a href='https://es.wikipedia.org/wiki/Las_95_tesis' target='_blank' class='inline-link' data-preview='Documento clave de protesta'>95 tesis</a>
          en la puerta de la iglesia del palacio en Wittenberg, Alemania. Con ellas protestaba firmemente contra la venta de indulgencias por parte de la
          Iglesia Católica y los abusos clericales, encendiendo así la irreversible chispa de la Reforma Protestante y recuperando la doctrina de la justificación por la fe sola (Sola Fide).`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Martin_Luther_by_Cranach-restoration.jpg',
  },

  {
    id: 'calvino',
    year: '1536',
    title: 'Calvino: La Doctrina Sistemática de la Reforma',
    tags: ['doctrina'],
    shortDesc: 'Juan Calvino publica la \'Institución de la religión cristiana\', sentando las bases sistemáticas de la fe reformada.',
    fullDesc: `En este año, Juan Calvino publica la primera edición de su obra fundamental: la
          <a href='https://es.wikipedia.org/wiki/Instituci%C3%B3n_de_la_religi%C3%B3n_cristiana' target='_blank' class='inline-link' data-preview='Magnum opus de Calvino'>Institución de la religión cristiana</a>.
          Esta obra monumental sistematizó de manera brillante la teología protestante esparcida, sentando el cuerpo doctrinal inquebrantable de la tradición reformada
          que históricamente originaría al famoso Calvinismo, basándose fuertemente en la Soberanía Absoluta de Dios y las Escrituras.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/John_Calvin_Museum_Catharijneconvent_RMCC_s84_cropped.png/1280px-John_Calvin_Museum_Catharijneconvent_RMCC_s84_cropped.png',
  },

  {
    id: 'trento',
    year: '1545 – 1563',
    title: 'Concilio de Trento',
    tags: ['doctrina', 'historia', 'roma'],
    shortDesc: 'La Iglesia Católica consolida sus dogmas y emite duras condenas en respuesta a la Reforma.',
    fullDesc: `Un influyente concilio ecuménico de la Iglesia Católica que abarcó varias décadas. Durante el <a href='https://es.wikipedia.org/wiki/Concilio_de_Trento' target='_blank' class='inline-link' data-preview='Inicio de la Contrarreforma'>Concilio de Trento</a>
          se trazaron condenas rigurosas en forma de anatemas contra los líderes protestantes y su teología de la fe inicial (como Sola Gratia o Sola Scriptura),
          a la vez que redefinieron y consolidaron todos sus dogmas católicos opuestos.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Tridentinum.jpg/1280px-Tridentinum.jpg',
  },

  {
    id: 'stephanus',
    year: '1551',
    title: 'Stephanus y la Purificación del Texto',
    tags: ['biblia'],
    shortDesc: 'Robert Estienne (Stephanus) edita y mejora el Textus Receptus, añadiendo también los versículos.',
    fullDesc: `El impresor y erudito francés Robert Estienne (conocido como Stephanus) publica impresionantes y definitivas ediciones del Nuevo Testamento Griego, dedicadas fielmente
          a la purificación y consolidación de lo que constituiría el <a href='https://es.wikipedia.org/wiki/Robert_Estienne' target='_blank' class='inline-link' data-preview='Erudito y Tipógrafo bíblico'>Textus Receptus</a>
          estándar (su famosa edición de 1550 u 'O Mirificam'). Posteriormente, in 1551, sería la primera persona en la historia en dividir este texto fundamental
          en versículos numerados. Su obra es el eslabón directo entre Erasmo y Teodoro Beza, consolidando así la línea de transmisión que culminaría en la KJV de 1611.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Portret_van_Robert_I_Estienne_Beroemde_hervormers_%28serietitel%29_Icones_virorum_nostra_patrumq._memoria_illustrium_%28serietitel%29%2C_RP-P-OB-55.218.jpg/1280px-Portret_van_Robert_I_Estienne_Beroemde_hervormers_%28serietitel%29_Icones_virorum_nostra_patrumq._memoria_illustrium_%28serietitel%29%2C_RP-P-OB-55.218.jpg',
  },

  {
    id: 'beza',
    year: '1565 – 1598',
    title: 'Beza y la cumbre del Textus Receptus',
    tags: ['biblia'],
    shortDesc: 'Beza publica varias ediciones del Nuevo Testamento en griego, consolidando el texto de Erasmo y Stephanus conocido como Textus Receptus.',
    fullDesc: `El teólogo y reformador ginebrino <a href='https://es.wikipedia.org/wiki/Teodoro_Beza' target='_blank' class='inline-link' data-preview='Sucesor de Calvino en Ginebra'>Teodoro Beza</a> sucedió a Calvino
          y publicó nueve ediciones principales del Nuevo Testamento griego entre 1565 y 1598. Su trabajo continuó y refinó la obra anterior de Erasmo y Stephanus,
          ayudando a estandarizar y consolidar la lectura del texto bíblico que provenía de la gran mayoría de manuscritos bizantinos descubiertos hasta la fecha.<br><br>
          Estas ediciones de Beza representaron la forma final de lo que posteriormente llegó a conocerse históricamente como el
          <a href='https://es.wikipedia.org/wiki/Textus_Receptus' target='_blank' class='inline-link' data-preview='Conoce el origen del Texto Recibido'>Textus Receptus</a>
          o 'Texto Recibido' por la iglesia protestante. Su Nuevo Testamento griego, junto a sus rigurosas anotaciones y traducciones latinas, proveyó una base
          sólida y uniforme para los traductores de la Reforma en toda Europa.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Theodore_de_Beze.jpg',
  },

  {
    id: 'biblia-del-oso',
    year: '1569',
    title: 'Casiodoro de Reina: La Biblia del Oso',
    tags: ['biblia'],
    shortDesc: 'Casiodoro de Reina traduce la primera Biblia completa al español, basándose firmemente en la cadena pura del Textus Receptus.',
    fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/3/32/Biblia_del_Oso.png' class='modal-inline-img' alt='Portada de la Biblia del Oso' title='El famoso logotipo del oso que procuraba evadir a la Inquisición'>
          Publicada durante su duro exilio en Basilea, Suiza. <a href="https://youtu.be/rrRswC3wZ3Y" target="_blank" class="inline-link" data-preview="Historia de la RV">
          Es la primera traducción de la Biblia completa directamente desde los idiomas originales al español </a>,
          elaborada meticulosamente por <a href='https://es.wikipedia.org/wiki/Casiodoro_de_Reina' target='_blank' class='inline-link' data-preview='Traductor principal'>Casiodoro de Reina</a>.
          Para el Nuevo Testamento se apoyó en el <strong>Textus Receptus (Erasmo → Stephanus)</strong> —la edición más depurada disponible en esos años—, y en el Texto Masorético para el Antiguo Testamento.
          De acuerdo a la 
          <a href="https://archive.org/details/BibliaDeCasiodoroDeReina1569/page/n981/mode/2up" target="_blank" class="inline-link" data-preview="Biblia del Oso escaneada">evidencia documental</a>, ésta incluyó los
          <strong>libros apócrifos</strong> integrados con naturalidad a lo largo del Antiguo Testamento 
          —sin separarlos ni marcarlos en un apéndice distinto, contrario a lo que aseguran otras publicaciones en la web—, imitando la estructura de la Vulgata Latina.
          Reina llegó al punto de incorporar textos tan marginales como <strong>3 Esdras</strong> y <strong>4 Esdras</strong> (conocido como Apocalipsis de Esdras), 
          libros rechazados definitivamente incluso por Roma en el Concilio de Trento.
          Esto revela que se regía más por un afán literario de volcar los manuscritos disponibles a su alcance, que por imponer un filtro teológico o confesional sobre el canon.
          Serían las revisiones protestantes de los siglos posteriores las que excluirían progresivamente este material, perfilando finalmente el canon cerrado evangélico estándar.
          Recibe el apodo de <a href='https://es.wikipedia.org/wiki/Biblia_del_oso' target='_blank' class='inline-link' data-preview='Conoce más sobre esta Biblia'>Biblia del Oso</a>
          por su histórico logotipo de portada utilizado para no revelar que era una Biblia y evitar ser quemada por la Inquisición.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Casiodoro_de_Reina.jpg',
  },

  // ═══════════════════════════════════════════════
  //   ERA VIII · ORTODOXIA PROTESTANTE (1600 – 1800)
  // ═══════════════════════════════════════════════
  {
    id: 'ortodoxia-protestante',
    era: true,
    year: '1600 – 1800',
    title: 'Ortodoxia Protestante',
    color: '#6f90d2',
    shortDesc: 'La Reina-Valera, la King James, Dort y los peregrinos.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Synodedordrecht.jpg',
    pendingReview: true,
  },

  {
    id: 'biblia-del-cantaro',
    year: '1602',
    title: 'Cipriano de Valera: La Biblia del Cántaro',
    tags: ['biblia'],
    shortDesc: 'Cipriano de Valera revisa la traducción de Casiodoro, consolidando la influencia del Textus Receptus en el mundo hispano.',
    fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/5/5f/Portada_de_la_Biblia_del_C%C3%A1ntaro_que_se_conserva_en_la_Biblioteca_Nacional_de_Espa%C3%B1a.jpg'
          class='modal-inline-img' alt='Portada de la Biblia del Cántaro' title='Dos hombres, uno planta y otro riega'>
          <a href='https://es.wikipedia.org/wiki/Cipriano_de_Valera' target='_blank' class='inline-link' data-preview='Compañero reformador español'>Cipriano de Valera</a> publica en Ámsterdam
          la primera revisión exhaustiva a la <a href='https://es.wikipedia.org/wiki/Biblia_del_oso' target='_blank' class='inline-link' data-preview='Traducción original de Casiodoro'>Biblia del Oso</a>.
          Tras más de dos décadas de esfuerzo de revisión minuciosa, esta edición histórica de 1602 es la primera obra en ser llamada y constituida como la Biblia 'Reina-Valera'.
          Para sus ajustes en el Nuevo Testamento, dependió a plenitud en las estables ediciones del <strong>Textus Receptus (Erasmo → Stephanus)</strong>,
          pues las últimas revisiones de Teodoro Beza fueron muy contemporáneas a su arduo trabajo de veinte años.<br><br>
          Adoptó el apodo <a href='https://archive.org/details/BibliaDelCntaro1602/page/n467/mode/2up' target='_blank' class='inline-link' data-preview='Conoce más de su historia'>Del Cántaro</a>
          porque su famosa portada ilustra a dos hombres trabajando: uno plantando un árbol y otro regándolo con un cántaro de agua,
          en alusión directa a la doctrina impartida por Pablo en 1 Corintios 3:6.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Retrato_de_Cipriano_de_Valera_que_aparece_en_La_Biblia_del_Siglo_de_Oro_%289_x_13%29.jpg',
  },

  {
    id: 'remonstrantes',
    year: '1610',
    title: 'Artículos de los Remonstrantes',
    tags: ['doctrina'],
    shortDesc: 'Los seguidores de Arminio expresan oficialmente sus desacuerdos y fuertes objeciones calvinistas.',
    fullDesc: `Los seguidores de Jacobo Arminio publicaron los <strong>Artículos de la Remonstrancia</strong>, oponiéndose a la <a href='#calvino' class='inline-link' data-event='calvino'>ortodoxia calvinista</a> con cinco puntos clave:<br>
          <ul class='modal-list'>
            <li><strong>1. Elección Condicional:</strong> Dios elige basándose en Su presciencia de la fe del hombre.</li>
            <li><strong>2. Expiación Ilimitada:</strong> Cristo murió por toda la humanidad (potencialmente).</li>
            <li><strong>3. Depravación Total:</strong> El hombre necesita la gracia preveniente para poder creer.</li>
            <li><strong>4. Gracia Resistible:</strong> La voluntad humana puede rechazar el llamado de Dios.</li>
            <li><strong>5. Seguridad Condicional:</strong> Posibilidad de caer de la gracia tras haber creído.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Jacobus_Arminius_02_IV_13_2_0026_01_0309_a_Seite_1_Bild_0001.jpg/1280px-Jacobus_Arminius_02_IV_13_2_0026_01_0309_a_Seite_1_Bild_0001.jpg',
  },

  {
    id: 'king-james',
    year: '1611',
    title: 'King James Version (Versión Autorizada)',
    tags: ['biblia'],
    shortDesc: 'Culmina la histórica traducción al inglés apoyada en las ediciones de Beza, siendo la obra cumbre del Textus Receptus en habla inglesa.',
    fullDesc: `Impulsada y autorizada por el mismísimo <strong>Rey Jacobo I</strong> de Inglaterra (razón por la cual tomó el título de <i>King James Version</i> o <i>Versión Autorizada</i>),
          esta monumental obra fue traducida exhaustivamente por 54 prominentes eruditos bíblicos. Este comité no innovó el texto original, sino que dependió
          firmemente en las versiones griegas recién maduradas por Teodoro Beza (1589, 1598) al final del siglo, asaltando la cumbre magistral de la cadena purificadora
          del <strong>Textus Receptus (Erasmo → Stephanus → Beza)</strong>.<br><br>
          Su solemne precisión consolidó y forjó la moderna lengua del inglés e instituyó a su vez a todo el mundo anglosajón firmemente sobre el texto griego
          mayoritario y bizantino, abriendo paso a los avivamientos de los grandes siglos post-reforma.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/KJV-King-James-Version-Bible-first-edition-title-page-1611.jpg/1280px-KJV-King-James-Version-Bible-first-edition-title-page-1611.jpg',
  },

  {
    id: 'dort',
    year: '1618–1619',
    title: 'Sínodo de Dort y el TULIP',
    tags: ['doctrina'],
    shortDesc: 'El Sínodo redacta los Cánones de Dort reafirmando las enseñanzas definitivas doctrinales de Juan Calvino.',
    fullDesc: `En respuesta a la <a href='#remonstrantes' class='inline-link' data-event='remonstrantes'>Remonstrancia</a>, el <a href='https://es.wikipedia.org/wiki/S%C3%ADnodo_de_Dort' target='_blank' class='inline-link' data-preview='Respuesta al arminianismo'>Sínodo de Dort</a>
          articuló los famosos cinco puntos del calvinismo (acróstico <strong>TULIP</strong>):<br>
          <ul class='modal-list'>
            <li><strong>T (Total Depravity):</strong> Depravación Total del hombre. El pecado afecta la voluntad del hombre y no puede buscar a Dios.</li>
            <li><strong>U (Unconditional Election):</strong> Elección Incondicional soberana de Dios. Dios elige sin basarse en la fe del elegido.</li>
            <li><strong>L (Limited Atonement):</strong> Expiación Limitada (Particular). Cristo pagó solo por los elegidos.</li>
            <li><strong>I (Irresistible Grace):</strong> Gracia Irresistible en el llamado. El Espíritu cambia la voluntad del hombre para aceptar el llamado, y el elegido siempre acepta.</li>
            <li><strong>P (Perseverance of the Saints):</strong> Perseverancia y preservación de los santos: «salvo siempre salvo».</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Synodedordrecht.jpg',
  },

  {
    id: 'peregrinos',
    year: '1620',
    title: 'Los Peregrinos llegan a América',
    tags: ['historia'],
    shortDesc: 'Los separatistas puritanos atracan el navío Mayflower en tierra americana buscando libertad.',
    fullDesc: `Un gran grupo de separatistas puritanos, hastiados de la persecución y ahogo forzado de una corrupta Iglesia de Inglaterra, atracan valientemente sobre
          las inexploradas costas de Plymouth en Massachusetts a bordo del famoso navío histórico 'Mayflower'. Buscando libertad absoluta establecieron una colonia
          en el nuevo mundo fuertemente cimentada en ideales y enseñanzas pías, conocidos y elogiados hoy en la historia americana como los verdaderos
          <a href='https://es.wikipedia.org/wiki/Padres_peregrinos' target='_blank' class='inline-link' data-preview='Padres Peregrinos'>Pilgrims</a> o Madres/Padres Peregrinos americanos.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/George-Henry-Boughton-Pilgrims-Going-To-Church.jpg',
  },

  // ═════════════════════════════════════════════════════════════════════════
  //   ERA IX · BAUTISTAS PRIMITIVOS Y REVISIONES HISPANAS (1800 – presente)
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'bautistas-primitivos',
    era: true,
    year: '1800 – presente',
    title: 'Bautistas Primitivos y Revisiones Hispanas',
    color: '#4fae9e',
    shortDesc: 'Kehukee, los Rollos del Mar Muerto y las revisiones de la Reina-Valera.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/KJV-King-James-Version-Bible-first-edition-title-page-1611.jpg/1280px-KJV-King-James-Version-Bible-first-edition-title-page-1611.jpg',
    pendingReview: true,
  },

  {
    id: 'kehukee',
    year: '1827',
    title: 'Declaración de Kehukee',
    tags: ['doctrina', 'historia', 'landmark'],
    shortDesc: 'La Asociación Bautista de Kehukee rechaza las misiones centralizadas, los seminarios y las sociedades bíblicas modernas, dando origen al movimiento Bautista Primitivo.',
    fullDesc: `La <a href='https://en.wikipedia.org/wiki/Kehukee_Primitive_Baptist_Church' target='_blank' class='inline-link' data-preview='Iglesia Primitiva Bautista de Kehukee'>Asociación Bautista de Kehukee</a>
          adoptó en octubre de 1827 la histórica <a href='https://baptiststudiesonline.com/wp-content/uploads/2007/02/the-kehukee-declaration.pdf' target='_blank' class='inline-link' data-preview='Texto original de la Declaración'>Declaración de Kehukee</a>
          en Halifax, Carolina del Norte. Cimentados en la doctrina calvinista de la soberanía absoluta de Dios, los bautistas primitivos rechazaron enfáticamente
          las misiones centralizadas, los seminarios y las sociedades bíblicas modernas por considerarlos innovaciones humanas contrarias a la Regla Reguladora de la iglesia.
          Esta declaración marcó el nacimiento formal del movimiento Bautista Primitivo en América. La iglesia de Kehukee aún existe y puede verse en su
          <a href='https://maps.app.goo.gl/KMk9AFqRkBHoyNoL8' target='_blank' class='inline-link' data-preview='Ver iglesia en Google Maps'>ubicación histórica original en Carolina del Norte</a>.`,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=fL4X7WbmKHZ4liXyya7lsw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=56.005978&pitch=0&thumbfov=100',
  },

  {
    id: 'westcott-y-hort',
    year: '1853 – 1881',
    title: 'Westcott y Hort y el Texto Crítico',
    tags: ['biblia'],
    shortDesc: 'Dos profesores de Cambridge preparan durante casi treinta años un Nuevo Testamento griego basado sobre todo en los códices Vaticano y Sinaítico.',
    fullDesc: `En 1853, <a href='https://es.wikipedia.org/wiki/Brooke_Foss_Westcott' target='_blank' class='inline-link'>Brooke Foss Westcott</a> y <a href='https://es.wikipedia.org/wiki/Fenton_John_Anthony_Hort' target='_blank' class='inline-link'>Fenton John Anthony Hort</a>, profesores de Cambridge, comenzaron a preparar un nuevo texto griego del Nuevo Testamento.
          Lo publicaron en 1881 con el título <em>The New Testament in the Original Greek</em> («El Nuevo Testamento en el griego original»).<br><br>
          <strong>📜 Lo que cambió:</strong>
          <ul class='modal-list'>
            <li><strong>Otros manuscritos:</strong> Dieron preferencia a dos códices del siglo IV, el <a href='https://es.wikipedia.org/wiki/Codex_Vaticanus' target='_blank' class='inline-link'>Vaticano</a> y el Sinaítico, que consideraban los más cercanos al original,
            por encima de la gran mayoría de los manuscritos griegos, que son de la misma familia que los del <a href='#erasmo' class='inline-link' data-event='erasmo'>Textus Receptus</a>.</li>
            <li><strong>Una nueva versión inglesa:</strong> Los dos formaban parte del comité de la <em>Revised Version</em> (1881), la revisión inglesa de la <a href='#king-james' class='inline-link' data-event='king-james'>King James</a>, que en el Nuevo Testamento siguió en buena parte su texto.</li>
            <li><strong>No fueron los primeros:</strong> Antes que ellos, Lachmann, Tischendorf y Tregelles ya habían publicado textos griegos de este tipo; el de Westcott y Hort fue el que se impuso.</li>
            <li><strong>La base del Texto Crítico:</strong> Las ediciones griegas en que se basan hoy la mayoría de las Biblias modernas (<a href='#ubs-nestle-aland-26' class='inline-link' data-event='ubs-nestle-aland-26'>UBS y Nestle-Aland</a>) siguen muy de cerca su texto.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Brooke_Foss_Westcott_by_WE_Miller.jpg',
    pendingReview: true,
  },

  {
    id: 'rv-1865',
    year: '1865',
    title: 'Reina-Valera 1865',
    tags: ['biblia'],
    shortDesc: 'Revisión del Dr. Ángel H. de Mora para la American Bible Society; un panorama textual más complejo de lo que normalmente se piensa.',
    fullDesc: `<p>La <strong>Reina-Valera 1865</strong> (también conocida como <strong>SBA 1865</strong>) es la revisión realizada por el
          <strong>Dr. Ángel H. de Mora</strong> para la <a href='https://es.wikipedia.org/wiki/American_Bible_Society' target='_blank' class='inline-link'>American Bible Society</a>.
          Introdujo numerosos cambios respecto a la edición de 1602 y, según varios investigadores, en algunos lugares siguió la
          <a href='https://es.wikipedia.org/wiki/Vulgata' target='_blank' class='inline-link'>Vulgata Latina</a> o traducciones tradicionales
          en vez del <a href='https://es.wikipedia.org/wiki/Textus_Receptus' target='_blank' class='inline-link'>Textus Receptus</a>.</p>

          <img src='https://assets.lulu.com/cover_thumbs/1/9/19zjk72j-ebook-shortedge-384.jpg'
          class='modal-inline-img' alt='Edición moderna de la RV 1865' title='Edición moderna de la Reina-Valera 1865'>

          <p><strong>📜 ¿Dos estados textuales?</strong></p>
          <p>Existen al menos dos estados textuales asociados a esta revisión, según autores dentro del movimiento de defensa del Textus Receptus:</p>
          <ul class='modal-list'>
            <li><strong>1865 original:</strong> La revisión tal como fue publicada inicialmente, con algunas lecturas procedentes de la Vulgata Latina.</li>
            <li><strong>1865 "revisada":</strong> Una edición posterior cuyo propósito, según descripciones halladas en proyectos de digitalización, fue eliminar las lecturas procedentes de la Vulgata y restaurar las del Textus Receptus, acercando la revisión al texto griego tradicional.</li>
          </ul>

          <p><strong>📖 Un panorama más complejo de lo que parece:</strong></p>
          <p>La introducción del texto digitalizado de la 1865 explica que el ejemplar escaneado representa una <strong>edición de 1884</strong>,
          y que hubo considerable trabajo editorial para distinguir revisiones diferentes de la época (1858, 1862 y 1865).
          Existen múltiples impresiones posteriores (1884, 1907, etc.) con correcciones tipográficas y editoriales, pero estas
          siguen identificándose como la revisión de 1865, no como una nueva revisión oficial.</p>

          <p><strong>⚠️ Nota crítica:</strong></p>
          <p>En cuanto a la afirmación de que existe una "1865 revisada" que elimina lecturas de la Vulgata para acercarse al
          Textus Receptus, <strong>no se ha encontrado documentación primaria que la respalde</strong>. No existe un prólogo, aviso editorial
          o registro histórico conocido que anuncie oficialmente una segunda revisión de la 1865 con ese objetivo.
          El término "revisada" parece describir una impresión corregida o una edición preparada por editores modernos,
          no una segunda revisión oficialmente publicada por la American Bible Society. Esta afirmación aparece repetida
          en algunos círculos defensores del Textus Receptus, pero carece de respaldo documental formal.</p>`,
    image: 'https://static.wixstatic.com/media/a83ea6_a868bbd3c93b404b862e05c9c2e6c3d2~mv2.jpg/v1/fill/w_980,h_1307,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a83ea6_a868bbd3c93b404b862e05c9c2e6c3d2~mv2.jpg',
  },

  {
    id: 'rv-1909',
    year: '1909',
    title: 'Reina-Valera 1909 (La Antigua)',
    tags: ['biblia'],
    shortDesc: 'Revisión histórica muy apreciada, criticada modernamente por permitir lecturas del Texto Crítico.',
    fullDesc: `Publicada por la Sociedad Bíblica Americana y la Británica, la <strong>RV 1909</strong> actualizó la ortografía. Sin embargo, incorporó sutilmente algunas influencias
          del <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'><strong>Texto Crítico</strong></a> en su NT, apartándose del Textus Receptus puro. Esta mezcla motivó los futuros esfuerzos de purificación independiente.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Biblia_Reina-Valera_1909.jpg',
  },

  {
    id: 'primera-guerra-mundial',
    year: '1914 – 1918',
    title: 'Primera Guerra Mundial',
    tags: ['historia'],
    shortDesc: 'Las potencias de Europa y sus imperios se enfrentan en la guerra más mortífera vista hasta entonces. Al terminar caen cuatro imperios, y Jerusalén pasa de manos otomanas a británicas.',
    fullDesc: `La <a href='https://es.wikipedia.org/wiki/Primera_Guerra_Mundial' target='_blank' class='inline-link'>Primera Guerra Mundial</a> empezó en julio de 1914, un mes después de que el archiduque Francisco Fernando de Austria fuera asesinado en Sarajevo, y terminó con el armisticio del 11 de noviembre de 1918.
          De un lado estaban los Aliados (Francia, el Reino Unido, Rusia y, desde 1917, Estados Unidos); del otro, los Imperios Centrales (Alemania, Austria-Hungría, el Imperio otomano y Bulgaria).<br><br>
          <strong>📜 Lo que dejó:</strong>
          <ul class='modal-list'>
            <li><strong>Los muertos:</strong> Murieron <mark class='dudoso'>unos 9 millones de soldados</mark> y millones de civiles.</li>
            <li><strong>Caen cuatro imperios:</strong> El alemán, el austrohúngaro, el ruso y el otomano.</li>
            <li><strong>Jerusalén:</strong> En noviembre de 1917, la <a href='https://es.wikipedia.org/wiki/Declaraci%C3%B3n_Balfour' target='_blank' class='inline-link'>Declaración Balfour</a> anunció el apoyo británico a «un hogar nacional para el pueblo judío» en Palestina.
            En diciembre, las tropas británicas del general Allenby tomaron Jerusalén, después de cuatro siglos de dominio otomano.</li>
            <li><strong>La paz:</strong> El <a href='https://es.wikipedia.org/wiki/Tratado_de_Versalles_%281919%29' target='_blank' class='inline-link'>Tratado de Versalles</a> (1919) impuso duras condiciones a Alemania; muchos historiadores lo cuentan entre las causas de la <a href='#segunda-guerra-mundial' class='inline-link' data-event='segunda-guerra-mundial'>Segunda Guerra Mundial</a>.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Cheshire_Regiment_trench_Somme_1916.jpg',
    pendingReview: true,
  },

  {
    id: 'segunda-guerra-mundial',
    year: '1939 – 1945',
    title: 'Segunda Guerra Mundial',
    tags: ['historia'],
    shortDesc: 'La guerra más mortífera de la historia enfrenta a Alemania, Italia y Japón con los Aliados. En ella, el régimen nazi asesina a unos seis millones de judíos.',
    fullDesc: `La <a href='https://es.wikipedia.org/wiki/Segunda_Guerra_Mundial' target='_blank' class='inline-link'>Segunda Guerra Mundial</a> empezó el 1 de septiembre de 1939, cuando Alemania invadió Polonia, y terminó en 1945: Alemania se rindió en mayo, y Japón en septiembre, después de las bombas atómicas sobre Hiroshima y Nagasaki.
          Sus causas se remontan en parte a la <a href='#primera-guerra-mundial' class='inline-link' data-event='primera-guerra-mundial'>Primera Guerra Mundial</a> y a la paz que la cerró.<br><br>
          <strong>📜 Lo que marcó:</strong>
          <ul class='modal-list'>
            <li><strong>Los muertos:</strong> Se calcula que murieron <mark class='dudoso'>entre 70 y 85 millones de personas</mark>, la mayoría civiles.</li>
            <li><strong>El Holocausto:</strong> El régimen nazi asesinó a unos seis millones de judíos, además de millones de otras víctimas (<a href='https://es.wikipedia.org/wiki/Holocausto' target='_blank' class='inline-link'>Holocausto</a>).</li>
            <li><strong>Roma y el régimen nazi:</strong> En 1933, la Santa Sede firmó un concordato con el gobierno de Hitler, el <a href='https://es.wikipedia.org/wiki/Reichskonkordat' target='_blank' class='inline-link'>Reichskonkordat</a>.</li>
            <li><strong>La Iglesia Confesante:</strong> En 1934, en la <a href='https://es.wikipedia.org/wiki/Declaraci%C3%B3n_de_Barmen' target='_blank' class='inline-link'>Declaración de Barmen</a>, representantes de iglesias protestantes alemanas rechazaron que la iglesia se sometiera a la ideología del régimen.
            Uno de los pastores de la Iglesia Confesante, <a href='https://es.wikipedia.org/wiki/Dietrich_Bonhoeffer' target='_blank' class='inline-link'>Dietrich Bonhoeffer</a>, fue ejecutado en abril de 1945.</li>
            <li><strong>Después:</strong> Se fundó la ONU (1945), y en 1948 se proclamó el Estado de Israel.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/1280px-Into_the_Jaws_of_Death_23-0455M_edit.jpg',
    pendingReview: true,
  },

  {
    id: 'rollos-mar-muerto',
    year: '1947',
    title: 'Descubrimiento de los Rollos del Mar Muerto',
    tags: ['biblia', 'historia'],
    shortDesc: 'Una vasta colección de manuscritos bíblicos antiguos, copiados y preservados por una comunidad judía en el desierto, salen a la luz.',
    fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/1/15/Temple_Scroll.png'
          class='modal-inline-img' alt='Rollo del Templo' title='Fragmento del Rollo del Templo, uno de los manuscritos más largos'>
          Escritos, copiados y preservados entre el siglo III a.C. y el año 68 d.C., los <a href='https://es.wikipedia.org/wiki/Manuscritos_del_Mar_Muerto' target='_blank' class='inline-link' data-preview='Conoce más sobre los Rollos'>Rollos del Mar Muerto</a>
          son una extraordinaria colección de más de 900 manuscritos judíos antiguos. Fueron ocultados en vasijas de barro dentro de varias cuevas rocosas en 
          <strong>Qumrán</strong>, cerca de las áridas costas del Mar Muerto, presumiblemente para protegerlos del avance del ejército romano durante la Gran Revuelta Judía. 
          Su asombroso <strong>descubrimiento a partir de 1947</strong> por un joven pastor beduino sacudió el mundo de la erudición bíblica, constituyendo el mayor hallazgo arqueológico del siglo XX.<br><br>
          <img src='https://upload.wikimedia.org/wikipedia/commons/c/cb/Qumran.jpeg'
          class='modal-inline-img img-large' alt='Cuevas de Qumrán' title='Las cuevas de Qumrán, donde se ocultaron los rollos por casi dos milenios'>
          <strong>📜 ¿Qué se encontró en las cuevas?:</strong>
          <ul class='modal-list'>
            <li><strong>Manuscritos Bíblicos (40%):</strong> Copias de todos los libros del Antiguo Testamento hebreo (excepto Ester). Destaca el <strong>Gran Rollo de Isaías</strong>, el cual demostró una precisión asombrosa en la preservación del texto al ser comparado con el Texto Masorético medieval de mil años después.</li>
            <li><strong>Textos Sectarios (30%):</strong> Documentos exclusivos de la estricta comunidad judía que habitó la zona (probablemente esenios). Incluyen reglas de vida (<em>Regla de la Comunidad</em>), leyes y comentarios interpretativos (<em>Pesher Habacuc</em>), y el curioso <em>Rollo de Cobre</em> que lista tesoros escondidos.</li>
            <li><strong>Literatura Intertestamentaria (30%):</strong> Textos judíos apócrifos y pseudoepigráficos altamente valorados en el judaísmo del Segundo Templo, como copias del <em>Libro de Enoc</em> y el <em>Libro de los Jubileos</em>.</li>
            <li><strong>⚠️ Aclaración importante:</strong> En los Rollos del Mar Muerto <strong>no se encontró absolutamente ningún texto del Nuevo Testamento</strong> ni evangelios gnósticos. Frecuentemente se confunde Qumrán con el hallazgo de la <strong>Biblioteca de Nag Hammadi</strong> (Egipto, 1945), donde sí se descubrió el famoso <em>Evangelio de Tomás</em>. Qumrán fue una biblioteca estrictamente judía precristiana, mientras que Nag Hammadi fue un depósito gnóstico copto posterior.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Jericho_and_Dead_Sea_area_and_River_Jordan._Qumran%2C_caves_where_Dead_Sea_scrolls_were_found._Dead_Sea_in_distance_LOC_matpc.22897_%28cropped_and_level_adjusted%29.jpg',
  },

  {
    id: 'rv-1960',
    year: '1960',
    title: 'Reina-Valera 1960',
    tags: ['biblia'],
    shortDesc: 'Las Sociedades Bíblicas Unidas publican la revisión que se convertiría en la Biblia más amada en el mundo de habla hispana contemporáneo.',
    fullDesc: `<img src='https://m.media-amazon.com/images/S/aplus-media-library-service-media/df26a498-b71f-448b-abca-ea2d839a909c.__CR0,0,350,175_PT0_SX350_V1___.png' class='modal-inline-img' alt='Biblia RVR 1960' title='Reina-Valera 1960'>
          Coordinada por las <a href='https://es.wikipedia.org/wiki/Sociedades_B%C3%ADblicas_Unidas' target='_blank' class='inline-link' data-preview='Unión bíblica global'>Sociedades Bíblicas Unidas (SBU)</a>, esta histórica magna revisión actualizó la gramática
          y el lenguaje de la Biblia para los hispanohablantes modernos mientras conservaba impecablemente la majestad y el estilo rítmico de la antigua traducción.<br><br>
          Gozando de una impresionante aceptación inmediata, la <strong>Reina-Valera 1960</strong> se estandarizó en casi todas las denominaciones evangélicas, siendo
          memorizada por innumerables generaciones. Sin embargo, en términos de pureza manuscrita, el comité revisor tomó una decisión trascendental: no se limitaron
          exclusivamente al <strong>Textus Receptus</strong>. En su lugar, decidieron incorporar en el Nuevo Testamento diversas lecturas provenientes de los
          <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'><strong>Textos Críticos</strong></a> (manuscritos alejandrinos de corte minoritario). Esta separación del fundamento original estricto de Casiodoro de Reina y Valera
          se convirtió en la razón principal por la que, décadas después, los firmes defensores del Texto Recibido iniciarían grandes proyectos de revisión
          para restaurar fielmente la línea tradicional.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Biblia_Reina_Valera_1960.jpg',
  },

  {
    id: 'ubs-nestle-aland-26',
    year: '1966 – 1979',
    title: 'UBS y Nestle-Aland 26: un texto común',
    tags: ['biblia'],
    shortDesc: 'Las dos ediciones del Nuevo Testamento griego más usadas acuerdan un mismo texto, todavía muy cercano al de Westcott y Hort.',
    fullDesc: `En 1966, las <a href='https://es.wikipedia.org/wiki/Sociedades_B%C3%ADblicas_Unidas' target='_blank' class='inline-link'>Sociedades Bíblicas Unidas</a> (UBS, por sus siglas en inglés) publicaron un Nuevo Testamento griego pensado para los traductores de la Biblia.
          Desde 1898 existía además la edición de <a href='https://es.wikipedia.org/wiki/Eberhard_Nestle' target='_blank' class='inline-link'>Eberhard Nestle</a>, continuada después por <a href='https://es.wikipedia.org/wiki/Kurt_Aland' target='_blank' class='inline-link'>Kurt Aland</a>: el <a href='https://es.wikipedia.org/wiki/Novum_Testamentum_Graece' target='_blank' class='inline-link'><em>Nestle-Aland</em></a>, la más usada por los estudiosos.<br><br>
          <strong>📜 Lo que pasó:</strong>
          <ul class='modal-list'>
            <li><strong>Un solo texto:</strong> Con la tercera edición de la UBS (1975) y la 26.ª del Nestle-Aland (1979), las dos quedaron con el mismo texto griego; solo cambian sus notas.</li>
            <li><strong>Cómo se eligió:</strong> Los editores escogieron, pasaje por pasaje, la lectura que consideraban más probable entre todos los manuscritos, dando mucho peso a los más antiguos.</li>
            <li><strong>Cerca de 1881:</strong> El resultado sigue muy cerca del texto de <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'>Westcott y Hort</a>.</li>
            <li><strong>Las Biblias modernas:</strong> Es el texto griego en que se basa la mayoría de las traducciones modernas del Nuevo Testamento.</li>
          </ul>`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/GNT-Committee.jpg',
    pendingReview: true,
  },

  {
    id: 'rv-1602-purificada',
    year: '2001 – 2008',
    title: 'Reina Valera 1602 Purificada',
    tags: ['biblia'],
    shortDesc: 'Revisión bautista completada en Monterrey que purifica el antiguo texto de 1602 hacia la línea pura.',
    fullDesc: `Realizada por la Iglesia Bautista Bíblica de la Gracia en Monterrey (bajo la guía del pastor Raúl Reyes), la
          <a href='https://valera1602.org/' target='_blank' class='inline-link' data-preview='Sitio Oficial 1602 Purificada'>Biblia 1602 Purificada</a>
          surgió como un proyecto solemne para restaurar las bases de la histórica <strong>Biblia de Cipriano de Valera (1602)</strong>. Su propósito primordial es
          purificar al español moderno de todas las incrustaciones críticas que contaminaron las biblias posteriores a 1865, apelando directamente a la autoridad del
          <strong>Textus Receptus</strong> griego y al Texto Masorético hebreo, verificando meticulosamente las lecturas a la par del referente inglés de la <strong>King James Bible (1611)</strong>.`,
    image: 'https://static.wixstatic.com/media/804ef4_e1108eec0c9247f9bd18c77efe0bcc5d~mv2.png/v1/fill/w_310,h_353,al_c,lg_1,q_85,enc_avif,quality_auto/804ef4_e1108eec0c9247f9bd18c77efe0bcc5d~mv2.png',
  },

  {
    id: 'rvg',
    year: '2004 – 2010',
    title: 'Reina Valera Gómez (RVG)',
    tags: ['biblia'],
    shortDesc: 'El Dr. Humberto Gómez lidera un esfuerzo de traducción para ser el paralelo léxico unánime de la histórica King James Version, apoyándose fuertemente en ella.',
    fullDesc: `Coordinada y respaldada cooperativamente por varios ministerios conservadores e iglesias independientes, la
          <a href='https://reinavaleragomez.com/' target='_blank' class='inline-link' data-preview='Sitio Oficial RV Gómez'>RVG</a> fue un esfuerzo dirigido por el Dr. Humberto Gómez.
          Tomando como base y estructura la histórica RV 1909, el equipo de traductores tuvo como norte alinear majestuosamente cada pasaje en el Nuevo Testamento
          para ser la máxima correspondencia léxica y doctrinal paralela en español a la <strong>King James Version (KJV)</strong> inglesa, apoyándose fuertemente en ella.
          Para este noble propósito, la RVG garantizó su completa y exclusiva cimentación sobre el incondicional <strong>Textus Receptus</strong>.`,
    image: 'https://static.wixstatic.com/media/11062b_e769f4593dac4a98834be659eaaca4fd~mv2.jpg/v1/fill/w_2403,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_e769f4593dac4a98834be659eaaca4fd~mv2.jpg',
  },

  {
    id: 'nestle-aland-28',
    year: '2013',
    title: 'Nestle-Aland 28',
    tags: ['biblia'],
    shortDesc: 'La nueva edición cambia el texto de las cartas de Santiago, Pedro, Juan y Judas con una forma nueva de comparar los manuscritos.',
    fullDesc: `En 2013 se publicó la 28.ª edición del <a href='https://es.wikipedia.org/wiki/Novum_Testamentum_Graece' target='_blank' class='inline-link'><em>Nestle-Aland</em></a>; en 2014, la UBS publicó su 5.ª edición con el mismo texto.<br><br>
          <strong>📜 Lo nuevo:</strong>
          <ul class='modal-list'>
            <li><strong>Las cartas generales:</strong> En Santiago, 1 y 2 Pedro, las tres cartas de Juan y Judas (las llamadas cartas «católicas»), cambió el texto en <mark class='dudoso'>unas tres decenas de lugares</mark>,
            siguiendo una nueva edición mayor preparada en Münster, Alemania.</li>
            <li><strong>Una forma nueva de comparar:</strong> Para decidir, los editores midieron con ayuda de computadoras cuánto coincide cada manuscrito con los demás, y así reconstruyeron qué lectura dio origen a las otras.</li>
            <li><strong>Sin el esquema de 1881:</strong> La idea de seguir el parentesco entre los manuscritos sigue viva, pero ya no se ordena en las grandes familias de texto que propusieron <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'>Westcott y Hort</a>.</li>
          </ul>
          El resto del Nuevo Testamento conserva el texto de la <a href='#ubs-nestle-aland-26' class='inline-link' data-event='ubs-nestle-aland-26'>edición 26</a>.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Vatican%2C_Apostolic_Library_Ms_Papyrus_Bodmer_VIII_2_%28Papyrus_72%29_Ending_of_1_Peter_-_Beginning_of_2_Peter.jpg/1280px-Vatican%2C_Apostolic_Library_Ms_Papyrus_Bodmer_VIII_2_%28Papyrus_72%29_Ending_of_1_Peter_-_Beginning_of_2_Peter.jpg',
    pendingReview: true,
  },

  {
    id: 'rv-sbt',
    year: '2020+',
    title: 'Reina Valera SBT',
    tags: ['biblia'],
    shortDesc: 'La Sociedad Bíblica Trinitaria somete la antigua RV 1909 a una revisión magistral amparada en los puros textos originales.',
    fullDesc: `El proyecto histórico liderado por la <a href='https://sociedadbiblicatrinitaria.org/' target='_blank' class='inline-link' data-preview='Página Oficial SBT Hispana'>Sociedad Bíblica Trinitaria (SBT)</a>
          persigue entregar a la esfera hispanohablante una depurada Reina-Valera de altísima calidad tomando como texto primario estructural a la venerable
          <strong>Reina-Valera 1909</strong>. Enmendando todas las infiltraciones del <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'>Texto Crítico</a> que dicha versión albergó por un siglo, este esfuerzo institucional
          asegura depender de forma leal y exclusiva del <strong>Textus Receptus</strong> histórico y del Texto Masorético tradicional hebreo; coronando un inmenso frente
          erudito con el fin de preservar intacta la equivalencia formal de las palabras originales.`,
    image: 'https://sociedadbiblicatrinitaria.org/wp-content/uploads/2025/11/Store01-400x400.jpg',
  },

  {
    id: 'concilio-vaticano-i',
    year: '1869 – 1870',
    title: 'Concilio Vaticano I',
    tags: ['roma'],
    shortDesc: 'Pío IX hace definir la infalibilidad del papa cuando habla ex cathedra y su jurisdicción sobre toda la iglesia.',
    fullDesc: `Convocado por <a href='https://es.wikipedia.org/wiki/P%C3%ADo_IX' target='_blank' class='inline-link'>Pío IX</a>, el <a href='https://es.wikipedia.org/wiki/Concilio_Vaticano_I' target='_blank' class='inline-link'>Concilio Vaticano I</a> fue el primero desde Trento.<br><br>
          <strong>📜 Lo que decidió:</strong>
          <ul class='modal-list'>
            <li><strong><em>Pastor aeternus</em> (18 de julio de 1870):</strong> Definió que el papa, cuando habla <em>ex cathedra</em> sobre fe o moral, es
            <a href='https://es.wikipedia.org/wiki/Infalibilidad_pontificia' target='_blank' class='inline-link'>infalible</a>, y que tiene jurisdicción plena y directa sobre toda la iglesia. Antes de la votación final,
            <mark class='dudoso'>decenas de obispos</mark> contrarios salieron de Roma para no votar en contra.</li>
            <li><strong><em>Dei Filius</em>:</strong> Sobre la fe y la razón.</li>
            <li><strong>Interrumpido:</strong> En septiembre de 1870 las tropas italianas tomaron Roma y el concilio se suspendió sin terminar.</li>
          </ul>
          Quienes rechazaron la infalibilidad formaron la Iglesia Vieja Católica.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/First_Vatican_Council%2C_1869-1870%3B_Pope_Pius_IX_leading_his_Wellcome_V0040850.jpg/960px-First_Vatican_Council%2C_1869-1870%3B_Pope_Pius_IX_leading_his_Wellcome_V0040850.jpg',
    pendingReview: true,
  },

  {
    id: 'concilio-vaticano-ii',
    year: '1962 – 1965',
    title: 'Concilio Vaticano II',
    tags: ['roma'],
    shortDesc: 'Convocado por Juan XXIII y cerrado por Pablo VI: misa en las lenguas de cada pueblo, apertura ecuménica y libertad religiosa, sin definir dogmas nuevos.',
    fullDesc: `Convocado por Juan XXIII y clausurado por Pablo VI, el <a href='https://es.wikipedia.org/wiki/Concilio_Vaticano_II' target='_blank' class='inline-link'>Concilio Vaticano II</a> reunió a
          <mark class='dudoso'>unos 2,500 obispos</mark> de todo el mundo y aprobó 16 documentos.<br><br>
          <strong>📜 Algunos de sus cambios:</strong>
          <ul class='modal-list'>
            <li><strong>La liturgia:</strong> Permitió celebrar la misa en las lenguas de cada pueblo y no solo en latín (<em>Sacrosanctum Concilium</em>).</li>
            <li><strong>Escritura y tradición:</strong> <em>Dei Verbum</em> las presenta como «un solo depósito sagrado de la palabra de Dios», cuya interpretación auténtica corresponde al magisterio de la iglesia.</li>
            <li><strong>Los «hermanos separados»:</strong> Llamó así a protestantes y ortodoxos, y abrió el diálogo ecuménico (<em>Unitatis redintegratio</em>).</li>
            <li><strong>Libertad religiosa:</strong> <em>Dignitatis humanae</em> reconoció el derecho civil a la libertad religiosa.</li>
          </ul>
          No definió dogmas nuevos: mantuvo los de Trento y del Vaticano I.`,
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Second_Vatican_Council_by_Lothar_Wolleh_004.jpg',
    pendingReview: true,
  },
];
