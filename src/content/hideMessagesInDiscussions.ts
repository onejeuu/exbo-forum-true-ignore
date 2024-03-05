import { ClassTypes, StorageKeys, intervalTickrate } from "@/constants"
import { GetStorageValue } from "@/storage"

export async function HideMessagesInDiscussions() {
    let messagesFeed: Element = document.getElementsByClassName("PostStream")[0]
    let messagesCount: number = -1
    let isCleaningNow: boolean = false

    const interval = setInterval(async () => {
        if (messagesFeed === undefined || (messagesFeed && messagesFeed.classList.contains(ClassTypes.HasEvent))) {
            messagesFeed = document.getElementsByClassName("PostStream")[0]
        } else {
            messagesFeed.classList.add(ClassTypes.HasEvent)
            const result: boolean = await GetStorageValue(StorageKeys.HideMessages)
            if (result) {
                hideMessages()
                const observer = new MutationObserver((mutationList) =>
                    mutationList
                        .filter((m) => m.type === "childList")
                        .forEach((m) => {
                            m.addedNodes.forEach(() => {
                                if (isCleaningNow) return

                                isCleaningNow = true
                                hideMessages()
                                isCleaningNow = false
                            })
                        })
                )
                observer.observe(messagesFeed, {
                    childList: true,
                    subtree: true,
                })
            } else {
                console.log("Удаление сообщений выключено.")
            }
            clearInterval(interval)
        }
    }, intervalTickrate)

    function hideMessages() {
        // if (messagesFeed.childNodes.length === messagesCount)
        //     return;
        // Тута пока баг, если вернуть то жопа

        const dataIdsToDelete: string[] = []

        console.log("Поиск непотребных сообщений...")
        messagesFeed.childNodes.forEach((div) => {
            const _div: HTMLDivElement = div as HTMLDivElement
            if (GetExtensionUserNickname() === GetMessageCreatorNickname(_div)) return

            if (_div.getElementsByClassName("Post--hidden")[0] && _div.dataset?.id) {
                dataIdsToDelete.push(_div.dataset.id)
            }
        })

        const elemsToHide: HTMLDivElement[] = []
        dataIdsToDelete.forEach((dataId: string) => {
            const elem = document.querySelector(`[data-id="${dataId}"]`)

            if (elem && !elem.classList.contains(ClassTypes.HideElement)) elemsToHide.push(elem as HTMLDivElement)
        })

        if (elemsToHide.length > 0) {
            console.log("Удаление непотребных сообщений...")

            elemsToHide.forEach((elem) => {
                elem.style.display = "none"
                elem.classList.add(ClassTypes.HideElement)
            })

            console.log("Непотребные сообщения удалены!")
        }

        messagesCount = messagesFeed.childNodes.length
    }
}

// Получить ник сообщения в дискуссии
function GetMessageCreatorNickname(div: HTMLDivElement): string {
    const postUserDiv = div.querySelector(".PostUser"),
        a = postUserDiv?.getElementsByTagName("a")[0],
        nickname: string = (a?.href || "/u/").split("/u/")[1]

    return nickname
}

// Получить ник пользователя расширения
function GetExtensionUserNickname(): string {
    return document.querySelector(".username")?.textContent || ""
}
