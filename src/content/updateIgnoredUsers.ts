import { StorageKey } from "@/constants"
import { SetStorageValue } from "@/storage"

export async function updateIgnoredUsers() {
    const usernames = collectIgnoredUsers()
    await SetStorageValue(StorageKey.IgnoredUsers, usernames)
}

export function collectIgnoredUsers(): string[] {
    const table = document.querySelector("table.NotificationGrid")!

    const usernamesValues = table.querySelectorAll("span.username")

    const usernames: string[] = Array.from(usernamesValues, (span) => span.textContent || "").filter(
        (username) => username.trim() !== ""
    )

    return usernames
}
