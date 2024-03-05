import { MessagesTypes } from "@/constants"

chrome.tabs.onUpdated.addListener(function (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
) {
    if (changeInfo.status === "complete") {
        const url = new URL(tab.url!)

        if (url.hostname === "forum.exbo.net") {
            let message: MessagesTypes | null = null

            if (url.href === "https://forum.exbo.net/") {
                message = MessagesTypes.DeleteDiscussionsSubscribe
            } else if (url.pathname.startsWith("/d/")) {
                message = MessagesTypes.DeleteMessagesInDiscussions
            } else if (url.pathname === "/ignoredUsers") {
                message = MessagesTypes.CollectIgnoredUsers
            }

            if (message) {
                chrome.tabs.sendMessage(tabId, message)
            }
        }
    }
})
