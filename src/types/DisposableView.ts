export interface DisposableView {
    /**
     * Returns a function that completely removes view from UI and removes all added listeners/timeouts
     */
    render(parentElement: HTMLElement): () => void;
}
