/* src/components/Button/NomadButton.ts */

export class NomadButton extends HTMLElement {
  onButtonClick: ((data: { variant: string; size: string; disabled: boolean; loading: boolean }) => void) | null = null;

  private _rendering = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['label', 'variant', 'size', 'disabled', 'loading'];
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
  }

  get variant() { return this.getAttribute('variant') || 'primary'; }
  get size() { return this.getAttribute('size') || 'md'; }
  get disabled() { return this.hasAttribute('disabled'); }
  get loading() { return this.hasAttribute('loading'); }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.shadowRoot && !this._rendering) {
      if (name === 'disabled' || name === 'loading') {
        this.updateButtonState();
      } else {
        const savedCallback = this.onButtonClick;
        this.render();
        this.attachEvents();
        this.onButtonClick = savedCallback;
      }
    }
  }

  updateButtonState() {
    const button = this.shadowRoot?.querySelector('button');
    if (button) {
      if (this.disabled || this.loading) {
        button.setAttribute('disabled', '');
      } else {
        button.removeAttribute('disabled');
      }

      const existingSpinner = button.querySelector('.spinner');
      const textSpan = button.querySelector('span');
      
      if (this.loading && !existingSpinner) {
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        button.insertBefore(spinner, textSpan);
      } else if (!this.loading && existingSpinner) {
        existingSpinner.remove();
      }

      button.className = `btn ${this.variant} ${this.size}`;
    }
  }

  attachEvents() {
    const button = this.shadowRoot?.querySelector('button');
    if (button) {
      button.removeEventListener('click', this.handleClick);
      button.addEventListener('click', this.handleClick);
    }
  }

  handleClick = (e: Event) => {
    if (!this.disabled && !this.loading) {
      const eventData = {
        variant: this.variant,
        size: this.size,
        disabled: this.disabled,
        loading: this.loading
      };

      if (typeof this.onButtonClick === 'function') {
        this.onButtonClick(eventData);
      }

      this.dispatchEvent(new CustomEvent('button-click', { 
        detail: eventData,
        bubbles: true,
        composed: true
      }));
    }
  };

  render() {
    if (!this.shadowRoot || this._rendering) return;
    
    this._rendering = true;
    
    const spinner = this.loading ? '<span class="spinner"></span>' : '';
    const text = this.textContent || this.getAttribute('label') || 'Button';
    
    this.shadowRoot.innerHTML = `
      <style>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.xs { padding: 0.25rem 0.5rem; font-size: 12px; }
.sm { padding: 0.375rem 0.75rem; font-size: 13px; }
.md { padding: 0.5rem 1rem; font-size: 14px; }
.lg { padding: 0.75rem 1.5rem; font-size: 16px; }
.xl { padding: 1rem 2rem; font-size: 18px; }

.primary { background: #3b82f6; color: white; }
.primary:hover:not(:disabled) { background: #2563eb; }

.secondary { background: #e5e7eb; color: #374151; }
.secondary:hover:not(:disabled) { background: #d1d5db; }

.success { background: #10b981; color: white; }
.success:hover:not(:disabled) { background: #059669; }

.danger { background: #ef4444; color: white; }
.danger:hover:not(:disabled) { background: #dc2626; }

.warning { background: #f59e0b; color: #92400e; }
.warning:hover:not(:disabled) { background: #d97706; }

.info { background: #06b6d4; color: white; }
.info:hover:not(:disabled) { background: #0891b2; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
      </style>
      <button class="btn ${this.variant} ${this.size}" ${this.disabled || this.loading ? 'disabled' : ''}>
        ${spinner}
        <span>${text}</span>
      </button>
    `;
    
    this._rendering = false;
  }

  setLoading(loading: boolean) {
    if (loading) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }

  setDisabled(disabled: boolean) {
    if (disabled) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
}

if (!customElements.get('nomad-button')) {
  customElements.define('nomad-button', NomadButton);
}