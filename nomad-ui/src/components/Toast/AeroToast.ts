export class NomadToast extends HTMLElement {
  // Callback properties
  onToastShow: ((data: { message: string; variant: string; duration: number }) => void) | null = null;
  onToastHide: ((data: { message: string; variant: string }) => void) | null = null;

  private autoHideTimeout: number | null = null;
  private _rendering = false;
  private _programmaticChange = false; // Flag to prevent recursion

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['message', 'variant', 'duration', 'closable', 'position', 'show'];
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
    
    // Auto show if show attribute is set
    if (this.hasAttribute('show')) {
      this._handleShowState();
    }
  }

  disconnectedCallback() {
    this.clearAutoHide();
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  get message() { return this.getAttribute('message') || this.textContent || 'Notification'; }
  get variant() { return this.getAttribute('variant') || 'info'; }
  get duration() { return parseInt(this.getAttribute('duration') || '4000'); }
  get closable() { return this.hasAttribute('closable'); }
  get position() { return this.getAttribute('position') || 'top-right'; }
  get isVisible() { return this.hasAttribute('show'); }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.shadowRoot && !this._rendering && !this._programmaticChange) {
      // Handle show/hide without recursion
      if (name === 'show') {
        if (newValue !== null && oldValue === null) {
          this._handleShowState();
        } else if (newValue === null && oldValue !== null) {
          this._handleHideState();
        }
        return;
      }

      // Handle message changes without full re-render
      if (name === 'message') {
        this.updateMessage();
        return;
      }

      // Handle variant changes
      if (name === 'variant') {
        this.updateVariant();
        return;
      }

      // Handle position changes
      if (name === 'position') {
        this.updatePosition();
        return;
      }

      // Handle closable changes
      if (name === 'closable') {
        this.updateClosable();
        return;
      }

      // For other changes, do full re-render
      this.render();
      this.attachEvents();
    }
  }

  private _handleShowState() {
    // Set up auto-hide if duration > 0
    if (this.duration > 0) {
      this.clearAutoHide();
      this.autoHideTimeout = window.setTimeout(() => {
        this.hide();
      }, this.duration);
    }

    const eventData = {
      message: this.message,
      variant: this.variant,
      duration: this.duration
    };

    // Call the callback function if provided
    if (typeof this.onToastShow === 'function') {
      this.onToastShow(eventData);
    }

    this.dispatchEvent(new CustomEvent('toast-show', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }

  private _handleHideState() {
    this.clearAutoHide();

    const eventData = {
      message: this.message,
      variant: this.variant
    };

    // Call the callback function if provided
    if (typeof this.onToastHide === 'function') {
      this.onToastHide(eventData);
    }

    this.dispatchEvent(new CustomEvent('toast-hide', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));

    // Remove from DOM after animation
    setTimeout(() => {
      if (!this.isVisible && this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }, 300);
  }

  updateMessage() {
    const contentElement = this.shadowRoot?.querySelector('.toast-content');
    if (contentElement) {
      contentElement.textContent = this.message;
    }
  }

  updateVariant() {
    const toastElement = this.shadowRoot?.querySelector('.toast');
    if (toastElement) {
      // Remove old variant classes
      toastElement.className = toastElement.className.replace(/\btoast--\w+\b/g, '');
      toastElement.classList.add(`toast--${this.variant}`);
    }
  }

  updatePosition() {
    // Position is handled by host attributes, no DOM update needed
    // The CSS will automatically apply the correct positioning
  }

  updateClosable() {
    const existingCloseBtn = this.shadowRoot?.querySelector('.toast-close');
    
    if (this.closable && !existingCloseBtn) {
      // Add close button
      const toastElement = this.shadowRoot?.querySelector('.toast');
      if (toastElement) {
        const closeButton = document.createElement('button');
        closeButton.className = 'toast-close';
        closeButton.setAttribute('aria-label', 'Close notification');
        closeButton.innerHTML = '<span class="close-icon">&times;</span>';
        closeButton.addEventListener('click', this.handleCloseClick);
        toastElement.appendChild(closeButton);
      }
    } else if (!this.closable && existingCloseBtn) {
      // Remove close button
      existingCloseBtn.remove();
    }
  }

  render() {
    if (!this.shadowRoot || this._rendering) return;

    this._rendering = true;

    const closeButton = this.closable ? `
      <button class="toast-close" aria-label="Close notification">
        <span class="close-icon">&times;</span>
      </button>
    ` : '';

    this.shadowRoot.innerHTML = `
      <style>
:host {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
  transition: all 0.3s ease;
  opacity: 0;
  font-family: system-ui, sans-serif;
  /* Default position: top-right within container */
  top: 1rem;
  right: 1rem;
  transform: translateY(-100%);
}

:host([show]) {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Specific positions override defaults */
:host([position="top-left"]) {
  top: 1rem;
  left: 1rem;
  right: unset;
  bottom: unset;
  transform: translateY(-100%);
}

:host([position="top-left"][show]) {
  transform: translateY(0);
}

:host([position="top-center"]) {
  top: 1rem;
  left: 50%;
  right: unset;
  bottom: unset;
  transform: translateX(-50%) translateY(-100%);
}

:host([position="top-center"][show]) {
  transform: translateX(-50%) translateY(0);
}

:host([position="top-right"]) {
  top: 1rem;
  right: 1rem;
  left: unset;
  bottom: unset;
  transform: translateY(-100%);
}

:host([position="top-right"][show]) {
  transform: translateY(0);
}

:host([position="bottom-left"]) {
  bottom: 1rem;
  left: 1rem;
  top: unset;
  right: unset;
  transform: translateY(100%);
}

:host([position="bottom-left"][show]) {
  transform: translateY(0);
}

:host([position="bottom-center"]) {
  bottom: 1rem;
  left: 50%;
  top: unset;
  right: unset;
  transform: translateX(-50%) translateY(100%);
}

:host([position="bottom-center"][show]) {
  transform: translateX(-50%) translateY(0);
}

:host([position="bottom-right"]) {
  bottom: 1rem;
  right: 1rem;
  top: unset;
  left: unset;
  transform: translateY(100%);
}

:host([position="bottom-right"][show]) {
  transform: translateY(0);
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  min-width: 300px;
  max-width: 500px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid transparent;
}

.toast-icon {
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  word-break: break-word;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

.close-icon {
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
}

/* Variants */
.toast--success {
  background: #dcfce7;
  border-color: #16a34a;
  color: #15803d;
}

.toast--success .toast-icon::before {
  content: "✓";
}

.toast--error {
  background: #fee2e2;
  border-color: #dc2626;
  color: #991b1b;
}

.toast--error .toast-icon::before {
  content: "✕";
}

.toast--warning {
  background: #fef3c7;
  border-color: #d97706;
  color: #92400e;
}

.toast--warning .toast-icon::before {
  content: "⚠";
}

.toast--info {
  background: #dbeafe;
  border-color: #2563eb;
  color: #1d4ed8;
}

.toast--info .toast-icon::before {
  content: "ℹ";
}
      </style>
      <div class="toast toast--${this.variant}">
        <div class="toast-icon"></div>
        <div class="toast-content">${this.message}</div>
        ${closeButton}
      </div>
    `;

    this._rendering = false;
  }

  attachEvents() {
    const closeBtn = this.shadowRoot?.querySelector('.toast-close');
    
    // Remove existing listeners
    closeBtn?.removeEventListener('click', this.handleCloseClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    
    if (closeBtn) {
      closeBtn.addEventListener('click', this.handleCloseClick);
    }

    // Close on Escape key
    document.addEventListener('keydown', this.handleKeyDown);
  }

  // Bound event handlers
  handleCloseClick = () => {
    this.hide();
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isVisible) {
      this.hide();
    }
  };

  show() {
    // Use flag to prevent recursion when we set the attribute
    this._programmaticChange = true;
    this.setAttribute('show', '');
    this._programmaticChange = false;
    
    // Handle the actual show logic without relying on attributeChangedCallback
    this._handleShowState();
  }

  hide() {
    // Use flag to prevent recursion when we remove the attribute
    this._programmaticChange = true;
    this.removeAttribute('show');
    this._programmaticChange = false;
    
    // Handle the actual hide logic without relying on attributeChangedCallback
    this._handleHideState();
  }

  private clearAutoHide() {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
      this.autoHideTimeout = null;
    }
  }

  // Public methods
  pause() {
    this.clearAutoHide();
  }

  resume() {
    if (this.duration > 0 && this.isVisible) {
      this.autoHideTimeout = window.setTimeout(() => {
        this.hide();
      }, this.duration);
    }
  }

  // Static helper methods for creating toasts
  static show(message: string, variant: 'success' | 'error' | 'warning' | 'info' = 'info', options: {
    duration?: number;
    position?: string;
    closable?: boolean;
  } = {}) {
    const toast = document.createElement('nomad-toast') as NomadToast;
    toast.setAttribute('message', message);
    toast.setAttribute('variant', variant);
    
    if (options.duration !== undefined) {
      toast.setAttribute('duration', options.duration.toString());
    }
    
    if (options.position) {
      toast.setAttribute('position', options.position);
    }
    
    if (options.closable) {
      toast.setAttribute('closable', '');
    }

    document.body.appendChild(toast);
    toast.show();
    
    return toast;
  }

  static success(message: string, options = {}) {
    return this.show(message, 'success', options);
  }

  static error(message: string, options = {}) {
    return this.show(message, 'error', options);
  }

  static warning(message: string, options = {}) {
    return this.show(message, 'warning', options);
  }

  static info(message: string, options = {}) {
    return this.show(message, 'info', options);
  }
}

if (!customElements.get('nomad-toast')) {
  customElements.define('nomad-toast', NomadToast);
}