import { StorageKey } from "@/constants"
import { GetStorageValue, ToggleStorageValue } from "@/storage"

const handleToggle = async (elementId: string, storageKey: string) => {
    const toggle = document.getElementById(elementId)! as HTMLInputElement

    if (await GetStorageValue(storageKey)) {
        toggle.checked = true
    }

    toggle.addEventListener("change", async (event: Event) => {
        await ToggleStorageValue(storageKey)
    })
}

const init = async () => {
    await handleToggle("toggle-posts", StorageKey.HideDiscussions)
    await handleToggle("toggle-messages", StorageKey.HideMessages)
    await handleToggle("toggle-replies", StorageKey.HideReplies)
}

init()
