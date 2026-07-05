import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FilterService } from '../../services/filter.service';
import { TIMELINE_TAGS } from '../../data/timeline-events.data';
import { TimelineTag, TimelineEvent } from '../../models/timeline.models';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-panel" [class.collapsed]="collapsed()">
      <div class="filter-header">
        <button class="filter-toggle-btn" (click)="togglePanel()" [attr.aria-expanded]="!collapsed()">
          <span class="filter-toggle-icon">🔍</span>
          <span>Filtros</span>
          <span class="filter-arrow">{{ collapsed() ? '▲' : '▼' }}</span>
        </button>

        <button class="print-btn" (click)="onPrint()" [disabled]="printing()" title="Imprimir con código QR">
          {{ printing() ? '⏳' : '🖨️' }} <span>{{ printing() ? 'Generando...' : 'Imprimir' }}</span>
        </button>
      </div>

      <div class="filter-body" [class.is-open]="!collapsed()">
        <!-- Tag toggles -->
        <div class="filter-tags">
          <button
            *ngFor="let tag of filterSvc.tags"
            class="filter-tag-btn"
            [class.active]="filterSvc.activeTags().has(tag.id)"
            [class.highlighted]="filterSvc.highlightedTags().has(tag.id)"
            [style.--tag-color]="tag.color"
            [style.--tag-bg]="tag.bg"
            [style.--tag-border]="tag.border"
            (click)="onTagClick(tag)"
            (contextmenu)="onTagRightClick($event, tag)"
            [title]="'Click: activar/desactivar | Clic derecho: resaltar'"
            [attr.aria-pressed]="filterSvc.activeTags().has(tag.id)">
            <span class="tag-icon">{{ tag.icon }}</span>
            <span class="tag-label">{{ tag.label }}</span>
            <span *ngIf="filterSvc.highlightedTags().has(tag.id)" class="highlight-dot">★</span>
          </button>
        </div>

        <!-- Filter Controls Row (Logic + Highlights) -->
        <div class="filter-controls-row">
          <!-- Action toggle -->
          <div class="filter-mode">
            <label class="mode-label">Acción:</label>
            <div class="mode-switch">
              <button
                class="mode-btn"
                [class.active]="action() === 'filter'"
                (click)="action.set('filter')"
                title="Filtrar (mostrar/ocultar) tarjetas">
                Filtrar
              </button>
              <button
                class="mode-btn alert"
                [class.active]="action() === 'highlight'"
                (click)="action.set('highlight')"
                title="Resaltar tarjetas en la línea">
                Resaltar
              </button>
            </div>
          </div>

          <!-- Filter mode toggle -->
          <div class="filter-mode" *ngIf="action() === 'filter'">
            <label class="mode-label">Lógica:</label>
            <div class="mode-switch">
              <button
                class="mode-btn"
                [class.active]="filterSvc.filterMode() === 'or'"
                (click)="filterSvc.setFilterMode('or')"
                title="Mostrar si coincide con algún filtro">
                (O)
              </button>
              <button
                class="mode-btn"
                [class.active]="filterSvc.filterMode() === 'and'"
                (click)="filterSvc.setFilterMode('and')"
                title="Mostrar solo si coincide con todos los filtros">
                (Y)
              </button>
            </div>
          </div>

          <!-- Clear highlights button -->
          <button
            *ngIf="filterSvc.hasHighlights()"
            class="clear-highlights-btn"
            (click)="filterSvc.clearHighlights()">
            ✕ Quitar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-panel {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: min(1000px, calc(100vw - 32px));
      background: var(--color-bg-filter);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      box-shadow: 0 -4px 24px rgba(0,0,0,0.1);
      z-index: 90;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: transform var(--transition-slow), background-color var(--transition-normal);
    }

    .filter-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      gap: 12px;
    }

    .filter-toggle-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-body);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .filter-toggle-btn:hover { background: var(--color-surface-1); color: var(--color-text-primary); }

    .filter-arrow { color: var(--color-accent); font-size: 0.7rem; }

    .print-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--color-surface-1);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .print-btn:hover { background: var(--color-accent-subtle); color: var(--color-accent); border-color: var(--color-accent); }
    .print-btn:disabled { opacity: 0.6; cursor: wait; }

    .filter-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease;
    }

    .filter-body.is-open {
      max-height: 300px;
      padding: 0 16px 16px;
    }

    .filter-tags {
      display: flex;
      flex-wrap: nowrap; /* Force single line */
      overflow-x: auto; /* Allow horizontal scrolling if many tags */
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 8px; /* space for scrollbar */
      scrollbar-width: thin; /* Firefox */
    }
    
    .filter-tags::-webkit-scrollbar {
      height: 6px;
    }
    .filter-tags::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 4px;
    }

    .filter-tag-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
      background: var(--color-surface-1);
      color: var(--color-text-muted);
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      position: relative;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .filter-tag-btn.active {
      border-color: var(--tag-border, var(--color-accent));
      background: var(--tag-bg, var(--color-accent-subtle));
      color: var(--tag-color, var(--color-accent));
    }

    .filter-tag-btn.highlighted {
      box-shadow: 0 0 0 2px var(--tag-color, var(--color-accent));
    }

    .filter-tag-btn:hover {
      border-color: var(--color-border-strong, #ccc);
      background: var(--color-surface-2);
      color: var(--color-text-primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }

    .filter-tag-btn.active:hover {
      filter: brightness(1.05);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    }

    .highlight-dot {
      color: var(--color-accent);
      font-size: 0.7rem;
    }

    .filter-controls-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      border-top: 1px solid var(--color-border);
      padding-top: 12px;
    }

    .filter-mode {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mode-label {
      font-size: 0.78rem;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    .mode-switch {
      display: flex;
      gap: 4px;
      background: var(--color-surface-1);
      border-radius: var(--radius-md);
      padding: 3px;
    }

    .mode-btn {
      padding: 4px 12px;
      border-radius: calc(var(--radius-md) - 2px);
      font-family: var(--font-body);
      font-size: 0.78rem;
      font-weight: 500;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .mode-btn.active {
      background: var(--color-bg-card);
      color: var(--color-accent);
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    
    .mode-btn.alert.active {
      color: #ef4444; /* Distinct red/orange for highlight mode */
    }

    .clear-highlights-btn {
      margin-top: 10px;
      padding: 5px 12px;
      border-radius: var(--radius-md);
      background: none;
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      font-family: var(--font-body);
      font-size: 0.78rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .clear-highlights-btn:hover {
      background: var(--color-surface-1);
      color: var(--color-text-primary);
    }

    @media print {
      .filter-panel { display: none !important; }
    }

    @media (max-width: 480px) {
      .filter-tag-btn span.tag-label { display: none; }
      .filter-tag-btn { padding: 6px 10px; }
    }
  `]
})
export class FilterPanelComponent {
  readonly filterSvc = inject(FilterService);
  private router = inject(Router);
  collapsed = signal(false);
  action = signal<'filter'|'highlight'>('filter');
  printing = signal(false);

  togglePanel(): void {
    this.collapsed.update(v => !v);
  }

  onTagClick(tag: TimelineTag): void {
    if (this.action() === 'filter') {
      this.filterSvc.toggleTag(tag.id);
    } else {
      this.filterSvc.toggleHighlight(tag.id);
    }
  }

  onTagRightClick(event: MouseEvent, tag: TimelineTag): void {
    event.preventDefault();
    this.filterSvc.toggleHighlight(tag.id);
  }

  async onPrint(): Promise<void> {
    this.printing.set(true);
    try {
      const QRCode = await import('qrcode');
      const events = this.filterSvc.getVisibleEvents();
      const baseUrl = this.getBaseUrl();

      // Generate QR data URLs in parallel
      const qrPromises = events.map(ev =>
        (QRCode.toDataURL as (text: string, opts: any) => Promise<string>)(
          `${baseUrl}?event=${ev.id}`,
          { width: 100, margin: 1, color: { dark: '#1c1710', light: '#ffffff' } }
        )
      );
      const globalQrPromise = (QRCode.toDataURL as (text: string, opts: any) => Promise<string>)(
        window.location.href,
        { width: 180, margin: 2, color: { dark: '#1c1710', light: '#ffffff' } }
      );

      const [eventQrs, globalQr] = await Promise.all([
        Promise.all(qrPromises),
        globalQrPromise,
      ]);

      const html = this.buildPrintHtml(events, eventQrs, globalQr);
      this.openPrintWindow(html);
    } catch (err) {
      console.error('Error generating print view:', err);
      // Fallback: print without QR codes
      const events = this.filterSvc.getVisibleEvents();
      const html = this.buildPrintHtml(events, [], '');
      this.openPrintWindow(html);
    } finally {
      this.printing.set(false);
    }
  }

  private getBaseUrl(): string {
    const origin = window.location.origin;
    const hash = window.location.hash.split('?')[0]; // e.g. #/timeline
    return `${origin}/${hash}`;
  }

  private getTag(tagId: string) {
    return TIMELINE_TAGS[tagId as keyof typeof TIMELINE_TAGS];
  }

  private buildPrintHtml(
    events: TimelineEvent[],
    eventQrs: string[],
    globalQr: string
  ): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const hasHighlights = this.filterSvc.hasHighlights();

    // Build active filters description
    const activeTagIds = Array.from(this.filterSvc.activeTags());
    const activeLabels = activeTagIds
      .map(id => this.getTag(id))
      .filter(Boolean)
      .map(t => `${t!.icon} ${t!.label}`);

    // Build event cards HTML
    const eventsHtml = events.map((ev, i) => {
      const hlTagsOnEvent = ev.tags.filter(tagId => this.filterSvc.highlightedTags().has(tagId));
      const isHighlighted = hlTagsOnEvent.length > 0;
      
      let borderColor = '#3b82f6';
      let borderWidth = '3px';
      let highlightBg = '';
      let highlightBadge = '';

      if (isHighlighted) {
        const tag = this.getTag(hlTagsOnEvent[0]);
        if (tag) {
          borderColor = tag.border;
          borderWidth = '5px';
          highlightBg = `background: ${tag.bg} !important;`;
          highlightBadge = ``;
        }
      }

      // Tag chips
      const tagsHtml = ev.tags.map(tagId => {
        const tag = this.getTag(tagId);
        if (!tag) return '';
        return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 8px;border-radius:999px;border:1px solid ${tag.border};background:${tag.bg};color:${tag.color};font-size:7pt;font-weight:600;white-space:nowrap;">${tag.icon} ${tag.label}</span>`;
      }).join(' ');

      // Clean description: strip secondary img tags for cleaner print, keep text
      const cleanDesc = (ev.fullDesc || '')
        .replace(/<img[^>]*class=['"]modal-inline-img[^'"]*['"][^>]*>/gi, '');

      // QR code for this event
      const qrHtml = eventQrs[i]
        ? `<div style="flex-shrink:0;text-align:center;margin-left:12px;">
             <img src="${eventQrs[i]}" alt="QR" style="width:72px;height:72px;border:1px solid #e5e7eb;border-radius:4px;" />
             <div style="font-size:5.5pt;color:#9ca3af;margin-top:2px;">Ver detalles</div>
           </div>`
        : '';

      // Event main image if exists (floating left to wrap text)
      const imgHtml = ev.image
        ? `<img src="${ev.image}" alt="${ev.title}" style="float:left; width:140px; height:auto; margin:0 12px 6px 0; border-radius:4px; border:1px solid #e5e7eb; box-shadow:0 1px 2px rgba(0,0,0,0.05);" />`
        : '';

      return `
        <article style="
          border-left: ${borderWidth} solid ${borderColor};
          padding: 8px 14px;
          margin-bottom: 14px;
          page-break-inside: avoid;
          break-inside: avoid;
          ${highlightBg}
          border-radius: 0 6px 6px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        ">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:4px;">
                <span style="font-family:'Playfair Display',Georgia,serif;font-size:11pt;font-weight:700;color:${borderColor};white-space:nowrap;">${ev.yearLabel}</span>
                <span style="font-family:'Playfair Display',Georgia,serif;font-size:11pt;font-weight:700;color:#1c1710;">${ev.title}</span>
                ${highlightBadge}
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">${tagsHtml}</div>
              <div style="font-size:8.5pt;color:#374151;line-height:1.45;text-align:justify;">
                ${imgHtml}
                ${cleanDesc}
                <div style="clear:both;"></div>
              </div>
            </div>
            ${qrHtml}
          </div>
        </article>`;
    }).join('\n');

    // Global QR footer
    const globalQrHtml = globalQr
      ? `<div style="
           display:flex;
           flex-direction:column;
           align-items:center;
           gap:8px;
           margin-top:24px;
           padding:20px;
           border-top:2px solid #e5e7eb;
           page-break-inside:avoid;
         ">
           <img src="${globalQr}" alt="QR Vista Filtrada" style="width:140px;height:140px;border:1px solid #d1d5db;border-radius:8px;" />
           <div style="font-family:'Playfair Display',Georgia,serif;font-size:10pt;font-weight:600;color:#374151;">Escanea para ver esta vista filtrada</div>
           <div style="font-size:7pt;color:#9ca3af;word-break:break-all;max-width:400px;text-align:center;">${window.location.href}</div>
         </div>`
      : '';

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Línea del Tiempo Bíblica — Impresión</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 9pt;
      color: #1c1710;
      background: #ffffff;
      line-height: 1.4;
      padding: 12mm 14mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @page {
      size: A4;
      margin: 10mm;
    }
    @media print {
      body { padding: 0; }
    }
    a { color: #2563eb; text-decoration: none; }
    strong { color: #111827; font-weight: 600; }
    em { font-style: italic; }
    ul { margin: 0.3em 0 0.6em 1.2em; }
    li { margin-bottom: 0.3em; }
    p { margin-bottom: 0.5em; }
  </style>
</head>
<body>
  <!-- Header -->
  <header style="
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 14px;
    margin-bottom: 18px;
    border-bottom: 3px solid #1e40af;
  ">
    <div>
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:18pt;font-weight:700;color:#1e3a5f;margin:0;">
        ✝ Línea del Tiempo Bíblica
      </h1>
      <div style="font-size:8pt;color:#6b7280;margin-top:4px;">
        Impreso el ${dateStr} · ${events.length} evento${events.length !== 1 ? 's' : ''}
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:7.5pt;color:#6b7280;">Filtros activos:</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end;margin-top:3px;">
        ${activeLabels.map(l => `<span style="font-size:7pt;padding:1px 6px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:999px;color:#475569;white-space:nowrap;">${l}</span>`).join('')}
      </div>
      ${hasHighlights ? '<div style="font-size:7pt;color:#92400e;margin-top:3px;">★ Se muestran eventos resaltados</div>' : ''}
    </div>
  </header>

  <!-- Events -->
  <main>
    ${eventsHtml}
  </main>

  <!-- Footer with global QR -->
  <footer>
    ${globalQrHtml}
  </footer>
</body>
</html>`;
  }

  private openPrintWindow(html: string): void {
    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) {
      alert('No se pudo abrir la ventana de impresión. Por favor permite las ventanas emergentes.');
      return;
    }
    printWin.document.write(html);
    printWin.document.close();

    // Wait for fonts and images to load before printing
    printWin.onload = () => {
      setTimeout(() => {
        printWin.focus();
        printWin.print();
      }, 600);
    };
  }
}
