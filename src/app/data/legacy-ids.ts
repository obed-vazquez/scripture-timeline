/**
 * Ids used by the previous version of the site (?event=...), printed in existing QR codes.
 * They were computed from the era name and the position of the event, so they can't be
 * produced again; this table sends each one to the event's new, fixed id.
 */
export const LEGACY_IDS: Record<string, string> = {
  'event-Igl-0--250': 'septuaginta',
  'event-Igl-1-100': 'vetus-latina',
  'event-Igl-2-382': 'vulgata',
  'event-Igl-3-1095': 'cruzadas',
  'event-Ren-0-1454': 'gutenberg',
  'event-Igl-4-1478': 'inquisicion',
  'event-Ren-1-1516': 'erasmo',
  'event-La-0-1517': 'lutero',
  'event-La-1-1536': 'calvino',
  'event-La-2-1545': 'trento',
  'event-La-3-1551': 'stephanus',
  'event-La-4-1565': 'beza',
  'event-Ort-0-1569': 'biblia-del-oso',
  'event-Ort-1-1602': 'biblia-del-cantaro',
  'event-Ort-2-1610': 'remonstrantes',
  'event-Ort-3-1611': 'king-james',
  'event-Ort-4-1618': 'dort',
  'event-Ort-5-1620': 'peregrinos',
  'event-Bau-0-1827': 'kehukee',
  'event-Bau-1-1865': 'rv-1865',
  'event-Bau-2-1909': 'rv-1909',
  'event-Bau-3-1947': 'rollos-mar-muerto',
  'event-Bau-4-1960': 'rv-1960',
  'event-Bau-5-2001': 'rv-1602-purificada',
  'event-Bau-6-2004': 'rvg',
  'event-Bau-7-2020': 'rv-sbt',
};
