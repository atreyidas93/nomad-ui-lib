export declare class NomadNavigation extends HTMLElement {
    onNavClick: ((data: {
        href: string;
        text: string;
        element: HTMLElement;
    }) => void) | null;
    onMenuOpen: (() => void) | null;
    onMenuClose: (() => void) | null;
    private isMobileOpen;
    private _rendering;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    get brand(): string;
    get variant(): string;
    get position(): string;
    get mobileBreakpoint(): string;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    parseNavItems(): any;
    updateBrand(): void;
    updateVariant(): void;
    updateNavItems(): void;
    render(): void;
    attachEvents(): void;
    attachNavLinkEvents(): void;
    handleToggleClick: () => void;
    handleNavLinkClick: (e: Event) => void;
    handleOutsideClick: (e: Event) => void;
    handleKeyDown: (e: KeyboardEvent) => void;
    toggleMobileMenu(): void;
    openMobileMenu(): void;
    closeMobileMenu(): void;
    setActiveItem(href: string): void;
    disconnectedCallback(): void;
}
