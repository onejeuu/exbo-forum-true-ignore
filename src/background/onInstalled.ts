import { StorageKeys } from "@/constants"
import { SetDefaultStorageValue } from "@/storage"

chrome.runtime.onInstalled.addListener(async (details: chrome.runtime.InstalledDetails) => {
    if (details.reason === "install") {
        for (const key of Object.values(StorageKeys)) {
            await SetDefaultStorageValue(key, true)
        }
    }
})
