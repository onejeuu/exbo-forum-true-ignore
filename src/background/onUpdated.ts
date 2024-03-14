import { MessagesType } from "@/constants"

chrome.tabs.onUpdated.addListener(function (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
) {
    if (changeInfo.status === "complete") {
        if (!tab.url) return
        const url = new URL(tab.url)

        if (url.hostname === "forum.exbo.net") {
            let message: MessagesType | null = null

            if (url.href === "https://forum.exbo.net/") {
                message = MessagesType.HandleDiscussions
            } else if (url.pathname.startsWith("/d/")) {
                message = MessagesType.HandlePosts
            } else if (url.pathname === "/ignoredUsers") {
                message = MessagesType.UpdateIgnoredUsers
            }

            if (message) {
                chrome.tabs.sendMessage(tabId, message)
            }
        }
    }
})
