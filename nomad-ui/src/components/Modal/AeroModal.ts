export class NomadModal extends HTMLElement {
  // Callback properties
  onModalOpen: ((data: { title: string; size: string }) => void) | null = null;
  onModalClose: ((data: { title: string; size: string }) => void) | null = null;

  private focusTrap: { activate: () => void; deactivate: () => void } | null = null;
  private previousActiveElement: HTMLElement | null = null;
  private _rendering = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['open', 'title', 'size', 'closable', 'backdrop-close'];
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
    
    // Auto-open if open attribute is set
    if (this.hasAttribute('open')) {
      this.open();
    }
  }

  disconnectedCallback() {
    this.deactivateFocusTrap();
    this.restoreFocus();
  }

  get isOpen() { return this.hasAttribute('open'); }
  get title() { return this.getAttribute('title') || ''; }
  get size() { return this.getAttribute('size') || 'md'; }
  get closable() { return this.hasAttribute('closable'); }
  get backdropClose() { return this.hasAttribute('backdrop-close'); }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.shadowRoot && !this._rendering) {
      // Handle open state changes without calling open()/close() methods
      if (name === 'open') {
        if (newValue !== null && oldValue === null) {
          // Opening - just handle the visual state and focus
          this.handleOpenState();
        } else if (newValue === null && oldValue !== null) {
          // Closing - just handle the visual state and cleanup
          this.handleCloseState();
        }
        return;
      }

      // Handle title changes without full re-render
      if (name === 'title') {
        this.updateTitle();
        return;
      }

      // Handle size changes
      if (name === 'size') {
        this.updateSize();
        return;
      }

      // For other changes, preserve callbacks and do full re-render
      const savedCallbacks = {
        onModalOpen: this.onModalOpen,
        onModalClose: this.onModalClose
      };
      
      this.render();
      this.attachEvents();
      
      // Restore callbacks
      this.onModalOpen = savedCallbacks.onModalOpen;
      this.onModalClose = savedCallbacks.onModalClose;
    }
  }

  private handleOpenState() {
    // Store currently focused element
    this.previousActiveElement = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    
    // Set focus to modal
    setTimeout(() => {
      const firstFocusable = this.shadowRoot?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (firstFocusable) {
        firstFocusable.focus();
      }
      this.activateFocusTrap();
    }, 100);

    const eventData = {
      title: this.title,
      size: this.size
    };

    // Call the callback function if provided
    if (typeof this.onModalOpen === 'function') {
      this.onModalOpen(eventData);
    }

    this.dispatchEvent(new CustomEvent('modal-open', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }

  private handleCloseState() {
    document.body.style.overflow = '';
    this.deactivateFocusTrap();
    this.restoreFocus();

    const eventData = {
      title: this.title,
      size: this.size
    };

    // Call the callback function if provided
    if (typeof this.onModalClose === 'function') {
      this.onModalClose(eventData);
    }

    this.dispatchEvent(new CustomEvent('modal-close', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));

    // Remove from DOM after animation if not persistent
    if (!this.hasAttribute('persistent')) {
      setTimeout(() => {
        if (!this.isOpen && this.parentNode) {
          this.parentNode.removeChild(this);
        }
      }, 300);
    }
  }

  updateTitle() {
    const titleElement = this.shadowRoot?.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = this.title;
    }
    
    // Update aria-labelledby
    const container = this.shadowRoot?.querySelector('.modal-container');
    if (container) {
      if (this.title) {
        container.setAttribute('aria-labelledby', 'modal-title');
      } else {
        container.removeAttribute('aria-labelledby');
      }
    }
  }

  updateSize() {
    const container = this.shadowRoot?.querySelector('.modal-container');
    if (container) {
      // Remove old size classes
      container.className = container.className.replace(/\b(xs|sm|md|lg|xl|full)\b/g, '');
      container.classList.add(this.size);
    }
  }

  render() {
    if (!this.shadowRoot || this._rendering) return;

    this._rendering = true;

    const closeButton = this.closable ? `
      <button class="modal-close" aria-label="Close modal">
        <span class="close-icon">&times;</span>
      </button>
    ` : '';

    const titleElement = this.title ? `
      <div class="modal-header">
        <h2 class="modal-title" id="modal-title">${this.title}</h2>
        ${closeButton}
      </div>
    ` : closeButton ? `
      <div class="modal-header">
        ${closeButton}
      </div>
    ` : '';

    this.shadowRoot.innerHTML = `
      <style>
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

:host([open]) {
  display: flex;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: calc(100vh - 2rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  width: 100%;
  max-width: 100%;
}

/* Sizes */
.modal-container.xs { max-width: 300px; }
.modal-container.sm { max-width: 400px; }
.modal-container.md { max-width: 500px; }
.modal-container.lg { max-width: 700px; }
.modal-container.xl { max-width: 900px; }
.modal-container.full { max-width: 95vw; max-height: 95vh; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin: -0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-icon {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0; 
    transform: scale(0.95) translateY(-10px); 
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  :host {
    padding: 0;
    align-items: flex-end;
  }
  
  .modal-container {
    border-radius: 8px 8px 0 0;
    max-height: 90vh;
    animation: slideUp 0.3s ease-out;
  }
  
  .modal-container.xs,
  .modal-container.sm,
  .modal-container.md,
  .modal-container.lg,
  .modal-container.xl {
    max-width: 100%;
  }
  
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .modal-backdrop,
  .modal-container {
    animation: none;
  }
}

/* High contrast */
@media (prefers-contrast: high) {
  .modal-container {
    border: 2px solid #000;
  }
}
      </style>
      <div class="modal-backdrop"></div>
      <div class="modal-container ${this.size}" role="dialog" aria-modal="true" ${this.title ? `aria-labelledby="modal-title"` : ''}>
        ${titleElement}
        <div class="modal-body">
          <slot name="body">
            <slot></slot>
          </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;

    this._rendering = false;
  }

  attachEvents() {
    const backdrop = this.shadowRoot?.querySelector('.modal-backdrop');
    const closeBtn = this.shadowRoot?.querySelector('.modal-close');
    const footer = this.shadowRoot?.querySelector('.modal-footer');

    // Remove existing listeners
    backdrop?.removeEventListener('click', this.handleBackdropClick);
    closeBtn?.removeEventListener('click', this.handleCloseClick);
    document.removeEventListener('keydown', this.handleKeydown);

    // Close on backdrop click
    if (backdrop && this.backdropClose) {
      backdrop.addEventListener('click', this.handleBackdropClick);
    }

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', this.handleCloseClick);
    }

    // Hide footer if no content
    if (footer) {
      const footerSlot = footer.querySelector('slot[name="footer"]') as HTMLSlotElement;
      if (footerSlot && footerSlot.assignedNodes().length === 0) {
        (footer as HTMLElement).style.display = 'none';
      }
    }

    // Keyboard handling
    document.addEventListener('keydown', this.handleKeydown);
  }

  // Bound event handlers
  handleBackdropClick = () => {
    this.close();
  };

  handleCloseClick = () => {
    this.close();
  };

  handleKeydown = (e: KeyboardEvent) => {
    if (!this.isOpen) return;

    if (e.key === 'Escape' && this.closable) {
      this.close();
    }
  };

  open() {
    // Store currently focused element
    this.previousActiveElement = document.activeElement as HTMLElement;
    
    this.setAttribute('open', '');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
    
    // Set focus to modal
    setTimeout(() => {
      const firstFocusable = this.shadowRoot?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (firstFocusable) {
        firstFocusable.focus();
      }
      
      this.activateFocusTrap();
    }, 100);

    const eventData = {
      title: this.title,
      size: this.size
    };

    // Call the callback function if provided
    if (typeof this.onModalOpen === 'function') {
      this.onModalOpen(eventData);
    }

    this.dispatchEvent(new CustomEvent('modal-open', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }

  close() {
    this.removeAttribute('open');
    document.body.style.overflow = ''; // Restore body scroll
    
    this.deactivateFocusTrap();
    this.restoreFocus();

    const eventData = {
      title: this.title,
      size: this.size
    };

    // Call the callback function if provided
    if (typeof this.onModalClose === 'function') {
      this.onModalClose(eventData);
    }

    this.dispatchEvent(new CustomEvent('modal-close', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));

    // Remove from DOM after animation if not persistent
    if (!this.hasAttribute('persistent')) {
      setTimeout(() => {
        if (!this.isOpen && this.parentNode) {
          this.parentNode.removeChild(this);
        }
      }, 300);
    }
  }

  private activateFocusTrap() {
    const focusableElements = this.shadowRoot?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements || focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };

    this.focusTrap = {
      activate: () => {
        document.addEventListener('keydown', handleFocusTrap);
      },
      deactivate: () => {
        document.removeEventListener('keydown', handleFocusTrap);
      }
    };

    this.focusTrap.activate();
  }

  private deactivateFocusTrap() {
    if (this.focusTrap) {
      this.focusTrap.deactivate();
      this.focusTrap = null;
    }
  }

  private restoreFocus() {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
  }

  // Static helper methods
  static show(content: string, options: {
    title?: string;
    size?: string;
    closable?: boolean;
    backdropClose?: boolean;
  } = {}) {
    const modal = document.createElement('nomad-modal') as NomadModal;
    
    if (options.title) modal.setAttribute('title', options.title);
    if (options.size) modal.setAttribute('size', options.size);
    if (options.closable) modal.setAttribute('closable', '');
    if (options.backdropClose) modal.setAttribute('backdrop-close', '');
    
    modal.innerHTML = content;
    document.body.appendChild(modal);
    modal.open();
    
    return modal;
  }

  static confirm(message: string, options: {
    title?: string;
    confirmText?: string;
    cancelText?: string;
  } = {}): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = document.createElement('nomad-modal') as NomadModal;
      modal.setAttribute('title', options.title || 'Confirm');
      modal.setAttribute('size', 'sm');
      modal.setAttribute('closable', '');
      
      const confirmText = options.confirmText || 'Confirm';
      const cancelText = options.cancelText || 'Cancel';
      
      modal.innerHTML = `
        <div slot="body">${message}</div>
        <div slot="footer">
          <button class="cancel-btn" style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer;">
            ${cancelText}
          </button>
          <button class="confirm-btn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
            ${confirmText}
          </button>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.open();
      
      const cleanup = () => {
        modal.close();
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 300);
      };
      
      modal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('confirm-btn')) {
          resolve(true);
          cleanup();
        } else if (target.classList.contains('cancel-btn')) {
          resolve(false);
          cleanup();
        }
      });
      
      modal.addEventListener('modal-close', () => {
        resolve(false);
      });
    });
  }

  static alert(message: string, options: {
    title?: string;
    buttonText?: string;
  } = {}): Promise<void> {
    return new Promise((resolve) => {
      const modal = document.createElement('nomad-modal') as NomadModal;
      modal.setAttribute('title', options.title || 'Alert');
      modal.setAttribute('size', 'sm');
      modal.setAttribute('closable', '');
      
      const buttonText = options.buttonText || 'OK';
      
      modal.innerHTML = `
        <div slot="body">${message}</div>
        <div slot="footer">
          <button class="ok-btn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
            ${buttonText}
          </button>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.open();
      
      const cleanup = () => {
        modal.close();
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 300);
        resolve();
      };
      
      modal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('ok-btn')) {
          cleanup();
        }
      });
      
      modal.addEventListener('modal-close', cleanup);
    });
  }
}

if (!customElements.get('nomad-modal')) {
  customElements.define('nomad-modal', NomadModal);
}