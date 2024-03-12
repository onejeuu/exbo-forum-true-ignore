import { MutationHandler } from "./base"
import { StorageKey } from "@/constants"
import { GetStorageValue } from "@/storage"

const KEY = StorageKey.HideMessages
const TARGET = "li.item-replies"
const USERNAME = "span.username"

export class RepliesHandler extends MutationHandler {
    constructor() {
        super(KEY, TARGET, USERNAME)
    }

    protected async hideElement(element: HTMLElement) {
        element.style.display = "none"

        this.hideEmptySummary(element)
        this.removeConjunction(element)
    }

    protected async handle(element: HTMLElement) {
        const usernames = element.querySelectorAll(USERNAME)
        if (!usernames) return

        const ignoredUsers: string[] = await GetStorageValue(StorageKey.IgnoredUsers)
        if (!ignoredUsers) return

        usernames.forEach(async (span) => {
            const username = span as HTMLElement

            if (ignoredUsers.includes(username.textContent!)) {
                await this.hideElement(username)
            }
        })
    }

    private hideEmptySummary(element: HTMLElement) {
        const summary = element.parentElement?.parentElement!
        const usernames = summary.querySelectorAll(USERNAME)

        const footerIsEmpty = Array.from(usernames).every(function (username) {
            return window.getComputedStyle(username).display === "none"
        })

        if (footerIsEmpty) {
            summary.style.display = "none"
        }
    }

    private removeConjunction(element: HTMLElement) {
        const CONJUNCTIONS = ["и", ","]

        const parent = element.parentElement
        const previousNode = parent?.previousSibling

        if (previousNode && previousNode.nodeType === Node.TEXT_NODE) {
            const text = previousNode.nodeValue?.trim() || ""

            if (CONJUNCTIONS.includes(text)) {
                parent.parentNode?.removeChild(previousNode)
            }
        }
    }
}

export async function hideReplies() {
    await new RepliesHandler().hide()
}
