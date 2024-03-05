import { ClassTypes, StorageKeys, intervalTickrate } from "@/constants"
import { GetStorageValue } from "@/storage"

export async function HideDiscussions() {
    let feed: Element = document.getElementsByClassName("DiscussionList-discussions")[0]
    let discussionCount: number = -1
    let isCleaningNow: boolean = false

    const interval = setInterval(async () => {
        if (feed === undefined || (feed && feed.classList.contains(ClassTypes.HasEvent))) {
            feed = document.getElementsByClassName("DiscussionList-discussions")[0]
        } else {
            feed.classList.add(ClassTypes.HasEvent)
            const result: boolean = await GetStorageValue(StorageKeys.HideDiscussions)
            if (result) {
                hideIgnoredDiscussions()
                const observer = new MutationObserver((mutationList) =>
                    mutationList
                        .filter((m) => m.type === "childList")
                        .forEach((m) => {
                            m.addedNodes.forEach(() => {
                                if (isCleaningNow) return

                                isCleaningNow = true
                                hideIgnoredDiscussions()
                                isCleaningNow = false
                            })
                        })
                )
                observer.observe(feed, { childList: true, subtree: true })
            } else {
                console.log("Удаление дискуссий выключено.")
            }
            clearInterval(interval)
        }
    }, intervalTickrate)

    function hideIgnoredDiscussions() {
        // if (feed.childNodes.length === discussionCount)
        //     return;
        // Тут пока баг, если вернуть то жопа

        const dataIdsToDelete: string[] = []

        console.log("Поиск непотребных дискуссий...")
        feed.childNodes.forEach((li) => {
            const _li: HTMLLIElement = li as HTMLLIElement
            if (_li.getElementsByClassName("item-user-discussion-ignored")[0] && _li.dataset?.id) {
                dataIdsToDelete.push(_li.dataset.id)
            }
        })

        const elemsToHide: HTMLLIElement[] = []
        dataIdsToDelete.forEach((dataId: string) => {
            const elem = document.querySelector(`[data-id="${dataId}"]`)
            if (elem && !elem.classList.contains(ClassTypes.HideElement)) elemsToHide.push(elem as HTMLLIElement)
        })

        if (elemsToHide.length > 0) {
            console.log("Удаление непотребных дискуссий...")

            elemsToHide.forEach((elem) => {
                elem.style.display = "none"
                elem.classList.add(ClassTypes.HideElement)
            })

            console.log("Непотребные дискуссии удалены!")
        }

        discussionCount = feed.childNodes.length
    }
}
