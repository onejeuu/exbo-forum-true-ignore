import { MutationHandler } from "./base"
import { StorageKey } from "@/constants"

const KEY = StorageKey.HideReplies
const TARGET = "li.item-replies"
const USERNAME = "span.username"

export class RepliesHandler extends MutationHandler {
    constructor() {
        super(KEY, TARGET, USERNAME)
    }

    protected async isIgnored(element: HTMLElement) {
        return await this.inIgnoredUsers(element)
    }

    protected async hideElement(element: HTMLElement) {
        element.style.display = "none"

        this.hideEmptySummary(element)
        this.removeConjunction(element)
    }

    protected async handle(element: HTMLElement) {
        const usernames = element.querySelectorAll(USERNAME)
        if (!usernames) return

        usernames.forEach(async (span) => {
            await this.hide(span as HTMLElement)
        })
    }

    private hideEmptySummary(element: HTMLElement) {
        const summary = element.parentElement?.parentElement!
        const usernames = summary.querySelectorAll(USERNAME)

        const footerIsEmpty = Array.from(usernames).every((username) => {
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
    await new RepliesHandler().start()
}
