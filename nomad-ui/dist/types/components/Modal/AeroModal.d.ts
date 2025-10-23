export declare class NomadModal extends HTMLElement {
    onModalOpen: ((data: {
        title: string;
        size: string;
    }) => void) | null;
    onModalClose: ((data: {
        title: string;
        size: string;
    }) => void) | null;
    private focusTrap;
    private previousActiveElement;
    private _rendering;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    get isOpen(): boolean;
    get title(): string;
    get size(): string;
    get closable(): boolean;
    get backdropClose(): boolean;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private handleOpenState;
    private handleCloseState;
    updateTitle(): void;
    updateSize(): void;
    render(): void;
    attachEvents(): void;
    handleBackdropClick: () => void;
    handleCloseClick: () => void;
    handleKeydown: (e: KeyboardEvent) => void;
    open(): void;
    close(): void;
    private activateFocusTrap;
    private deactivateFocusTrap;
    private restoreFocus;
    static show(content: string, options?: {
        title?: string;
        size?: string;
        closable?: boolean;
        backdropClose?: boolean;
    }): NomadModal;
    static confirm(message: string, options?: {
        title?: string;
        confirmText?: string;
        cancelText?: string;
    }): Promise<boolean>;
    static alert(message: string, options?: {
        title?: string;
        buttonText?: string;
    }): Promise<void>;
}
