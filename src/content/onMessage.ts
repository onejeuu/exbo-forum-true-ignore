import { MessagesType } from "@/constants"

import { hideDiscussions } from "./handlers/discussions"
import { hideMessages } from "./handlers/messages"
import { hideReplies } from "./handlers/replies"
import { hideRepliesPreview } from "./handlers/repliesPreview"
import { updateIgnoredUsers } from "./updateIgnoredUsers"

chrome.runtime.onMessage.addListener(async (message: string, sender: chrome.runtime.MessageSender) => {
    switch (message) {
        case MessagesType.HideDiscussions: {
            await hideDiscussions()
            break
        }
        case MessagesType.HidePosts: {
            await hideMessages()
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
