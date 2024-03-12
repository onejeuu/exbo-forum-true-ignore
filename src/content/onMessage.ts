import { MessagesType } from "@/constants"

import { hideDiscussions } from "./handlers/discussions"
import { hideMessages } from "./handlers/messages"
import { hideReplies } from "./handlers/replies"
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
            break
        }
        case MessagesType.UpdateIgnoredUsers: {
            await updateIgnoredUsers()
            break
        }
    }
})
