import { Injectable, inject, signal } from '@angular/core';
import { FilterService } from './filter.service';
import { I18nService } from './i18n.service';
import { TimelineDataService } from './timeline-data.service';
import { UrlStateService } from './url-state.service';
import { TimelineItem } from '../models/timeline.models';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Printing (A71, A72): the visible events (respecting the filters) in the active language,
 * each with a QR that opens it in the diagram, plus a QR of the filtered view.
 * A video appears as a link with its own QR.
 */
@Injectable({ providedIn: 'root' })
export class PrintService {
  private filters = inject(FilterService);
  private i18n = inject(I18nService);
  private data = inject(TimelineDataService);
  private url = inject(UrlStateService);
  readonly busy = signal(false);

  async print(): Promise<void> {
    this.busy.set(true);
    const win = window.open('', '_blank', 'width=900,height=760');
    try {
      const mod = await import('qrcode');
      const QR = ((mod as unknown as { default?: unknown }).default ?? mod) as {
        toDataURL: (text: string, opts: object) => Promise<string>;
      };
      const events = this.filters.visibleEvents();
      const opts = { width: 120, margin: 1, color: { dark: '#1c1710', light: '#ffffff' } };
      const eventQrs = await Promise.all(events.map((e) => QR.toDataURL(this.url.linkTo(e.id), opts)));
      const videos = events.flatMap((e) =>
        (this.data.custom.events[e.id]?.blocks ?? []).filter((b) => b.type === 'video').map((b) => ({ ev: e.id, b })),
      );
      const videoQrs = new Map<string, string>();
      for (const v of videos) {
        if (v.b.type !== 'video') continue;
        videoQrs.set(v.b.id, await QR.toDataURL(`https://youtu.be/${v.b.youtube}`, opts));
      }
      const viewQr = await QR.toDataURL(this.url.currentUrl(), { ...opts, width: 200, margin: 2 });
      this.write(win, this.html(events, eventQrs, videoQrs, viewQr));
    } catch (err) {
      console.error('Print with QR failed, printing without QR', err);
      this.write(win, this.html(this.filters.visibleEvents(), [], new Map(), ''));
    } finally {
      this.busy.set(false);
    }
  }

  private write(win: Window | null, html: string): void {
    if (!win) {
      alert(this.i18n.t('popupBlocked'));
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.onload = () => setTimeout(() => {
      win.focus();
      win.print();
    }, 600);
  }

  private html(events: TimelineItem[], qrs: string[], videoQrs: Map<string, string>, viewQr: string): string {
    const t = (k: Parameters<I18nService['t']>[0]) => this.i18n.t(k);
    const tx = (id: string, f: string, src: string) => this.i18n.text(`${id}.${f}`, src);
    const hlSet = this.filters.highlightedTags();
    const active = [...this.filters.activeTags()].map((id) => this.data.tag(id)).filter((x) => !!x);

    const body = events.map((e, i) => {
      const hlTags = e.tags.filter((tg) => hlSet.has(tg));
      const tag0 = this.data.tag(hlTags[0] ?? e.tags[0]);
      const accent = tag0?.color ?? '#8a6d3b';
      const isHl = hlTags.length > 0;
      const chips = e.tags.map((id) => {
        const tg = this.data.tag(id)!;
        return `<span class="chip"><i style="background:${tg.color}"></i>${esc(tx(`tag.${id}`, 'label', tg.label))}</span>`;
      }).join('');
      const desc = tx(e.id, 'fullDesc', e.fullDesc).replace(/<img[^>]*class=['"]modal-inline-img[^'"]*['"][^>]*>/gi, '');
      const img = e.image ? `<img class="hero" src="${esc(e.image)}" alt="">` : '';
      const vids = (this.data.custom.events[e.id]?.blocks ?? []).filter((b) => b.type === 'video').map((b) => {
        if (b.type !== 'video') return '';
        const title = this.i18n.text(`custom.${b.id}.title`, b.title);
        const qr = videoQrs.get(b.id);
        return `<div class="video">${qr ? `<img src="${qr}" alt="QR">` : ''}<div><strong>${esc(t('printVideo'))}:</strong> ${esc(title)}<br><a href="https://youtu.be/${b.youtube}">https://youtu.be/${b.youtube}</a></div></div>`;
      }).join('');
      const where = e.parent && e.parent.kind === 'event' ? `<div class="within">${esc(tx(e.parent.id, 'title', e.parent.title))}</div>` : '';
      return `
        <article class="${isHl ? 'is-hl' : ''}" style="--a:${accent}">
          <div class="main">
            <div class="head"><span class="year">${esc(this.i18n.year(e.yearLabel))}</span><span class="title">${esc(tx(e.id, 'title', e.title))}</span></div>
            ${where}
            <div class="chips">${chips}</div>
            <div class="desc">${img}${desc}<div style="clear:both"></div></div>
            ${vids}
          </div>
          ${qrs[i] ? `<div class="qr"><img src="${qrs[i]}" alt="QR"><span>${esc(t('printScanEvent'))}</span></div>` : ''}
        </article>`;
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="${this.i18n.lang()}"><head><meta charset="utf-8">
<title>${esc(t('printTitle'))}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Literata:opsz,wght@7..72,400;7..72,600&family=Inter:wght@500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Literata,Georgia,serif;font-size:8.6pt;line-height:1.45;color:#1c1710;background:#fff;padding:12mm 14mm;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:A4;margin:10mm} @media print{body{padding:0}}
  a{color:#7a4f12;text-decoration:none} strong{font-weight:600} em{font-style:italic}
  ul{margin:.3em 0 .6em 1.2em} li{margin-bottom:.25em} p{margin-bottom:.5em}
  header{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding-bottom:10px;margin-bottom:16px;border-bottom:2px solid #1c1710}
  h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:22pt;font-weight:700;letter-spacing:.01em}
  .meta{font-family:Inter,sans-serif;font-size:7.4pt;color:#6b6457;margin-top:2px}
  .filters{text-align:right;font-family:Inter,sans-serif;font-size:7pt;color:#6b6457}
  .chip{display:inline-flex;align-items:center;gap:4px;margin:0 0 0 8px;font-family:Inter,sans-serif;font-size:6.8pt;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#4f483d}
  .chip i{width:6px;height:6px;border-radius:50%;display:inline-block}
  .chips .chip:first-child{margin-left:0}
  article{display:flex;gap:14px;padding:9px 0 11px 14px;border-left:3px solid var(--a);margin-bottom:12px;break-inside:avoid;page-break-inside:avoid}
  article.is-hl{border-left-width:6px;background:#faf6ee}
  .main{flex:1;min-width:0}
  .head{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
  .year{font-family:'Cormorant Garamond',serif;font-size:13pt;font-weight:700;color:var(--a);white-space:nowrap}
  .title{font-family:'Cormorant Garamond',serif;font-size:13pt;font-weight:700}
  .within{font-family:Inter,sans-serif;font-size:6.8pt;color:#8a8173;margin-top:1px}
  .chips{margin:3px 0 6px}
  .desc{text-align:justify;color:#2f2a22}
  .hero{float:left;width:120px;max-height:150px;object-fit:cover;margin:2px 12px 6px 0;border-radius:2px}
  .qr{flex:none;text-align:center;font-family:Inter,sans-serif;font-size:6pt;color:#8a8173}
  .qr img{width:70px;height:70px;display:block;margin-bottom:2px}
  .video{display:flex;gap:10px;align-items:center;margin-top:6px;font-family:Inter,sans-serif;font-size:7.4pt}
  .video img{width:56px;height:56px}
  footer{display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:22px;padding-top:16px;border-top:1px solid #d9d2c4;break-inside:avoid}
  footer img{width:120px;height:120px}
  footer .cap{font-family:'Cormorant Garamond',serif;font-size:11pt;font-weight:600}
  footer .url{font-family:Inter,sans-serif;font-size:6.6pt;color:#8a8173;word-break:break-all;max-width:420px;text-align:center}
</style></head><body>
<header>
  <div><h1>${esc(t('printTitle'))}</h1>
  <div class="meta">${esc(t('printedOn'))} ${esc(this.i18n.date(new Date()))} · ${events.length} ${esc(events.length === 1 ? t('printEvent') : t('printEvents'))}</div></div>
  <div class="filters">${esc(t('printActive'))}:<br>${active.map((tg) => `<span class="chip"><i style="background:${tg!.color}"></i>${esc(tx(`tag.${tg!.id}`, 'label', tg!.label))}</span>`).join('')}
  ${hlSet.size ? `<br>★ ${esc(t('printHighlighted'))}` : ''}</div>
</header>
<main>${body}</main>
${viewQr ? `<footer><img src="${viewQr}" alt="QR"><div class="cap">${esc(t('printScanView'))}</div><div class="url">${esc(this.url.currentUrl())}</div></footer>` : ''}
</body></html>`;
  }
}
