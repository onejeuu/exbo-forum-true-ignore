import { MutationHandler } from "./base"
import { StorageKey } from "@/constants"

const KEY = StorageKey.HidePosts
const TARGET = "div[role='feed']"
const IGNORED = "article.Post--hidden"

export class PostsHandler extends MutationHandler {
    constructor() {
        super(KEY, TARGET, IGNORED)
    }
}

export async function hidePosts() {
    await new PostsHandler().start()
}
