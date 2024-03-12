import { StorageKey } from "@/constants"
import { Storage } from "@/storage"

chrome.runtime.onInstalled.addListener(async (details: chrome.runtime.InstalledDetails) => {
    if (details.reason === "install") {
        await Storage.setDefault(StorageKey.HideDiscussions, true)
        await Storage.setDefault(StorageKey.HidePosts, true)
        await Storage.setDefault(StorageKey.HideReplies, true)
    }
})
