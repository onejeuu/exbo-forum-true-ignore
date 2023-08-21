import { MessagesTypes } from "@/constants";



chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete') {
            console.log(tab.url)
            if (tab.url === 'https://forum.exbo.net/') {
                chrome.tabs.sendMessage(tabId, MessagesTypes.DeleteDiscussionsSubscribe, (response) => {
                    response.error ? console.log(response) : null;
                });
            }
            if (tab.url?.includes('https://forum.exbo.net/d/')) {
                chrome.tabs.sendMessage(tabId, MessagesTypes.DeleteMessagesInDiscussions, (response) => {
                    response.error ? console.log(response) : null;
                });
            }
            if (tab.url === 'https://forum.exbo.net/ignoredUsers') {
                chrome.tabs.sendMessage(tabId, MessagesTypes.CollectIgnoredUsers, (response) => {
                    response.error ? console.log(response) : null;
                });
            }
        }
    }
)