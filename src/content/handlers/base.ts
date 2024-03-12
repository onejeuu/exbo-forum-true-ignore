import { GetStorageValue } from "@/storage"

export abstract class MutationHandler {
    private observer: MutationObserver
    private options: MutationObserverInit = { childList: true, subtree: true, attributes: true }
    protected storageKey: string
    protected targetsSelector: string
    protected ignoredSelector: string
    protected targets: NodeListOf<Element>

    constructor(storageKey: string, targetsSelector: string, ignoredSelector: string) {
        this.storageKey = storageKey
        this.targetsSelector = targetsSelector
        this.ignoredSelector = ignoredSelector

        this.targets = document.querySelectorAll(targetsSelector)

        this.observer = new MutationObserver(this.callback.bind(this))
    }

    async hide() {
        if (await this.isDisabled()) return

        await this.check()
        await this.observe()
    }

    private async check() {
        this.targets.forEach((target: Element) => {
            target.childNodes.forEach((node: ChildNode) => {
                this.handle(node as HTMLElement)
            })
        })
    }

    private async observe() {
        this.targets.forEach((target) => {
            this.observer.observe(target, this.options)
        })
    }

    protected async isDisabled() {
        return (await GetStorageValue(this.storageKey)) !== true
    }

    protected async isIgnored(element: HTMLElement) {
        return element.querySelector(this.ignoredSelector) !== null
    }

    protected async hideElement(element: HTMLElement) {
        element.style.display = "none"
    }

    protected async handle(element: HTMLElement) {
        if (await this.isIgnored(element)) {
            await this.hideElement(element)
        }
    }

    private async callback(mutationsList: MutationRecord[]) {
        const addedElements: HTMLElement[] = mutationsList
            .filter((mutation) => mutation.type === "childList")
            .flatMap((mutation) => Array.from(mutation.addedNodes))
            .filter((node) => node instanceof HTMLElement) as HTMLElement[]

        await Promise.all(addedElements.map((node) => this.handle(node)))
    }
}
