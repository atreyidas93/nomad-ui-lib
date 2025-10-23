class NomadButton extends HTMLElement {
  constructor() {
    super();
    this.onButtonClick = null;
    this._rendering = false;
    this.handleClick = (e) => {
      if (!this.disabled && !this.loading) {
        const eventData = {
          variant: this.variant,
          size: this.size,
          disabled: this.disabled,
          loading: this.loading
        };
        if (typeof this.onButtonClick === "function") {
          this.onButtonClick(eventData);
        }
        this.dispatchEvent(new CustomEvent("button-click", {
          detail: eventData,
          bubbles: true,
          composed: true
        }));
      }
    };
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["label", "variant", "size", "disabled", "loading"];
  }
  connectedCallback() {
    this.render();
    this.attachEvents();
  }
  get variant() {
    return this.getAttribute("variant") || "primary";
  }
  get size() {
    return this.getAttribute("size") || "md";
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  get loading() {
    return this.hasAttribute("loading");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && !this._rendering) {
      if (name === "disabled" || name === "loading") {
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
    const button = this.shadowRoot?.querySelector("button");
    if (button) {
      if (this.disabled || this.loading) {
        button.setAttribute("disabled", "");
      } else {
        button.removeAttribute("disabled");
      }
      const existingSpinner = button.querySelector(".spinner");
      const textSpan = button.querySelector("span");
      if (this.loading && !existingSpinner) {
        const spinner = document.createElement("span");
        spinner.className = "spinner";
        button.insertBefore(spinner, textSpan);
      } else if (!this.loading && existingSpinner) {
        existingSpinner.remove();
      }
      button.className = `btn ${this.variant} ${this.size}`;
    }
  }
  attachEvents() {
    const button = this.shadowRoot?.querySelector("button");
    if (button) {
      button.removeEventListener("click", this.handleClick);
      button.addEventListener("click", this.handleClick);
    }
  }
  render() {
    if (!this.shadowRoot || this._rendering)
      return;
    this._rendering = true;
    const spinner = this.loading ? '<span class="spinner"></span>' : "";
    const text = this.textContent || this.getAttribute("label") || "Button";
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
      <button class="btn ${this.variant} ${this.size}" ${this.disabled || this.loading ? "disabled" : ""}>
        ${spinner}
        <span>${text}</span>
      </button>
    `;
    this._rendering = false;
  }
  setLoading(loading) {
    if (loading) {
      this.setAttribute("loading", "");
    } else {
      this.removeAttribute("loading");
    }
  }
  setDisabled(disabled) {
    if (disabled) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }
}
if (!customElements.get("nomad-button")) {
  customElements.define("nomad-button", NomadButton);
}
class NomadInput extends HTMLElement {
  constructor() {
    super();
    this.onInputChange = null;
    this.onInputFocus = null;
    this.onInputBlur = null;
    this._internalValue = "";
    this._rendering = false;
    this.handleInput = (e) => {
      const inputValue = e.target.value;
      this._internalValue = inputValue;
      this.setAttribute("value", inputValue);
      const eventData = {
        value: inputValue,
        type: this.type,
        name: this.getAttribute("name")
      };
      if (typeof this.onInputChange === "function") {
        this.onInputChange(eventData);
      }
      this.dispatchEvent(new CustomEvent("input-change", {
        detail: eventData,
        bubbles: true,
        composed: true
      }));
    };
    this.handleFocus = (e) => {
      const eventData = {
        type: this.type,
        name: this.getAttribute("name"),
        value: this.value
      };
      if (typeof this.onInputFocus === "function") {
        this.onInputFocus(eventData);
      }
      this.dispatchEvent(new CustomEvent("input-focus", {
        detail: eventData,
        bubbles: true,
        composed: true
      }));
    };
    this.handleBlur = (e) => {
      const eventData = {
        type: this.type,
        name: this.getAttribute("name"),
        value: this.value
      };
      if (typeof this.onInputBlur === "function") {
        this.onInputBlur(eventData);
      }
      this.dispatchEvent(new CustomEvent("input-blur", {
        detail: eventData,
        bubbles: true,
        composed: true
      }));
    };
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["type", "placeholder", "label", "value", "disabled", "required", "size", "variant"];
  }
  connectedCallback() {
    this._internalValue = this.getAttribute("value") || "";
    this.render();
    this.attachEvents();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && !this._rendering) {
      if (name === "value" && newValue !== this._internalValue) {
        this._internalValue = newValue;
        const input = this.shadowRoot.querySelector("input");
        if (input) {
          input.value = newValue;
        }
        return;
      }
      if (name === "variant") {
        this.updateVariant();
        return;
      }
      if (name === "disabled") {
        this.updateDisabled();
        return;
      }
      if (name === "placeholder") {
        this.updatePlaceholder();
        return;
      }
      if (name === "label") {
        this.updateLabel();
        return;
      }
      if (name === "size") {
        this.updateSize();
        return;
      }
      if (name === "type" || name === "required") {
        const savedCallbacks = {
          onInputChange: this.onInputChange,
          onInputFocus: this.onInputFocus,
          onInputBlur: this.onInputBlur
        };
        this.render();
        this.attachEvents();
        this.onInputChange = savedCallbacks.onInputChange;
        this.onInputFocus = savedCallbacks.onInputFocus;
        this.onInputBlur = savedCallbacks.onInputBlur;
      }
    }
  }
  get type() {
    return this.getAttribute("type") || "text";
  }
  get placeholder() {
    return this.getAttribute("placeholder") || "";
  }
  get label() {
    return this.getAttribute("label") || "";
  }
  get value() {
    return this._internalValue;
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  get required() {
    return this.hasAttribute("required");
  }
  get size() {
    return this.getAttribute("size") || "md";
  }
  get variant() {
    return this.getAttribute("variant") || "default";
  }
  set value(val) {
    this._internalValue = val;
    this.setAttribute("value", val);
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.value = val;
    }
  }
  // Update specific attributes without full re-render
  updateVariant() {
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.className = input.className.replace(/\b(default|success|error|warning)\b/g, "");
      input.classList.add(this.variant);
    }
  }
  updateDisabled() {
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      if (this.disabled) {
        input.setAttribute("disabled", "");
      } else {
        input.removeAttribute("disabled");
      }
    }
  }
  updatePlaceholder() {
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.setAttribute("placeholder", this.placeholder);
    }
  }
  updateLabel() {
    const labelElement = this.shadowRoot?.querySelector(".input-label");
    const container = this.shadowRoot?.querySelector(".input-container");
    if (this.label) {
      if (labelElement) {
        labelElement.textContent = this.label;
      } else if (container) {
        const newLabel = document.createElement("label");
        newLabel.className = "input-label";
        newLabel.textContent = this.label;
        container.insertBefore(newLabel, container.firstChild);
      }
    } else if (labelElement) {
      labelElement.remove();
    }
  }
  updateSize() {
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.className = input.className.replace(/\b(xs|sm|md|lg|xl)\b/g, "");
      input.classList.add(this.size);
    }
  }
  render() {
    if (!this.shadowRoot || this._rendering)
      return;
    this._rendering = true;
    const labelEl = this.label ? `<label class="input-label">${this.label}</label>` : "";
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
          ${this.disabled ? "disabled" : ""}
          ${this.required ? "required" : ""}
        />
      </div>
    `;
    this._rendering = false;
  }
  attachEvents() {
    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      input.removeEventListener("input", this.handleInput);
      input.removeEventListener("focus", this.handleFocus);
      input.removeEventListener("blur", this.handleBlur);
      input.addEventListener("input", this.handleInput);
      input.addEventListener("focus", this.handleFocus);
      input.addEventListener("blur", this.handleBlur);
    }
  }
  // Public methods
  focus() {
    const input = this.shadowRoot?.querySelector("input");
    if (input)
      input.focus();
  }
  blur() {
    const input = this.shadowRoot?.querySelector("input");
    if (input)
      input.blur();
  }
}
customElements.define("nomad-input", NomadInput);
class NomadDropdown extends HTMLElement {
  constructor() {
    super();
    this.onDropdownChange = null;
    this.onDropdownOpen = null;
    this.onDropdownClose = null;
    this.isOpen = false;
    this.options = [];
    this._internalValue = "";
    this._rendering = false;
    this.handleButtonClick = (e) => {
      e.stopPropagation();
      this.toggle();
    };
    this.handleKeyDown = (e) => {
      const keyEvent = e;
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        keyEvent.preventDefault();
        this.toggle();
      } else if (keyEvent.key === "Escape") {
        this.close();
      } else if (keyEvent.key === "ArrowDown") {
        keyEvent.preventDefault();
        this.open();
        this.focusFirstOption();
      }
    };
    this.handleOptionClick = (e) => {
      const option = e.target.closest(".dropdown-option");
      if (option) {
        const value = option.dataset.value || "";
        this.selectOption(value);
      }
    };
    this.handleOutsideClick = () => {
      if (this.isOpen) {
        this.close();
      }
    };
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["label", "value", "placeholder", "disabled", "size", "variant", "options"];
  }
  connectedCallback() {
    this._internalValue = this.getAttribute("value") || "";
    this.parseOptions();
    this.render();
    this.attachEvents();
  }
  get label() {
    return this.getAttribute("label") || "";
  }
  get value() {
    return this._internalValue;
  }
  get placeholder() {
    return this.getAttribute("placeholder") || "Select an option...";
  }
  get disabled() {
    return this.hasAttribute("disabled");
  }
  get size() {
    return this.getAttribute("size") || "md";
  }
  get variant() {
    return this.getAttribute("variant") || "default";
  }
  set value(val) {
    this._internalValue = val;
    this.setAttribute("value", val);
    this.updateSelectedDisplay();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && !this._rendering) {
      const savedCallbacks = {
        onDropdownChange: this.onDropdownChange,
        onDropdownOpen: this.onDropdownOpen,
        onDropdownClose: this.onDropdownClose
      };
      this.render();
      this.attachEvents();
      Object.assign(this, savedCallbacks);
    }
  }
  parseOptions() {
    const optionsAttr = this.getAttribute("options");
    if (optionsAttr) {
      try {
        this.options = JSON.parse(optionsAttr);
      } catch {
        this.options = optionsAttr.split(",").map((opt) => opt.trim());
      }
    } else {
      this.options = Array.from(this.children).filter((child) => child.tagName === "OPTION").map((option) => option.textContent || "");
    }
  }
  updateSelectedDisplay() {
    const textEl = this.shadowRoot?.querySelector(".dropdown-text");
    const selectedText = this._internalValue || this.placeholder;
    if (textEl) {
      textEl.textContent = selectedText;
      textEl.classList.toggle("placeholder", !this._internalValue);
    }
    this.shadowRoot?.querySelectorAll(".dropdown-option").forEach((option) => {
      const el = option;
      el.classList.toggle("selected", el.dataset.value === this._internalValue);
    });
  }
  updateDropdownList() {
    const list = this.shadowRoot?.querySelector(".dropdown-list");
    if (list) {
      list.innerHTML = this.options.map((option) => `
        <div class="dropdown-option ${option === this._internalValue ? "selected" : ""}" 
             data-value="${option}">
          ${option}
        </div>
      `).join("");
      this.attachOptionEvents();
    }
  }
  updateDisabledState() {
    const button = this.shadowRoot?.querySelector(".dropdown-button");
    if (button) {
      if (this.disabled) {
        button.setAttribute("disabled", "");
        button.setAttribute("tabindex", "-1");
      } else {
        button.removeAttribute("disabled");
        button.setAttribute("tabindex", "0");
      }
    }
  }
  render() {
    if (!this.shadowRoot || this._rendering)
      return;
    this._rendering = true;
    const labelEl = this.label ? `<label class="dropdown-label">${this.label}</label>` : "";
    const selectedText = this._internalValue || this.placeholder;
    this.shadowRoot.innerHTML = `
      <style>
.dropdown-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: system-ui, sans-serif;
}

.dropdown-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.dropdown-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: system-ui, sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.dropdown-button:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.dropdown-button:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.dropdown-text {
  flex: 1;
  text-align: left;
}

.dropdown-text.placeholder {
  color: #9ca3af;
}

.dropdown-arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #6b7280;
  transition: transform 0.2s;
  margin-left: 0.5rem;
}

.dropdown-button.open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
}

.dropdown-list.open {
  display: block;
}

.dropdown-option {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-option:hover {
  background-color: #f9fafb;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option.selected {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
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
      <div class="dropdown-container">
        ${labelEl}
        <div class="dropdown-button ${this.size} ${this.variant}" 
             tabindex="${this.disabled ? "-1" : "0"}" 
             ${this.disabled ? "disabled" : ""}>
          <span class="dropdown-text ${!this._internalValue ? "placeholder" : ""}">${selectedText}</span>
          <div class="dropdown-arrow"></div>
        </div>
        <div class="dropdown-list">
          ${this.options.map((option) => `
            <div class="dropdown-option ${option === this._internalValue ? "selected" : ""}" 
                 data-value="${option}">
              ${option}
            </div>
          `).join("")}
        </div>
      </div>
    `;
    this._rendering = false;
  }
  attachEvents() {
    const button = this.shadowRoot?.querySelector(".dropdown-button");
    if (button && !this.disabled) {
      button.removeEventListener("click", this.handleButtonClick);
      button.removeEventListener("keydown", this.handleKeyDown);
      button.addEventListener("click", this.handleButtonClick);
      button.addEventListener("keydown", this.handleKeyDown);
    }
    this.attachOptionEvents();
    document.removeEventListener("click", this.handleOutsideClick);
    document.addEventListener("click", this.handleOutsideClick);
  }
  attachOptionEvents() {
    const list = this.shadowRoot?.querySelector(".dropdown-list");
    if (list) {
      list.removeEventListener("click", this.handleOptionClick);
      list.addEventListener("click", this.handleOptionClick);
    }
  }
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  open() {
    if (this.disabled)
      return;
    this.isOpen = true;
    const button = this.shadowRoot?.querySelector(".dropdown-button");
    const list = this.shadowRoot?.querySelector(".dropdown-list");
    if (button)
      button.classList.add("open");
    if (list)
      list.classList.add("open");
    if (typeof this.onDropdownOpen === "function") {
      this.onDropdownOpen();
    }
    this.dispatchEvent(new CustomEvent("dropdown-open", {
      bubbles: true,
      composed: true
    }));
  }
  close() {
    this.isOpen = false;
    const button = this.shadowRoot?.querySelector(".dropdown-button");
    const list = this.shadowRoot?.querySelector(".dropdown-list");
    if (button)
      button.classList.remove("open");
    if (list)
      list.classList.remove("open");
    if (typeof this.onDropdownClose === "function") {
      this.onDropdownClose();
    }
    this.dispatchEvent(new CustomEvent("dropdown-close", {
      bubbles: true,
      composed: true
    }));
  }
  selectOption(value) {
    const oldValue = this._internalValue;
    this._internalValue = value;
    this.setAttribute("value", value);
    this.updateSelectedDisplay();
    this.close();
    const eventData = {
      value,
      oldValue,
      options: this.options
    };
    if (typeof this.onDropdownChange === "function") {
      this.onDropdownChange(eventData);
    }
    this.dispatchEvent(new CustomEvent("dropdown-change", {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }
  focusFirstOption() {
    const firstOption = this.shadowRoot?.querySelector(".dropdown-option");
    if (firstOption)
      firstOption.focus();
  }
  // Public methods
  focus() {
    const button = this.shadowRoot?.querySelector(".dropdown-button");
    if (button)
      button.focus();
  }
  blur() {
    const button = this.shadowRoot?.querySelector(".dropdown-button");
    if (button)
      button.blur();
  }
  setOptions(options) {
    this.options = options;
    this.setAttribute("options", JSON.stringify(options));
    this.updateDropdownList();
  }
  disconnectedCallback() {
    document.removeEventListener("click", this.handleOutsideClick);
  }
}
if (!customElements.get("nomad-dropdown")) {
  customElements.define("nomad-dropdown", NomadDropdown);
}
class NomadModal extends HTMLElement {
  constructor() {
    super();
    this.onModalOpen = null;
    this.onModalClose = null;
    this.focusTrap = null;
    this.previousActiveElement = null;
    this._rendering = false;
    this.handleBackdropClick = () => {
      this.close();
    };
    this.handleCloseClick = () => {
      this.close();
    };
    this.handleKeydown = (e) => {
      if (!this.isOpen)
        return;
      if (e.key === "Escape" && this.closable) {
        this.close();
      }
    };
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["open", "title", "size", "closable", "backdrop-close"];
  }
  connectedCallback() {
    this.render();
    this.attachEvents();
    if (this.hasAttribute("open")) {
      this.open();
    }
  }
  disconnectedCallback() {
    this.deactivateFocusTrap();
    this.restoreFocus();
  }
  get isOpen() {
    return this.hasAttribute("open");
  }
  get title() {
    return this.getAttribute("title") || "";
  }
  get size() {
    return this.getAttribute("size") || "md";
  }
  get closable() {
    return this.hasAttribute("closable");
  }
  get backdropClose() {
    return this.hasAttribute("backdrop-close");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && !this._rendering) {
      if (name === "open") {
        if (newValue !== null && oldValue === null) {
          this.handleOpenState();
        } else if (newValue === null && oldValue !== null) {
          this.handleCloseState();
        }
        return;
      }
      if (name === "title") {
        this.updateTitle();
        return;
      }
      if (name === "size") {
        this.updateSize();
        return;
      }
      const savedCallbacks = {
        onModalOpen: this.onModalOpen,
        onModalClose: this.onModalClose
      };
      this.render();
      this.attachEvents();
      this.onModalOpen = savedCallbacks.onModalOpen;
      this.onModalClose = savedCallbacks.onModalClose;
    }
  }
  handleOpenState() {
    this.previousActiveElement = document.activeElement;
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      const firstFocusable = this.shadowRoot?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
      this.activateFocusTrap();
    }, 100);
    const eventData = {
      title: this.title,
      size: this.size
    };
    if (typeof this.onModalOpen === "function") {
      this.onModalOpen(eventData);
    }
    this.dispatchEvent(new CustomEvent("modal-open", {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }
  handleCloseState() {
    document.body.style.overflow = "";
    this.deactivateFocusTrap();
    this.restoreFocus();
    const eventData = {
      title: this.title,
      size: this.size
    };
    if (typeof this.onModalClose === "function") {
      this.onModalClose(eventData);
    }
    this.dispatchEvent(new CustomEvent("modal-close", {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
    if (!this.hasAttribute("persistent")) {
      setTimeout(() => {
        if (!this.isOpen && this.parentNode) {
          this.parentNode.removeChild(this);
        }
      }, 300);
    }
  }
  updateTitle() {
    const titleElement = this.shadowRoot?.querySelector(".modal-title");
    if (titleElement) {
      titleElement.textContent = this.title;
    }
    const container = this.shadowRoot?.querySelector(".modal-container");
    if (container) {
      if (this.title) {
        container.setAttribute("aria-labelledby", "modal-title");
      } else {
        container.removeAttribute("aria-labelledby");
      }
    }
  }
  updateSize() {
    const container = this.shadowRoot?.querySelector(".modal-container");
    if (container) {
      container.className = container.className.replace(/\b(xs|sm|md|lg|xl|full)\b/g, "");
      container.classList.add(this.size);
    }
  }
  render() {
    if (!this.shadowRoot || this._rendering)
      return;
    this._rendering = true;
    const closeButton = this.closable ? `
      <button class="modal-close" aria-label="Close modal">
        <span class="close-icon">&times;</span>
      </button>
    ` : "";
    const titleElement = this.title ? `
      <div class="modal-header">
        <h2 class="modal-title" id="modal-title">${this.title}</h2>
        ${closeButton}
      </div>
    ` : closeButton ? `
      <div class="modal-header">
        ${closeButton}
      </div>
    ` : "";
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
      <div class="modal-container ${this.size}" role="dialog" aria-modal="true" ${this.title ? `aria-labelledby="modal-title"` : ""}>
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
    const backdrop = this.shadowRoot?.querySelector(".modal-backdrop");
    const closeBtn = this.shadowRoot?.querySelector(".modal-close");
    const footer = this.shadowRoot?.querySelector(".modal-footer");
    backdrop?.removeEventListener("click", this.handleBackdropClick);
    closeBtn?.removeEventListener("click", this.handleCloseClick);
    document.removeEventListener("keydown", this.handleKeydown);
    if (backdrop && this.backdropClose) {
      backdrop.addEventListener("click", this.handleBackdropClick);
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", this.handleCloseClick);
    }
    if (footer) {
      const footerSlot = footer.querySelector('slot[name="footer"]');
      if (footerSlot && footerSlot.assignedNodes().length === 0) {
        footer.style.display = "none";
      }
    }
    document.addEventListener("keydown", this.handleKeydown);
  }
  open() {
    this.previousActiveElement = document.activeElement;
    this.setAttribute("open", "");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      const firstFocusable = this.shadowRoot?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
      this.activateFocusTrap();
    }, 100);
    const eventData = {
      title: this.title,
      size: this.size
    };
    if (typeof this.onModalOpen === "function") {
      this.onModalOpen(eventData);
    }
    this.dispatchEvent(new CustomEvent("modal-open", {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }
  close() {
    this.removeAttribute("open");
    document.body.style.overflow = "";
    this.deactivateFocusTrap();
    this.restoreFocus();
    const eventData = {
      title: this.title,
      size: this.size
    };
    if (typeof this.onModalClose === "function") {
      this.onModalClose(eventData);
    }
    this.dispatchEvent(new CustomEvent("modal-close", {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
    if (!this.hasAttribute("persistent")) {
      setTimeout(() => {
        if (!this.isOpen && this.parentNode) {
          this.parentNode.removeChild(this);
        }
      }, 300);
    }
  }
  activateFocusTrap() {
    const focusableElements = this.shadowRoot?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements || focusableElements.length === 0)
      return;
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const handleFocusTrap = (e) => {
      if (e.key === "Tab") {
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
        document.addEventListener("keydown", handleFocusTrap);
      },
      deactivate: () => {
        document.removeEventListener("keydown", handleFocusTrap);
      }
    };
    this.focusTrap.activate();
  }
  deactivateFocusTrap() {
    if (this.focusTrap) {
      this.focusTrap.deactivate();
      this.focusTrap = null;
    }
  }
  restoreFocus() {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
  }
  // Static helper methods
  static show(content, options = {}) {
    const modal = document.createElement("nomad-modal");
    if (options.title)
      modal.setAttribute("title", options.title);
    if (options.size)
      modal.setAttribute("size", options.size);
    if (options.closable)
      modal.setAttribute("closable", "");
    if (options.backdropClose)
      modal.setAttribute("backdrop-close", "");
    modal.innerHTML = content;
    document.body.appendChild(modal);
    modal.open();
    return modal;
  }
  static confirm(message, options = {}) {
    return new Promise((resolve) => {
      const modal = document.createElement("nomad-modal");
      modal.setAttribute("title", options.title || "Confirm");
      modal.setAttribute("size", "sm");
      modal.setAttribute("closable", "");
      const confirmText = options.confirmText || "Confirm";
      const cancelText = options.cancelText || "Cancel";
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
      modal.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("confirm-btn")) {
          resolve(true);
          cleanup();
        } else if (target.classList.contains("cancel-btn")) {
          resolve(false);
          cleanup();
        }
      });
      modal.addEventListener("modal-close", () => {
        resolve(false);
      });
    });
  }
  static alert(message, options = {}) {
    return new Promise((resolve) => {
      const modal = document.createElement("nomad-modal");
      modal.setAttribute("title", options.title || "Alert");
      modal.setAttribute("size", "sm");
      modal.setAttribute("closable", "");
      const buttonText = options.buttonText || "OK";
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
      modal.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("ok-btn")) {
          cleanup();
        }
      });
      modal.addEventListener("modal-close", cleanup);
    });
  }
}
if (!customElements.get("nomad-modal")) {
  customElements.define("nomad-modal", NomadModal);
}
class NomadToast extends HTMLElement {
  // Flag to prevent recursion
  constructor() {
    super();
    this.onToastShow = null;
    this.onToastHide = null;
    this.autoHideTimeout = null;
    this._rendering = false;
    this._programmaticChange = false;
    this.handleCloseClick = () => {
      this.hide();
    };
    this.handleKeyDown = (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
    };
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["message", "variant", "duration", "closable", "position", "show"];
  }
  connectedCallback() {
    this.render();
    this.attachEvents();
    if (this.hasAttribute("show")) {
      this._handleShowState();
    }
  }
  disconnectedCallback() {
    this.clearAutoHide();
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  get message() {
    return this.getAttribute("message") || this.textContent || "Notification";
  }
  get variant() {
    return this.getAttribute("variant") || "info";
  }
  get duration() {
    return parseInt(this.getAttribute("duration") || "4000");
  }
  get closable() {
    return this.hasAttribute("closable");
  }
  get position() {
    return this.getAttribute("position") || "top-right";
  }
  get isVisible() {
    return this.hasAttribute("show");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && !this._rendering && !this._programmaticChange) {
      if (name === "show") {
        if (newValue !== null && oldValue === null) {
          this._handleShowState();
        } else if (newValue === null && oldValue !== null) {
          this._handleHideState();
        }
        return;
      }
      if (name === "message") {
        this.updateMessage();
        return;
      }
      if (name === "variant") {
        this.updateVariant();
        return;
      }
      if (name === "position") {
        this.updatePosition();
        return;
      }
      if (name === "closable") {
        this.updateClosable();
        return;
      }
      this.render();
      this.attachEvents();
    }
  }
  _handleShowState() {
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
    if (typeof this.onToastShow === "function") {
      this.onToastShow(eventData);
    }
    this.dispatchEvent(new CustomEvent("toast-show", {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }
  _handleHideState() {
    this.clearAutoHide();
    const eventData = {
      message: this.message,
      variant: this.variant
    };
    if (typeof this.onToastHide === "function") {
      this.onToastHide(eventData);
    }
    this.dispatchEvent(new CustomEvent("toast-hide", {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
    setTimeout(() => {
      if (!this.isVisible && this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }, 300);
  }
  updateMessage() {
    const contentElement = this.shadowRoot?.querySelector(".toast-content");
    if (contentElement) {
      contentElement.textContent = this.message;
    }
  }
  updateVariant() {
    const toastElement = this.shadowRoot?.querySelector(".toast");
    if (toastElement) {
      toastElement.className = toastElement.className.replace(/\btoast--\w+\b/g, "");
      toastElement.classList.add(`toast--${this.variant}`);
    }
  }
  updatePosition() {
  }
  updateClosable() {
    const existingCloseBtn = this.shadowRoot?.querySelector(".toast-close");
    if (this.closable && !existingCloseBtn) {
      const toastElement = this.shadowRoot?.querySelector(".toast");
      if (toastElement) {
        const closeButton = document.createElement("button");
        closeButton.className = "toast-close";
        closeButton.setAttribute("aria-label", "Close notification");
        closeButton.innerHTML = '<span class="close-icon">&times;</span>';
        closeButton.addEventListener("click", this.handleCloseClick);
        toastElement.appendChild(closeButton);
      }
    } else if (!this.closable && existingCloseBtn) {
      existingCloseBtn.remove();
    }
  }
  render() {
    if (!this.shadowRoot || this._rendering)
      return;
    this._rendering = true;
    const closeButton = this.closable ? `
      <button class="toast-close" aria-label="Close notification">
        <span class="close-icon">&times;</span>
      </button>
    ` : "";
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
    const closeBtn = this.shadowRoot?.querySelector(".toast-close");
    closeBtn?.removeEventListener("click", this.handleCloseClick);
    document.removeEventListener("keydown", this.handleKeyDown);
    if (closeBtn) {
      closeBtn.addEventListener("click", this.handleCloseClick);
    }
    document.addEventListener("keydown", this.handleKeyDown);
  }
  show() {
    this._programmaticChange = true;
    this.setAttribute("show", "");
    this._programmaticChange = false;
    this._handleShowState();
  }
  hide() {
    this._programmaticChange = true;
    this.removeAttribute("show");
    this._programmaticChange = false;
    this._handleHideState();
  }
  clearAutoHide() {
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
  static show(message, variant = "info", options = {}) {
    const toast = document.createElement("nomad-toast");
    toast.setAttribute("message", message);
    toast.setAttribute("variant", variant);
    if (options.duration !== void 0) {
      toast.setAttribute("duration", options.duration.toString());
    }
    if (options.position) {
      toast.setAttribute("position", options.position);
    }
    if (options.closable) {
      toast.setAttribute("closable", "");
    }
    document.body.appendChild(toast);
    toast.show();
    return toast;
  }
  static success(message, options = {}) {
    return this.show(message, "success", options);
  }
  static error(message, options = {}) {
    return this.show(message, "error", options);
  }
  static warning(message, options = {}) {
    return this.show(message, "warning", options);
  }
  static info(message, options = {}) {
    return this.show(message, "info", options);
  }
}
if (!customElements.get("nomad-toast")) {
  customElements.define("nomad-toast", NomadToast);
}
class NomadNavigation extends HTMLElement {
  constructor() {
    super();
    this.onNavClick = null;
    this.onMenuOpen = null;
    this.onMenuClose = null;
    this.isMobileOpen = false;
    this._rendering = false;
    this.handleToggleClick = () => {
      this.toggleMobileMenu();
    };
    this.handleNavLinkClick = (e) => {
      const link = e.target;
      const href = link.getAttribute("href");
      if (this.isMobileOpen) {
        this.closeMobileMenu();
      }
      const eventData = {
        href: href || "#",
        text: link.textContent || "",
        element: link
      };
      if (typeof this.onNavClick === "function") {
        this.onNavClick(eventData);
      }
      this.dispatchEvent(new CustomEvent("nav-click", {
        detail: eventData,
        bubbles: true,
        composed: true
      }));
    };
    this.handleOutsideClick = (e) => {
      if (this.isMobileOpen && !this.contains(e.target)) {
        this.closeMobileMenu();
      }
    };
    this.handleKeyDown = (e) => {
      if (e.key === "Escape" && this.isMobileOpen) {
        this.closeMobileMenu();
      }
    };
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["brand", "variant", "position", "mobile-breakpoint", "nav-items"];
  }
  connectedCallback() {
    this.parseNavItems();
    this.render();
    this.attachEvents();
  }
  get brand() {
    return this.getAttribute("brand") || "";
  }
  get variant() {
    return this.getAttribute("variant") || "light";
  }
  get position() {
    return this.getAttribute("position") || "static";
  }
  get mobileBreakpoint() {
    return this.getAttribute("mobile-breakpoint") || "768px";
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && !this._rendering) {
      if (name === "brand") {
        this.updateBrand();
        return;
      }
      if (name === "variant") {
        this.updateVariant();
        return;
      }
      if (name === "nav-items") {
        this.parseNavItems();
        this.updateNavItems();
        return;
      }
      this.render();
      this.attachEvents();
    }
  }
  parseNavItems() {
    const navItems = this.getAttribute("nav-items");
    if (navItems) {
      try {
        return JSON.parse(navItems);
      } catch {
        return [];
      }
    }
    return [];
  }
  updateBrand() {
    const brandLink = this.shadowRoot?.querySelector(".brand-link");
    if (brandLink) {
      brandLink.textContent = this.brand;
    }
    const brandElement = this.shadowRoot?.querySelector(".nav-brand");
    if (brandElement) {
      brandElement.style.display = "none";
    }
  }
  updateVariant() {
    const navContainer = this.shadowRoot?.querySelector(".nav-container");
    if (navContainer) {
      navContainer.className = navContainer.className.replace(/\bnav--\w+\b/g, "");
      navContainer.classList.add(`nav--${this.variant}`);
    }
  }
  updateNavItems() {
    const navItems = this.parseNavItems();
    const navMenu = this.shadowRoot?.querySelector(".nav-menu");
    if (navMenu && navItems.length > 0) {
      const navItemsHtml = navItems.map((item) => `
        <li class="nav-item">
          <a href="${item.href || "#"}" class="nav-link ${item.active ? "active" : ""}" ${item.target ? `target="${item.target}"` : ""}>
            ${item.label}
          </a>
        </li>
      `).join("");
      navMenu.innerHTML = navItemsHtml;
      this.attachNavLinkEvents();
    }
  }
  render() {
    if (!this.shadowRoot || this._rendering)
      return;
    this._rendering = true;
    const navItems = this.parseNavItems();
    const brandElement = this.brand ? `
      <div class="nav-brand">
        <a href="#" class="brand-link">${this.brand}</a>
      </div>
    ` : "";
    const navItemsHtml = navItems.map((item) => `
      <li class="nav-item">
        <a href="${item.href || "#"}" class="nav-link ${item.active ? "active" : ""}" ${item.target ? `target="${item.target}"` : ""}>
          ${item.label}
        </a>
      </li>
    `).join("");
    const mobileToggle = `
      <button class="mobile-toggle" aria-label="Toggle navigation" aria-expanded="${this.isMobileOpen}">
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
      </button>
    `;
    this.shadowRoot.innerHTML = `
      <style>
:host {
  display: block;
  font-family: system-ui, sans-serif;
  
  /* CSS Custom Properties - Inherit from parent */
  --nav-bg: var(--navigation-bg, transparent);
  --nav-text: var(--navigation-text, currentColor);
  --nav-text-hover: var(--navigation-text-hover, currentColor);
  --nav-border: var(--navigation-border, rgba(0, 0, 0, 0.1));
  --nav-shadow: var(--navigation-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
  --nav-active-color: var(--navigation-active, currentColor);
}

:host([position="fixed"]) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

:host([position="sticky"]) {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  padding: 0 1rem;
  background-color: var(--nav-bg);
  color: var(--nav-text);
  box-shadow: var(--nav-shadow);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--nav-text);
  transition: color 0.2s ease;
}

.brand-link:hover {
  color: var(--nav-text-hover);
  opacity: 0.8;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: block;
  padding: 0.5rem 0;
  text-decoration: none;
  color: var(--nav-text);
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: var(--nav-text-hover);
  opacity: 0.8;
}

.nav-link.active {
  border-bottom-color: var(--nav-active-color);
  color: var(--nav-active-color);
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  color: var(--nav-text);
}

.toggle-bar {
  width: 100%;
  height: 3px;
  background-color: currentColor;
  transition: all 0.3s ease;
  border-radius: 2px;
}

/* Mobile toggle animations */
.mobile-toggle.open .toggle-bar:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-toggle.open .toggle-bar:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.open .toggle-bar:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Variants - Set CSS custom properties */
.nav--transparent {
  --nav-bg: transparent;
  --nav-text: currentColor;
  --nav-border: transparent;
  --nav-shadow: none;
}

.nav--light {
  --nav-bg: #ffffff;
  --nav-text: #374151;
  --nav-text-hover: #1f2937;
  --nav-border: #e5e7eb;
  --nav-active-color: #3b82f6;
  border-bottom: 1px solid var(--nav-border);
}

.nav--dark {
  --nav-bg: #1f2937;
  --nav-text: #ffffff;
  --nav-text-hover: #f3f4f6;
  --nav-border: #374151;
  --nav-active-color: #60a5fa;
  border-bottom: 1px solid var(--nav-border);
}

.nav--primary {
  --nav-bg: #3b82f6;
  --nav-text: #ffffff;
  --nav-text-hover: #f1f5f9;
  --nav-active-color: #fbbf24;
}

/* Inherit parent colors when transparent or no variant */
.nav--inherit,
.nav--transparent {
  --nav-bg: transparent;
  --nav-text: inherit;
  --nav-text-hover: inherit;
  --nav-active-color: inherit;
  --nav-border: transparent;
  --nav-shadow: none;
}

/* Mobile styles */
@media (max-width: ${this.mobileBreakpoint}) {
  .mobile-toggle {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    padding: 1rem 0;
    background-color: var(--nav-bg);
    border-top: 1px solid var(--nav-border);
    box-shadow: var(--nav-shadow);
    display: none;
  }

  .nav-menu.open {
    display: flex;
  }

  .nav-item {
    width: 100%;
    text-align: center;
  }

  .nav-link {
    padding: 0.75rem 1rem;
    border-bottom: none;
    border-left: 2px solid transparent;
  }

  .nav-link.active {
    border-left-color: var(--nav-active-color);
    background-color: rgba(255, 255, 255, 0.05);
  }

  .nav--light .nav-link.active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

/* Slot content for custom nav items */
::slotted(*) {
  display: none;
  color: var(--nav-text);
}

@media (min-width: ${this.mobileBreakpoint}) {
  .custom-nav-items {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  ::slotted(*) {
    display: flex;
    align-items: center;
    gap: 2rem;
    color: var(--nav-text);
  }
}

@media (max-width: ${this.mobileBreakpoint}) {
  .custom-nav-items {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    padding: 1rem 0;
    background-color: var(--nav-bg);
    border-top: 1px solid var(--nav-border);
    box-shadow: var(--nav-shadow);
    display: none;
  }
  
  .custom-nav-items.open {
    display: flex;
  }
  
  ::slotted(*) {
    flex-direction: column;
    gap: 0;
    width: 100%;
    color: var(--nav-text);
  }
}
      </style>
      <nav class="nav-container nav--${this.variant}">
        <div class="nav">
          ${brandElement}
          
          <div class="nav-content">
            ${navItems.length > 0 ? `
              <ul class="nav-menu ${this.isMobileOpen ? "open" : ""}">
                ${navItemsHtml}
              </ul>
            ` : `
              <div class="custom-nav-items ${this.isMobileOpen ? "open" : ""}">
                <slot></slot>
              </div>
            `}
            
            ${mobileToggle}
          </div>
        </div>
      </nav>
    `;
    this._rendering = false;
  }
  attachEvents() {
    const toggle = this.shadowRoot?.querySelector(".mobile-toggle");
    toggle?.removeEventListener("click", this.handleToggleClick);
    document.removeEventListener("click", this.handleOutsideClick);
    document.removeEventListener("keydown", this.handleKeyDown);
    if (toggle) {
      toggle.addEventListener("click", this.handleToggleClick);
    }
    this.attachNavLinkEvents();
    document.addEventListener("click", this.handleOutsideClick);
    document.addEventListener("keydown", this.handleKeyDown);
  }
  attachNavLinkEvents() {
    const navLinks = this.shadowRoot?.querySelectorAll(".nav-link");
    navLinks?.forEach((link) => {
      link.removeEventListener("click", this.handleNavLinkClick);
      link.addEventListener("click", this.handleNavLinkClick);
    });
  }
  toggleMobileMenu() {
    if (this.isMobileOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  openMobileMenu() {
    this.isMobileOpen = true;
    const toggle = this.shadowRoot?.querySelector(".mobile-toggle");
    const menu = this.shadowRoot?.querySelector(".nav-menu, .custom-nav-items");
    if (toggle)
      toggle.classList.add("open");
    if (menu)
      menu.classList.add("open");
    if (toggle)
      toggle.setAttribute("aria-expanded", "true");
    if (typeof this.onMenuOpen === "function") {
      this.onMenuOpen();
    }
    this.dispatchEvent(new CustomEvent("nav-menu-open", {
      bubbles: true,
      composed: true
    }));
  }
  closeMobileMenu() {
    this.isMobileOpen = false;
    const toggle = this.shadowRoot?.querySelector(".mobile-toggle");
    const menu = this.shadowRoot?.querySelector(".nav-menu, .custom-nav-items");
    if (toggle)
      toggle.classList.remove("open");
    if (menu)
      menu.classList.remove("open");
    if (toggle)
      toggle.setAttribute("aria-expanded", "false");
    if (typeof this.onMenuClose === "function") {
      this.onMenuClose();
    }
    this.dispatchEvent(new CustomEvent("nav-menu-close", {
      bubbles: true,
      composed: true
    }));
  }
  setActiveItem(href) {
    const links = this.shadowRoot?.querySelectorAll(".nav-link");
    links?.forEach((link) => {
      const linkElement = link;
      if (linkElement.getAttribute("href") === href) {
        linkElement.classList.add("active");
      } else {
        linkElement.classList.remove("active");
      }
    });
  }
  disconnectedCallback() {
    document.removeEventListener("click", this.handleOutsideClick);
    document.removeEventListener("keydown", this.handleKeyDown);
  }
}
if (!customElements.get("nomad-navigation")) {
  customElements.define("nomad-navigation", NomadNavigation);
}
const version = "1.0.0";
function checkComponentsRegistered() {
  const components = [
    "nomad-button",
    "nomad-input",
    "nomad-dropdown",
    "nomad-modal",
    "nomad-toast",
    "nomad-navigation"
  ];
  return components.every((name) => customElements.get(name));
}
if (typeof window !== "undefined") {
  console.log("NomadUI components loaded successfully");
  if (process.env.NODE_ENV === "development") {
    const registered = [
      "nomad-button",
      "nomad-input",
      "nomad-dropdown",
      "nomad-modal",
      "nomad-toast",
      "nomad-navigation"
    ].filter((name) => customElements.get(name));
    console.log("Registered components:", registered);
  }
}
export {
  NomadButton,
  NomadDropdown,
  NomadInput,
  NomadModal,
  NomadNavigation,
  NomadToast,
  checkComponentsRegistered,
  version
};
