import { MutationHandler } from "./base"
import { StorageKey } from "@/constants"
import { GetStorageValue } from "@/storage"

const KEY = StorageKey.HideMessages
const TARGET = "ul.Post-mentionedBy-preview"
const USERNAME = "span.username"

export class RepliesPreviewHandler extends MutationHandler {
    protected options: MutationObserverInit = { childList: true }

    constructor() {
        super(KEY, TARGET, USERNAME)
    }

    protected async hideElement(element: HTMLElement) {
        element.style.display = "none"

        this.hideEmptyPreview(element)
    }

    protected async handle(element: HTMLElement) {
        const ignoredUsers: string[] = await GetStorageValue(StorageKey.IgnoredUsers)
        if (!ignoredUsers) return

        const username = element.querySelector(USERNAME)
        if (!username) return

        if (ignoredUsers.includes(username.textContent!)) {
            await this.hideElement(element)
        }
    }

    private hideEmptyPreview(element: HTMLElement) {}
}

export async function hideRepliesPreview() {
    await new RepliesPreviewHandler().hide()
}
