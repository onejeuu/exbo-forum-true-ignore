import { StorageKey } from "@/constants"
import { SetDefaultStorageValue } from "@/storage"

chrome.runtime.onInstalled.addListener(async (details: chrome.runtime.InstalledDetails) => {
    if (details.reason === "install") {
        await SetDefaultStorageValue(StorageKey.HideDiscussions, true)
        await SetDefaultStorageValue(StorageKey.HideMessages, true)
        await SetDefaultStorageValue(StorageKey.HideReplies, true)
    }
})
