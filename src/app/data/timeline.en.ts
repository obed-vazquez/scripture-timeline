import type { TranslationTable } from '../models/i18n.models';

/*
 * English translations — maintained by the implementer (generated during development,
 * no external translation service). Keys: <id>.<field>, tag.<id>.label, guide.<id>.<field>,
 * custom.<block>.<field>.
 *
 *   npm run i18n           → lists missing, stale and pending translations
 *   npm run i18n -- stamp  → stamps new entries (written with src: '') with the hash of their Spanish source
 *
 * Every entry is pending review until the user marks it `reviewed: true`.
 *
 * Glossary (always translated the same way): Textus Receptus · Critical Text · Majority Text ·
 * Byzantine Text · Masoretic Text · Septuagint · Vulgate · Bear Bible (Biblia del Oso) ·
 * Pitcher Bible (Biblia del Cántaro) · Reina-Valera · Roman Catholic Church · Primitive Baptists ·
 * the lapsed (lapsi) · traditores · successionist · bishop · presbyter · elder · apocrypha.
 */
const W = 'https://en.wikipedia.org/wiki/';

export const EN_TRANSLATIONS: TranslationTable = {
  // ── Categories ─────────────────────────────────────────────
  'tag.biblia.label': { src: '6be058fa', text: `Bible Versions` },
  'tag.doctrina.label': { src: 'ace3d14c', text: `Theology and Doctrine` },
  'tag.historia.label': { src: '562e456b', text: `History and Culture` },
  'tag.roma.label': { src: 'fe2a3f6f', text: `Roman Catholic Church` },
  'tag.landmark.label': { src: '30473780', text: `Landmark History` },

  // ── Guides ─────────────────────────────────────────────────
  'guide.biblia.title': { src: '9ca3dc81', text: `The Bible and its versions` },
  'guide.biblia.description': { src: 'bf0d43d0', text: `From the Septuagint to the modern revisions of the Reina-Valera.` },
  'guide.doctrina.title': { src: 'fcaeb56c', text: `Theology and doctrine` },
  'guide.doctrina.description': { src: 'd47705be', text: `Creeds, confessions and controversies that defined the faith.` },
  'guide.historia.title': { src: '258569cb', text: `History and culture` },
  'guide.historia.description': { src: 'd2b4c6d7', text: `The events that shaped the churches and their times.` },
  'guide.roma.title': { src: 'c0dff4c6', text: `The Roman Catholic Church` },
  'guide.roma.description': { src: '823c7e41', text: `How the church joined to the State became the Church of Rome.` },

  // ── Charts and videos ──────────────────────────────────────
  'custom.linea-tr.title': { src: 'b7862c36', text: `The line of the Textus Receptus` },
  'custom.linea-tr.caption': { src: '947d8cb9', text: `Each edition built on the one before. Zoom into a point to see its contribution.` },
  // ── Mapa de doctrinas (Dort) ──
  'custom.mapa-doctrinas.title': { src: 'e30f6ec1', text: `From Luther to Dort` },
  'custom.mapa-doctrinas.caption': { src: '03bb9359', text: `How one position led to the next, and how Rome answered.` },
  'custom.mapa-doctrinas.lutero.label': { src: 'ee2b2e36', text: `Luther` },
  'custom.mapa-doctrinas.lutero.p0': { src: '66e6eea8', text: `Justification by faith alone` },
  'custom.mapa-doctrinas.lutero.p1': { src: '112780e7', text: `Scripture alone` },
  'custom.mapa-doctrinas.calvino.label': { src: 'c9b03cb5', text: `Calvin` },
  'custom.mapa-doctrinas.calvino.p0': { src: '617d3d23', text: `Orders Reformed doctrine into a system` },
  'custom.mapa-doctrinas.calvino.p1': { src: 'cb51bf56', text: `God's sovereignty and predestination` },
  'custom.mapa-doctrinas.remonstrantes.label': { src: '0bc227ce', text: `Remonstrants` },
  'custom.mapa-doctrinas.remonstrantes.p0': { src: '02f1f15c', text: `God elects according to the faith He foresees` },
  'custom.mapa-doctrinas.remonstrantes.p1': { src: 'e93c893f', text: `Grace can be resisted` },
  'custom.mapa-doctrinas.dort.label': { src: '8ca17932', text: `Dort` },
  'custom.mapa-doctrinas.dort.p0': { src: 'e6dde240', text: `Answers point by point` },
  'custom.mapa-doctrinas.dort.p1': { src: '20449d6a', text: `Its canons are summed up today as TULIP` },
  'custom.mapa-doctrinas.trento.label': { src: '84a2ca1d', text: `Trent` },
  'custom.mapa-doctrinas.trento.p0': { src: '75b8dc40', text: `Scripture and tradition with equal reverence (1546)` },
  'custom.mapa-doctrinas.trento.p1': { src: '729f8b45', text: `Condemns justification by faith alone (1547)` },
  'custom.mapa-doctrinas.kehukee.label': { src: 'ae1c4511', text: `Kehukee` },
  'custom.mapa-doctrinas.kehukee.p0': { src: '88876431', text: `Primitive Baptists` },
  'custom.mapa-doctrinas.kehukee.p1': { src: 'dc2159ea', text: `God's sovereignty in salvation` },
  'custom.mapa-doctrinas.kehukee.note': { src: 'af168460', text: `How much Dort influenced them is not known.` },
  'custom.mapa-doctrinas.e1.label': { src: 'd5d1eb4c', text: `systematizes it` },
  'custom.mapa-doctrinas.e2.label': { src: '343b53a1', text: `object to it` },
  'custom.mapa-doctrinas.e3.label': { src: '1cfbcead', text: `answers them` },
  'custom.mapa-doctrinas.e4.label': { src: 'd90d573e', text: `Rome condemns` },
  'custom.mapa-doctrinas.e6.label': { src: '541fe945', text: `agrees in doctrine` },
  'custom.mapa-doctrinas.legend.leads': { src: '62d6c415', text: `One position led to the other` },
  'custom.mapa-doctrinas.legend.against': { src: '5185d36d', text: `Rome answers and condemns` },
  'custom.mapa-doctrinas.legend.coincides': { src: 'e48d576e', text: `Agrees, without coming from it` },
  'custom.mapa-doctrinas.pairs.left': { src: 'dcdb8183', text: `Remonstrants (1610)` },
  'custom.mapa-doctrinas.pairs.right': { src: '1a77a08c', text: `Dort: TULIP (1619)` },
  'custom.mapa-doctrinas.pairs.note': { src: 'c62ff2e2', text: `The Canons of Dort answer articles 3 and 4 in a single chapter (III/IV).` },
  'custom.mapa-doctrinas.r1.label': { src: '936176d5', text: `1. Conditional election` },
  'custom.mapa-doctrinas.r1.sub': { src: '718b0f72', text: `God elects on the basis of His foreknowledge of man's faith.` },
  'custom.mapa-doctrinas.r2.label': { src: '3c87752f', text: `2. Unlimited atonement` },
  'custom.mapa-doctrinas.r2.sub': { src: 'ca1b94db', text: `Christ died for all mankind (potentially).` },
  'custom.mapa-doctrinas.r3.label': { src: '6287919a', text: `3. Total depravity` },
  'custom.mapa-doctrinas.r3.sub': { src: 'b44b3791', text: `Man needs prevenient grace in order to believe.` },
  'custom.mapa-doctrinas.r4.label': { src: '30b296a4', text: `4. Resistible grace` },
  'custom.mapa-doctrinas.r4.sub': { src: 'c03aeb29', text: `The human will can reject God's call.` },
  'custom.mapa-doctrinas.r5.label': { src: 'fef22d83', text: `5. Conditional security` },
  'custom.mapa-doctrinas.r5.sub': { src: '51b3a3dc', text: `It is possible to fall from grace after having believed.` },
  'custom.mapa-doctrinas.t.label': { src: '3d0acf28', text: `T · Total depravity` },
  'custom.mapa-doctrinas.t.sub': { src: '01808edf', text: `Sin affects man's will, and he cannot seek God.` },
  'custom.mapa-doctrinas.u.label': { src: 'cfbac1ed', text: `U · Unconditional election` },
  'custom.mapa-doctrinas.u.sub': { src: 'ce5f3c68', text: `God chooses without basing it on the faith of the chosen.` },
  'custom.mapa-doctrinas.l.label': { src: '18d7333b', text: `L · Limited atonement` },
  'custom.mapa-doctrinas.l.sub': { src: '6ea2bd56', text: `Christ paid only for the elect.` },
  'custom.mapa-doctrinas.i.label': { src: '73a3a105', text: `I · Irresistible grace` },
  'custom.mapa-doctrinas.i.sub': { src: '2f430491', text: `The Spirit changes man's will so that he accepts the call, and the elect always accept it.` },
  'custom.mapa-doctrinas.p.label': { src: '0e0b7fef', text: `P · Perseverance of the saints` },
  'custom.mapa-doctrinas.p.sub': { src: 'd16f3090', text: `"Once saved, always saved."` },
  'custom.linea-tr.erasmo.label': { src: '63203146', text: `Erasmus` },
  'custom.linea-tr.erasmo.detail': { src: 'cc954f98', text: `The first printed Greek New Testament, from manuscripts of the Byzantine tradition.` },
  'custom.linea-tr.stephanus.label': { src: '7f95acee', text: `Stephanus` },
  'custom.linea-tr.stephanus.detail': { src: '1fdf11a2', text: `The "royal" edition of 1550 and, in 1551, the first division of the text into verses.` },
  'custom.linea-tr.beza.label': { src: 'fa705a5d', text: `Beza` },
  'custom.linea-tr.beza.detail': { src: 'a5288107', text: `Nine editions that fix the final form of the Textus Receptus.` },
  'custom.linea-tr.kjv.label': { src: '3512f462', text: `King James` },
  'custom.linea-tr.kjv.detail': { src: 'c33dee22', text: `Translated from Beza's editions: the summit of the Textus Receptus in English.` },
  'custom.linea-tr.reina.label': { src: '58b60f8a', text: `Bear Bible` },
  'custom.linea-tr.reina.detail': { src: '8d514e6a', text: `Casiodoro de Reina translates the New Testament from Erasmus and Stephanus.` },
  'custom.linea-tr.valera.label': { src: '66390d17', text: `Pitcher Bible` },
  'custom.linea-tr.valera.detail': { src: 'ddc61fa2', text: `Cipriano de Valera revises Reina's work with the settled editions of the Textus Receptus.` },
  'custom.video-rv.title': { src: 'aa326127', text: `History of the Reina-Valera version` },
  'custom.video-rv.caption': { src: '3667a75b', text: `Video by BITE (YouTube, in Spanish).` },

  'custom.portada-oso.title': { src: '8f0f1fd5', text: `The 1569 title page` },
  'custom.portada-oso.caption': { src: '3dbb791b', text: `Zoom into each number to see what the title page says.` },
  'custom.portada-oso.image.alt': { src: 'd3033444', text: `Title page of the Bear Bible, 1569` },
  'custom.portada-oso.image.credit': { src: '06da0035', text: `Image: Wikimedia Commons (public domain).` },
  'custom.portada-oso.titulo.label': { src: 'fa886e7d', text: `The title` },
  'custom.portada-oso.titulo.detail': { src: 'ca42238b', text: `"La Biblia, que es, los sacros libros del Viejo y Nuevo Testamento. Trasladada en Español." That is: "The Bible, which is the sacred books of the Old and New Testament. Translated into Spanish."` },
  'custom.portada-oso.oso.label': { src: '57982512', text: `The bear and the honey` },
  'custom.portada-oso.oso.detail': { src: '8d6a35bd', text: `A bear reaches for the honey of a honeycomb in a tree trunk; a mallet hangs over its head and an open book lies at the foot of the tree. It was the emblem of the printer Matthias Apiarius (apiarius is Latin for "beekeeper"): a picture with no religious symbols.` },
  'custom.portada-oso.lema.label': { src: '48a5b4d5', text: `The motto` },
  'custom.portada-oso.lema.detail': { src: 'f796529a', text: `In Hebrew and then in Spanish: "La Palabra del Dios nuestro permanece para siempre" (Isaiah 40:8, Reina 1569), in the KJV "the word of our God shall stand for ever".` },
  'custom.portada-oso.anio.label': { src: 'd2859ae7', text: `The year` },
  'custom.portada-oso.anio.detail': { src: '7c16739b', text: `M. D. LXIX: 1569 in Roman numerals (M = 1000, D = 500, LXIX = 69). It was published in Basel, Switzerland.` },

  'custom.arbol-rv.title': { src: 'b7eabfd8', text: `The Reina-Valera family` },
  'custom.arbol-rv.caption': { src: '0989de83', text: `From Reina's translation to today's revisions. Zoom into a point to see each revision.` },
  'custom.arbol-rv.reina.label': { src: '6ee6df0a', text: `Reina` },
  'custom.arbol-rv.reina.detail': { src: '8a361831', text: `Casiodoro de Reina publishes in Basel the first complete Bible in Spanish.` },
  'custom.arbol-rv.valera.label': { src: '4ce6627e', text: `Valera` },
  'custom.arbol-rv.valera.detail': { src: '76eeb692', text: `Cipriano de Valera revises Reina's translation; hence the name "Reina-Valera".` },
  'custom.arbol-rv.rv1865.label': { src: '48ce4b7b', text: `RV 1865` },
  'custom.arbol-rv.rv1865.detail': { src: '30ed11df', text: `Revision by Dr. Ángel H. de Mora for the American Bible Society.` },
  'custom.arbol-rv.rv1909.label': { src: '369d8322', text: `RV 1909` },
  'custom.arbol-rv.rv1909.detail': { src: '6ff5781d', text: `"La Antigua": much loved, and criticized today for admitting Critical Text readings.` },
  'custom.arbol-rv.rv1960.label': { src: '3399013b', text: `RV 1960` },
  'custom.arbol-rv.rv1960.detail': { src: 'e966144a', text: `Revision by the United Bible Societies starting from the 1909; the most widely used in the Spanish-speaking world.` },
  'custom.arbol-rv.p1602.label': { src: '44fcbcb0', text: `1602 Purificada` },
  'custom.arbol-rv.p1602.detail': { src: '7e64d62d', text: `A Baptist revision made in Monterrey that goes back to Valera's 1602 text.` },
  'custom.arbol-rv.rvg.label': { src: '96ae623a', text: `RVG` },
  'custom.arbol-rv.rvg.detail': { src: 'f2d28e5b', text: `A revision by Humberto Gómez (2004) that checks the RV 1909 against the Textus Receptus and the King James. Its critics say it was conformed to the King James; its defenders, that it is the 1909 without Critical Text readings.` },
  'custom.arbol-rv.sbt.label': { src: '1235a76e', text: `RV SBT` },
  'custom.arbol-rv.sbt.detail': { src: '76b41944', text: `The Trinitarian Bible Society revises the RV 1909 against the original texts.` },

  'custom.mapa-reforma.title': { src: '7a588755', text: `The map of the Reformation` },
  'custom.mapa-reforma.caption': { src: '6dc1cb16', text: `Where the events of this period took place. Zoom into a number.` },
  'custom.mapa-reforma.image.alt': { src: '2f4f7e49', text: `Map of western and central Europe` },
  'custom.mapa-reforma.image.credit': { src: '8fe5766e', text: `Map: Wikimedia Commons (CC BY-SA 3.0).` },
  'custom.mapa-reforma.maguncia.label': { src: 'f51a1f7a', text: `Mainz` },
  'custom.mapa-reforma.maguncia.detail': { src: '6db16038', text: `Gutenberg prints the 42-line Bible with movable type.` },
  'custom.mapa-reforma.basilea.label': { src: '2cc196fa', text: `Basel` },
  'custom.mapa-reforma.basilea.detail': { src: '872c14b0', text: `Erasmus publishes his Greek New Testament (1516). In 1569 the Bear Bible is published here.` },
  'custom.mapa-reforma.wittenberg.label': { src: '2112e740', text: `Wittenberg` },
  'custom.mapa-reforma.wittenberg.detail': { src: '2e87dcea', text: `Luther makes his 95 theses known.` },
  'custom.mapa-reforma.ginebra.label': { src: '269d7193', text: `Geneva` },
  'custom.mapa-reforma.ginebra.detail': { src: '394dead2', text: `Calvin arrives in 1536 and reforms the city. Later Beza and, from 1550, Stephanus work here.` },
  'custom.mapa-reforma.trento.label': { src: '84a2ca1d', text: `Trent` },
  'custom.mapa-reforma.trento.detail': { src: '515e8230', text: `Council of the Catholic Church in response to the Reformation.` },
  'custom.mapa-reforma.amsterdam.label': { src: '647c845b', text: `Amsterdam` },
  'custom.mapa-reforma.amsterdam.detail': { src: 'f8fcef20', text: `Cipriano de Valera publishes his revision of Reina's Bible.` },
  'custom.mapa-reforma.londres.label': { src: '7f8df318', text: `London` },
  'custom.mapa-reforma.londres.detail': { src: '50997a53', text: `The King James is published.` },
  'custom.mapa-reforma.dordrecht.label': { src: '1fa3b310', text: `Dordrecht` },
  'custom.mapa-reforma.dordrecht.detail': { src: 'ebbdcef6', text: `The Synod of Dort answers the Remonstrants.` },

  'custom.cmp-rv60.title': { src: '0652c75d', text: `The RV 1960 and the manuscripts` },
  'custom.cmp-rv60.caption': { src: '816b06d5', text: `What three ancient codices and the RV 1960 do with some readings of the Majority Text. Click a row to read its note.` },
  'custom.cmp-rv60.footnote': { src: '21e23b1d', text: `† Included with a footnote in study editions.` },
  'custom.cmp-rv60.w.m.label': { src: 'c80bfd18', text: `M` },
  'custom.cmp-rv60.w.m.detail': { src: 'df9a5abd', text: `Majority Text` },
  'custom.cmp-rv60.w.v.label': { src: 'd30c0e69', text: `V` },
  'custom.cmp-rv60.w.v.detail': { src: '419ad2a7', text: `Codex Vaticanus, 4th c.` },
  'custom.cmp-rv60.w.s.label': { src: 'd60c1322', text: `S` },
  'custom.cmp-rv60.w.s.detail': { src: '211b047f', text: `Codex Sinaiticus, 4th c.` },
  'custom.cmp-rv60.w.a.label': { src: 'c40bf6cc', text: `A` },
  'custom.cmp-rv60.w.a.detail': { src: 'b3e5f2d6', text: `Codex Alexandrinus, 5th c.` },
  'custom.cmp-rv60.w.rv60.label': { src: '3399013b', text: `RV 1960` },
  'custom.cmp-rv60.w.rv60.detail': { src: '895b946e', text: `Reina-Valera 1960` },
  'custom.cmp-rv60.1jn57.text': { src: 'd5ae0804', text: `"in heaven, the Father, the Word, and the Holy Ghost: and these three are one. And there are three that bear witness in earth"` },
  'custom.cmp-rv60.1jn57.note': { src: '3b4d0129', text: `Comma Johanneum. Absent from the whole early Greek tradition; present only in late manuscripts and in the Vulgate. The RV 1960 includes it, with a footnote in study editions.` },
  'custom.cmp-rv60.mr16.text': { src: '636d42d0', text: `The long ending of Mark (12 verses): the resurrection, the appearances and the Great Commission.` },
  'custom.cmp-rv60.mr16.note': { src: '0c85020d', text: `Cited by Irenaeus (2nd c.) and Tatian; known to Justin Martyr. The RV 1960 includes it, with a footnote in study editions.` },
  'custom.cmp-rv60.hch837.text': { src: '0b2cd687', text: `"And Philip said, If thou believest with all thine heart, thou mayest. And he answered and said, I believe that Jesus Christ is the Son of God."` },
  'custom.cmp-rv60.hch837.note': { src: 'c352b425', text: `The three codices leave out the whole verse; the RV 1960 keeps it.` },
  'custom.cmp-rv60.ro51.text': { src: '0f20b757', text: `"we have peace with God" (ἔχομεν, indicative)` },
  'custom.cmp-rv60.ro51.note': { src: '677bdbf3', text: `V, S and A read "let us have peace" (ἔχωμεν, subjunctive). A single letter in Greek turns a statement into an exhortation. The RV 1960 keeps "tenemos paz" (we have peace).` },
  'custom.cmp-rv60.mt522.text': { src: '09659b31', text: `"whosoever is angry with his brother without a cause" (εἰκῇ)` },
  'custom.cmp-rv60.mt522.note': { src: '95f664e4', text: `V leaves out "without a cause"; S left it out too, and a later corrector added it above the line. A does not preserve this part of Matthew. The RV 1960 leaves out "without a cause".` },
  'custom.cmp-rv60.mr217.text': { src: 'd23420e4', text: `"I came not to call the righteous, but sinners to repentance"` },
  'custom.cmp-rv60.mr217.note': { src: 'dcb9648f', text: `V, S and A leave out "to repentance" (εἰς μετάνοιαν). So does the RV 1960.` },
  'custom.cmp-rv60.mt1720.text': { src: '523ea02a', text: `"Because of your unbelief" (ἀπιστίαν)` },
  'custom.cmp-rv60.mt1720.note': { src: '1ce9e4b7', text: `V and S read "little faith" (ὀλιγοπιστίαν). A does not preserve this part of Matthew. The RV 1960 follows V and S: "poca fe" (little faith).` },

  'custom.historia-rv.title': { src: 'd522fd36', text: `The story of the Reina-Valera` },
  'custom.historia-rv.caption': { src: '64b633d2', text: `Zoom in to open it: the video, the 1569 title page and the chronology.` },
  'custom.historia-rv.cover.alt': { src: 'd3033444', text: `Title page of the Bear Bible, 1569` },
  'custom.cronologia-rv.title': { src: 'c45366ea', text: `Chronology` },
  'custom.cronologia-rv.caption': { src: '03dfc0e7', text: `As told in the BITE video.` },
  'custom.cronologia-rv.e1542.text': { src: '453fc61b', text: `Francisco de Enzinas publishes a New Testament in Spanish.` },
  'custom.cronologia-rv.e1542.note': { src: 'cb1fff4a', text: `Other sources give 1543.` },
  'custom.cronologia-rv.e1550.text': { src: '89652c11', text: `Julián Hernández, "Julianillo", begins smuggling Bibles and Protestant books into Spain; in Seville Juan Ponce de León keeps them.` },
  'custom.cronologia-rv.e1553.text': { src: '31438a63', text: `Two Jews publish in Ferrara a version of the Old Testament.` },
  'custom.cronologia-rv.e1557a.text': { src: '9382c2d7', text: `Juan Pérez de Pineda publishes another version of the New Testament.` },
  'custom.cronologia-rv.e1557b.text': { src: '6df69fd7', text: `Monks flee the monastery of San Isidoro del Campo, in Seville; among them Casiodoro de Reina, Cipriano de Valera and Antonio del Corro.` },
  'custom.cronologia-rv.e1558.text': { src: '61b18234', text: `Casiodoro reaches Geneva and that same year moves to Frankfurt, set on translating the Bible into Spanish.` },
  'custom.cronologia-rv.e1559.text': { src: '08379c34', text: `Juan Ponce de León dies at the stake. Casiodoro reaches London, meets Valera and pastors Spanish refugees.` },
  'custom.cronologia-rv.e1560.text': { src: 'eb959234', text: `On 22 December, Julián Hernández dies at the stake.` },
  'custom.cronologia-rv.e1564.text': { src: '0ea684e1', text: `Casiodoro passes through Antwerp and Frankfurt and reaches France; the Duchess of Ferrara shelters him in her castle, where he meets Pérez de Pineda.` },
  'custom.cronologia-rv.e1564.note': { src: 'd52a6f19', text: `The video names the castle unclearly; it would be Montargis.` },
  'custom.cronologia-rv.e1565.text': { src: 'e7663fd0', text: `He settles in Frankfurt; as a cloth merchant he travels to Strasbourg and Basel, and finishes his translation.` },
  'custom.cronologia-rv.e1567.text': { src: 'cab39dca', text: `Juan Pérez de Pineda dies in Paris and leaves funds to print the Bible.` },
  'custom.cronologia-rv.e1567.note': { src: '216e5f59', text: `The video does not give the year.` },
  'custom.cronologia-rv.e1568.text': { src: 'b119c380', text: `The Basel printer, Johannes Oporinus, dies and the advance is lost.` },
  'custom.cronologia-rv.e1568.note': { src: '216e5f59', text: `The video does not give the year.` },
  'custom.cronologia-rv.e1569.text': { src: '8a72c779', text: `With new help from friends, the Bear Bible is finished in August.` },
  'custom.cronologia-rv.e1594.text': { src: '327923a8', text: `Casiodoro de Reina dies.` },
  'custom.cronologia-rv.e1602.text': { src: '230a49e2', text: `Cipriano de Valera publishes his revision: the Reina-Valera is born.` },
  'custom.cronologia-rv.e1865.text': { src: '6bf9d2dc', text: `The American Bible Society funds a revision led by a Spanish and an American missionary.` },
  'custom.cronologia-rv.e1909.text': { src: '8dcd94c8', text: `A committee of the American and British Bible Societies, formed in 1907, publishes the RV 1909.` },
  'custom.cronologia-rv.e1960.text': { src: 'fc18ea02', text: `Bible scholars from several Spanish-speaking countries make the best-known revision: the RV 1960.` },

  'custom.linea-251.title': { src: '805a16fd', text: `251: the year of the lapsi` },
  'custom.linea-251.caption': { src: '4005546e', text: `What happened around the synod. Zoom into a point to see the detail.` },
  'custom.linea-251.decio.label': { src: '087ebd00', text: `Edict of Decius` },
  'custom.linea-251.decio.detail': { src: '5bf8fbba', text: `Decius orders everyone to sacrifice to the gods. Many Christians give in: they are the lapsi.` },
  'custom.linea-251.cornelio.label': { src: 'e014782e', text: `Cornelius, bishop` },
  'custom.linea-251.cornelio.detail': { src: '4c8a189d', text: `After more than a year without a bishop in Rome, Cornelius is elected. He receives the lapsi after a penance.` },
  'custom.linea-251.novaciano.label': { src: '869b6901', text: `Novatian` },
  'custom.linea-251.novaciano.detail': { src: 'f3d7c967', text: `The presbyter Novatian will not take the lapsi back. His opponents accuse him of having himself consecrated bishop of Rome when there already was one.` },
  'custom.linea-251.cartago.label': { src: '6e0bfb4b', text: `Council of Carthage` },
  'custom.linea-251.cartago.detail': { src: '70eea96f', text: `Cyprian gathers the bishops of Africa: the lapsi may return after a penance.` },
  'custom.linea-251.decio-muere.label': { src: 'bca03abf', text: `Decius dies` },
  'custom.linea-251.decio-muere.detail': { src: '49a4f1c0', text: `Decius dies in battle against the Goths and the persecution ends.` },
  'custom.linea-251.sinodo.label': { src: 'd200a687', text: `Synod of Rome` },
  'custom.linea-251.sinodo.detail': { src: '55cd1ad7', text: `About 60 bishops back Cornelius and excommunicate Novatian, blaming him for that consecration and for not accepting the lapsi.` },
  'custom.linea-251.cornelio-muere.label': { src: '7394d1b6', text: `Cornelius dies` },
  'custom.linea-251.cornelio-muere.detail': { src: 'e4d138ef', text: `Banished by the emperor Gallus, Cornelius dies in exile.` },

  // ── Critical Text ──
  'westcott-y-hort.title': { src: 'cd1e8a67', text: `Westcott and Hort and the Critical Text` },
  'westcott-y-hort.shortDesc': { src: 'ddfd7123', text: `Two Cambridge professors spend almost thirty years preparing a Greek New Testament based above all on the Vatican and Sinai codices.` },
  'westcott-y-hort.fullDesc': { src: 'c028123e', text: `In 1853, <a href='${W}Brooke_Foss_Westcott' target='_blank' class='inline-link'>Brooke Foss Westcott</a> and <a href='${W}Fenton_John_Anthony_Hort' target='_blank' class='inline-link'>Fenton John Anthony Hort</a>, professors at Cambridge, began to prepare a new Greek text of the New Testament.
          They published it in 1881 under the title <em><a href='${W}The_New_Testament_in_the_Original_Greek' target='_blank' class='inline-link'>The New Testament in the Original Greek</a></em>.<br><br>
          <strong>📜 What changed:</strong>
          <ul class='modal-list'>
            <li><strong>Other manuscripts:</strong> They preferred two fourth-century codices, the <a href='${W}Codex_Vaticanus' target='_blank' class='inline-link'>Vatican</a> and the Sinai codex, which they held to be the closest to the original,
            over the great majority of Greek manuscripts, which belong to the same family as those of the <a href='#erasmo' class='inline-link' data-event='erasmo'>Textus Receptus</a>.</li>
            <li><strong>A new English version:</strong> Both sat on the committee of the <a href='${W}Revised_Version' target='_blank' class='inline-link'><em>Revised Version</em></a> (1881), the English revision of the <a href='#king-james' class='inline-link' data-event='king-james'>King James</a>, whose New Testament largely followed their text.</li>
            <li><strong>They were not the first:</strong> Before them, Lachmann, Tischendorf and Tregelles had already published Greek texts of this kind; Westcott and Hort's was the one that prevailed.</li>
            <li><strong>The basis of the Critical Text:</strong> The Greek editions on which most modern Bibles are based today (<a href='#ubs-nestle-aland-26' class='inline-link' data-event='ubs-nestle-aland-26'>UBS and Nestle-Aland</a>) follow their text closely.</li>
          </ul>` },
  'ubs-nestle-aland-26.title': { src: '11cb2d7a', text: `UBS and Nestle-Aland 26: a common text` },
  'ubs-nestle-aland-26.shortDesc': { src: 'a879d05f', text: `The two most used editions of the Greek New Testament agree on one text, still very close to Westcott and Hort's.` },
  'ubs-nestle-aland-26.fullDesc': { src: '9dc64989', text: `In 1966, the United Bible Societies (UBS) published a Greek New Testament meant for Bible translators.
          Since 1898 there had also been the edition of Eberhard Nestle, later carried on by Kurt Aland: the <a href='${W}Novum_Testamentum_Graece' target='_blank' class='inline-link'><em>Nestle-Aland</em></a>, the one most used by scholars.<br><br>
          <strong>📜 What happened:</strong>
          <ul class='modal-list'>
            <li><strong>One text:</strong> With the third edition of the UBS (1975) and the 26th of the Nestle-Aland (1979), both ended up with the same Greek text; only their notes differ.</li>
            <li><strong>How it was chosen:</strong> The editors chose, passage by passage, the reading they held most likely among all the manuscripts, giving great weight to the oldest ones.</li>
            <li><strong>Close to 1881:</strong> The result remains very close to the text of <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'>Westcott and Hort</a>.</li>
            <li><strong>Modern Bibles:</strong> It is the Greek text on which most modern translations of the New Testament are based.</li>
          </ul>` },
  'nestle-aland-28.title': { src: '328998f3', text: `Nestle-Aland 28` },
  'nestle-aland-28.shortDesc': { src: '2c89cd2e', text: `The new edition changes the text of the letters of James, Peter, John and Jude with a new way of comparing the manuscripts.` },
  'nestle-aland-28.fullDesc': { src: 'ad56a7fd', text: `In 2013 the 28th edition of the <a href='${W}Novum_Testamentum_Graece' target='_blank' class='inline-link'><em>Nestle-Aland</em></a> was published; in 2014, the UBS published its 5th edition with the same text.<br><br>
          <strong>📜 What is new:</strong>
          <ul class='modal-list'>
            <li><strong>The general letters:</strong> In James, 1 and 2 Peter, the three letters of John and Jude (the so-called "catholic" letters), it changed the text in <mark class='dudoso'>about thirty places</mark>,
            following a new major edition prepared in Münster, Germany.</li>
            <li><strong>A new way of comparing:</strong> To decide, the editors measured with the help of computers how far each manuscript agrees with the others, and so reconstructed which reading gave rise to the rest.</li>
            <li><strong>Without the 1881 scheme:</strong> The idea of tracing the kinship between manuscripts lives on, but it is no longer arranged in the great text families that <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'>Westcott and Hort</a> proposed.</li>
          </ul>
          The rest of the New Testament keeps the text of the <a href='#ubs-nestle-aland-26' class='inline-link' data-event='ubs-nestle-aland-26'>26th edition</a>.` },
  // ── World wars ──
  'primera-guerra-mundial.title': { src: '8d7ff6d7', text: `World War I` },
  'primera-guerra-mundial.shortDesc': { src: 'b125c90b', text: `The powers of Europe and their empires clash in the deadliest war seen until then. When it ends, four empires fall, and Jerusalem passes from Ottoman to British hands.` },
  'primera-guerra-mundial.fullDesc': { src: 'cab59c96', text: `<a href='${W}World_War_I' target='_blank' class='inline-link'>World War I</a> began in July 1914, a month after Archduke Franz Ferdinand of Austria was assassinated in Sarajevo, and ended with the armistice of 11 November 1918.
          On one side were the Allies (France, the United Kingdom, Russia and, from 1917, the United States); on the other, the Central Powers (Germany, Austria-Hungary, the Ottoman Empire and Bulgaria).<br><br>
          <strong>📜 What it left behind:</strong>
          <ul class='modal-list'>
            <li><strong>The dead:</strong> <mark class='dudoso'>About 9 million soldiers</mark> died, and millions of civilians.</li>
            <li><strong>Four empires fall:</strong> The German, the Austro-Hungarian, the Russian and the Ottoman.</li>
            <li><strong>Jerusalem:</strong> In November 1917, the <a href='${W}Balfour_Declaration' target='_blank' class='inline-link'>Balfour Declaration</a> announced British support for "a national home for the Jewish people" in Palestine.
            In December, the British troops of General Allenby took Jerusalem, after four centuries of Ottoman rule.</li>
            <li><strong>The peace:</strong> The <a href='${W}Treaty_of_Versailles' target='_blank' class='inline-link'>Treaty of Versailles</a> (1919) imposed harsh terms on Germany; many historians count it among the causes of <a href='#segunda-guerra-mundial' class='inline-link' data-event='segunda-guerra-mundial'>World War II</a>.</li>
          </ul>` },
  'segunda-guerra-mundial.title': { src: '2e3e1b5a', text: `World War II` },
  'segunda-guerra-mundial.shortDesc': { src: 'f6a01bb4', text: `The deadliest war in history sets Germany, Italy and Japan against the Allies. In it, the Nazi regime murders about six million Jews.` },
  'segunda-guerra-mundial.fullDesc': { src: '6961ba98', text: `<a href='${W}World_War_II' target='_blank' class='inline-link'>World War II</a> began on 1 September 1939, when Germany invaded Poland, and ended in 1945: Germany surrendered in May, and Japan in September, after the atomic bombs on Hiroshima and Nagasaki.
          Its causes go back in part to <a href='#primera-guerra-mundial' class='inline-link' data-event='primera-guerra-mundial'>World War I</a> and the peace that closed it.<br><br>
          <strong>📜 What marked it:</strong>
          <ul class='modal-list'>
            <li><strong>The dead:</strong> An estimated <mark class='dudoso'>70 to 85 million people</mark> died, most of them civilians.</li>
            <li><strong>The Holocaust:</strong> The Nazi regime murdered about six million Jews, besides millions of other victims (<a href='${W}The_Holocaust' target='_blank' class='inline-link'>Holocaust</a>).</li>
            <li><strong>Rome and the Nazi regime:</strong> In 1933, the Holy See signed a concordat with Hitler's government, the <a href='${W}Reichskonkordat' target='_blank' class='inline-link'>Reichskonkordat</a>.</li>
            <li><strong>The Confessing Church:</strong> In 1934, in the <a href='${W}Barmen_Declaration' target='_blank' class='inline-link'>Barmen Declaration</a>, representatives of German Protestant churches rejected the church's submission to the regime's ideology.
            One of the pastors of the Confessing Church, <a href='${W}Dietrich_Bonhoeffer' target='_blank' class='inline-link'>Dietrich Bonhoeffer</a>, was executed in April 1945.</li>
            <li><strong>Afterwards:</strong> The UN was founded (1945), and in 1948 the State of Israel was proclaimed.</li>
          </ul>` },
  // ── Councils ────────────────────────────────────────────
  'concilio-de-jerusalen.title': { src: '9a558ac7', text: `Council of Jerusalem` },
  'concilio-de-jerusalen.shortDesc': { src: 'fc9e2ede', text: `The apostles and elders, with the whole church of Jerusalem, resolve that Gentile believers need not be circumcised to be saved.` },
  'concilio-de-jerusalen.fullDesc': { src: 'efa8ccb3', text: `Certain men which came down from Judea taught the brethren of Antioch: "Except ye be circumcised after the manner of Moses, ye cannot be saved" (Acts 15:1, KJV).
          Paul and Barnabas went up to Jerusalem to settle the question with the apostles and elders. This is the <a href='${W}Council_of_Jerusalem' target='_blank' class='inline-link'>Council of Jerusalem</a>.<br><br>
          <strong>📜 What Acts 15 tells:</strong>
          <ul class='modal-list'>
            <li><strong>Peter:</strong> "We believe that through the grace of the Lord Jesus Christ we shall be saved, even as they" (Acts 15:11, KJV).</li>
            <li><strong>James:</strong> He proposes not to trouble the Gentiles who turn to God, but to write unto them "that they abstain from pollutions of idols, and from fornication, and from things strangled, and from blood" (Acts 15:19–20, KJV).</li>
            <li><strong>The decision:</strong> "Then pleased it the apostles and elders, with the whole church", to send a letter to Antioch with that agreement (Acts 15:22–29, KJV).</li>
          </ul>
          Acts gives no date; the one most often given is around <mark class='dudoso'>49 or 50</mark>.` },
  'concilio-de-constantinopla-381.title': { src: '395e599c', text: `First Council of Constantinople` },
  'concilio-de-constantinopla-381.shortDesc': { src: 'd76d8b56', text: `Called by Theodosius I, it completes the Nicene creed on the Holy Spirit and places the bishop of Constantinople second, after the bishop of Rome.` },
  'concilio-de-constantinopla-381.fullDesc': { src: '49c89aa1', text: `A year after the Edict of Thessalonica, the emperor <a href='${W}Theodosius_I' target='_blank' class='inline-link'>Theodosius I</a> gathered some 150 eastern bishops in Constantinople
          to close the Arian dispute: the <a href='${W}First_Council_of_Constantinople' target='_blank' class='inline-link'>First Council of Constantinople</a>.<br><br>
          <strong>📜 What it decided:</strong>
          <ul class='modal-list'>
            <li><strong>The faith of Nicaea:</strong> It confirmed the Nicene creed and condemned the Arians and those who denied the divinity of the Holy Spirit.</li>
            <li><strong>The creed:</strong> The enlarged form of the creed, with the article on the Holy Spirit, "the Lord and giver of life", is attributed to it: the so-called Niceno-Constantinopolitan Creed.</li>
            <li><strong>The rank of bishops:</strong> Its canon 3 gives the bishop of Constantinople "the primacy of honour after the bishop of Rome, because it is New Rome".</li>
          </ul>
          Just as the Edict of Thessalonica made the Nicene faith the law of the Empire, this council fixed it as the doctrine of the imperial church.` },
  'concilio-de-efeso.title': { src: '260322f8', text: `Council of Ephesus` },
  'concilio-de-efeso.shortDesc': { src: '6498f4be', text: `It deposes Nestorius and proclaims Mary "Mother of God" (Theotokos), in an assembly dominated by Cyril of Alexandria.` },
  'concilio-de-efeso.fullDesc': { src: 'fbe69b96', text: `<a href='${W}Nestorius' target='_blank' class='inline-link'>Nestorius</a>, bishop of Constantinople, taught that Mary should be called "mother of Christ" and not "mother of God", because he sharply distinguished
          the humanity and the divinity of Christ. Cyril, bishop of Alexandria, accused him of dividing Christ into two persons.<br><br>
          <strong>📜 What happened at the <a href='${W}Council_of_Ephesus' target='_blank' class='inline-link'>Council of Ephesus</a>:</strong>
          <ul class='modal-list'>
            <li><strong>Two meetings:</strong> Called by the emperor Theodosius II, it was opened by Cyril before the bishops of Antioch, who supported Nestorius, arrived.
            Those bishops held their own meeting and condemned Cyril.</li>
            <li><strong>The decision:</strong> Nestorius was deposed and Mary was proclaimed <em>Theotokos</em> ("Mother of God"). The followers of Pelagius were also condemned.</li>
            <li><strong>Afterwards:</strong> The title <em>Theotokos</em>, meant to affirm that Christ is God, fed devotion to Mary over the centuries.
            Nestorius's theology lived on in the Church of the East, in Persia.</li>
          </ul>` },
  'concilio-de-calcedonia.title': { src: '1f7f2bef', text: `Council of Chalcedon` },
  'concilio-de-calcedonia.shortDesc': { src: '0a95b504', text: `It defines that Christ is one person in two natures, divine and human; the churches that reject it separate from the imperial church.` },
  'concilio-de-calcedonia.fullDesc': { src: '66deb7f5', text: `Called by the emperor Marcian, the <a href='${W}Council_of_Chalcedon' target='_blank' class='inline-link'>Council of Chalcedon</a> was the largest of antiquity:
          <mark class='dudoso'>more than 500 bishops</mark>, almost all from the East.<br><br>
          <strong>📜 What it decided:</strong>
          <ul class='modal-list'>
            <li><strong>The two natures:</strong> Christ is one person "in two natures, without confusion, without change, without division, without separation".
            It rejected both Nestorius and Eutyches, who merged the two natures into one.</li>
            <li><strong>The Tome of Leo:</strong> The letter of the bishop of Rome, Leo I, was read, and according to the acts the bishops acclaimed: "Peter has spoken through Leo".</li>
            <li><strong>Canon 28:</strong> It gave Constantinople the same privileges as Rome. Leo rejected it.</li>
          </ul>
          The churches that did not accept Chalcedon, today called Coptic, Armenian, Syriac and Ethiopian, separated from the imperial church.` },
  'segundo-concilio-de-nicea.title': { src: '1c16bccb', text: `Second Council of Nicaea` },
  'segundo-concilio-de-nicea.shortDesc': { src: '2ecc6af3', text: `Called by the empress Irene, it restores the veneration of images against the iconoclasts.` },
  'segundo-concilio-de-nicea.fullDesc': { src: '3afcef98', text: `For much of the 8th century, emperors in Constantinople banned and destroyed religious images: <a href='${W}Byzantine_Iconoclasm' target='_blank' class='inline-link'>iconoclasm</a>.
          The empress Irene called the <a href='${W}Second_Council_of_Nicaea' target='_blank' class='inline-link'>Second Council of Nicaea</a>, the last one recognised by both the Catholic and the Orthodox churches.<br><br>
          <strong>📜 What it decided:</strong>
          <ul class='modal-list'>
            <li><strong>The images:</strong> It ordered images of Christ, of Mary, of the angels and of the saints to be set up in churches and honoured with kisses, incense and lights.</li>
            <li><strong>Veneration and worship:</strong> It distinguished the "veneration" given to images from the "worship" due to God alone,
            and stated that the honour given to the image passes to the one it represents.</li>
            <li><strong>In the West:</strong> The Council of Frankfurt (794), under Charlemagne, rejected what Nicaea had decided, working from a poor translation of its acts.</li>
          </ul>` },
  'cuarto-concilio-de-letran.title': { src: '96872d95', text: `Fourth Lateran Council` },
  'cuarto-concilio-de-letran.shortDesc': { src: 'c5da21e6', text: `Innocent III gathers the largest council of the Middle Ages: it defines transubstantiation, imposes yearly confession and orders heretics to be pursued.` },
  'cuarto-concilio-de-letran.fullDesc': { src: '60e78a46', text: `Called by <a href='${W}Pope_Innocent_III' target='_blank' class='inline-link'>Innocent III</a> at the height of papal power, the <a href='${W}Fourth_Council_of_the_Lateran' target='_blank' class='inline-link'>Fourth Lateran Council</a> gathered
          <mark class='dudoso'>more than 400 bishops</mark>, hundreds of abbots and envoys of the kings.<br><br>
          <strong>📜 Some of its 71 canons:</strong>
          <ul class='modal-list'>
            <li><strong>Canon 1:</strong> For the first time a council uses the word <a href='${W}Transubstantiation' target='_blank' class='inline-link'>transubstantiation</a>: the bread and wine are changed into the body and blood of Christ.</li>
            <li><strong>Canon 3:</strong> It orders civil authorities to "exterminate" (drive out) from their lands the heretics pointed out by the church, on pain of excommunication,
            and promises those who fight them the same indulgences as crusaders.</li>
            <li><strong>Canon 21:</strong> Every believer must confess to his priest at least once a year and receive communion at Easter.</li>
            <li><strong>Canon 68:</strong> Jews and Muslims must wear clothing that sets them apart from Christians.</li>
          </ul>
          It also called a new crusade, the fifth.` },
  'concilio-de-constanza.title': { src: 'b665affd', text: `Council of Constance` },
  'concilio-de-constanza.shortDesc': { src: '276d1df5', text: `It ends the Western Schism, with three popes at once, and sends Jan Hus to the stake despite the emperor's safe-conduct.` },
  'concilio-de-constanza.fullDesc': { src: 'b249b80f', text: `From 1378 the Western church had two popes, and from 1409 three, each with his allied kingdoms. The emperor Sigismund pushed for the
          <a href='${W}Council_of_Constance' target='_blank' class='inline-link'>Council of Constance</a> to resolve it.<br><br>
          <strong>📜 What happened:</strong>
          <ul class='modal-list'>
            <li><strong>From three popes to one:</strong> It deposed John XXIII and Benedict XIII, accepted the resignation of Gregory XII and elected Martin V (1417).</li>
            <li><strong>The council above the pope:</strong> Its decree <em>Haec sancta</em> (1415) stated that the council receives its authority directly from Christ and that even the pope must obey it.</li>
            <li><strong>Jan Hus:</strong> The Bohemian reformer <a href='${W}Jan_Hus' target='_blank' class='inline-link'>Jan Hus</a> came with a safe-conduct from Sigismund. He was imprisoned, condemned as a heretic
            and burned on 6 July 1415. His companion Jerome of Prague died the same way in 1416.</li>
            <li><strong>Wycliffe:</strong> It also condemned John Wycliffe, who had died in 1384, and ordered his remains dug up and burned, which was done in 1428.</li>
          </ul>` },
  'concilio-vaticano-i.title': { src: '8e04e805', text: `First Vatican Council` },
  'concilio-vaticano-i.shortDesc': { src: 'd4753dba', text: `Pius IX has the council define the infallibility of the pope when he speaks ex cathedra and his jurisdiction over the whole church.` },
  'concilio-vaticano-i.fullDesc': { src: '0c1e6ba0', text: `Called by <a href='${W}Pope_Pius_IX' target='_blank' class='inline-link'>Pius IX</a>, the <a href='${W}First_Vatican_Council' target='_blank' class='inline-link'>First Vatican Council</a> was the first since Trent.<br><br>
          <strong>📜 What it decided:</strong>
          <ul class='modal-list'>
            <li><strong><em>Pastor aeternus</em> (18 July 1870):</strong> It defined that the pope, when he speaks <em>ex cathedra</em> on faith or morals, is
            <a href='${W}Papal_infallibility' target='_blank' class='inline-link'>infallible</a>, and that he has full and immediate jurisdiction over the whole church. Before the final vote,
            <mark class='dudoso'>dozens of bishops</mark> who opposed it left Rome so as not to vote against it.</li>
            <li><strong><em>Dei Filius</em>:</strong> On faith and reason.</li>
            <li><strong>Interrupted:</strong> In September 1870 Italian troops took Rome and the council was suspended unfinished.</li>
          </ul>
          Those who rejected infallibility formed the Old Catholic Church.` },
  'concilio-vaticano-ii.title': { src: 'ddb9afa4', text: `Second Vatican Council` },
  'concilio-vaticano-ii.shortDesc': { src: '71255e34', text: `Called by John XXIII and closed by Paul VI: Mass in each people's language, ecumenical openness and religious freedom, with no new dogmas defined.` },
  'concilio-vaticano-ii.fullDesc': { src: '9096c625', text: `Called by John XXIII and closed by Paul VI, the <a href='${W}Second_Vatican_Council' target='_blank' class='inline-link'>Second Vatican Council</a> gathered
          <mark class='dudoso'>some 2,500 bishops</mark> from all over the world and approved 16 documents.<br><br>
          <strong>📜 Some of its changes:</strong>
          <ul class='modal-list'>
            <li><strong>The liturgy:</strong> It allowed Mass to be celebrated in each people's language and not only in Latin (<em>Sacrosanctum Concilium</em>).</li>
            <li><strong>Scripture and tradition:</strong> <em>Dei Verbum</em> presents them as "one sacred deposit of the word of God", whose authentic interpretation belongs to the magisterium of the church.</li>
            <li><strong>The "separated brethren":</strong> It called Protestants and Orthodox by that name and opened ecumenical dialogue (<em>Unitatis redintegratio</em>).</li>
            <li><strong>Religious freedom:</strong> <em>Dignitatis humanae</em> recognised the civil right to religious freedom.</li>
          </ul>
          It defined no new dogmas: it kept those of Trent and of the First Vatican Council.` },

  // ══ ERA I · BEFORE CHRIST ═════════════════════════════════
  'antes-de-cristo.title': { src: '70f0dff3', text: `Before Christ` },
  'antes-de-cristo.shortDesc': { src: '3a5d9823', text: `The Old Testament Scriptures and their translation into Greek in the Hellenistic world.` },

  // ══ ERA II · THE LIFE OF CHRIST ════════════════════════════
  'vida-de-cristo.title': { src: '66e2c4b6', text: `The Life of Christ` },
  'vida-de-cristo.shortDesc': { src: '0fdf549b', text: `The Word made flesh: the birth, ministry, death and resurrection of Jesus Christ.` },

  'jesucristo.title': { src: '35c6d9fc', text: `Jesus Christ` },
  'jesucristo.shortDesc': { src: '5c55191a', text: `Jesus is born in Bethlehem in the days of King Herod, teaches and heals in Galilee and Judea, dies crucified under Pontius Pilate and rises on the third day.` },
  'jesucristo.fullDesc': { src: '5cc86f5e', text: `According to the Gospels, <a href='${W}Jesus' target='_blank' class='inline-link'>Jesus of Nazareth</a>
          was born in Bethlehem of Judea "in the days of <a href='${W}Herod_the_Great' target='_blank' class='inline-link'>Herod</a> the king" (Mt 2:1, KJV).
          Since Herod died around 4 BC, the birth is usually dated between 6 and 4 BC.<br><br>
          <strong>📅 Born "before Christ"?</strong> The count of years "after Christ" (anno Domini) was proposed by the monk
          <a href='${W}Dionysius_Exiguus' target='_blank' class='inline-link'>Dionysius Exiguus</a> around the year 525,
          and his reckoning of the birth fell short by a few years. That is why the dates of the life of Christ are written as approximate.<br><br>
          <strong>📜 His life in the Scriptures:</strong>
          <ul class='modal-list'>
            <li><strong>Baptism:</strong> John the Baptist baptizes him in the Jordan. Jesus "began to be about thirty years of age" (Lk 3:23, KJV), in the fifteenth year of Tiberius Caesar (Lk 3:1), around AD 28 or 29.</li>
            <li><strong>Ministry:</strong> He teaches, heals and calls his disciples in Galilee and Judea. The Gospel of John mentions at least three Passovers, so his ministry is usually reckoned at about three years.</li>
            <li><strong>Death:</strong> He is crucified in Jerusalem under <a href='${W}Pontius_Pilate' target='_blank' class='inline-link'>Pontius Pilate</a>, prefect of Judea from 26 to 36. The year most often given is <mark class='dudoso'>30</mark>; others propose 33.</li>
            <li><strong>Resurrection:</strong> "He rose again the third day according to the scriptures" (1 Cor 15:4, KJV), and showed himself alive to his disciples for forty days before ascending (Acts 1:3, 9).</li>
          </ul>
          The Gospels of Matthew, Mark, Luke and John are the main sources for his life.` },

  // ══ ERA III · THE CHURCH OF THE APOSTLES ═══════════════════
  'iglesia-apostolica.title': { src: '5d02b837', text: `The church of the apostles` },
  'iglesia-apostolica.shortDesc': { src: 'dffcb780', text: `From Pentecost to the death of John: the apostles preach, write the New Testament and face the first persecutions.` },
  'muerte-de-juan.title': { src: 'aca343d9', text: `John, the last apostle, dies` },
  'muerte-de-juan.shortDesc': { src: '50354060', text: `According to tradition, the apostle John dies in Ephesus around the year 100; with him ends the generation of the direct witnesses of Christ.` },
  'muerte-de-juan.fullDesc': { src: 'd4517ac9', text: `John, son of Zebedee, was one of the twelve apostles (Mt 4:21–22). According to <a href='${W}Irenaeus' target='_blank' class='inline-link'>Irenaeus of Lyon</a>,
          who wrote at the end of the 2nd century, John lived in Ephesus and remained there "until the times of Trajan", emperor from the year 98
          (<em>Against Heresies</em> II.22.5 and III.3.4).<br><br>
          <strong>📜 What is known:</strong>
          <ul class='modal-list'>
            <li><strong>Patmos:</strong> Revelation says that John was on the island of Patmos "for the word of God, and for the testimony of Jesus Christ" (Rev 1:9, KJV).
            Irenaeus places the vision towards the end of Domitian's reign, that is, around <mark class='dudoso'>95</mark> (<em>Against Heresies</em> V.30.3).</li>
            <li><strong>His writings:</strong> Tradition attributes to him the Gospel of John, three letters and Revelation.</li>
            <li><strong>The last apostle:</strong> With his death, around <mark class='dudoso'>the year 100</mark>, the generation of the direct witnesses of Christ comes to an end.
            The dates come from tradition, not from a record of the time.</li>
          </ul>` },

  // ══ ERA IV · EARLY CHURCHES═══════════════════════════════
  'iglesias-primitivas.title': { src: '703085e0', text: `Early Churches` },
  'iglesias-primitivas.shortDesc': { src: '9835a053', text: `From the death of the last apostle to Constantine: the churches under persecution.` },

  'septuaginta.title': { src: '93c3fee6', text: `The Septuagint (LXX)` },
  'septuaginta.shortDesc': { src: '64a5236a', text: `Jewish scholars in Alexandria translate the Torah into Greek, beginning a collection that would become the most influential translation of antiquity.` },
  'septuaginta.fullDesc': { src: 'eb0c953d', text: `The <a href='${W}Septuagint' target='_blank' class='inline-link'>Septuagint</a>
          (abbreviated <strong>LXX</strong>) is, in theory, the translation of the Hebrew Old Testament into Koine Greek begun in Alexandria, Egypt.
          According to tradition (recorded in the pseudepigraphal <em>Letter of Aristeas</em>), 72 Jewish scholars were summoned by Ptolemy II and miraculously translated the law in 72 days.
          However, modern historians and scholars regard this account as a <strong>myth or founding legend</strong>. The historical reality points to
          only the Torah (the Pentateuch) being translated in the 3rd century BC, with the rest of the Old Testament translated sporadically by different authors over the following centuries.<br><br>
          <strong>📜 Importance and historical debate:</strong>
          <ul class='modal-list'>
            <li><strong>The Bible of the Early Church?:</strong> It is often stated categorically that it was the Bible of the apostles
            because many of their Greek Old Testament quotations match copies of the LXX.
            However, this is historically debated. A strong textual-preservation position argues that Jesus and the apostles read and quoted directly from the original Hebrew text
            (translating it freely into Greek by divine inspiration). According to this historical argument, it was later scholars (such as Origen in Antioch/Alexandria) who would have altered
            the surviving Greek copies of the Old Testament to force them to match the New Testament retrospectively.</li>
            <li><strong>The Apocryphal books:</strong> It is claimed that the LXX added extra (apocryphal) books to the canon.
            However, <em>there is no evidence or pre-Christian Jewish manuscript</em> of the Septuagint containing these books.
            The complete copies of the LXX that include them (such as the Catholic-Orthodox codices <em>Vaticanus</em> and <em>Sinaiticus</em>) were produced in the 4th and 5th centuries AD —
            Important sources, such as F.F. Bruce in <em>The Canon of Scripture</em> or Edward F. Hills, point out that it was later Alexandrian churchmen who bundled these books together with the inspired canon.</li>
            <li>It was the basis of the Old Testament in the old <strong>Vetus Latina</strong> translations.</li>
          </ul>
          Today the LXX remains an object of extensive critical study and is the official Old Testament text of the Eastern Orthodox Church.` },

  'vetus-latina.title': { src: 'c8f5749d', text: `The Vetus Latina` },
  'vetus-latina.shortDesc': { src: 'dbdea535', text: `The first fragmentary translations of the Bible into Latin, used by the western church that would later be called Roman Catholic.` },
  'vetus-latina.fullDesc': { src: '6ecc4497', text: `<img src='https://upload.wikimedia.org/wikipedia/commons/f/fc/Codex_Vercellensis_-_Old_Latin_gospel_%28John_ch._16%2C_v._23-30%29_%28The_S.S._Teacher%27s_Edition-The_Holy_Bible_-_Plate_XXXII%29.jpg'
          class='modal-inline-img' alt='Codex Vercellensis - Old Latin gospel' title='Codex Vercellensis: an example of a Vetus Latina manuscript (John 16:23-30)'>
          From the 2nd century onward, different communities of the Roman West produced independent, fragmentary translations of the Scriptures
          into Latin, known collectively as the <a href='${W}Vetus_Latina' target='_blank' class='inline-link'>Vetus Latina</a>
          ("Old Latin"). It was not a unified or coordinated work — each region translated from whatever Greek manuscripts it had at hand, without access to a central collection.
          This was the main reason the texts varied: local translators rarely had all the sources available, only portions or isolated copies of different manuscripts.
          Added to this were the secondary variations of translation itself: inconsistent theological vocabulary and verses worded differently depending on each translator's command of Greek.<br><br>
          They were translated from Greek manuscripts for the New Testament and from the <strong>Septuagint</strong> for the Old Testament.
          Their lack of uniformity was precisely the reason Pope Damasus I gave for commissioning Jerome to produce an official, standardized Latin version
          that would unite the whole western Catholic Church under a single text.` },

  'neron.title': { src: 'cddb896b', text: `Nero is Caesar` },
  'neron.shortDesc': { src: 'da6931ca', text: `Nero rules the Roman Empire: he is the Caesar to whom Paul appeals and before whom he must appear.` },
  'neron.fullDesc': { src: 'c650b6cb', text: `<a href='${W}Nero' target='_blank' class='inline-link'>Nero</a> was emperor of Rome from 54 to 68. He is the "Caesar" of the book of Acts:
          imprisoned in Caesarea and in danger of being handed over to the Jews, Paul appealed to Caesar (Acts 25:11), and during the shipwreck on the way to Rome an angel assured him:
          <em>"thou must be brought before Caesar"</em> (Acts 27:24, KJV). This was around the year 59–60.<br><br>
          <strong>📜 What marked his reign for the church:</strong>
          <ul class='modal-list'>
            <li><strong>Early years:</strong> He ruled under the guidance of the philosopher Seneca and the prefect Burrus, years remembered as relatively stable.
            In that period Paul reached Rome and lived two years in a rented house, preaching "no man forbidding him" (Acts 28:30–31, KJV).</li>
            <li><strong>The fire of Rome (64):</strong> After the great fire, the Roman historian <a href='${W}Tacitus' target='_blank' class='inline-link'>Tacitus</a> (<em>Annals</em> XV.44) reports that Nero
            blamed the Christians and punished them cruelly: some were covered in animal skins and torn apart by dogs, others crucified or burned as torches.
            It is the first persecution of Christians by the Roman State.</li>
            <li><strong>His end (68):</strong> Declared a public enemy by the Senate, he took his own life in June 68. The Julio-Claudian dynasty ended with him.</li>
          </ul>
          The tradition of the early church places the death of Paul in Rome under his reign.` },

  'muerte-de-pablo.title': { src: 'e6a2b5b9', text: `The death of Paul` },
  'muerte-de-pablo.shortDesc': { src: 'eee0fea6', text: `The Bible does not narrate Paul's death; the tradition of the early church says he was beheaded in Rome under Nero.` },
  'muerte-de-pablo.fullDesc': { src: '5a9e2ce3', text: `The book of Acts ends with <a href='${W}Paul_the_Apostle' target='_blank' class='inline-link'>Paul</a> a prisoner in Rome, living two years in a rented house and preaching (Acts 28:30–31),
          around the year 62. <strong>The Bible does not narrate his death.</strong> In his last letter, written from a second imprisonment, Paul sees it near:
          <em>"I am now ready to be offered, and the time of my departure is at hand"</em> (2 Tim 4:6).<br><br>
          <strong>📜 Where does the information come from?</strong>
          <ul class='modal-list'>
            <li><strong>1 Clement 5 (c. 96):</strong> The letter of the church of Rome to the church of Corinth says that Paul, after preaching in the east and the west,
            "bore witness before the rulers and so departed from the world". It is the oldest reference, but it gives no place, date or manner of death.</li>
            <li><strong>Dionysius of Corinth (c. 170):</strong> Quoted by Eusebius, he states that Peter and Paul were martyred in Italy at about the same time.</li>
            <li><strong><a href='${W}Eusebius' target='_blank' class='inline-link'>Eusebius of Caesarea</a> (<em>Ecclesiastical History</em> II.22 and II.25, c. 325):</strong>
            He records the tradition that Paul was beheaded in Rome under Nero, consistent with his Roman citizenship, which exempted him from crucifixion.</li>
          </ul>
          <strong>⚠️ About the date:</strong> It is not known exactly. The most cited years run from 64, after the fire of Rome, to 67; the limit is Nero's death in June 68.
          Everything beyond Acts and 2 Timothy depends on later tradition, not on the Scriptures.` },

  'ignacio-esmirniotas.title': { src: '2617dd98', text: `Ignatius of Antioch's Letter to the Smyrnaeans` },
  'ignacio-esmirniotas.shortDesc': { src: 'bb3f9d6a', text: `On his way to martyrdom, Ignatius writes to the church of Smyrna: the expression "catholic church" appears for the first time, along with the command to do nothing without the bishop.` },
  'ignacio-esmirniotas.fullDesc': { src: '8303e7b5', text: `<a href='${W}Ignatius_of_Antioch' target='_blank' class='inline-link'>Ignatius</a>, bishop of Antioch, was arrested and taken to Rome to die in the arena under the emperor Trajan.
          On the way he wrote seven letters to different churches; one of them to the church of <strong>Smyrna</strong>, whose bishop was
          <a href='${W}Polycarp' target='_blank' class='inline-link'>Polycarp</a>.<br><br>
          <strong>📜 What the letter says:</strong>
          <ul class='modal-list'>
            <li><strong>Against the Docetists:</strong> He maintains that Christ was born, suffered and rose again in real flesh, against those who said his body was only an appearance.</li>
            <li><strong>"Nothing without the bishop" (8.1):</strong> He demands that nothing belonging to the church be done without the bishop, and that only the Lord's Supper
            celebrated by the bishop, or by someone he authorizes, be considered valid.</li>
            <li><strong>"Catholic church" (8.2):</strong> <em>"Wherever the bishop appears, there let the multitude be; just as, wherever Jesus Christ is, there is the catholic church."</em>
            It is the first known use of the expression. Here "catholic" means "universal"; it does not yet designate an institution based in Rome.</li>
          </ul>
          <strong>⚠️ Why it matters:</strong> In the New Testament, "bishop" and "elder" (presbyter) name the same office (Acts 20:17, 28; Titus 1:5–7), and each church had several.
          In Ignatius a single bishop already appears above the presbyters and deacons of each city. It is one of the first written signs of the road toward the hierarchy
          that, centuries later, would end in the Roman Catholic Church.<br><br>
          The date is approximate: it is traditionally placed between 107 and 110, during the reign of Trajan (98–117);
          <mark class='dudoso'>some scholars propose later dates</mark>.` },

  'edicto-de-decio.title': { src: '087ebd00', text: `The Edict of Decius` },
  'edicto-de-decio.shortDesc': { src: '49dab6ad', text: `Decius orders every inhabitant of the Empire to sacrifice to the gods and obtain a certificate; many Christians from lax churches give in.` },
  'edicto-de-decio.fullDesc': { src: 'c59f0cbe', text: `After decades of relative peace, many churches had grown lax: members were received without evidence of conversion, some pastors were beginning to raise themselves
          over other churches, and the first ideas that baptism saves were appearing. In that context, the emperor <a href='${W}Decius' target='_blank' class='inline-link'>Decius</a>
          (ruled 249–251) issued, at the end of 249 or the beginning of 250, an edict requiring <strong>every inhabitant of the Empire</strong> to sacrifice to the Roman gods.<br><br>
          <strong>📜 How it worked:</strong>
          <ul class='modal-list'>
            <li><strong>No name of its own:</strong> The text of the edict has not survived; it is known simply as "the edict of Decius".</li>
            <li><strong>The certificate (<em>libellus</em>):</strong> Each person had to sacrifice, eat of the offered meat and declare it before a local commission, which handed over a certificate.
            Dozens of these <em>libelli</em> survive on papyri from Egypt.</li>
            <li><strong>The "lapsed" (<em>lapsi</em>):</strong> Many Christians gave in: some sacrificed (<em>sacrificati</em>), others bought a certificate without sacrificing (<em>libellatici</em>).
            Others resisted and died, such as Fabian, bishop of Rome.</li>
          </ul>
          <strong>📌 The question that divided the churches:</strong> Should those who denied the faith to save their lives be received back into communion?
          The answer to that question led to the Synod of Rome of 251 and to the separation of the Novatianists.` },

  'sinodo-de-roma-251.title': { src: '648aa6b1', text: `The Synod of Rome and the Novatianists` },
  'sinodo-de-roma-251.shortDesc': { src: 'b5319f24', text: `Some 60 bishops back Cornelius as bishop of Rome, accept the lapsed after penance and excommunicate Novatian.` },
  'sinodo-de-roma-251.fullDesc': { src: '6b8a715a', text: `In June 251 Decius dies in battle against the Goths and the persecution ends. The churches are left with a problem:
          what to do with the <strong>lapsed</strong>, those who denied the faith during the persecution and now ask to return.<br><br>
          <strong>📜 The facts:</strong>
          <ul class='modal-list'>
            <li><strong>Cornelius (March 251):</strong> After more than a year without a bishop in Rome, <a href='${W}Pope_Cornelius' target='_blank' class='inline-link'>Cornelius</a> is elected bishop of Rome
            (today he would be called pope). He favored receiving the lapsed after a penance.</li>
            <li><strong>Novatian:</strong> The presbyter <a href='${W}Novatian' target='_blank' class='inline-link'>Novatian</a>, who held that the church could not restore communion
            to someone who had denied Christ. His opponents accuse him of having himself consecrated bishop of Rome when one had already been elected.</li>
            <li><strong>The synod:</strong> According to Eusebius (<em>Ecclesiastical History</em> VI.43), some <strong>60 bishops</strong>, mostly Italian,
            and many more presbyters and deacons gather in Rome. They back Cornelius, confirm the line of the council of Carthage presided over by
            <a href='${W}Cyprian' target='_blank' class='inline-link'>Cyprian</a> (to receive the lapsed after penance) and <strong>excommunicate Novatian</strong> and his followers, blaming him for that consecration and for not accepting the lapsed into communion.</li>
          </ul>
          <strong>⚠️ Reading this event:</strong> Novatian was excluded, accused of a rival consecration and for refusing to receive the lapsed.
          The majority gathered in synod thus established that communion depended on a penance regulated by the bishops. The Novatianist churches went on existing
          for centuries, separately, and Baptist successionist historiography counts them among the churches that stayed outside the system that would give rise to Rome.` },

  'gran-persecucion.title': { src: '9c9e0873', text: `The Great Persecution of Diocletian` },
  'gran-persecucion.shortDesc': { src: '931e7036', text: `The harshest persecution of the Empire: the meeting places are to be destroyed and the Scriptures handed over and burned.` },
  'gran-persecucion.fullDesc': { src: '3941222c', text: `From February 303, the emperor <a href='${W}Diocletian' target='_blank' class='inline-link'>Diocletian</a>, urged on by his caesar Galerius,
          issued a series of edicts against the Christians: the so-called <a href='${W}Diocletianic_Persecution' target='_blank' class='inline-link'>Great Persecution</a>.<br><br>
          <strong>📜 The edicts:</strong>
          <ul class='modal-list'>
            <li><strong>First edict (303):</strong> Destroy the meeting places, <strong>hand over and burn the Scriptures</strong>, forbid assemblies and strip Christians of civil rights.</li>
            <li><strong>Second and third edicts (303):</strong> Imprison the clergy and release them only if they sacrificed to the gods.</li>
            <li><strong>Fourth edict (304):</strong> Every inhabitant had to sacrifice, on pain of death.</li>
          </ul>
          <strong>📖 The <em>traditores</em>:</strong> Those who handed the Scriptures over to the authorities were called <em>traditores</em> ("those who hand over").
          That word will be at the center of the Donatist schism a few years later.<br><br>
          Its intensity varied by region: in the west it almost ceased around 305, while in the east it went on with force. It formally ended with the edict of Galerius in 311,
          although Maximinus Daza continued it in his territories until 313.` },

  'edicto-de-galerio.title': { src: '01f3ecaa', text: `Galerius' Edict of Toleration` },
  'edicto-de-galerio.shortDesc': { src: '7ce0d008', text: `Galerius, gravely ill, admits the persecution has failed and allows Christians to exist and meet again.` },
  'edicto-de-galerio.fullDesc': { src: 'de71e1ee', text: `On 30 April 311, the emperor <a href='${W}Galerius' target='_blank' class='inline-link'>Galerius</a>, the same man who had driven the Great Persecution,
          published in Nicomedia an edict of toleration, also called the edict of Serdica. Gravely ill, he died a few days later.
          The text is preserved by <a href='${W}Lactantius' target='_blank' class='inline-link'>Lactantius</a> and Eusebius.<br><br>
          <strong>📜 What it said:</strong>
          <ul class='modal-list'>
            <li>It acknowledges that the purpose of the persecution was to bring Christians back to the religion of their ancestors, and that <strong>it did not succeed</strong>:
            many no longer worshipped either the gods or their own God.</li>
            <li>It allows <strong>Christians to exist again</strong> and rebuild their meeting places, provided they do not act against public order.</li>
            <li>It asks them to <strong>pray to their God</strong> for the emperor's health, for the State and for themselves.</li>
            <li>It does <strong>not</strong> return confiscated property; that would come with the edict of Milan, in 313.</li>
          </ul>` },

  'donatistas.title': { src: '33c724df', text: `The Donatists and the church of Rome part ways` },
  'donatistas.shortDesc': { src: '93e6d39f', text: `In North Africa, a group rejects the new bishop of Carthage for having been consecrated by an alleged traditor; in 313 a synod in Rome rules against them and they are left separated from the church of Rome.` },
  'donatistas.fullDesc': { src: 'f3e59264', text: `When the persecution ended, the church of Carthage chose <strong>Caecilian</strong> as bishop. A large group rejected him: one of the bishops who consecrated him,
          Felix of Aptunga, was accused of having been a <em>traditor</em>, that is, of having handed over the Scriptures during the Great Persecution.
          They elected a rival bishop, Majorinus, and after his death <strong>Donatus</strong>, from whom the movement took its name:
          <a href='${W}Donatism' target='_blank' class='inline-link'>Donatism</a>.<br><br>
          <strong>📜 Likenesses and differences with the Novatianists:</strong>
          <ul class='modal-list'>
            <li><strong>What they share:</strong> Both demanded purity of the church and refused to simply receive those who had failed under persecution.</li>
            <li><strong>What is particular to the Donatists:</strong> They held that a minister who had been a <em>traditor</em> could not perform valid acts,
            and so they <strong>rebaptized</strong> those who came over from the other side.</li>
          </ul>
          <strong>⚠️ The first conflict with the State:</strong> The Donatists appealed to the emperor Constantine. A synod in Rome (313) and the council of Arles (314)
          ruled against them, and Constantine ended up using the force of the Empire to suppress them. It was the first time the power of the State was used against Christians
          over a dispute between churches. Augustine of Hippo would defend that coercion a century later.<br><br>
          The exact date of Caecilian's consecration <mark class='dudoso'>is debated (between 307 and 312)</mark>.` },

  'constantino.title': { src: '608c18ec', text: `Constantine becomes emperor` },
  'constantino.shortDesc': { src: '84d52460', text: `Proclaimed by his troops in 306, Constantine becomes sole emperor and leads the church into an alliance with the State.` },
  'constantino.fullDesc': { src: '6d55351a', text: `<a href='${W}Constantine_the_Great' target='_blank' class='inline-link'>Constantine</a> was proclaimed emperor by his troops in Eboracum (today York, England) in 306,
          on the death of his father, Constantius Chlorus. His reign transformed the relationship between the church and the Empire.<br><br>
          <strong>📜 Stages of his rule:</strong>
          <ul class='modal-list'>
            <li><strong>306:</strong> Proclaimed in Britain; rules in the west sharing power with other emperors.</li>
            <li><strong>312:</strong> Defeats Maxentius at the Milvian Bridge and becomes master of the west.</li>
            <li><strong>313:</strong> With Licinius, emperor of the east, agrees the edict of Milan.</li>
            <li><strong>324:</strong> Defeats Licinius and becomes sole emperor.</li>
            <li><strong>337:</strong> Dies near Nicomedia, baptized on his deathbed.</li>
          </ul>
          <strong>And his edict?</strong> There was one: the <strong>edict of Milan</strong> (313) went further than Galerius', because it granted freedom of worship to all
          and ordered that Christians' confiscated property be returned to them.` },

  'sueno-de-constantino.title': { src: '2d5cdeab', text: `Constantine's dream and the Milvian Bridge` },
  'sueno-de-constantino.shortDesc': { src: 'f9c1ae7b', text: `Before the battle against Maxentius, Constantine claims to have received a sign from Christ; he wins and becomes master of the west.` },
  'sueno-de-constantino.fullDesc': { src: '94fdeede', text: `On 28 October 312, Constantine defeated Maxentius at the <a href='${W}Battle_of_the_Milvian_Bridge' target='_blank' class='inline-link'>Battle of the Milvian Bridge</a>,
          on the outskirts of Rome. Before the battle, by his own account, he received a sign from Christ.<br><br>
          <strong>📜 Two accounts that do not agree:</strong>
          <ul class='modal-list'>
            <li><strong>Lactantius (<em>On the Deaths of the Persecutors</em>, c. 315):</strong> In a dream he was told to mark his soldiers' shields with the sign of Christ, and he did so.</li>
            <li><strong>Eusebius (<em>Life of Constantine</em>, c. 337):</strong> Written after the emperor's death, it says Constantine swore to him that at midday, with his whole army, he saw
            a cross of light in the sky with the inscription <em>"in this sign conquer"</em>, and that night Christ appeared to him in a dream with the same sign.</li>
          </ul>
          <strong>⚠️ An ambiguous conversion:</strong> For years Constantine kept using pagan titles and symbols, such as Pontifex Maximus (high priest of the Roman religion),
          and was not baptized until his deathbed. What did change at once was the position of the church: from persecuted it became favored by the most powerful man in the Empire.` },

  'edicto-de-milan.title': { src: 'fa629581', text: `Union of church and state: the edict of Milan` },
  'edicto-de-milan.shortDesc': { src: 'ffcaf687', text: `Constantine and Licinius grant freedom of worship and return their property to Christians; the marriage of the church with the Roman State begins.` },
  'edicto-de-milan.fullDesc': { src: '0b734a5e', text: `In 313, Constantine and <a href='${W}Licinius' target='_blank' class='inline-link'>Licinius</a> agreed in Milan the policy known as the
          <a href='${W}Edict_of_Milan' target='_blank' class='inline-link'>edict of Milan</a>: freedom of worship for all, Christians included, and the return of the meeting places
          and property confiscated during the persecution. The text that survives is actually a letter from Licinius to the governors of the east.<br><br>
          But 313 marks more than toleration: it is the beginning of the <strong>marriage of the "Christian" church with the State</strong>. Religion becomes sponsored by the emperor.<br><br>
          <strong>📜 What that marriage meant:</strong>
          <ul class='modal-list'>
            <li><strong>Privileges for the clergy:</strong> Exemption from public offices and their costs (313), which turned the clergy into a privileged class and drew many in out of self-interest.</li>
            <li><strong>Money and buildings:</strong> Imperial donations and great basilicas, such as the Lateran palace, handed to the bishop of Rome.</li>
            <li><strong>The emperor in the affairs of the church:</strong> Constantine convenes synods and councils (Arles 314, Nicaea 325) and enforces their decisions with the power of the State.</li>
            <li><strong>Bishops as officials:</strong> They receive the powers of civil judges (318).</li>
            <li><strong>Persecution in reverse:</strong> Groups that would not submit, such as the Donatists, began to be repressed by the State.</li>
          </ul>
          Christianity was not yet the official religion of the Empire; that would come with the edict of Thessalonica, in 380.` },

  'obispos-jueces.title': { src: 'eb6cdfe5', text: `Bishops become civil judges` },
  'obispos-jueces.shortDesc': { src: '9587c0e0', text: `A law of Constantine allows civil lawsuits to be brought before the bishop, whose ruling is as valid as a State judge's.` },
  'obispos-jueces.fullDesc': { src: 'd7c57b56', text: `A law of Constantine preserved in the <a href='${W}Codex_Theodosianus' target='_blank' class='inline-link'>Theodosian Code</a> (I.27.1) established the so-called
          <strong><em>episcopalis audientia</em></strong> ("the bishop's hearing"): anyone could bring a civil lawsuit before the bishop, and his ruling would have
          the same validity as that of a State judge.<br><br>
          <strong>📜 What it implied:</strong>
          <ul class='modal-list'>
            <li><strong>From pastors to magistrates:</strong> Bishops take on functions of civil power, and their authority rests on imperial law.</li>
            <li><strong>Power over the city:</strong> The bishop becomes a public figure with authority over believers and unbelievers, not only over his congregation.</li>
            <li><strong>Contrast with the Scriptures:</strong> Paul had asked believers to settle their differences among brethren, in the church, instead of going to the courts
            (1 Cor 6:1–6). Now it was the State that gave the bishop the place of judge.</li>
          </ul>
          <strong>⚠️ About the date:</strong> The law is dated 318, <mark class='dudoso'>but historians debate that date and the exact scope of the law</mark>.<br><br>
          <strong>📌 Two other things associated with "318":</strong> around that year the controversy of Arius begins in Alexandria, which would lead to the council of Nicaea;
          and 318 is the traditional number of bishops who attended that council. Both are covered in the Nicaea event.` },

  'nicea.title': { src: 'b428d178', text: `The Council of Nicaea` },
  'nicea.shortDesc': { src: '0d3094f7', text: `Convened by Constantine, the first "ecumenical" council condemns Arius and defines the faith with the backing of the Empire.` },
  'nicea.fullDesc': { src: '171c2fd7', text: `<strong>Background:</strong> Around 318, in Alexandria, the presbyter <a href='${W}Arius' target='_blank' class='inline-link'>Arius</a> began to teach that the Son of God was a creature,
          that "there was a time when he was not". His bishop, Alexander, condemned him, but the dispute spread through the whole east.<br><br>
          In 325, <strong>Constantine</strong> summoned the bishops to <a href='${W}First_Council_of_Nicaea' target='_blank' class='inline-link'>Nicaea</a>, near his imperial residence,
          paid for their journeys with State resources, opened the council and took part in its sessions. The traditional number of those present is <strong>318 bishops</strong>
          ("the 318 fathers"); Eusebius, who was there, speaks of more than 250.<br><br>
          <strong>📜 What it decided:</strong>
          <ul class='modal-list'>
            <li><strong>The Nicene Creed:</strong> It affirmed that the Son is "true God of true God, begotten, not made, of one substance (<em>homoousios</em>) with the Father",
            and condemned Arius.</li>
            <li><strong>Other decisions:</strong> The date of Easter and a series of canons on the discipline of the clergy and the precedence among the sees of Alexandria, Rome and Antioch (canon 6).</li>
            <li><strong>The arm of the State:</strong> Arius and the bishops who did not sign were exiled by order of the emperor.</li>
          </ul>
          <strong>⚖️ The Baptist successionist reading:</strong> The deity of Christ was not born at Nicaea: the churches believed it because it is in the Scriptures (John 1:1; Phil 2:6; Col 2:9).
          What was new at Nicaea was <strong>who</strong> defined the faith and <strong>how</strong> it was imposed: an unbaptized emperor summoning the bishops, and the power of the State punishing dissenters.
          That is why this historiography sees in Nicaea the birth of the imperial church, the "catholic" church united to the State, from which the Roman Catholic Church would emerge.
          The churches that remained outside that system were not at Nicaea as equals: the council treated the Novatianists as a group to be readmitted (canon 8).` },

  'constantinopla.title': { src: '8cc2d206', text: `The founding of Constantinople` },
  'constantinopla.shortDesc': { src: 'dac2e1c3', text: `Constantine refounds ancient Byzantium as the new capital of the Empire; it will be the center of eastern Christianity for more than a thousand years.` },
  'constantinopla.fullDesc': { src: 'fec5d437', text: `<strong>Byzantium</strong> was an ancient Greek colony founded in the 7th century BC on the shores of the Bosphorus, the strait that separates Europe from Asia.
          Its location made it key for trade and defense between both continents.<br><br>
          After defeating Licinius in 324, Constantine chose the site for his new capital, rebuilt it on a grand scale and dedicated it on <strong>11 May 330</strong>
          with the name <a href='${W}Constantinople' target='_blank' class='inline-link'>Constantinople</a>, "the city of Constantine", also called "New Rome".<br><br>
          <strong>📜 Why it matters:</strong>
          <ul class='modal-list'>
            <li><strong>Two centers of power:</strong> With the emperor in the east, the bishop of Rome gained weight of his own in the west, while the bishop of Constantinople stood beside the emperor.
            That rivalry would end in the separation between the church of Rome and the eastern Orthodox church (1054).</li>
            <li><strong>The Byzantine Empire:</strong> When the west fell (476), Constantinople remained the capital of the
            <a href='${W}Byzantine_Empire' target='_blank' class='inline-link'>Eastern Roman Empire</a> until its fall to the Ottoman Turks in 1453.</li>
            <li><strong>The Greek text:</strong> In that Empire the Greek text of the New Testament known as the Byzantine or Majority Text was copied and handed down for centuries,
            the basis of Erasmus' <em>Textus Receptus</em>.</li>
          </ul>` },

  'muerte-de-constantino.title': { src: 'bf6fe13c', text: `Constantine is baptized and dies` },
  'muerte-de-constantino.shortDesc': { src: 'a286b205', text: `On his deathbed, Constantine is baptized by Eusebius of Nicomedia, a bishop close to Arius.` },
  'muerte-de-constantino.fullDesc': { src: '5f19a90a', text: `In the spring of 337, ill, Constantine asked for baptism near Nicomedia. He was baptized by <a href='${W}Eusebius_of_Nicomedia' target='_blank' class='inline-link'>Eusebius of Nicomedia</a>,
          one of Arius' main allies, who had been exiled after Nicaea and later restored. Constantine died on <strong>22 May 337</strong>.<br><br>
          <strong>📜 What his baptism reveals:</strong>
          <ul class='modal-list'>
            <li><strong>A postponed baptism:</strong> It was common at the time to postpone baptism until the end of life, from the belief that it washed away the sins committed up to that moment.
            It is the idea that "baptism saves", already widespread in the 4th century.</li>
            <li><strong>The emperor who governed the church without being a member:</strong> He convened Nicaea and ruled in disputes between bishops without having been baptized.</li>
            <li><strong>The turn of his last years:</strong> He favored the party of Arius: he ordered Arius to be readmitted and exiled Athanasius, defender of Nicaea (335).</li>
          </ul>
          His sons divided the Empire. Constantius II, in the east, openly supported Arianism, and the disputes Nicaea meant to settle went on for decades.` },

  // ══ ERA V · THE IMPERIAL CHURCH AND THE MIDDLE AGES ═══════
  'iglesia-imperial.title': { src: '4c01d88b', text: `The Imperial Church and the Middle Ages` },
  'iglesia-imperial.shortDesc': { src: 'c5d5613a', text: `The church united to the State: imperial councils, the Vulgate, the crusades.` },

  'edicto-de-tesalonica.title': { src: '6a9444f3', text: `The Edict of Thessalonica` },
  'edicto-de-tesalonica.shortDesc': { src: '49e3d169', text: `Theodosius I makes Nicene Christianity the compulsory religion of the Empire: only its followers are "catholic Christians"; the rest, heretics.` },
  'edicto-de-tesalonica.fullDesc': { src: '8b5c7ff7', text: `On 27 February 380, the emperor <a href='${W}Theodosius_I' target='_blank' class='inline-link'>Theodosius I</a>, together with Gratian and Valentinian II,
          issued the <a href='${W}Edict_of_Thessalonica' target='_blank' class='inline-link'>edict of Thessalonica</a> (<em>Cunctos populos</em>).<br><br>
          <strong>📜 What it ordered:</strong>
          <ul class='modal-list'>
            <li>All the peoples of the Empire had to follow the religion handed down by the apostle Peter to the Romans, as professed by
            <strong>Damasus, bishop of Rome</strong>, and <strong>Peter, bishop of Alexandria</strong>.</li>
            <li>Only those who followed it could call themselves <strong>"catholic Christians"</strong>.</li>
            <li>The rest were declared <strong>heretics</strong>: their meeting places could not be called churches, and they were exposed to divine punishment and to the emperor's.</li>
          </ul>
          <strong>⚖️ The end of the road begun in 313:</strong> From being tolerated (311) and favored (313), imperial Christianity became <strong>compulsory</strong>.
          Faith stopped being a personal decision and became a civic duty, and whoever dissented from the official church also became an offender before the State.
          It is the same Damasus who shortly afterwards would commission Jerome to produce the Vulgate.` },

  'vulgata.title': { src: 'df880269', text: `Jerome's Latin Vulgate` },
  'vulgata.shortDesc': { src: '72d8a019', text: `Jerome of Stridon translates the Bible into Latin at the request of Pope Damasus I, producing the official text of the Catholic Church.` },
  'vulgata.fullDesc': { src: '1632441d', text: `<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Amiatinus_Maiestas_Domini.jpg/960px-Amiatinus_Maiestas_Domini.jpg'
          class='modal-inline-img' alt='Majesty of the Lord in the Codex Amiatinus' title='The Codex Amiatinus, a copy of the Vulgate'>
          At the request of Pope Damasus I, <a href='${W}Jerome' target='_blank' class='inline-link'>Jerome of Stridon</a>
          produced the <a href='${W}Vulgate' target='_blank' class='inline-link'>Latin Vulgate</a>,
          the official translation of the Scriptures into Latin for the western Catholic Church.<br><br>
          <strong>📚 Sources by section:</strong>
          <ul class='modal-list'>
            <li><strong>Old Testament:</strong> Translated directly from the
            <a href='${W}Masoretic_Text' target='_blank' class='inline-link'>Hebrew Masoretic Text</a>.
              Jerome rejected the Greek <em>Septuagint</em> on the principle of <em>Hebraica Veritas</em>: he considered that only the Hebrew original
              was authoritative, and that the Septuagint was a Greek translation with inaccuracies — not the original text.</li>
            <li><strong>New Testament:</strong> Revised from the <strong>Vetus Latina</strong> (the old Latin translations in circulation),
              checking them against 4th-century Greek manuscripts belonging to the <strong>Alexandrian textual family</strong> — the same tradition
              that was set down in codices such as the <strong>Codex Vaticanus</strong> (kept in the Vatican Library since the 15th century)
              and the <strong>Codex Sinaiticus</strong> (found in the Catholic-Orthodox monastery of Saint Catherine in Sinai), both manuscripts
              preserved and guarded exclusively by Catholic/Orthodox institutions. Today they form the basis of the
              <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'><strong>Critical Text</strong></a>. There was not yet a compiled and standardized Greek New Testament.</li>
            <li><strong>Apocrypha:</strong> Jerome <em>rejected</em> the deuterocanonical books as non-canonical — he marked them as such in his own prologues,
              following the Hebrew canon (and contrary to what the LXX admitted). However, church tradition and their presence in the Vetus Latina pressed him
              to include them. He translated them partly reluctantly and at the insistence of fellow bishops. The Vulgate ended up including: Tobit, Judith,
              1–2 Maccabees, Wisdom, Ecclesiasticus and Baruch. Centuries later, the Council of Trent (1546) would formally declare them canonical for the Catholic Church.</li>
          </ul>
          The Vulgate became established as the official ecclesiastical text in the west throughout the Middle Ages. The illustration shows the
          <a href='${W}Codex_Amiatinus' target='_blank' class='inline-link'>Codex Amiatinus</a>
          (8th century), which is essentially the oldest complete copy of the Vulgate surviving to our day.` },

  'cruzadas.title': { src: '3e0f2e96', text: `The Crusades` },
  'cruzadas.shortDesc': { src: '2cd1db5b', text: `The crusades were military and religious campaigns promoted by the Latin Church to recover or defend the Holy Land.` },
  'cruzadas.fullDesc': { src: '8066a581', text: `The first great wave of the <a href='${W}Crusades' target='_blank' class='inline-link'>crusades</a>
          began in 1095 with the call of Urban II and extended to several later expeditions to recover or defend the Holy Land.
          These campaigns combined religious, political and military motives, and marked deep tensions between Christians, Muslims and Jews.<br><br>
          <ul class='modal-list'>
            <li><strong>First Crusade (1095–1099):</strong> It was the best known and ended with the capture of Jerusalem.</li>
            <li><strong>Later expeditions (1147–1291):</strong> They included new military and diplomatic attempts, though with less overall success.</li>
          </ul>` },

  // ══ ERA VI · RENAISSANCE AND PRE-REFORMATION ══════════════
  'renacimiento.title': { src: '4d00d298', text: `Renaissance and Pre-Reformation` },
  'renacimiento.shortDesc': { src: '1e5a8b8e', text: `The printing press, the Inquisition and the first printed Greek New Testament.` },

  'gutenberg.title': { src: 'e3726ff5', text: `The Printing Press and the Gutenberg Bible` },
  'gutenberg.shortDesc': { src: '03f6dc2d', text: `Gutenberg changes history by using movable type to successfully print the 42-line Bible.` },
  'gutenberg.fullDesc': { src: '35d139a3', text: `In Mainz, Johannes Gutenberg uses his movable-type press to print the first major book in the West on a large scale: the
          <a href='${W}Gutenberg_Bible' target='_blank' class='inline-link'>42-line Bible</a>
          (the Latin Vulgate version). This advance revolutionized society, eased the spread of ideas and provided the vital technological foundations
          for the worldwide spread of the Bible and the coming Reformation.` },

  'inquisicion.title': { src: '442f643a', text: `The Holy Inquisition` },
  'inquisicion.shortDesc': { src: 'e26d835b', text: `The Inquisition was a church tribunal to investigate heresies and protect Catholic orthodoxy.` },
  'inquisicion.fullDesc': { src: 'a66074a8', text: `The <a href='${W}Inquisition' target='_blank' class='inline-link'>Holy Inquisition</a>
          arose as a church tribunal intended to investigate suspicions of heresy and preserve orthodoxy in the Latin Church.<br><br>
          <ul class='modal-list'>
            <li><strong>Medieval Inquisition (1184):</strong> Originally founded in southern France (Languedoc) by Pope Lucius III to fight the Cathars and Waldensians.</li>
            <li><strong>Spanish Inquisition (1478):</strong> Established by the Catholic Monarchs through a papal bull, it focused heavily on identifying false converts (Jews and Muslims who practiced their faith in secret) and later on censoring Protestant literature.</li>
            <li><strong>Roman Inquisition (1542):</strong> Pope Paul III established the Congregation of the Holy Office in Rome with the main aim of stopping the alarming advance of Protestantism in the Italian peninsula.</li>
            <li><strong>How it acted:</strong> It operated through systematic trials, ecclesiastical torture, the burning of forbidden books (<em>Index Librorum Prohibitorum</em>) and mass public punishments known as <strong>Autos-da-fé</strong>.</li>
            <li><strong>Abolition (1834):</strong> It was officially abolished in Spain by royal decree under the reign of Isabella II, after a long period of decline in its power.</li>
          </ul>` },

  'erasmo.title': { src: '0f793e08', text: `Erasmus compiles the Textus Receptus` },
  'erasmo.shortDesc': { src: '457a1548', text: `Erasmus of Rotterdam publishes the Novum Instrumentum omne, the basis of future Bible translations.` },
  'erasmo.fullDesc': { src: '9a32702a', text: `<img src='https://upload.wikimedia.org/wikipedia/commons/9/9b/Justinian555AD.png'
          class='modal-inline-img img-large' alt='Map of the Byzantine Empire under Justinian' title='The Byzantine Empire at its greatest extent (555 AD)'>
          Desiderius Erasmus of Rotterdam compiles and publishes, under the title <em>Novum Instrumentum omne</em>, the first printed edition of the Greek New Testament,
          together with a new Latin translation. He based it on Greek manuscripts of the
          <strong>Majority Text</strong> or <strong>Byzantine Text</strong> tradition — so called because it was the New Testament text copied, preserved and
          handed down for centuries throughout the <a href='${W}Byzantine_Empire' target='_blank' class='inline-link'>Byzantine Empire</a>,
          the eastern Christian heir of the Roman Empire. Being the text that circulated in most of the Greek churches for more than a thousand years,
          it represents the tradition of the <strong>great majority</strong> of known New Testament manuscripts.<br><br>
          This Greek text (later called the <a href='${W}Textus_Receptus' target='_blank' class='inline-link'>Textus Receptus</a>)
          served as the undeniable basis for Bible translations into the vernacular languages during the Reformation.` },

  // ══ ERA VII · THE PROTESTANT REFORMATION ════════════════════
  'reforma.title': { src: 'add48f43', text: `The Protestant Reformation` },
  'reforma.shortDesc': { src: 'aabd3c16', text: `Luther, Calvin, Trent and the consolidation of the Textus Receptus.` },

  'lutero.title': { src: '02c25dac', text: `Martin Luther and the 95 Theses` },
  'lutero.shortDesc': { src: '81e85a6e', text: `Luther nails his theses in Wittenberg, lighting the spark of the Protestant Reformation.` },
  'lutero.fullDesc': { src: '558a376f', text: `<img src='https://upload.wikimedia.org/wikipedia/commons/9/9a/Ferdinand_Pauwels_-_Luther_hammers_his_95_theses_to_the_door.jpg'
          class='modal-inline-img' alt='Luther nailing his theses' title='Luther nailing the 95 theses'>
          On 31 October 1517, the monk Martin Luther nails his <a href='${W}Ninety-five_Theses' target='_blank' class='inline-link'>95 theses</a>
          to the door of the castle church in Wittenberg, Germany. With them he firmly protested against the sale of indulgences by the
          Catholic Church and clerical abuses, lighting the irreversible spark of the Protestant Reformation and recovering the doctrine of justification by faith alone (Sola Fide).` },

  'calvino.title': { src: '724498cd', text: `Calvin: the Systematic Doctrine of the Reformation` },
  'calvino.shortDesc': { src: '62e00f5a', text: `John Calvin publishes the 'Institutes of the Christian Religion', laying the systematic foundations of the Reformed faith.` },
  'calvino.fullDesc': { src: '353f440b', text: `In this year John Calvin publishes the first edition of his fundamental work: the
          <a href='${W}Institutes_of_the_Christian_Religion' target='_blank' class='inline-link'>Institutes of the Christian Religion</a>.
          This monumental work brilliantly systematized the scattered Protestant theology, laying the unshakable doctrinal body of the Reformed tradition
          that historically would give rise to the famous Calvinism, based firmly on the Absolute Sovereignty of God and the Scriptures.` },

  'trento.title': { src: 'a2ee6130', text: `The Council of Trent` },
  'trento.shortDesc': { src: '03f4221a', text: `The Catholic Church consolidates its dogmas and issues harsh condemnations in response to the Reformation.` },
  'trento.fullDesc': { src: 'fc1ab42d', text: `An influential ecumenical council of the Catholic Church spanning several decades. During the <a href='${W}Council_of_Trent' target='_blank' class='inline-link'>Council of Trent</a>
          rigorous condemnations were drawn up in the form of anathemas against the Protestant leaders and their theology of the original faith (such as Sola Gratia or Sola Scriptura),
          while all their opposing Catholic dogmas were redefined and consolidated.` },

  'stephanus.title': { src: 'db0886b3', text: `Stephanus and the Purification of the Text` },
  'stephanus.shortDesc': { src: '62fdd05a', text: `Robert Estienne (Stephanus) edits and improves the Textus Receptus, also adding the verses.` },
  'stephanus.fullDesc': { src: '6c5b56ea', text: `The French printer and scholar Robert Estienne (known as Stephanus) publishes impressive and definitive editions of the Greek New Testament, faithfully devoted
          to the purification and consolidation of what would become the standard <a href='${W}Robert_Estienne' target='_blank' class='inline-link'>Textus Receptus</a>
          (his famous 1550 edition, or 'O Mirificam'). Later, in 1551, he would be the first person in history to divide this fundamental text
          into numbered verses. His work is the direct link between Erasmus and Theodore Beza, thus consolidating the line of transmission that would culminate in the KJV of 1611.` },

  'beza.title': { src: '7acde248', text: `Beza and the summit of the Textus Receptus` },
  'beza.shortDesc': { src: 'b8d02a02', text: `Beza publishes several editions of the Greek New Testament, consolidating the text of Erasmus and Stephanus known as the Textus Receptus.` },
  'beza.fullDesc': { src: '0d6ebc39', text: `The Genevan theologian and reformer <a href='${W}Theodore_Beza' target='_blank' class='inline-link'>Theodore Beza</a> succeeded Calvin
          and published nine main editions of the Greek New Testament between 1565 and 1598. His work continued and refined the earlier work of Erasmus and Stephanus,
          helping to standardize and consolidate the reading of the biblical text that came from the great majority of Byzantine manuscripts discovered up to that time.<br><br>
          These editions of Beza represented the final form of what later came to be known historically as the
          <a href='${W}Textus_Receptus' target='_blank' class='inline-link'>Textus Receptus</a>
          or 'Received Text' of the Protestant church. His Greek New Testament, together with his rigorous annotations and Latin translations, provided a solid
          and uniform basis for the translators of the Reformation throughout Europe.` },

  'biblia-del-oso.title': { src: '63a232d2', text: `Casiodoro de Reina: the Bear Bible` },
  'biblia-del-oso.shortDesc': { src: '4a8a1994', text: `Casiodoro de Reina translates the first complete Bible into Spanish, building firmly on the pure line of the Textus Receptus.` },
  'biblia-del-oso.fullDesc': { src: 'acbd5c77', text: `<img src='https://upload.wikimedia.org/wikipedia/commons/3/32/Biblia_del_Oso.png' class='modal-inline-img' alt='Title page of the Bear Bible' title='The famous bear emblem that sought to evade the Inquisition'>
          Published during his hard exile in Basel, Switzerland. <a href="https://youtu.be/rrRswC3wZ3Y" target="_blank" class="inline-link">
          It is the first translation of the complete Bible directly from the original languages into Spanish</a>,
          meticulously prepared by <a href='${W}Casiodoro_de_Reina' target='_blank' class='inline-link'>Casiodoro de Reina</a>.
          For the New Testament he relied on the <strong>Textus Receptus (Erasmus → Stephanus)</strong> — the most refined edition available in those years — and on the Masoretic Text for the Old Testament.
          According to the
          <a href="https://archive.org/details/BibliaDeCasiodoroDeReina1569/page/n981/mode/2up" target="_blank" class="inline-link">documentary evidence</a>, it included the
          <strong>apocryphal books</strong> integrated naturally throughout the Old Testament
          — without separating them or marking them in a distinct appendix, contrary to what other publications on the web claim — imitating the structure of the Latin Vulgate.
          Reina went as far as including texts as marginal as <strong>3 Esdras</strong> and <strong>4 Esdras</strong> (known as the Apocalypse of Ezra),
          books definitively rejected even by Rome at the Council of Trent.
          This shows that he was guided more by a literary desire to render the manuscripts within his reach than by imposing a theological or confessional filter on the canon.
          It would be the Protestant revisions of later centuries that progressively removed this material, finally shaping the standard closed evangelical canon.
          It is nicknamed the <a href='https://es.wikipedia.org/wiki/Biblia_del_oso' target='_blank' class='inline-link'>Bear Bible</a>
          after the historic emblem on its title page, used so as not to reveal that it was a Bible and to avoid it being burned by the Inquisition.` },

  // ══ ERA VIII · PROTESTANT ORTHODOXY ═══════════════════════════
  'ortodoxia-protestante.title': { src: '77bf6a49', text: `Protestant Orthodoxy` },
  'ortodoxia-protestante.shortDesc': { src: '43066ca3', text: `The Reina-Valera, the King James, Dort and the Pilgrims.` },

  'biblia-del-cantaro.title': { src: '362fa599', text: `Cipriano de Valera: the Pitcher Bible` },
  'biblia-del-cantaro.shortDesc': { src: '5655e647', text: `Cipriano de Valera revises Casiodoro's translation, consolidating the influence of the Textus Receptus in the Spanish-speaking world.` },
  'biblia-del-cantaro.fullDesc': { src: '2cf7c753', text: `<img src='https://upload.wikimedia.org/wikipedia/commons/5/5f/Portada_de_la_Biblia_del_C%C3%A1ntaro_que_se_conserva_en_la_Biblioteca_Nacional_de_Espa%C3%B1a.jpg'
          class='modal-inline-img' alt='Title page of the Pitcher Bible' title='Two men, one plants and the other waters'>
          <a href='${W}Cipriano_de_Valera' target='_blank' class='inline-link'>Cipriano de Valera</a> publishes in Amsterdam
          the first thorough revision of the <a href='https://es.wikipedia.org/wiki/Biblia_del_oso' target='_blank' class='inline-link'>Bear Bible</a>.
          After more than two decades of painstaking revision, this historic 1602 edition is the first work to be called and constituted as the 'Reina-Valera' Bible.
          For his adjustments to the New Testament he relied fully on the stable editions of the <strong>Textus Receptus (Erasmus → Stephanus)</strong>,
          since Theodore Beza's latest revisions were very close in time to his arduous twenty years of work.<br><br>
          It took the nickname <a href='https://archive.org/details/BibliaDelCntaro1602/page/n467/mode/2up' target='_blank' class='inline-link'>Pitcher Bible</a>
          because its famous title page shows two men at work: one planting a tree and the other watering it with a pitcher of water,
          in direct allusion to the teaching given by Paul in 1 Corinthians 3:6.` },

  'remonstrantes.title': { src: '8cc64c0b', text: `The Articles of the Remonstrants` },
  'remonstrantes.shortDesc': { src: '9e024ffd', text: `The followers of Arminius officially state their disagreements and strong Calvinist objections.` },
  'remonstrantes.fullDesc': { src: '931d3344', text: `The followers of Jacobus Arminius published the <strong>Articles of Remonstrance</strong>, opposing <a href='#calvino' class='inline-link' data-event='calvino'>Calvinist orthodoxy</a> with five key points:<br>
          <ul class='modal-list'>
            <li><strong>1. Conditional Election:</strong> God elects on the basis of His foreknowledge of man's faith.</li>
            <li><strong>2. Unlimited Atonement:</strong> Christ died for all mankind (potentially).</li>
            <li><strong>3. Total Depravity:</strong> Man needs prevenient grace in order to believe.</li>
            <li><strong>4. Resistible Grace:</strong> The human will can reject God's call.</li>
            <li><strong>5. Conditional Security:</strong> The possibility of falling from grace after having believed.</li>
          </ul>` },

  'king-james.title': { src: '4a213f65', text: `King James Version (Authorized Version)` },
  'king-james.shortDesc': { src: 'b241f472', text: `The historic English translation, relying on Beza's editions, is completed: the crowning work of the Textus Receptus in English.` },
  'king-james.fullDesc': { src: '343af68e', text: `Promoted and authorized by <strong>King James I</strong> of England himself (which is why it took the title <i>King James Version</i> or <i>Authorized Version</i>),
          this monumental work was thoroughly translated by 54 prominent biblical scholars. This committee did not innovate on the original text, but relied
          firmly on the Greek editions recently matured by Theodore Beza (1589, 1598) at the end of the century, reaching the masterly summit of the purifying chain
          of the <strong>Textus Receptus (Erasmus → Stephanus → Beza)</strong>.<br><br>
          Its solemn precision consolidated and forged the modern English language and in turn established the whole English-speaking world firmly on the majority
          and Byzantine Greek text, opening the way to the revivals of the great post-Reformation centuries.` },

  'dort.title': { src: '99df5f7b', text: `The Synod of Dort and TULIP` },
  'dort.shortDesc': { src: '1afbce35', text: `The Synod drafts the Canons of Dort, reaffirming John Calvin's definitive doctrinal teachings.` },
  'dort.fullDesc': { src: '5ed3ee7e', text: `In response to the <a href='#remonstrantes' class='inline-link' data-event='remonstrantes'>Remonstrance</a>, the <a href='${W}Synod_of_Dort' target='_blank' class='inline-link'>Synod of Dort</a>
          set out the famous five points of Calvinism (the acrostic <strong>TULIP</strong>):<br>
          <ul class='modal-list'>
            <li><strong>T (Total Depravity):</strong> The total depravity of man. Sin affects man's will, and he cannot seek God.</li>
            <li><strong>U (Unconditional Election):</strong> God's sovereign unconditional election. God chooses without basing it on the faith of the chosen.</li>
            <li><strong>L (Limited Atonement):</strong> Limited (particular) atonement. Christ paid only for the elect.</li>
            <li><strong>I (Irresistible Grace):</strong> Irresistible grace in the calling. The Spirit changes man's will so that he accepts the call, and the elect always accept it.</li>
            <li><strong>P (Perseverance of the Saints):</strong> The perseverance and preservation of the saints: "once saved, always saved".</li>
          </ul>` },

  'peregrinos.title': { src: 'd94ba83f', text: `The Pilgrims reach America` },
  'peregrinos.shortDesc': { src: 'd6863a21', text: `The Puritan separatists bring the Mayflower to shore in America in search of freedom.` },
  'peregrinos.fullDesc': { src: '22fdd7aa', text: `A large group of Puritan separatists, weary of the persecution and forced suffocation of a corrupt Church of England, bravely landed on
          the unexplored shores of Plymouth in Massachusetts aboard the famous historic ship 'Mayflower'. Seeking absolute freedom, they established a colony
          in the new world firmly grounded in godly ideals and teachings, known and praised today in American history as the true
          <a href='${W}Pilgrims_(Plymouth_Colony)' target='_blank' class='inline-link'>Pilgrims</a> or American Pilgrim Mothers and Fathers.` },

  // ══ ERA IX · PRIMITIVE BAPTISTS AND SPANISH REVISIONS ══════
  'bautistas-primitivos.title': { src: 'c4bd7292', text: `Primitive Baptists and Spanish Revisions` },
  'bautistas-primitivos.shortDesc': { src: 'e6491a3e', text: `Kehukee, the Dead Sea Scrolls and the revisions of the Reina-Valera.` },

  'kehukee.title': { src: '9cafced1', text: `The Kehukee Declaration` },
  'kehukee.shortDesc': { src: '6649f518', text: `The Kehukee Baptist Association rejects centralized missions, seminaries and modern Bible societies, giving rise to the Primitive Baptist movement.` },
  'kehukee.fullDesc': { src: '9b191396', text: `The <a href='https://en.wikipedia.org/wiki/Kehukee_Primitive_Baptist_Church' target='_blank' class='inline-link'>Kehukee Baptist Association</a>
          adopted in October 1827 the historic <a href='https://baptiststudiesonline.com/wp-content/uploads/2007/02/the-kehukee-declaration.pdf' target='_blank' class='inline-link'>Kehukee Declaration</a>
          in Halifax, North Carolina. Grounded in the Calvinist doctrine of the absolute sovereignty of God, the Primitive Baptists emphatically rejected
          centralized missions, seminaries and modern Bible societies as human innovations contrary to the Regulative Principle of the church.
          This declaration marked the formal birth of the Primitive Baptist movement in America. The Kehukee church still exists and can be seen at its
          <a href='https://maps.app.goo.gl/KMk9AFqRkBHoyNoL8' target='_blank' class='inline-link'>original historic location in North Carolina</a>.` },

  'rv-1865.title': { src: '6ae90916', text: `Reina-Valera 1865` },
  'rv-1865.shortDesc': { src: '1e825ae0', text: `Dr. Ángel H. de Mora's revision for the American Bible Society; a more complex textual picture than is usually thought.` },
  'rv-1865.fullDesc': { src: 'fb803651', text: `<p>The <strong>Reina-Valera 1865</strong> (also known as <strong>SBA 1865</strong>) is the revision carried out by
          <strong>Dr. Ángel H. de Mora</strong> for the <a href='${W}American_Bible_Society' target='_blank' class='inline-link'>American Bible Society</a>.
          It introduced numerous changes from the 1602 edition and, according to several researchers, in some places followed the
          <a href='${W}Vulgate' target='_blank' class='inline-link'>Latin Vulgate</a> or traditional translations
          instead of the <a href='${W}Textus_Receptus' target='_blank' class='inline-link'>Textus Receptus</a>.</p>

          <img src='https://assets.lulu.com/cover_thumbs/1/9/19zjk72j-ebook-shortedge-384.jpg'
          class='modal-inline-img' alt='Modern edition of the RV 1865' title='Modern edition of the Reina-Valera 1865'>

          <p><strong>📜 Two textual states?</strong></p>
          <p>There are at least two textual states associated with this revision, according to authors within the Textus Receptus defense movement:</p>
          <ul class='modal-list'>
            <li><strong>Original 1865:</strong> The revision as first published, with some readings taken from the Latin Vulgate.</li>
            <li><strong>"Revised" 1865:</strong> A later edition whose purpose, according to descriptions found in digitization projects, was to remove the readings taken from the Vulgate and restore those of the Textus Receptus, bringing the revision closer to the traditional Greek text.</li>
          </ul>

          <p><strong>📖 A more complex picture than it seems:</strong></p>
          <p>The introduction to the digitized text of the 1865 explains that the scanned copy represents an <strong>1884 edition</strong>,
          and that there was considerable editorial work to distinguish different revisions of the period (1858, 1862 and 1865).
          There are multiple later printings (1884, 1907, etc.) with typographical and editorial corrections, but these
          are still identified as the 1865 revision, not as a new official revision.</p>

          <p><strong>⚠️ Critical note:</strong></p>
          <p>As for the claim that there is a "revised 1865" that removes Vulgate readings to come closer to the
          Textus Receptus, <strong>no primary documentation supporting it has been found</strong>. There is no known preface, editorial notice
          or historical record that officially announces a second revision of the 1865 with that aim.
          The term "revised" seems to describe a corrected printing or an edition prepared by modern editors,
          not a second revision officially published by the American Bible Society. This claim is repeated
          in some circles that defend the Textus Receptus, but it lacks formal documentary support.</p>` },

  'rv-1909.title': { src: '89457e6a', text: `Reina-Valera 1909 (the "Antigua")` },
  'rv-1909.shortDesc': { src: '6a82418c', text: `A historic, much-loved revision, criticized today for allowing readings from the Critical Text.` },
  'rv-1909.fullDesc': { src: '059044dc', text: `Published by the American and the British Bible Societies, the <strong>RV 1909</strong> updated the spelling. However, it subtly incorporated some influences
          of the <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'><strong>Critical Text</strong></a> into its New Testament, departing from the pure Textus Receptus. This mixture prompted the later independent purification efforts.` },

  'rollos-mar-muerto.title': { src: 'b69cc7cf', text: `The discovery of the Dead Sea Scrolls` },
  'rollos-mar-muerto.shortDesc': { src: '6489e4e3', text: `A vast collection of ancient biblical manuscripts, copied and preserved by a Jewish community in the desert, comes to light.` },
  'rollos-mar-muerto.fullDesc': { src: '9ae5b683', text: `<img src='https://upload.wikimedia.org/wikipedia/commons/1/15/Temple_Scroll.png'
          class='modal-inline-img' alt='Temple Scroll' title='Fragment of the Temple Scroll, one of the longest manuscripts'>
          Written, copied and preserved between the 3rd century BC and AD 68, the <a href='${W}Dead_Sea_Scrolls' target='_blank' class='inline-link'>Dead Sea Scrolls</a>
          are an extraordinary collection of more than 900 ancient Jewish manuscripts. They were hidden in clay jars inside several rocky caves at
          <strong>Qumran</strong>, near the arid shores of the Dead Sea, presumably to protect them from the advance of the Roman army during the Great Jewish Revolt.
          Their astonishing <strong>discovery from 1947 onward</strong> by a young Bedouin shepherd shook the world of biblical scholarship, the greatest archaeological find of the 20th century.<br><br>
          <img src='https://upload.wikimedia.org/wikipedia/commons/c/cb/Qumran.jpeg'
          class='modal-inline-img img-large' alt='Qumran caves' title='The Qumran caves, where the scrolls lay hidden for almost two millennia'>
          <strong>📜 What was found in the caves?:</strong>
          <ul class='modal-list'>
            <li><strong>Biblical manuscripts (40%):</strong> Copies of every book of the Hebrew Old Testament (except Esther). The <strong>Great Isaiah Scroll</strong> stands out: compared with the medieval Masoretic Text a thousand years later, it showed an astonishing precision in the preservation of the text.</li>
            <li><strong>Sectarian texts (30%):</strong> Documents exclusive to the strict Jewish community that lived in the area (probably Essenes). They include rules of life (<em>Community Rule</em>), laws and interpretive commentaries (<em>Pesher Habakkuk</em>), and the curious <em>Copper Scroll</em>, which lists hidden treasures.</li>
            <li><strong>Intertestamental literature (30%):</strong> Apocryphal and pseudepigraphal Jewish texts highly valued in Second Temple Judaism, such as copies of the <em>Book of Enoch</em> and the <em>Book of Jubilees</em>.</li>
            <li><strong>⚠️ Important clarification:</strong> <strong>absolutely no New Testament text</strong> or Gnostic gospel was found among the Dead Sea Scrolls. Qumran is often confused with the find of the <strong>Nag Hammadi Library</strong> (Egypt, 1945), where the famous <em>Gospel of Thomas</em> was indeed discovered. Qumran was a strictly Jewish, pre-Christian library, while Nag Hammadi was a later Coptic Gnostic deposit.</li>
          </ul>` },

  'rv-1960.title': { src: '895b946e', text: `Reina-Valera 1960` },
  'rv-1960.shortDesc': { src: '1db96daf', text: `The United Bible Societies publish the revision that would become the best-loved Bible in the contemporary Spanish-speaking world.` },
  'rv-1960.fullDesc': { src: '2f7c79d2', text: `<img src='https://m.media-amazon.com/images/S/aplus-media-library-service-media/df26a498-b71f-448b-abca-ea2d839a909c.__CR0,0,350,175_PT0_SX350_V1___.png' class='modal-inline-img' alt='RVR 1960 Bible' title='Reina-Valera 1960'>
          Coordinated by the <a href='${W}United_Bible_Societies' target='_blank' class='inline-link'>United Bible Societies (UBS)</a>, this historic major revision updated the grammar
          and language of the Bible for modern Spanish speakers while impeccably keeping the majesty and rhythmic style of the old translation.<br><br>
          Enjoying an impressive immediate acceptance, the <strong>Reina-Valera 1960</strong> became the standard in almost every evangelical denomination,
          memorized by countless generations. However, in terms of manuscript purity, the revision committee made a momentous decision: they did not limit themselves
          exclusively to the <strong>Textus Receptus</strong>. Instead, they chose to incorporate into the New Testament various readings from the
          <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'><strong>Critical Texts</strong></a> (minority Alexandrian manuscripts). This departure from the strict original foundation of Casiodoro de Reina and Valera
          became the main reason why, decades later, the firm defenders of the Received Text would begin great revision projects
          to faithfully restore the traditional line.` },

  'rv-1602-purificada.title': { src: '1153bbc2', text: `Reina Valera 1602 Purified` },
  'rv-1602-purificada.shortDesc': { src: '6595d639', text: `A Baptist revision completed in Monterrey that purifies the old 1602 text toward the pure line.` },
  'rv-1602-purificada.fullDesc': { src: 'c4faa28b', text: `Carried out by the Iglesia Bautista Bíblica de la Gracia in Monterrey (under the guidance of pastor Raúl Reyes), the
          <a href='https://valera1602.org/' target='_blank' class='inline-link'>1602 Purified Bible</a>
          arose as a solemn project to restore the foundations of the historic <strong>Bible of Cipriano de Valera (1602)</strong>. Its primary purpose is
          to purify modern Spanish of all the critical incrustations that contaminated the Bibles after 1865, appealing directly to the authority of the Greek
          <strong>Textus Receptus</strong> and the Hebrew Masoretic Text, meticulously checking the readings against the English reference of the <strong>King James Bible (1611)</strong>.` },

  'rvg.title': { src: '23e05b2b', text: `Reina Valera Gómez (RVG)` },
  'rvg.shortDesc': { src: 'a35c8375', text: `Dr. Humberto Gómez leads a translation effort to be the unanimous lexical parallel of the historic King James Version, relying heavily on it.` },
  'rvg.fullDesc': { src: '5ce6c2cc', text: `Coordinated and cooperatively supported by several conservative ministries and independent churches, the
          <a href='https://reinavaleragomez.com/' target='_blank' class='inline-link'>RVG</a> was an effort led by Dr. Humberto Gómez.
          Taking the historic RV 1909 as its base and structure, the team of translators aimed to align every New Testament passage majestically
          to be the closest lexical and doctrinal parallel in Spanish to the English <strong>King James Version (KJV)</strong>, relying heavily on it.
          For this noble purpose, the RVG ensured its complete and exclusive grounding on the unconditional <strong>Textus Receptus</strong>.` },

  'rv-sbt.title': { src: '3f4d4e12', text: `Reina Valera SBT` },
  'rv-sbt.shortDesc': { src: 'a23df920', text: `The Trinitarian Bible Society subjects the old RV 1909 to a masterly revision based on the pure original texts.` },
  'rv-sbt.fullDesc': { src: 'f7b9cda1', text: `The historic project led by the <a href='https://sociedadbiblicatrinitaria.org/' target='_blank' class='inline-link'>Trinitarian Bible Society (SBT)</a>
          seeks to give the Spanish-speaking world a refined, very high-quality Reina-Valera, taking as its primary structural text the venerable
          <strong>Reina-Valera 1909</strong>. Correcting all the <a href='#westcott-y-hort' class='inline-link' data-event='westcott-y-hort'>Critical Text</a> infiltrations that this version harbored for a century, this institutional effort
          ensures it depends loyally and exclusively on the historic <strong>Textus Receptus</strong> and the traditional Hebrew Masoretic Text, crowning a vast
          scholarly front with the aim of preserving intact the formal equivalence of the original words.` },
};
