
interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: string | Partial<CSSStyleDeclaration>;
  ref?: React.Ref<any>;
}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    NomadButton: DefineComponent<{
      variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      disabled?: boolean;
      loading?: boolean;
      label?: string;
    }>;

    NomadInput: DefineComponent<{
      type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
      placeholder?: string;
      label?: string;
      value?: string;
      disabled?: boolean;
      required?: boolean;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant?: 'default' | 'success' | 'error' | 'warning';
      name?: string;
    }>;

    NomadDropdown: DefineComponent<{
      label?: string;
      value?: string;
      placeholder?: string;
      disabled?: boolean;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant?: 'default' | 'success' | 'error' | 'warning';
      options?: string;
      name?: string;
    }>;

    NomadModal: DefineComponent<{
      open?: boolean;
      title?: string;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
      closable?: boolean;
      'backdrop-close'?: boolean;
      persistent?: boolean;
    }>;

    NomadToast: DefineComponent<{
      message?: string;
      variant?: 'success' | 'error' | 'warning' | 'info';
      duration?: number | string;
      closable?: boolean;
      position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
      show?: boolean;
    }>;

    NomadNavigation: DefineComponent<{
      brand?: string;
      variant?: 'light' | 'dark' | 'primary' | 'transparent';
      position?: 'static' | 'fixed' | 'sticky';
      'mobile-breakpoint'?: string;
      'nav-items'?: string;
    }>;
  }
}

export {};