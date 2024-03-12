import { MutationHandler } from "./base"
import { StorageKey } from "@/constants"

const KEY = StorageKey.HideMessages
const TARGET = "div[role='feed']"
const IGNORED = "article.Post--hidden"

export class MessagesHandler extends MutationHandler {
    constructor() {
        super(KEY, TARGET, IGNORED)
    }
}

export async function hideMessages() {
    await new MessagesHandler().hide()
}
