# Reconstrucción de la Línea del Tiempo Bíblica con Zoom Reveal

| | |
|---|---|
| Proyecto | `scripture-timeline` (publicado en `timeline.whiteweb.mx`) |
| Fecha | 2026-11-16 |
| Estado | Definido, listo para implementar |
| Destinatario | El implementador (desarrollo asistido por IA, "vibe coding") |
| Aprobador | El usuario (dueño del producto) |

## Cómo leer este documento

El documento tiene tres partes:

- **Parte I. El requerimiento.** Lo que el usuario quiere, descrito en texto corrido, tal como lo planteó. Define **qué** se quiere, no cómo hacerlo.
- **Parte II. Análisis.** El desglose del requerimiento en puntos concretos y verificables (A1, A2…), con las soluciones que el análisis previo identificó como las más convenientes. Incluye la lista de aceptación.
- **Parte III. Diseño y especificación técnica.** Cómo se recomienda construirlo: estado actual del código, arquitectura, datos, notas técnicas, despliegue y riesgos.

Reglas de lectura:

- **Manda la Parte I.** Si algo de las Partes II o III la contradice, vale lo que dice la Parte I.
- **Las Partes II y III son un análisis previo, no instrucciones.** El implementador puede cambiar cualquier cosa de ellas si defiende por qué su opción es mejor (sección 2 de la Parte II).
- **La prioridad del proyecto es que el resultado sea visualmente atractivo** (sección 1 de la Parte II). Debe leerse antes que el resto del análisis.

Dos términos que se usan en todo el documento:

- **El usuario:** el dueño del producto, quien pide el trabajo y lo aprueba.
- **El visitante:** la persona que usa el diagrama ya publicado.

---

# Parte I. El requerimiento

Ya existe un proyecto llamado Scripture Timeline: una línea del tiempo en una página web, con eventos relacionados con la Biblia, la iglesia y la religión. El usuario quiere ampliar ese proyecto, y para ampliarlo hay que rearmarlo. A los datos de los eventos hay que darles un formato nuevo, y de la parte visual no se quiere reutilizar casi nada de lo que existe: se quiere hacer todo desde cero.

Hay una funcionalidad muy específica que se quiere usar: el Zoom Reveal con transiciones suaves. Debe ser muy parecido a lo que hace Prezi y, si se puede, igual. No se quiere hacer en Prezi. Se quiere que sea una página web, como lo es ahora. Hoy está hecha con Angular, y al usuario le interesa saber si puede hacerse con Angular apoyándose en algún módulo o librería reutilizable que ya ofrezca lo que hace Prezi, tanto el Zoom Reveal como las transiciones suaves.

El proyecto debe centrarse mucho en esa funcionalidad y en lo bien que se ve. Lo que se va a representar sigue siendo una línea del tiempo normal, pero con Zoom Reveal. Actualmente, si alguien da clic en la línea del tiempo, se muestran los datos del evento y nada más. Con Zoom Reveal habría más funcionalidad y más riqueza, y esa riqueza es la que se busca: que la persona pueda moverse con más libertad, que se puedan introducir más gráficas, y que además de la interactividad se aprovechen las ayudas visuales que el Zoom Reveal permite, porque el lienzo es distinto.

Tiene que quedar claro que se pide un Zoom Reveal y no un simple zoom. Los objetos deben aparecer y desaparecer según las acciones de quien usa el diagrama, sobre todo al acercarse y alejarse, y también con las transiciones. La profundidad no es la misma en todas partes. Habrá eventos en los que acercarse sea una transformación sencilla y ahí termine, y habrá otros en los que se pueda acercar una y otra vez, cada vez más adentro, mientras el diagrama sigue mostrando más detalle de lo que la persona va explorando, igual que en Prezi. La persona debe sentirse libre de acercarse a lo que se le antoje para ver si se despliega más información.

Prezi está orientado a que estos diagramas sean fáciles de usar, y muchos de sus controles no son comunes en el desarrollo de software. Por eso se quiere que el comportamiento de Prezi se revise a fondo y se respete. El usuario ya ha pedido antes cosas parecidas a otros implementadores y dejaron funciones fuera; el ejemplo más claro es arrastrar con el mouse, que no les salió natural o simplemente no lo hicieron. Eso no puede repetirse. El diagrama debe abrirse como lo abre Prezi: solo, cubriendo la página entera.

También debe poder usarse como una presentación. Si la persona da clic en siguiente, el diagrama se mueve al siguiente punto elegido, ya sea acercándose, alejándose o con una transición sin cambio de zoom. Debe haber siguiente y anterior, y los puntos del recorrido los define el usuario. De Prezi no se necesita la música. El video sí: poder incluir videos de YouTube sería muy útil.

En el teléfono debe usarse igual que en la computadora, de forma transparente para la persona, con el pellizco para acercar y alejar.

Al usuario se le ocurrió además una función que no recuerda haber visto en Prezi y que quiere incluir. Con el diagrama alejado, al nivel de las eras, que es el nivel más alto, aparecerían uno o varios menús. Cada menú sirve de guía sobre un tema: por ejemplo, los temas relacionados con la Biblia, o con la iglesia, o con la doctrina. La persona da clic en un punto del menú y el diagrama se acerca muy suavemente hasta ese punto, por adentro que esté. Al llegar debe haber un botón para regresar al menú de ese tema; al usarlo, el diagrama se aleja hasta el menú y lo enfoca, para que la persona pueda elegir otro punto. Junto a ese menú puede haber otro, sobre otro tema. Hoy esos temas existen como filtros, y los filtros deben seguir existiendo.

El usuario vio en un diagrama de Prezi una línea del tiempo en la parte inferior de la pantalla, presente sin importar dónde estuviera enfocada la vista, y quiere lo mismo. Si la persona se acercó mucho a un punto, abajo debe aparecer la línea del tiempo y en qué lugar de ella está parada, para darle contexto: qué año está viendo o qué evento está analizando, sin importar qué tan adentro se haya ido. Cuando el diagrama está completamente alejado solo se ven las eras, así que ahí esa línea no hace falta; puede ocultarse o dejarse en blanco, conservando el espacio.

Esto no es una migración tal cual. Además de migrar, hay que agregar más información. El usuario tiene un listado de eventos históricos que quiere ir agregando: por ahora hay 14 definidos, y es probable que lleguen a ser tres o cuatro veces esa cantidad. En los eventos nuevos aparece además una estructura que antes no estaba y que puede obligar a replantear cómo están organizados los datos: los subrangos de tiempo. Las eras ya son rangos de tiempo, pero ahora hay rangos que no abarcan una era entera, sino que quedan dentro de una. Los eventos, de hecho, no siempre son una fecha: por lo general son rangos de fechas. Hay rangos contenidos dentro de otros, y también puede haber rangos que se traslapan: uno del año 1 al 5, otro del 3 al 7 y otro del 6 al 8. Hace falta una forma de representarlos que sea visualmente agradable y fácil de entender.

De los eventos nuevos no existe todavía el texto detallado. Los eventos actuales tienen secciones de texto que se despliegan al acercarse; de los nuevos solo se tiene el año, el nombre y un resumen muy corto, de una línea. El usuario quiere que el implementador genere, a partir de eso, la información detallada de cada evento nuevo, como la que ya tienen los eventos con los que se cuenta.

El contenido va a ir creciendo junto con el proyecto, de forma parecida a un marco de trabajo ágil. Conforme se agreguen eventos, el usuario irá proporcionando las gráficas, recursos o diseños que quiere que se muestren en el diagrama. Qué va y dónde va dentro de cada evento se decide de forma manual: lo lleva el implementador, en un documento aparte, siguiendo las instrucciones del usuario conforme se va construyendo el diagrama. Pero un evento nuevo no puede quedarse vacío mientras tanto. Debe tener un estado por defecto, con textos, gráficos y animaciones sencillas ya resueltos, y sobre eso el usuario personaliza lo que quiera.

El usuario debe poder editar los datos de los eventos. Hoy están en un archivo con un formato específico, y el texto de los eventos está bien como está. Entre más amigable sea el formato, sin código ni estructuras complejas, mejor; aunque el usuario entiende que al hacerlo más genérico se sacrifican cosas, y por eso duda si conviene cambiarlo. No tiene que ser un JSON. Lo que sí quiere es que todos los eventos queden dentro de un solo archivo.

El sitio debe poder verse en español y en inglés. Todo el contenido que se muestra en pantalla debe tener su traducción, de manera que cuando alguien dé clic en el botón de traducir, todo pase al otro idioma. Soportar inglés y español es suficiente para el sitio. Hace falta una estrategia para manejar la traducción, de español a inglés o viceversa. Las traducciones debe generarlas la IA, es decir, el implementador, durante el propio proceso de vibe coding, y así debe ser en todo momento; usar un servicio externo de traducción sería un error en este proyecto. Cuando el implementador genere el detalle y la descripción de los eventos nuevos, debe generarlos en español y en inglés. Los eventos que ya existen en español debe traducirlos al inglés.

La reconstrucción se hace dentro del mismo proyecto de Scripture Timeline. Se crea un branch nuevo, se genera un PR, y el resultado sustituye a la línea del tiempo que hay actualmente. Lo que hoy existe debe mantenerse: los filtros, la impresión, que la impresión se base en los filtros, el código QR y las demás funciones, o al menos las que puedan migrarse. El usuario entiende que mover los eventos para que ocupen el ancho de la pantalla, como ocurre hoy, quizá no tenga sentido en un diseño con Zoom Reveal, y en eso espera una recomendación. Las impresiones que ya existen pueden quedar obsoletas si no hay remedio; de preferencia deberían seguir funcionando, y como mínimo sus códigos deberían abrir el diagrama. Si no implica riesgos ni problemas, la publicación del sitio debe quedar automática dentro de este mismo trabajo.

Se quiere hacer todo junto, no por fases. El trabajo se hará con vibe coding. El implementador presenta el diseño completo, con el tema visual, las transiciones por defecto y la organización por defecto, sobre los datos reales. El usuario aprueba el diseño completo: lo visual y el contenido no pueden separarse, porque no se puede aprobar uno sin el otro. A partir de la primera versión habrá correcciones, también visuales, y el usuario irá agregando personalizaciones. Las pruebas de aceptación son manuales y las hace el usuario, que irá listando las correcciones hasta dar el trabajo por aceptado.

Lo visual es lo que más preocupa al usuario. El resultado tiene que ser visualmente atractivo, y este punto debe quedarle muy claro al implementador. Durante la preparación de este requerimiento se hizo una prueba visual rápida, salió muy mal y se descartó; el temor es que el producto final quede así. De esa prueba el usuario sacó una observación que quiere dejar asentada: en los diagramas con Zoom Reveal casi nada va encerrado en recuadros, porque no hace falta, y encerrar algo es restringir a la persona, que debe sentirse libre de acercarse a cualquier cosa. Delimitar debe ser algo muy puntual. El video sí, y ya trae su propio marco. Los controles de siguiente y anterior, la indicación de la era en la parte superior y la línea del tiempo inferior también le parecieron atinados. La combinación de colores la resolverá el implementador.

Por último, el usuario parte de que el implementador puede ser mejor que este análisis en lo que va a proponer, y de forma especial en lo visual. Fuera de lo que el usuario está pidiendo aquí, el implementador puede cambiar cualquier cosa de lo que se le sugiere: la arquitectura, la plataforma, la estructura de los datos o lo que considere, mientras defienda por qué su opción es mejor.

---

# Parte II. Análisis

Esta parte desglosa el requerimiento de la Parte I en puntos concretos. Lo que aquí se describe como solución es lo que el análisis previo alcanzó a identificar; no es una instrucción del usuario.

## 1. La prioridad del proyecto: que sea visualmente atractivo

Esta sección es la más importante del documento. Si el implementador solo pudiera recordar una cosa de todo lo que aquí se pide, debería ser esta: **el resultado tiene que verse muy bien.**

### 1.1 Qué significa esta prioridad

- **A1.** El atractivo visual es el criterio principal con el que se va a juzgar el trabajo. No es un acabado que se aplica al final ni un detalle que se deja "para después": es parte de lo que se está pidiendo desde el primer día.
- **A2.** Una versión que funciona pero se ve pobre, genérica o improvisada **no se considera terminada**, aunque cumpla todos los demás puntos de este documento.

El proyecto se centra en el Zoom Reveal y en lo bien que se ve. Cuando el implementador tenga que elegir dónde poner el esfuerzo, la calidad visual y la fluidez del diagrama van antes que cualquier función secundaria.

### 1.2 Por qué importa tanto

El contenido de esta línea del tiempo es denso: siglos de historia, traducciones, concilios, doctrinas. Nadie lo recorre por obligación. Lo que hace que una persona se quede, explore, se acerque a un evento y luego a otro, es que el diagrama resulte atractivo y que dé gusto moverse por él. Si se ve mal, el contenido no se lee, por bueno que sea.

Además existe un antecedente. Durante el análisis se hizo una prueba visual rápida y el resultado fue burdo; se descartó por completo. El temor concreto del usuario es que el producto final quede así. Esta sección existe para evitarlo.

### 1.3 Dónde tiene que notarse

El atractivo visual no se limita a los colores. Debe notarse en todo lo que el visitante ve y siente al usar el diagrama. La lista siguiente señala **dónde** importa; no dice **cómo** lograrlo, porque eso le corresponde al implementador.

- **A3. La primera impresión.** La vista general, con el diagrama completo, es lo primero que ve cualquier persona. Debe invitar a entrar. No puede parecer una tabla, un diagrama técnico ni una herramienta de oficina.
- **A4. El movimiento.** Las transiciones son la mitad de la experiencia. Acercarse, alejarse y desplazarse debe sentirse fluido, con ritmo, con arranques y frenados naturales. Un movimiento brusco, mecánico o entrecortado arruina el efecto aunque todo lo demás esté bien.
- **A5. La revelación.** El momento en que algo aparece o se transforma al acercarse es el corazón del Zoom Reveal. Debe ser agradable de ver: las cosas no "brincan" a la pantalla ni se encienden de golpe.
- **A6. La línea del tiempo misma.** Eras, rangos, carriles y eventos deben formar una composición elegante. Que haya carriles y rangos solapados no debe hacer que parezca un cronograma de proyecto.
- **A7. La tipografía.** Años, títulos y textos largos deben tener carácter y leerse con comodidad. La elección de letras, sus tamaños y su jerarquía son parte central del diseño.
- **A8. El color.** La paleta debe ser armónica y con intención, tanto en tema claro como en oscuro, y permitir distinguir eras y categorías sin esfuerzo.
- **A9. El detalle de cada evento.** Texto, imagen, gráficas y video deben verse dispuestos con intención y con aire entre ellos. La plantilla por defecto, la que recibe cualquier evento sin personalizar, también debe verse diseñada; no puede parecer un formulario rellenado.
- **A10. Las gráficas y ayudas visuales.** Deben compartir un mismo estilo entre sí y con el resto del diagrama, aunque se vayan agregando poco a poco.
- **A11. Cada nivel de acercamiento.** En cualquier punto donde el visitante se detenga, lo que ve debe parecer una vista compuesta a propósito: ni vacía, ni saturada, ni accidental. Esto incluye los puntos intermedios, no solo los destinos previstos.
- **A12. Los controles.** Botones, filtros, menús de guías y la barra inferior deben ser discretos y coherentes con el conjunto. Acompañan al contenido; no compiten con él.
- **A13. El teléfono.** La experiencia en pantalla pequeña debe verse tan cuidada como en computadora.
- **A14. La unidad.** Todo lo anterior debe sentirse como una sola pieza, con un mismo criterio, y no como partes hechas por separado.

### 1.4 La autoridad del implementador

Este documento parte de un supuesto: **en lo visual, el implementador sabe más que este documento.** Se espera que proponga, no solo que obedezca. Es la misma regla general de la sección 2, aplicada a lo visual.

- El implementador decide el tema visual completo: colores, tipografías, formas, composición, animaciones.
- Las reglas visuales de la sección 15 son lo que el análisis identificó a partir del requerimiento y de la prueba visual descartada. Si el implementador encuentra una solución mejor que alguna de ellas, debe proponerla y explicar por qué; el usuario decide.
- Si algo de este documento, en cualquier sección, obliga a un resultado que se ve peor, el implementador debe decirlo en lugar de cumplirlo en silencio.
- Nada de lo descrito aquí debe leerse como un límite a la calidad. Es el piso, no el techo.

### 1.5 Cómo se va a juzgar

- Lo juzga el usuario, mirando el producto funcionando, en rondas de corrección. Es de esperarse que haya correcciones visuales desde la primera versión; eso es parte normal del proceso.
- Antes de presentar cada versión, el implementador debe mirar su propio resultado en pantalla y preguntarse si pasaría como trabajo de un estudio de diseño profesional. Si la respuesta es no, todavía no está listo para presentarse.
- No son aceptables: el aspecto de plantilla genérica, los estilos por defecto de una librería sin trabajar, ni dar algo por terminado solo porque funciona.

## 2. Libertad del implementador para proponer algo mejor

Esta regla aplica a todo el documento.

- **A15.** Las Partes II y III de este documento son el resultado de un análisis previo: lo mejor que se alcanzó a identificar antes de implementar. Eso incluye la arquitectura, la plataforma, las librerías, la estructura de los datos y cualquier solución concreta. El implementador puede cambiar cualquiera de esas cosas, siempre que defienda por qué su opción es mejor.
- **A16.** Lo que el usuario pide está en la Parte I. Un cambio que altere lo que ahí se pide necesita la aprobación del usuario. El implementador también puede, y debe, proponer mejoras sobre eso.

Se parte del supuesto de que el implementador puede encontrar mejores soluciones que las descritas aquí. Cuando un punto del análisis menciona una solución concreta, debe leerse como "esto es lo mejor que se identificó; si hay algo mejor, se propone".

## 3. Alcance y entrega

- **A17.** El trabajo se hace dentro del mismo proyecto, `scripture-timeline`. El implementador crea un branch nuevo (se asume que parte de `main`) y entrega todo en un solo PR.
- **A18.** La versión nueva sustituye a la línea del tiempo actual. No deben convivir las dos.
- **A19.** La parte visual se hace desde cero. No se quiere reutilizar casi nada de lo visual que existe hoy.
- **A20.** Todo se entrega junto: la reconstrucción, el nuevo formato de los datos y los eventos nuevos disponibles en ese momento.

## 4. Forma de trabajo

- **A21.** El desarrollo es iterativo. El implementador presenta una primera versión completa, funcionando con los datos reales y con su propuesta visual. El usuario la revisa y lista las correcciones, hasta aceptarla.
- **A22.** Lo visual y el contenido se aprueban juntos, sobre el producto funcionando. No hay una etapa separada para aprobar solo el diseño.
- **A23.** El proyecto crece por etapas: conforme avance, el usuario irá entregando más eventos, gráficas y recursos, y el implementador los irá incorporando.
- **A24.** Antes de presentar cualquier versión, el implementador debe ver su propio resultado en pantalla, en computadora y en teléfono, y corregir lo que se vea mal.

## 5. La línea del tiempo

El diagrama es una línea del tiempo normal, a la que se le agrega el Zoom Reveal.

- **A25.** La línea representa el tiempo a escala real, desde la fecha más antigua hasta la más reciente.
- **A26.** Al nivel más alto están las **eras**. Con el diagrama completamente alejado solo se ven las eras y los menús de las guías (ver sección 10).
- **A27.** Dentro de una era puede haber **rangos de tiempo** más cortos, que no abarcan la era completa.
- **A28.** Un rango que queda dentro de otro se muestra dentro de él.
- **A29.** Cuando varios rangos se solapan a medias, deben verse todos con claridad y de forma agradable. La solución que propone el análisis son carriles: cada rango ocupa el primer carril libre. Ejemplo: si un rango va del año 1 al 5, otro del 3 al 7 y otro del 6 al 8, el primero y el tercero comparten carril, y el segundo va en uno aparte.
- **A30.** Los eventos no siempre son una sola fecha; por lo general son rangos de fechas. Un evento de un solo año es una marca sobre la línea; uno con año de inicio y de fin se trata como rango.

## 6. Zoom Reveal

Este es el corazón del proyecto. **No es un zoom que solo agranda.** Los objetos aparecen, desaparecen y se transforman según lo que hace el visitante, sobre todo al acercarse y alejarse.

- **A31.** Al acercarse a un elemento, aparece contenido que antes no se veía; al alejarse, desaparece.
- **A32.** La profundidad es dinámica. Hay eventos en los que acercarse produce una sola transformación, y otros en los que se puede entrar una y otra vez, mostrando cada vez más detalle de lo que el visitante explora.
- **A33.** Cualquier objeto, del tamaño que sea, puede responder al acercamiento o al clic.
- **A34.** El visitante debe sentirse libre de acercarse a lo que se le antoje para ver si se despliega más información.
- **A35.** Las transiciones son suaves: la vista se aleja, se desplaza y se acerca de forma continua, sin cortes.
- **A36.** Un movimiento puede ser un acercamiento, un alejamiento o un desplazamiento sin cambio de zoom.
- **A37.** Si el dispositivo del visitante tiene activada la preferencia de reducir el movimiento, las transiciones se simplifican.

## 7. Cómo se mueve el visitante

Prezi tiene controles pensados para que estos diagramas sean fáciles de usar, y varios no son comunes en el desarrollo de software. Otros implementadores los han dejado fuera. Aquí son obligatorios.

- **A38. Arrastrar con el mouse.** El visitante mueve el diagrama manteniendo presionado el botón izquierdo y arrastrando, desde cualquier punto, incluso encima de un objeto. Debe sentirse natural. Es la función que más se ha omitido en intentos anteriores; no se acepta una entrega sin ella.
- **A39. Rueda del mouse.** Acerca y aleja, hacia donde está el cursor.
- **A40. Touchpad.** Dos dedos mueven el diagrama; pellizcar acerca y aleja.
- **A41. Teléfono y tableta.** Se usa igual que en la computadora: un dedo arrastra y el pellizco acerca y aleja. No hay una versión distinta para móvil.
- **A42. Clic.** Un clic sobre un elemento lleva la vista hasta él; un clic fuera regresa.
- **A43. Botones.** Hay botones para ir al inicio (vista completa), subir un nivel, acercar y alejar.
- **A44. Pantalla completa.** El diagrama ocupa toda la pantalla, como en Prezi. Los controles flotan sobre él. Puede ofrecerse además un botón de pantalla completa del navegador.
- **A45. Límites.** El visitante no puede perderse fuera del diagrama ni acercarse o alejarse sin fin.

## 8. Saber dónde se está

- **A46.** En la parte inferior hay una línea del tiempo pequeña y fija que indica dónde está parado el visitante, sin importar qué tan adentro haya entrado: qué época, qué año y qué evento está viendo.
- **A47.** Desde esa barra se puede saltar a otra época y subir de nivel.
- **A48.** Con el diagrama completamente alejado, esa barra se deja vacía, conservando su espacio. A ese nivel solo se ven eras y no hace falta.
- **A49.** Mientras el visitante está dentro de una era, el nombre de la era se muestra en la parte superior.

## 9. Recorrido: siguiente y anterior

El diagrama también debe poder usarse como presentación.

- **A50.** Hay controles de siguiente y anterior. Al dar siguiente, el diagrama se mueve al siguiente punto elegido, ya sea acercándose, alejándose o desplazándose.
- **A51.** El usuario define el orden y los puntos del recorrido. Si no define nada, el recorrido es cronológico.
- **A52.** Un paso del recorrido también puede hacer aparecer o desaparecer un objeto.
- **A53.** El recorrido salta los eventos que el filtro tiene ocultos.
- **A54.** Si el visitante exploró por su cuenta, al dar siguiente continúa desde el último punto del recorrido que visitó.

## 10. Guías temáticas

Esta función no viene de Prezi; es una petición expresa del requerimiento.

- **A55.** Con el diagrama alejado, al nivel de las eras, aparecen uno o varios **menús**. Cada menú es una guía sobre un tema: por ejemplo, la Biblia, la iglesia o la doctrina.
- **A56.** Cada menú lista sus puntos. Al dar clic en uno, la vista se acerca suavemente hasta ese punto, por profundo que esté.
- **A57.** Al llegar hay un botón para regresar al menú de esa guía. Al usarlo, la vista se aleja hasta el menú y lo enfoca, para que el visitante elija otro punto.
- **A58.** Puede haber varios menús, uno junto a otro.
- **A59.** Dentro de una guía, siguiente y anterior recorren los puntos de esa guía.
- **A60.** Las guías no sustituyen a los filtros: los filtros se conservan.
- **A61.** El contenido de cada guía lo define el usuario.

## 11. Contenido de cada evento

- **A62.** Todo evento se ve completo sin trabajo adicional: título, año, categorías, descripción, imagen y animaciones sencillas por defecto. Así un evento nuevo aparece bien resuelto desde que se agrega.
- **A63.** Cada evento puede personalizarse: qué gráficas lleva, dónde va cada cosa y cuántos niveles tiene. Por ejemplo, la descripción de un evento puede incluir una gráfica con varios puntos, y al acercarse a un punto o seleccionarlo se abre una gráfica distinta.
- **A64.** La personalización es manual y la realiza el implementador siguiendo las instrucciones del usuario, conforme se construye el diagrama.
- **A65.** Se pueden incluir videos de YouTube.
- **A66.** No se requiere música ni audio suelto.
- **A67.** El texto largo se lee moviendo el diagrama; no hay cuadros con barra de desplazamiento propia.

## 12. Lo que ya existe y debe conservarse

La versión nueva debe mantener las funciones actuales, o al menos las que puedan migrarse.

- **A68.** Filtros por categoría, con sus modos de combinación.
- **A69.** Resaltado de categorías. En teléfono, donde no hay clic derecho, debe existir una forma equivalente.
- **A70.** El estado se guarda en el enlace, para poder compartir una vista filtrada o un punto exacto del diagrama.
- **A71.** Impresión basada en los filtros activos.
- **A72.** Código QR por evento y código QR de la vista filtrada. En la impresión, un video aparece como enlace con su QR.
- **A73.** Tema claro y tema oscuro.
- **A74.** No se requiere que los eventos se reacomoden para ocupar el ancho de la pantalla al filtrar, como ocurre hoy. En su lugar, lo filtrado se oculta o atenúa sin mover lo demás, y la vista se ajusta para encuadrar lo visible.
- **A75.** Las impresiones anteriores pueden quedar obsoletas si no hay forma de evitarlo. De preferencia sus QR deben seguir abriendo el evento correcto; como mínimo, deben abrir el diagrama.

## 13. Idiomas

- **A76.** El sitio se ofrece en dos idiomas: español e inglés. No se requieren más.
- **A77.** Se traduce todo lo que el visitante ve: controles, mensajes, nombres de eras y rangos, textos de los eventos, guías y los textos que aparezcan dentro de las gráficas.
- **A78.** Hay un botón para cambiar de idioma en cualquier momento, sin perder el punto del diagrama en el que se está. El idioma elegido se recuerda en la siguiente visita.
- **A79.** El idioma forma parte del enlace: un enlace compartido abre el diagrama en el idioma con el que se compartió. La impresión y los códigos QR usan el idioma activo.
- **A80.** Cada texto tiene un idioma de origen, que por lo general es el español, y una traducción guardada al otro idioma. El sitio muestra una u otra según el idioma activo.
- **A81.** Las traducciones las genera el implementador (la IA) durante el desarrollo, y quedan guardadas en el proyecto. **No se usa ningún servicio externo de traducción**, ni al construir el sitio ni durante la visita. Esto es una decisión del usuario, no una recomendación del análisis.
- **A82.** Las traducciones van en un archivo aparte, que mantiene el implementador. El archivo de eventos que edita el usuario se queda en un solo idioma, para no complicarlo.
- **A83.** Si a un texto le falta traducción, se muestra en su idioma de origen; nunca un espacio vacío.
- **A84.** Cuando el texto de origen cambia, su traducción se marca como desactualizada y se vuelve a generar.
- **A85.** Las traducciones generadas quedan pendientes de revisión por el usuario, igual que los textos generados (A95). Los términos doctrinales y los nombres propios se traducen siempre igual.
- **A86.** Los eventos que ya existen en español se traducen al inglés como parte de este trabajo.

## 14. Los datos

- **A87.** El usuario debe poder editar los eventos por sí mismo. El formato debe ser lo más amigable posible: sin código ni estructuras complejas.
- **A88.** El formato actual del texto de los eventos es adecuado y se conserva.
- **A89.** Todos los eventos quedan en un solo archivo.
- **A90.** La personalización del diagrama (sección 11) va en un documento aparte, que mantiene el implementador.
- **A91.** Se agregan eventos nuevos. Hay 14 definidos por ahora, y es probable que lleguen a tres o cuatro veces esa cantidad.
- **A92.** Los eventos nuevos se capturan en `requerimientos/eventos-nuevos.md`, con lo único que hoy se tiene de cada uno: año o rango, nombre y un resumen de una línea.
- **A93.** El implementador genera el texto detallado de cada evento nuevo, en español y en inglés, con las mismas partes y el mismo formato que tienen los eventos actuales: descripción corta y descripción completa con negritas, listas y enlaces.
- **A94.** El análisis recomienda que el texto generado siga la línea y el tono de los eventos existentes, que tienen una postura definida, en lugar de un tono neutral o de otra postura.
- **A95.** Todo texto generado queda marcado como pendiente de revisión hasta que el usuario lo revise. El implementador no debe inventar fechas, nombres ni citas; lo que no pueda sustentar lo deja señalado como dudoso para que el usuario lo resuelva.
- **A96.** Los enlaces y las imágenes de los eventos nuevos deben ser reales y estar comprobados. Si no hay una imagen confiable, el evento usa la presentación por defecto sin imagen.
- **A97.** La estructura actual de los datos (una lista de eras, y cada era con sus eventos) puede sustituirse. La solución que el análisis previo alcanza a ver como más conveniente es una sola estructura en la que cada elemento indica a cuál pertenece, con niveles sin límite. En ella las eras dejan de ser un elemento aparte: son las raíces de la estructura, y los eventos son las hojas. Esto es un análisis previo, no una instrucción: es lo mejor que se identificó hasta ahora, y si el implementador identifica algo mejor, debe proponerlo (A15). La única condición es que el usuario pueda seguir editando los eventos (A87).

## 15. Reglas visuales identificadas en el análisis

La prioridad visual está descrita en la sección 1. Aquí se recogen las reglas concretas que el análisis identificó a partir del requerimiento. El implementador propone el tema visual completo, junto con las transiciones y la organización por defecto, y el usuario lo corrige por rondas. No existe un diseño aprobado de antemano.

- **A98. Sin delimitaciones.** El contenido no se encierra en cajas, tarjetas ni bordes. En los diagramas con Zoom Reveal no se usan porque no hacen falta, y delimitar algo restringe al visitante: le sugiere que ahí termina el contenido.
- **A99. Delimitar es la excepción.** Solo se enmarcan el video (con el marco propio de YouTube) y los controles: siguiente y anterior, guía, zoom, filtros, el nombre de la era y la barra inferior.
- **A100.** Los rangos de tiempo se dibujan como franja o línea sobre el eje, con su nombre al lado, no como caja con texto dentro.
- **A101.** No se agregan marcas ni adornos para indicar que algo tiene más detalle. Se sigue el patrón de Prezi: el contenido se revela al acercarse y todo responde al clic.
- **A102.** Nada debe encimarse y el texto debe leerse bien en cualquier nivel de acercamiento.
- **A103.** La combinación de colores debe ser cuidada y funcionar en tema claro y en oscuro.

Referencia: un diagrama de Prezi con una línea del tiempo en la parte inferior, cuyo enlace el usuario puede aportar.

## 16. Publicación

- **A104.** Al integrar cambios a la rama principal, el sitio se publica automáticamente, siempre que no implique riesgos.

## 17. Lo que queda fuera

- Más idiomas que español e inglés.
- Traducir el audio de los videos.
- Música y audio suelto.
- Un editor visual para colocar objetos.
- Girar la vista.
- Funciones para presentar ante público: notas del presentador, temporizador, control remoto, audiencia en vivo.
- Guardar las imágenes dentro del proyecto. Hoy se enlazan desde otros sitios y pueden romperse; se acepta por ahora y queda para una etapa posterior.

## 18. Lo que el usuario debe aportar

| Insumo | Para qué |
|---|---|
| Listado de eventos nuevos en `requerimientos/eventos-nuevos.md` (14 definidos por ahora) | Agregarlos al diagrama y generar su texto detallado. |
| Revisión de los textos generados para los eventos nuevos | Darlos por buenos o corregirlos. |
| Revisión de las traducciones generadas | Darlas por buenas o corregirlas. |
| Año de inicio y de fin de cada era | Dibujar las eras a escala. Hoy no están definidos. |
| Rangos de tiempo dentro de las eras | Dibujar los rangos. |
| Gráficas y recursos por evento | Personalizar los eventos, conforme avance el proyecto. |
| Nombre y puntos de cada guía | Construir los menús. |
| Orden del recorrido, si no es cronológico | Configurar siguiente y anterior. |
| Enlace del diagrama de Prezi de referencia | Referencia de aspecto y comportamiento (opcional). |

## 19. Aceptación

La aceptación es manual y la hace el usuario, que listará las correcciones hasta dar por aceptado el trabajo. Lista de revisión:

**Movimiento**
- [ ] Arrastrar con el botón izquierdo mueve el diagrama desde cualquier punto, también sobre objetos (A38).
- [ ] La rueda acerca y aleja hacia el cursor (A39).
- [ ] Touchpad: dos dedos mueven, pellizco acerca y aleja (A40).
- [ ] Teléfono: un dedo mueve, pellizco acerca y aleja (A41).
- [ ] Clic en un elemento lo enfoca; clic fuera regresa (A42).
- [ ] Funcionan inicio, subir un nivel, acercar y alejar (A43).
- [ ] Las transiciones son suaves, sin saltos (A35).
- [ ] Con movimiento reducido activado, las transiciones se simplifican (A37).

**Zoom Reveal**
- [ ] Con todo alejado solo se ven eras y menús de guías (A26).
- [ ] Al acercarse aparecen rangos, eventos y su detalle (A31).
- [ ] Un evento con varios niveles permite entrar más de una vez (A32).

**Línea del tiempo**
- [ ] El tiempo está a escala real (A25).
- [ ] Los rangos contenidos se ven dentro de su rango mayor (A28).
- [ ] Los rangos solapados se distinguen en carriles (A29).

**Recorrido y guías**
- [ ] Siguiente y anterior siguen el orden definido, o el cronológico (A50, A51).
- [ ] El recorrido salta lo filtrado (A53).
- [ ] Cada menú lleva a sus puntos y el botón de regreso vuelve al menú (A56, A57).

**Contexto**
- [ ] La barra inferior indica época, año y evento al acercarse (A46).
- [ ] La barra inferior queda vacía con todo alejado (A48).
- [ ] El nombre de la era aparece arriba (A49).

**Contenido**
- [ ] Un evento nuevo sin personalizar se ve completo (A62).
- [ ] Un evento personalizado muestra sus gráficas donde se indicó (A63).
- [ ] Los eventos nuevos tienen texto detallado con el mismo formato que los actuales (A93).
- [ ] Los textos generados pendientes de revisión están identificados (A95).
- [ ] Los videos de YouTube se reproducen dentro del diagrama (A65).

**Funciones conservadas**
- [ ] Filtros, resaltado y tema claro y oscuro (A68, A69, A73).
- [ ] El enlace restaura la vista compartida (A70).
- [ ] La impresión respeta los filtros e incluye los QR (A71, A72).
- [ ] Los QR nuevos abren el evento correcto; los anteriores, al menos el diagrama (A75).

**Idiomas**
- [ ] El botón de idioma cambia todo lo visible entre español e inglés sin perder el punto del diagrama (A77, A78).
- [ ] Un enlace compartido abre en el idioma con el que se compartió; la impresión y los QR usan el idioma activo (A79).
- [ ] Un texto sin traducción se muestra en su idioma de origen (A83).

**Aspecto**
- [ ] No hay cajas ni bordes alrededor del contenido, salvo video y controles (A98, A99).
- [ ] Nada se encima y el texto se lee en cualquier nivel (A102).
- [ ] La vista general invita a explorar y no parece una tabla ni un diagrama técnico (A3).
- [ ] Las transiciones y las apariciones se sienten fluidas y agradables (A4, A5).
- [ ] La plantilla por defecto de un evento se ve diseñada (A9).
- [ ] Cada punto donde el visitante se detiene se ve compuesto a propósito (A11).
- [ ] El conjunto se siente como una sola pieza (A14).
- [ ] El usuario aprueba el tema visual (A1, A2, A21).

**Entrega**
- [ ] Todo llega en un solo PR que sustituye a la versión actual (A17, A18).
- [ ] Integrar a la rama principal publica el sitio automáticamente (A104).

---

# Parte III. Diseño y especificación técnica

Convención: **debe** indica una condición necesaria para cumplir el requerimiento; **recomendado** indica la opción sugerida, que el implementador puede cambiar si lo justifica ante el usuario.

## T1. Situación actual del código

### T1.1 Tecnología

- Angular 20 con componentes independientes (standalone) y signals; `zone.js` activo.
- GSAP 3.14 para animaciones; `qrcode` para los códigos QR.
- `HashLocationStrategy`; la app redirige a `/#/timeline`.
- Publicación en GitHub Pages con dominio `timeline.whiteweb.mx`.

### T1.2 Datos

- Los datos **no** son un JSON. Están en `src/app/data/timeline-events.data.ts`, un archivo TypeScript de unos 50 kB.
- Contiene 26 eventos, agrupados en 5 eras, con 4 categorías (`biblia`, `doctrina`, `historia`, `roma`).
- Cada evento tiene: año en texto (`"~250 a.C."`, `"382 – 405 d.C."`, `"2020+"`), título, categorías, descripción corta, descripción completa en HTML e imagen por URL externa.
- `src/app/utils/parse-year.util.ts` convierte el texto del año en año inicial y final.
- Las eras solo agrupan eventos: no tienen año de inicio ni de fin. Hay eventos de eras distintas que coinciden en el tiempo.
- El id de cada evento se calcula: tres letras de la era + posición dentro de la era + año inicial (ejemplo: `event-Igl-3-1095`).

### T1.3 Dónde vive cada función existente

| Función | Ubicación |
|---|---|
| Filtros, modos O / Y, resaltado, estado en la URL (`tags`, `mode`, `highlight`) | `services/filter.service.ts` |
| Enlace directo a un evento (`?event=<id>`) | `components/timeline/timeline.component.ts` |
| Impresión con QR por evento y QR de la vista | `components/filter-panel/filter-panel.component.ts` |
| Tema claro / oscuro | `services/theme.service.ts` |
| Detalle del evento en ventana modal | `components/event-modal/` |
| Desplazamiento horizontal y vista vertical para móvil | `components/timeline/` |

### T1.4 Observaciones

- El eje actual no está a escala: cada evento ocupa una casilla en orden, con relleno por cada 40 años de hueco.
- La impresión arma su propio HTML en una ventana nueva a partir de los eventos filtrados; no depende de la línea visual. El filtro tampoco.
- El resaltado se activa hoy con clic derecho sobre el filtro.
- Los estilos del componente de la línea del tiempo rondan los 7.7 kB (estimación sin espacios ni comentarios); `angular.json` falla la compilación a partir de 8 kB por componente.
- No hay pruebas automáticas, salvo `app.spec.ts`.
- El README dice que el despliegue ocurre en cada push a `main`, pero en la copia local `.github/workflows/deploy.yml` solo tiene el disparador manual (`workflow_dispatch`).

## T2. Arquitectura recomendada

Responde a A25 a A45.

- **Angular** se mantiene para la aplicación, los datos, los filtros, la impresión y el tema. Se recomienda conservar la lógica no visual existente (T1.3).
- **Cámara propia sobre `d3-zoom` y `d3-interpolate`:**
  - `d3-zoom` resuelve los gestos (rueda, arrastre, pellizco) y los límites de zoom y desplazamiento.
  - Sus transiciones implementan el algoritmo de van Wijk y Nuij, que aleja, desplaza y acerca en una sola curva: el movimiento tipo Prezi.
  - El interpolador calcula una duración recomendada según la trayectoria.
- **Dos capas movidas por la misma cámara:**
  - Capa SVG para lo gráfico: eje, eras, rangos, conectores, gráficas.
  - Capa HTML para el texto, porque el texto en SVG no hace párrafos ni saltos de línea por sí solo, y las descripciones actuales son HTML con listas y enlaces.
- **GSAP** se conserva para microanimaciones. Su licencia permite uso comercial sin costo, pero es propietaria de Webflow, no open source; el README debe corregirse en ese punto.
- **Lienzo a pantalla completa** con controles flotantes. No hay versión embebida en una página con scroll.

No se encontró una librería de Angular lista que ofrezca el efecto Prezi completo.

## T3. Opciones evaluadas y descartadas

| Opción | Motivo |
|---|---|
| Zumly | No es un lienzo libre: son vistas discretas y jerárquicas conectadas por disparadores. |
| impress.js | Es un framework de presentaciones con pasos fijos, no pensado para datos filtrables. |
| Envoltorios de Angular (ngx-panzoom, ngx-panster) | Solo dan pan y zoom, y van atrasados respecto a Angular 20. |
| PixiJS / canvas | Obligaría a reimplementar el HTML enriquecido. Solo se justificaría con miles de elementos. |

## T4. Modelo de datos

Responde a A27 a A30, A51, A61 a A64, A75 a A97 y A15.

### T4.1 Archivo de eventos

- Un solo archivo, en TypeScript (A87 a A89). Ventaja de TypeScript: un campo mal escrito detiene la compilación en lugar de publicarse.
- El texto de cada evento (título, descripciones, imagen, categorías) conserva su formato actual.
- **La estructura actual puede sustituirse** (A97). Hoy es una lista de eras y cada era contiene sus eventos: solo dos niveles. Los rangos dentro de eras, y los rangos dentro de rangos, no caben en esa forma.
- **Estructura propuesta: una sola lista de elementos que se referencian entre sí.**
  - Todos los elementos son del mismo tipo: tienen `id` fijo, año de inicio, año de fin opcional y `padre` opcional.
  - Un elemento sin padre es una raíz: eso son las eras. No hay una lista de eras aparte.
  - Un elemento sin hijos es una hoja: eso son los eventos.
  - Lo que está en medio son los rangos intermedios. La profundidad no tiene límite.
  - Si el padre no se declara, puede deducirse de las fechas.
- **Alternativa considerada:** anidar los elementos unos dentro de otros en el archivo. Se lee como la jerarquía real, pero mover un elemento implica cortar y pegar bloques, y a varios niveles de profundidad se vuelve difícil de editar.
- Esta estructura es el resultado del análisis previo, no una instrucción. El implementador puede proponer una distinta si es mejor (A15).
- El `id` es fijo y escrito a mano (por ejemplo `cruzadas`); nunca cambia.
- Volumen esperado: 26 eventos actuales más hasta unos 56 nuevos (alrededor de 80).

### T4.2 Archivo de personalización

- Archivo aparte (A90). Es de datos, no de lógica, e indexa por id de evento.
- Contiene: gráficas y bloques por evento, su posición, niveles de profundidad, reglas de aparición, animaciones, recorridos y guías.
- Un evento sin entrada en este archivo usa la plantilla por defecto (A62).
- Las gráficas y recursos van como archivos separados, referenciados por nombre.

### T4.3 Ids estables

- Problema actual: el id depende de la posición del evento dentro de su era. Insertar un evento antes, corregir un año o renombrar una era lo cambia, y los QR impresos y enlaces compartidos (`?event=<id>`) dejan de encontrar el evento.
- En el diseño nuevo el id es además el destino de la cámara, así que **debe** ser fijo.
- **Recomendado:** una tabla con los 26 ids actuales y su id nuevo, para que los QR ya impresos sigan abriendo el evento correcto (A75).
- **Mínimo:** un id desconocido abre el diagrama sin error. Hoy ya ocurre así.

### T4.4 Eventos nuevos y texto generado

- La fuente de los eventos nuevos es `requerimientos/eventos-nuevos.md` (A92). El implementador los pasa a la estructura de datos.
- Se recomienda un campo por evento que indique si su texto está pendiente de revisión, para que el usuario pueda ubicar lo que falta revisar (A95).
- Como referencia de formato, tono y nivel de detalle se toman los 26 eventos existentes.

### T4.5 Traducciones

Responde a A76 a A86.

**Quién traduce.** El implementador genera todas las traducciones durante el desarrollo: las de los eventos existentes, las de los eventos nuevos (que se generan directamente en los dos idiomas), y las de la interfaz, las guías y las gráficas. No hay servicio externo de traducción en ninguna etapa (A81).

**Estrategia propuesta:**

- **Interfaz:** los textos de controles y mensajes van en un diccionario con una entrada por idioma.
- **Contenido:** las traducciones de eventos, eras, rangos, guías y gráficas van en un archivo aparte (A82), ligadas al id del elemento al que pertenecen.
- **Detección de cambios:** cada traducción queda ligada a su texto de origen, para detectar cuándo el origen cambió y la traducción quedó desactualizada (A84).
- **Activación:** un botón y un parámetro en el enlace (por ejemplo `?lang=en`). La elección se recuerda en el navegador.
- **Falta de traducción:** se muestra el texto de origen (A83).

**Otros puntos a resolver:**

- Formato de fechas por idioma (por ejemplo `a.C.` / `d.C.` frente a `BC` / `AD`).
- Las gráficas deben llevar su texto como texto, no dibujado dentro de una imagen, para poder traducirlo (A77).
- El parámetro de idioma debe convivir con los que ya existen en el enlace (`tags`, `mode`, `highlight`, elemento enfocado).
- Indicar el idioma activo en el atributo `lang` de la página.
- Un glosario de términos doctrinales y nombres propios, para que se traduzcan siempre igual (A85).
- Un campo que marque cada traducción como pendiente de revisión o desactualizada (A84, A85).

## T5. Detalle de comportamiento

### T5.1 Navegación

| Punto | Detalle técnico |
|---|---|
| A38 Arrastrar | Botón izquierdo en cualquier punto, también sobre objetos. Un umbral de distancia separa clic de arrastre. Cursor de mano e inercia al soltar. |
| A39 Rueda | Zoom centrado en el cursor. |
| A41 Táctil | Desactivar el zoom nativo de la página sobre el lienzo. Botones de zoom siempre visibles. |
| A42 Clic | Cada elemento define el área que la cámara encuadra al entrar en él. |
| A43 Subir un nivel | Además del botón, teclas Retroceso y Escape. Flechas del teclado para siguiente y anterior. |
| A45 Límites | Tope suave de zoom y de desplazamiento, sin mensajes. |

### T5.2 Zoom Reveal

- Cada objeto declara cuándo aparece y desaparece, según el nivel de zoom o el paso del recorrido (A31, A52).
- Un elemento puede tener una portada que cubre su contenido hasta que el visitante entra.
- Un objeto puede marcarse como visible tanto fuera como dentro de su padre (por ejemplo, un título que permanece).
- Lo que no se ve se retira del dibujo, no solo se vuelve transparente.
- Hay un ajuste global de velocidad de las transiciones.

### T5.3 Recorrido

- El orden del recorrido es independiente de la posición en el lienzo.
- Tipos de paso: volar a un elemento, hacer aparecer, hacer desaparecer, acercar a un objeto, alejar.
- Puede existir contenido fuera de todo recorrido.
- Ajuste configurable: entre dos elementos hermanos, la cámara regresa al padre o pasa directo al siguiente.
- Un elemento con detalle largo puede dividirse en páginas que se recorren en secuencia.

### T5.4 Carriles

- Asignación automática: se ordenan los rangos por inicio y cada uno toma el primer carril cuyo último rango ya terminó (A29).

### T5.5 Barra de contexto

- Mini línea con las eras y marcador de la posición visible.
- Ruta de profundidad (Era › Rango › Evento › Detalle) con cada nivel clicable.
- Clic o arrastre sobre la mini línea para saltar de época (A47).

### T5.6 Video de YouTube

- Carga diferida: miniatura primero; el reproductor se carga al dar clic.
- Un reproductor activo captura el mouse. **Debe** resolverse que arrastrar o hacer zoom sobre un video no deje atrapado al visitante.
- Pausa automática al alejarse o al pasar a otro punto.

### T5.7 Imágenes

- Carga diferida.
- Se recomienda usar las miniaturas de Wikimedia en lugar de los originales, que pueden pesar varios MB.

### T5.8 Enlace

- Se conservan `tags`, `mode` y `highlight`, y se agrega el elemento enfocado (A70).

## T6. Notas técnicas

- **Nitidez.** Para animar fluido, el navegador convierte la capa en imagen y la escala durante el movimiento; al detenerse hay que forzar que se redibuje nítida. Aplica a HTML y a SVG.
- **Rendimiento.** Retirar del dibujo lo que queda fuera de la vista o por debajo de su nivel de aparición.
- **Angular.** Los manejadores de gestos deben correr sin disparar la detección de cambios en cada cuadro.
- **Estilos.** `angular.json` limita los estilos por componente (advertencia a 4 kB, error a 8 kB). Poner los estilos del lienzo en archivos CSS globales bajo `src/styles/`, dividir el lienzo en componentes pequeños y subir el límite de error a 16 kB como red de seguridad.
- **Aspecto separado del contenido.** Colores, tipografías y formas definidos en un solo lugar, para que las rondas de corrección visual (A21) sean baratas.

## T7. Despliegue

Responde a A104.

- Verificar primero si el workflow en GitHub ya es automático; la copia local solo tiene el disparador manual y puede estar desactualizada.
- Si no lo es, agregar el disparador de push a `main`.
- Agregar al workflow una compilación de verificación, sin publicar, que corra cuando se abre o se actualiza un PR. La entrega de este trabajo es un solo PR (A17); la verificación aplica a ese PR cada vez que recibe cambios, y a los que haya en el futuro.
- Riesgo, considerado bajo: todo merge a `main` se publica de inmediato. Si la compilación falla, el sitio queda como estaba. La aceptación manual debe hacerse antes del merge.
- Corregir el README para que describa el comportamiento real.

## T8. Riesgos

| Riesgo | Mitigación |
|---|---|
| Alcance grande en un solo PR (decisión del usuario, A20) | Rondas de revisión sobre el producto funcionando; compilación de verificación en el PR (T7). |
| Resultado visual pobre | Prioridad de la sección 1 (A1 a A14); reglas A98 a A103; revisión propia del implementador (A24); rondas de corrección. |
| Arrastre con mouse omitido o poco natural | A38 obligatorio y primer punto de la aceptación. |
| Video que atrapa los gestos | T5.6. |
| Texto borroso tras una transición | Redibujado al detenerse (T6). |
| Mareo por movimiento | A37; sin rotación de la vista. |
| Imágenes externas rotas o pesadas | T5.7; alojamiento local en etapa posterior. |
| Límite de estilos por componente | T6. |
| Sin pruebas automáticas | Lista de aceptación manual (sección 19). |
| Enlaces y QR anteriores rotos | T4.3. |
| Traducciones con errores doctrinales o de sentido | A85: glosario de términos, traducciones marcadas como pendientes y revisión del usuario. |
| Texto generado con datos falsos, o con un tono distinto al de los eventos existentes | A94 a A96: seguir la línea de los eventos actuales, no inventar, marcar como pendiente y revisión del usuario. |

## T9. Etapas posteriores

- Alojar las imágenes dentro del repositorio.
- Incorporar el resto de los eventos nuevos y sus personalizaciones, conforme el usuario los entregue.

## T10. Referencias

Comportamiento de Prezi tomado como modelo:

- [How to use zoom in Prezi Present](https://support.prezi.com/hc/en-us/articles/360003498793-How-to-use-zoom-in-Prezi-Present)
- [How to present and view a Prezi presentation](https://support.prezi.com/hc/en-us/articles/360003478034-Presenting-and-viewing-a-presentation)
- [How to use keyboard shortcuts in Prezi Present](https://support.prezi.com/hc/articles/360003499013)
- [Editing topic and subtopic covers](https://support.prezi.com/hc/en-us/articles/360003498833-Editing-topic-and-subtopic-covers)
- [Structuring a Prezi presentation](https://support.prezi.com/hc/articles/360003498513)
- [How to add topics, subtopics, and pages](https://support.prezi.com/hc/en-us/articles/360003499333)
- [Topic and subtopic path settings](https://support.prezi.com/hc/articles/360044277273)
- [Using animations](https://support.prezi.com/hc/en-us/articles/360003498573-Using-animations)

Técnica:

- [d3-zoom](https://d3js.org/d3-zoom)
- [d3-interpolate: Zoom interpolation](https://d3js.org/d3-interpolate/zoom)
- [GSAP Standard License](https://gsap.com/community/standard-license/)
- [Zumly](https://unpkg.com/zumly@0.92.3/README.md)
- [impress.js](https://cdn.jsdelivr.net/gh/impress/impress.js@master/README.md)
