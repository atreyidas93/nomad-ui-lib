
interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: string | Partial<CSSStyleDeclaration>;
  ref?: React.Ref<any>;
}

declare global {
  interface HTMLElementTagNameMap {
    'nomad-button': HTMLElement & {
      variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      disabled: boolean;
      loading: boolean;
      label: string;
    };

    'nomad-input': HTMLElement & {
      type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
      placeholder: string;
      label: string;
      value: string;
      disabled: boolean;
      required: boolean;
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant: 'default' | 'success' | 'error' | 'warning';
      name: string;
    };

    'nomad-dropdown': HTMLElement & {
      label: string;
      value: string;
      placeholder: string;
      disabled: boolean;
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant: 'default' | 'success' | 'error' | 'warning';
      options: string;
      name: string;
    };

    'nomad-modal': HTMLElement & {
      open: boolean;
      title: string;
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
      closable: boolean;
      persistent: boolean;
    };

    'nomad-toast': HTMLElement & {
      message: string;
      variant: 'success' | 'error' | 'warning' | 'info';
      duration: number;
      closable: boolean;
      position: string;
      show: boolean;
    };

    'nomad-navigation': HTMLElement & {
      brand: string;
      variant: 'light' | 'dark' | 'primary' | 'transparent';
      position: 'static' | 'fixed' | 'sticky';
      'mobile-breakpoint': string;
      'nav-items': string;
    };
  }
}