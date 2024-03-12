import { StorageKey } from "@/constants"
import { Storage } from "@/storage"

const handleToggle = async (elementId: string, storageKey: string) => {
    const toggle = document.getElementById(elementId)! as HTMLInputElement

    if (await Storage.get(storageKey)) {
        toggle.checked = true
    }

    toggle.addEventListener("change", async (event: Event) => {
        await Storage.toggle(storageKey)
    })
}

const init = async () => {
    await handleToggle("toggle-discussions", StorageKey.HideDiscussions)
    await handleToggle("toggle-posts", StorageKey.HidePosts)
    await handleToggle("toggle-replies", StorageKey.HideReplies)
}

init()
