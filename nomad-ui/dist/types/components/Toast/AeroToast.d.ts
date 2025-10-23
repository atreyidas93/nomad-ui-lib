export declare class NomadToast extends HTMLElement {
    onToastShow: ((data: {
        message: string;
        variant: string;
        duration: number;
    }) => void) | null;
    onToastHide: ((data: {
        message: string;
        variant: string;
    }) => void) | null;
    private autoHideTimeout;
    private _rendering;
    private _programmaticChange;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    get message(): string;
    get variant(): string;
    get duration(): number;
    get closable(): boolean;
    get position(): string;
    get isVisible(): boolean;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private _handleShowState;
    private _handleHideState;
    updateMessage(): void;
    updateVariant(): void;
    updatePosition(): void;
    updateClosable(): void;
    render(): void;
    attachEvents(): void;
    handleCloseClick: () => void;
    handleKeyDown: (e: KeyboardEvent) => void;
    show(): void;
    hide(): void;
    private clearAutoHide;
    pause(): void;
    resume(): void;
    static show(message: string, variant?: 'success' | 'error' | 'warning' | 'info', options?: {
        duration?: number;
        position?: string;
        closable?: boolean;
    }): NomadToast;
    static success(message: string, options?: {}): NomadToast;
    static error(message: string, options?: {}): NomadToast;
    static warning(message: string, options?: {}): NomadToast;
    static info(message: string, options?: {}): NomadToast;
}
