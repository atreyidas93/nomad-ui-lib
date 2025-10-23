
interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: string | Partial<CSSStyleDeclaration>;
  ref?: React.Ref<any>;
}

// Universal type declarations for any JavaScript framework
export interface NomadButtonElement extends HTMLElement {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled: boolean;
  loading: boolean;
  label: string;
}

export interface NomadInputElement extends HTMLElement {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder: string;
  label: string;
  value: string;
  disabled: boolean;
  required: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant: 'default' | 'success' | 'error' | 'warning';
  name: string;
}

export interface NomadDropdownElement extends HTMLElement {
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant: 'default' | 'success' | 'error' | 'warning';
  options: string;
  name: string;
}

export interface NomadModalElement extends HTMLElement {
  open: boolean;
  title: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable: boolean;
  persistent: boolean;
  show(): void;
  hide(): void;
}

export interface NomadToastElement extends HTMLElement {
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  closable: boolean;
  position: string;
  show: boolean;
}

export interface NomadNavigationElement extends HTMLElement {
  brand: string;
  variant: 'light' | 'dark' | 'primary' | 'transparent';
  position: 'static' | 'fixed' | 'sticky';
  'mobile-breakpoint': string;
  'nav-items': string;
}

declare global {
  interface HTMLElementTagNameMap {
    'nomad-button': NomadButtonElement;
    'nomad-input': NomadInputElement;
    'nomad-dropdown': NomadDropdownElement;
    'nomad-modal': NomadModalElement;
    'nomad-toast': NomadToastElement;
    'nomad-navigation': NomadNavigationElement;
  }
}