import { MutationHandler } from "./base"
import { StorageKey } from "@/constants"

const KEY = StorageKey.HideDiscussions
const TARGET = "ul[role='feed']"
const IGNORED = "li.item-user-discussion-ignored"

export class DiscussionsHandler extends MutationHandler {
    constructor() {
        super(KEY, TARGET, IGNORED)
    }
}

export async function hideDiscussions() {
    await new DiscussionsHandler().start()
}
