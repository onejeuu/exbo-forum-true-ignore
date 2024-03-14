import { MessagesType } from "@/constants"

import { hideDiscussions } from "./handlers/discussions"
import { hidePosts } from "./handlers/posts"
import { hideReplies } from "./handlers/replies"
import { hideRepliesPreview } from "./handlers/repliesPreview"
import { updateIgnoredUsers } from "./updateIgnoredUsers"

chrome.runtime.onMessage.addListener(async (message: string, sender: chrome.runtime.MessageSender) => {
    switch (message) {
        case MessagesType.HandleDiscussions: {
            await hideDiscussions()
            break
        }
        case MessagesType.HandlePosts: {
            await hidePosts()
            await hideReplies()
            await hideRepliesPreview()
            break
        }
        case MessagesType.UpdateIgnoredUsers: {
            await updateIgnoredUsers()
            break
        }
    }
})
