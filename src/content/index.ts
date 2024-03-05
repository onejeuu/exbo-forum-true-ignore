import { MessagesTypes, intervalTickrate } from "@/constants"

import { HideNotifications } from "./hideNotifications"
import { HideDiscussions } from "./hideDiscussions"
import { HideMessagesInDiscussions } from "./hideMessagesInDiscussions"
import { CollectIgnoredUsers } from "./collectIgnoredUsers"

chrome.runtime.onMessage.addListener(async (message: string, sender: chrome.runtime.MessageSender) => {
    setTimeout(async () => {
        HideNotifications()

        switch (message) {
            case MessagesTypes.DeleteDiscussionsSubscribe: {
                await HideDiscussions()
                break
            }
            case MessagesTypes.DeleteMessagesInDiscussions: {
                await HideMessagesInDiscussions()
                break
            }
            case MessagesTypes.CollectIgnoredUsers: {
                await CollectIgnoredUsers()
                break
            }
        }
    }, intervalTickrate)
})
