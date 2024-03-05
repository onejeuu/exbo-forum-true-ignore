import { StorageKeys, intervalTickrate } from "@/constants"
import { SetStorageValue } from "@/storage"

export async function CollectIgnoredUsers() {
    let secsToTry = 10
    const interval = setInterval(async () => {
        if (secsToTry <= 0) {
            clearInterval(interval)
        } else {
            secsToTry -= intervalTickrate / 1000
        }
        const table = document.getElementsByClassName("NotificationGrid")[0]
        if (table) {
            const names: string[] = []
            for (let aTag of table.getElementsByTagName("a")) {
                names.push(aTag.innerText.replaceAll(" ", ""))
            }
            clearInterval(interval)
            console.log(await SetStorageValue(StorageKeys.IgnoredUsers, names))
            window.alert(
                "Список игнорируемых пользователей собран.\nТеперь удаление уведомлений будет работать корректно."
            )
        }
    }, intervalTickrate)
}
