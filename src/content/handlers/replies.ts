import { MutationHandler } from "./base"
import { StorageKey } from "@/constants"

const KEY = StorageKey.HideReplies
const TARGET = "li.item-replies"

const USERNAME = "span.username"

const CONJUNCTIONS = ["и", ","]

export class RepliesHandler extends MutationHandler {
    constructor() {
        super(KEY, TARGET)
    }

    protected async isIgnored(element: HTMLElement) {
        return await this.inIgnoredUsers(element)
    }

    protected async hideElement(element: HTMLElement) {
        await super.hideElement(element)

        this.hideEmptySummary(element)
        this.removeConjunctions(element)
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

    private removeConjunctions(element: HTMLElement) {
        const href = element.parentElement!

        const previousNode = href?.previousSibling
        const nextNode = href?.nextSibling

        const summary = href.parentElement!

        this.removeTextNode(summary, previousNode)
        this.removeTextNode(summary, nextNode)
    }

    private removeTextNode(summary: HTMLElement, node: ChildNode | null) {
        if (node && node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue?.trim() || ""

            if (CONJUNCTIONS.includes(text)) {
                summary.removeChild(node)
            }
        }
    }
}

export async function hideReplies() {
    await new RepliesHandler().start()
}
