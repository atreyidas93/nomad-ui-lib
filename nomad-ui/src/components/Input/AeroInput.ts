export class NomadInput extends HTMLElement {
  // Callback properties
  onInputChange: ((data: { value: string; type: string; name: string | null }) => void) | null = null;
  onInputFocus: ((data: { type: string; name: string | null; value: string }) => void) | null = null;
  onInputBlur: ((data: { type: string; name: string | null; value: string }) => void) | null = null;

  private _internalValue: string = '';
  private _rendering = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['type', 'placeholder', 'label', 'value', 'disabled', 'required', 'size', 'variant'];
  }

  connectedCallback() {
    this._internalValue = this.getAttribute('value') || '';
    this.render();
    this.attachEvents();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.shadowRoot && !this._rendering) {
      // If value changed externally (not from user input), update internal value
      if (name === 'value' && newValue !== this._internalValue) {
        this._internalValue = newValue;
        const input = this.shadowRoot.querySelector('input') as HTMLInputElement;
        if (input) {
          input.value = newValue;
        }
        return; // Don't re-render for value changes
      }
      
      // Handle specific attribute changes without full re-render to preserve focus
      if (name === 'variant') {
        this.updateVariant();
        return;
      }
      
      if (name === 'disabled') {
        this.updateDisabled();
        return;
      }
      
      if (name === 'placeholder') {
        this.updatePlaceholder();
        return;
      }
      
      if (name === 'label') {
        this.updateLabel();
        return;
      }
      
      if (name === 'size') {
        this.updateSize();
        return;
      }
      
      // For type changes, we need to re-render because input type can't be changed
      if (name === 'type' || name === 'required') {
        // Save callbacks before re-render
        const savedCallbacks = {
          onInputChange: this.onInputChange,
          onInputFocus: this.onInputFocus,
          onInputBlur: this.onInputBlur
        };
        
        this.render();
        this.attachEvents();
        
        // Restore callbacks
        this.onInputChange = savedCallbacks.onInputChange;
        this.onInputFocus = savedCallbacks.onInputFocus;
        this.onInputBlur = savedCallbacks.onInputBlur;
      }
    }
  }

  get type() { return this.getAttribute('type') || 'text'; }
  get placeholder() { return this.getAttribute('placeholder') || ''; }
  get label() { return this.getAttribute('label') || ''; }
  get value() { return this._internalValue; }
  get disabled() { return this.hasAttribute('disabled'); }
  get required() { return this.hasAttribute('required'); }
  get size() { return this.getAttribute('size') || 'md'; }
  get variant() { return this.getAttribute('variant') || 'default'; }

  set value(val: string) {
    this._internalValue = val;
    this.setAttribute('value', val);
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    if (input) {
      input.value = val;
    }
  }

  // Update specific attributes without full re-render
  updateVariant() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      // Remove old variant classes
      input.className = input.className.replace(/\b(default|success|error|warning)\b/g, '');
      // Add new variant class
      input.classList.add(this.variant);
    }
  }

  updateDisabled() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      if (this.disabled) {
        input.setAttribute('disabled', '');
      } else {
        input.removeAttribute('disabled');
      }
    }
  }

  updatePlaceholder() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      input.setAttribute('placeholder', this.placeholder);
    }
  }

  updateLabel() {
    const labelElement = this.shadowRoot?.querySelector('.input-label');
    const container = this.shadowRoot?.querySelector('.input-container');
    
    if (this.label) {
      if (labelElement) {
        labelElement.textContent = this.label;
      } else if (container) {
        // Create label if it doesn't exist
        const newLabel = document.createElement('label');
        newLabel.className = 'input-label';
        newLabel.textContent = this.label;
        container.insertBefore(newLabel, container.firstChild);
      }
    } else if (labelElement) {
      // Remove label if no label attribute
      labelElement.remove();
    }
  }

  updateSize() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      // Remove old size classes
      input.className = input.className.replace(/\b(xs|sm|md|lg|xl)\b/g, '');
      // Add new size class
      input.classList.add(this.size);
    }
  }

  render() {
    if (!this.shadowRoot || this._rendering) return;

    this._rendering = true;

    const labelEl = this.label ? `<label class="input-label">${this.label}</label>` : '';
    
    this.shadowRoot.innerHTML = `
      <style>
.input-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: system-ui, sans-serif;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.input {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: system-ui, sans-serif;
  transition: all 0.2s;
  background: white;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

/* Sizes */
.xs { padding: 0.25rem 0.5rem; font-size: 12px; }
.sm { padding: 0.375rem 0.75rem; font-size: 13px; }
.md { padding: 0.5rem 0.75rem; font-size: 14px; }
.lg { padding: 0.75rem 1rem; font-size: 16px; }
.xl { padding: 1rem 1.25rem; font-size: 18px; }

/* Variants */
.default { border-color: #d1d5db; }
.default:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }

.success { border-color: #10b981; }
.success:focus { border-color: #059669; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1); }

.error { border-color: #ef4444; }
.error:focus { border-color: #dc2626; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1); }

.warning { border-color: #f59e0b; }
.warning:focus { border-color: #d97706; box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1); }
      </style>
      <div class="input-container">
        ${labelEl}
        <input 
          class="input ${this.size} ${this.variant}"
          type="${this.type}"
          placeholder="${this.placeholder}"
          value="${this._internalValue}"
          ${this.disabled ? 'disabled' : ''}
          ${this.required ? 'required' : ''}
        />
      </div>
    `;

    this._rendering = false;
  }

  attachEvents() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      // Remove existing event listeners to prevent duplicates
      input.removeEventListener('input', this.handleInput);
      input.removeEventListener('focus', this.handleFocus);
      input.removeEventListener('blur', this.handleBlur);

      // Add event listeners
      input.addEventListener('input', this.handleInput);
      input.addEventListener('focus', this.handleFocus);
      input.addEventListener('blur', this.handleBlur);
    }
  }

  // Bound event handlers to avoid losing 'this' context
  handleInput = (e: Event) => {
    const inputValue = (e.target as HTMLInputElement).value;
    
    // Update internal value only - don't trigger re-render
    this._internalValue = inputValue;
    
    // Update the attribute silently (this won't trigger attributeChangedCallback 
    // because _internalValue now matches the new value)
    this.setAttribute('value', inputValue);
    
    const eventData = {
      value: inputValue,
      type: this.type,
      name: this.getAttribute('name')
    };
    
    // Call the callback function if provided
    if (typeof this.onInputChange === 'function') {
      this.onInputChange(eventData);
    }
    
    // Still emit the custom event for backward compatibility
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  };

  handleFocus = (e: Event) => {
    const eventData = {
      type: this.type,
      name: this.getAttribute('name'),
      value: this.value
    };
    
    // Call the callback function if provided
    if (typeof this.onInputFocus === 'function') {
      this.onInputFocus(eventData);
    }
    
    // Emit custom event
    this.dispatchEvent(new CustomEvent('input-focus', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  };

  handleBlur = (e: Event) => {
    const eventData = {
      type: this.type,
      name: this.getAttribute('name'),
      value: this.value
    };
    
    // Call the callback function if provided
    if (typeof this.onInputBlur === 'function') {
      this.onInputBlur(eventData);
    }
    
    // Emit custom event
    this.dispatchEvent(new CustomEvent('input-blur', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  };

  // Public methods
  focus() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) input.focus();
  }

  blur() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) input.blur();
  }
}

customElements.define('nomad-input', NomadInput);