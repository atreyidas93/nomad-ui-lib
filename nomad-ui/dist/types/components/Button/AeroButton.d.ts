export declare class NomadButton extends HTMLElement {
    onButtonClick: ((data: {
        variant: string;
        size: string;
        disabled: boolean;
        loading: boolean;
    }) => void) | null;
    private _rendering;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    get variant(): string;
    get size(): string;
    get disabled(): boolean;
    get loading(): boolean;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    updateButtonState(): void;
    attachEvents(): void;
    handleClick: (e: Event) => void;
    render(): void;
    setLoading(loading: boolean): void;
    setDisabled(disabled: boolean): void;
}
