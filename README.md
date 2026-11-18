# Línea del Tiempo de las Escrituras

Línea del tiempo interactiva, con Zoom Reveal, sobre la historia de la Biblia, sus traducciones, la doctrina cristiana y la historia de la iglesia. En español e inglés.

Publicada en https://timeline.whiteweb.mx

## Instalación

```bash
git clone https://github.com/obed-vazquez/scripture-timeline
cd scripture-timeline
npm install
```

## Desarrollo local

```bash
npm start
```

Abre http://localhost:4200

## Build de producción

```bash
npm run build
# Salida en: dist/scripture-timeline/browser/
```

## Publicar

Un push no publica. Hay dos formas de publicar:

- **Con un PR:** ponle la etiqueta `deploy` al PR hacia `main`. Al hacer merge, se publica.
- **A mano:** en GitHub, abre **Actions → Build and Deploy to GitHub Pages** y da clic en **Run workflow** sobre la rama `main`.

El workflow compila y publica en la rama `gh-pages` con el dominio `timeline.whiteweb.mx`.

## Editar los eventos

Todo el contenido está en un solo archivo: `src/app/data/timeline.data.ts`. El encabezado del archivo explica cada campo. Para agregar un evento, copia un bloque `{ ... }` y cambia sus datos; el orden no importa.

Si un `id` ya se publicó, no lo cambies: los enlaces y los códigos QR impresos lo usan.

## Traducciones al inglés

Las traducciones están en `src/app/data/timeline.en.ts`. Después de cambiar un texto en español:

```bash
npm run i18n
```

El reporte lista las traducciones faltantes, las desactualizadas (el español cambió) y las pendientes de revisión. Una traducción nueva se escribe con `src: ''` y luego se sella con:

```bash
npm run i18n -- stamp
```

Para marcar una traducción como revisada, agrégale `reviewed: true`.

## Gráficas, videos, guías y recorrido

Van en `src/app/data/timeline.custom.ts`, indexados por el `id` del evento. Un evento que no aparece ahí usa la presentación por defecto.

## Música de fondo

1. Para abrir el sitio con la música puesta, agrega `&musica=1` al enlace (por ejemplo `/#/timeline?musica=1`). El navegador la arranca en silencio y la activa con el primer clic.
2. Para cambiar la música, cambia el id de YouTube en `MUSIC_VIDEO`, dentro de `src/app/services/media.service.ts`.

## Revisar textos pendientes

Agrega `&revision=1` al enlace (por ejemplo `/#/timeline?revision=1`). Se marcan los textos pendientes de revisión, las traducciones faltantes o desactualizadas y los datos dudosos.
