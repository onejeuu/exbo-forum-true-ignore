import { MutationHandler } from "./base"
import { StorageKey } from "@/constants"

const KEY = StorageKey.HideReplies
const TARGET = "ul.Post-mentionedBy-preview"
const USERNAME = "span.username"

export class RepliesPreviewHandler extends MutationHandler {
    constructor() {
        super(KEY, TARGET, USERNAME)
    }

    protected async isIgnored(element: HTMLElement) {
        const username = element.querySelector(USERNAME)!
        return await this.inIgnoredUsers(username as HTMLElement)
    }

    protected async hideElement(element: HTMLElement) {
        element.style.display = "none"

        this.hideEmptyPreview(element)
    }

    private hideEmptyPreview(element: HTMLElement) {}
}

export async function hideRepliesPreview() {
    await new RepliesPreviewHandler().start()
}
