export declare class NomadInput extends HTMLElement {
    onInputChange: ((data: {
        value: string;
        type: string;
        name: string | null;
    }) => void) | null;
    onInputFocus: ((data: {
        type: string;
        name: string | null;
        value: string;
    }) => void) | null;
    onInputBlur: ((data: {
        type: string;
        name: string | null;
        value: string;
    }) => void) | null;
    private _internalValue;
    private _rendering;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    get type(): string;
    get placeholder(): string;
    get label(): string;
    get value(): string;
    get disabled(): boolean;
    get required(): boolean;
    get size(): string;
    get variant(): string;
    set value(val: string);
    updateVariant(): void;
    updateDisabled(): void;
    updatePlaceholder(): void;
    updateLabel(): void;
    updateSize(): void;
    render(): void;
    attachEvents(): void;
    handleInput: (e: Event) => void;
    handleFocus: (e: Event) => void;
    handleBlur: (e: Event) => void;
    focus(): void;
    blur(): void;
}
