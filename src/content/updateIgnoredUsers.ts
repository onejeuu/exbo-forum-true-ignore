import { StorageKey } from "@/constants"
import { Storage } from "@/storage"

export async function updateIgnoredUsers() {
    const usernames = collectIgnoredUsers()
    await Storage.set(StorageKey.IgnoredUsers, usernames)
    window.alert("True Ignore\nСписок игнорируемых пользователей успешно обновлен.")
}

export function collectIgnoredUsers(): string[] {
    const table = document.querySelector("table.NotificationGrid")!

    const usernamesValues = table.querySelectorAll("span.username")

    const usernames: string[] = Array.from(usernamesValues, (span) => span.textContent || "").filter(
        (username) => username.trim() !== ""
    )

    return usernames
}
