const MessagesTypes = {
    DeleteDiscussionsSubscribe: "deleteDiscussionsSubscribe",
    DeleteMessagesInDiscussions: "deleteMessagesInDiscussions",
    CollectIgnoredUsers: "collectIgnoredUsers",
}
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete') {
            console.log(tab.url)
            if (tab.url === 'https://forum.exbo.net/') {
                chrome.tabs.sendMessage(tabId, MessagesTypes.DeleteDiscussionsSubscribe, (response) => {
                    console.log(response);
                });
            }
            if (tab.url?.includes('https://forum.exbo.net/d/')) {
                chrome.tabs.sendMessage(tabId, MessagesTypes.DeleteMessagesInDiscussions, (response) => {
                    console.log(response);
                });
            }
            if (tab.url === 'https://forum.exbo.net/ignoredUsers') {
                chrome.tabs.sendMessage(tabId, MessagesTypes.CollectIgnoredUsers, (response) => {
                    console.log(response);
                });
            }
        }
    }
)