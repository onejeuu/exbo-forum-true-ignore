import { StorageKey } from "@/constants"
import { Storage } from "@/storage"

export async function updateIgnoredUsers() {
    const usernames = await collectIgnoredUsers()
    await Storage.set(StorageKey.IgnoredUsers, usernames)
    window.alert("True Ignore\nСписок игнорируемых пользователей успешно обновлен.")
}

async function collectIgnoredUsers() {
    const table = document.querySelector("table.NotificationGrid")!
    const spans = table.querySelectorAll("span.username")

    let usernames: string[] = Array.from(spans, (span) => span.textContent || "").filter(
        (username) => username.trim() !== ""
    )

    return usernames
}
