import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, SimpleChanges, HostListener, inject, signal
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';
import { TimelineEvent } from '../../models/timeline.models';
import { TIMELINE_TAGS } from '../../data/timeline-events.data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('overlayAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease', style({ opacity: 0 }))
      ])
    ]),
    trigger('contentAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(20px)' }),
        animate('350ms cubic-bezier(0.165, 0.84, 0.44, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease',
          style({ opacity: 0, transform: 'scale(0.97) translateY(10px)' }))
      ])
    ])
  ],
  template: `
    <div
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="event.title"
      (click)="onBackdropClick($event)"
      @overlayAnim>

      <button *ngIf="hasPrev" class="modal-nav-btn prev" (click)="$event.stopPropagation(); prev.emit()" aria-label="Evento anterior" title="Evento anterior (Flecha Izquierda)">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      <div class="modal-content" @contentAnim (click)="$event.stopPropagation()">

        <button class="modal-close" (click)="close()" aria-label="Cerrar modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Main image — left column on desktop -->
        <img
          *ngIf="event.image && !imageHidden()"
          class="modal-image"
          [src]="event.image"
          [alt]="event.title"
          (error)="onImgError()">

        <!-- Scrollable body — right column on desktop -->
        <div class="modal-body">
          <div class="modal-header-info">
            <span class="modal-year">{{ event.yearLabel }}</span>
            <div class="modal-tag-row">
              <span
                *ngFor="let tagId of event.tags"
                class="modal-tag-chip"
                [style.background]="getTag(tagId)?.bg"
                [style.color]="getTag(tagId)?.color"
                [style.border-color]="getTag(tagId)?.border">
                {{ getTag(tagId)?.icon }} {{ getTag(tagId)?.label }}
              </span>
            </div>
          </div>

          <div class="modal-title-row">
            <h2 class="modal-title">{{ event.title }}</h2>

            <!-- Share link button -->
            <button class="share-link-btn" (click)="copyLink()" [title]="linkCopied() ? '¡Enlace copiado!' : 'Compartir enlace directo'">
              <svg *ngIf="!linkCopied()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <svg *ngIf="linkCopied()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>

          <div class="modal-description" [innerHTML]="safeHtml"></div>
        </div>

      </div>

      <button *ngIf="hasNext" class="modal-nav-btn next" (click)="$event.stopPropagation(); next.emit()" aria-label="Evento siguiente" title="Evento siguiente (Flecha Derecha)">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    /* ── Overlay ─────────────────────────────────────────────── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      gap: 1.5rem; /* Space between content and nav arrows */
    }

    /* ── Modal Nav Buttons ───────────────────────────────────── */
    .modal-nav-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: all 0.25s ease;
      flex-shrink: 0;
      z-index: 1010;
    }

    .modal-nav-btn:hover {
      background: var(--color-accent);
      transform: scale(1.1);
      border-color: var(--color-accent-hover);
    }
    
    @media (max-width: 768px) {
      .modal-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        background: rgba(0, 0, 0, 0.65);
      }
      .modal-nav-btn.prev { left: 8px; }
      .modal-nav-btn.next { right: 8px; }
      .modal-nav-btn:hover { transform: translateY(-50%) scale(1.1); }
      .modal-overlay { padding: 1rem; }
    }

    /* ── Modal Box ───────────────────────────────────────────── */
    .modal-content {
      background: var(--color-bg-modal);
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Desktop: side-by-side */
    @media (min-width: 768px) {
      .modal-content {
        flex-direction: row;
        width: 90vw;
        max-width: 1200px;
        min-height: 480px;
      }
    }

    /* ── Close Button ────────────────────────────────────────── */
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 36px;
      height: 36px;
      background: rgba(0, 0, 0, 0.45);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      z-index: 10;
      border: none;
      backdrop-filter: blur(4px);
      transition: background 0.25s ease, transform 0.25s ease;
    }
    .modal-close:hover {
      background: rgba(0, 0, 0, 0.85);
      transform: rotate(90deg);
    }

    /* ── Hero Image ──────────────────────────────────────────── */
    .modal-image {
      width: 100%;
      height: 240px;
      object-fit: cover;
      display: block;
      border-bottom: 4px solid var(--color-accent);
      background: var(--color-surface-1);
    }

    @media (min-width: 768px) {
      .modal-image {
        width: 42%;
        flex-shrink: 0;
        height: auto;
        min-height: 100%;
        border-bottom: none;
        border-right: 4px solid var(--color-accent);
        object-fit: cover;
      }
    }

    /* ── Body ────────────────────────────────────────────────── */
    .modal-body {
      padding: 2rem 2rem 2.5rem;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    @media (min-width: 768px) {
      .modal-body {
        padding: 2.5rem 2.5rem 3rem;
        overflow-x: hidden;
      }
      /* Push remaining space below the content so the body text
         sits near the vertical centre when the modal is tall,
         but the title is never clipped above the scroll area. */
      .modal-body::after {
        content: '';
        flex: 1 0 0px;
      }
    }

    /* ── Header: Year + Tags ─────────────────────────────────── */
    .modal-header-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .modal-year {
      font-family: var(--font-display);
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--color-accent);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .modal-tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .modal-tag-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* ── Title Row ───────────────────────────────────────────── */
    .modal-title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .modal-title {
      font-family: var(--font-display);
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1.2;
      color: var(--color-text-primary);
      margin: 0;
      flex: 1;
    }

    @media (min-width: 768px) {
      .modal-title {
        font-size: 1.9rem;
      }
    }

    /* ── Description Prose ───────────────────────────────────── */
    .modal-description {
      font-size: 1rem;
      line-height: 1.65;
      color: var(--color-text-secondary);
    }

    /* Inline seconday images — float right, small, height:auto */
    :host ::ng-deep .modal-description {
      & p { margin-bottom: 1em; }
      & strong { color: var(--color-text-primary); font-weight: 600; }
      & em { font-style: italic; }
      & ul { margin: 0.5em 0 1em 1.5em; }
      & li { margin-bottom: 0.5em; }
      & a {
        color: var(--color-accent);
        text-decoration: none;
        font-weight: 500;
        border-bottom: 1px dotted var(--color-accent);
        transition: color 0.2s;
      }
      & a:hover { color: var(--color-accent-hover); }

      /* Secondary inline images — small thumbnail, auto height */
      & img.modal-inline-img {
        float: right;
        width: 140px;
        height: auto; /* let the image decide its own height! */
        margin-left: 1.5rem;
        margin-bottom: 1rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: 1px solid var(--color-border-light);
        object-fit: cover;
      }

      & img.modal-inline-img.img-large {
        width: 220px;
      }

      & ul.modal-list {
        padding-left: 1.5em;
        margin: 0.5em 0 1em;
      }
      & ul.modal-list li {
        margin-bottom: 0.6em;
        line-height: 1.55;
      }
    }

    @media (min-width: 768px) {
      :host ::ng-deep .modal-description img.modal-inline-img {
        width: 180px;
      }
      :host ::ng-deep .modal-description img.modal-inline-img.img-large {
        width: 350px;
      }
    }

    /* ── Share Link Button ────────────────────────────────────── */
    .share-link-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid var(--color-border-light, rgba(255,255,255,0.15));
      background: var(--color-surface-1, rgba(255,255,255,0.06));
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.25s ease;
      flex-shrink: 0;
    }
    .share-link-btn:hover {
      background: var(--color-accent);
      color: white;
      border-color: var(--color-accent);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .share-link-btn:active {
      transform: translateY(0);
    }
  `]
})
export class EventModalComponent implements OnInit, OnChanges {
  @Input({ required: true }) event!: TimelineEvent;
  @Input() hasNext = false;
  @Input() hasPrev = false;
  
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private location = inject(Location);
  safeHtml!: SafeHtml;
  imageHidden = signal(false);
  linkCopied = signal(false);

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.updateHtml();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      this.updateHtml();
      this.linkCopied.set(false);
    }
  }

  private updateHtml(): void {
    this.imageHidden.set(false);
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.event.fullDesc);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowRight' && this.hasNext) this.next.emit();
    if (event.key === 'ArrowLeft' && this.hasPrev) this.prev.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  close(): void {
    document.body.style.overflow = '';
    this.closed.emit();
  }

  getTag(tagId: string) {
    return TIMELINE_TAGS[tagId];
  }

  onImgError(): void {
    this.imageHidden.set(true);
  }

  /** Build the shareable direct URL for the current event */
  getShareUrl(): string {
    // Build the URL tree with the event query param merged
    const tree = this.router.createUrlTree([], {
      queryParams: { event: this.event.id },
      queryParamsHandling: 'merge',
    });
    const path = this.router.serializeUrl(tree);
    const externalUrl = this.location.prepareExternalUrl(path);
    return `${window.location.origin}${externalUrl}`;
  }

  /** Copy the share URL to clipboard with visual feedback */
  copyLink(): void {
    const url = this.getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2500);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2500);
    });
  }
}
