import {MessagesTypes, StorageKeys} from "@/constants";
import {GetStorageValue, SetStorageValue} from "@/functions";

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tab.url?.includes('forum.exbo.net')) {
            console.log(tab.url)
            if (tab.url === 'https://forum.exbo.net/') {
                chrome.tabs.sendMessage(tabId, MessagesTypes.DeleteDiscussionsSubscribe, (response) => {
                    response?.error ? console.log(response) : null;
                });
            }
            if (tab.url?.includes('https://forum.exbo.net/d/')) {
                chrome.tabs.sendMessage(tabId, MessagesTypes.DeleteMessagesInDiscussions, (response) => {
                    response?.error ? console.log(response) : null;
                });
            }
            if (tab.url === 'https://forum.exbo.net/ignoredUsers') {
                chrome.tabs.sendMessage(tabId, MessagesTypes.CollectIgnoredUsers, (response) => {
                    response?.error ? console.log(response) : null;
                });
            }
        }
    }
)

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        await Promise.allSettled([
            async () => {
                if (await GetStorageValue(StorageKeys.HideDiscussions) === undefined) {
                    await SetStorageValue(StorageKeys.HideDiscussions, true);
                }
            },
            async () => {
                if (await GetStorageValue(StorageKeys.HideMessages) === undefined) {
                    await SetStorageValue(StorageKeys.HideMessages, true);
                }
            },
            async () => {
                if (await GetStorageValue(StorageKeys.HideNotifications) === undefined) {
                    await SetStorageValue(StorageKeys.HideNotifications, true);
                }
            },
        ]);
    } else if (details.reason === "update") {

    }
});