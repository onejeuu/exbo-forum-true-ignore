import { ClassTypes, StorageKeys, intervalTickrate } from "@/constants"
import { GetStorageValue } from "@/storage"

export async function HideNotifications() {
    if ((await GetStorageValue(StorageKeys.HideNotifications)) === false) {
        console.log("Удаление уведомлений отключено.")
        return
    }

    const ignoredUsers: string[] = await GetStorageValue(StorageKeys.IgnoredUsers)
    if (!ignoredUsers || ignoredUsers.length === 0) {
        console.log("Не собран список игнорируемых пользователей.")
        return
    }

    const interval = setInterval(async () => {
        const li_container = document.querySelector(".item-notifications")
        if (li_container && !li_container.classList.contains(ClassTypes.HasEvent)) {
            clearInterval(interval)
            li_container.classList.add(ClassTypes.HasEvent)
            li_container.addEventListener("click", async (event) => {
                const dropdown = li_container.querySelector(".NotificationsDropdown")
                const isOpen: boolean = !dropdown?.classList.contains("open")
                if (dropdown && isOpen) {
                    let content: Element
                    let notificationsCount: number = -1
                    let isCleaningNow: boolean = false
                    const interval = setInterval(() => {
                        if (content === undefined || (content && content.classList.contains(ClassTypes.HasEvent))) {
                            content = dropdown.querySelector(".NotificationList-content") as Element
                        } else {
                            content.classList.add(ClassTypes.HasEvent)
                            clearNotifications()

                            const observer = new MutationObserver((mutationList) =>
                                mutationList
                                    .filter((m) => m.type === "childList")
                                    .forEach((m) => {
                                        m.addedNodes.forEach(() => {
                                            if (isCleaningNow) return

                                            isCleaningNow = true
                                            clearNotifications()
                                            isCleaningNow = false
                                        })
                                    })
                            )
                            observer.observe(content, {
                                childList: true,
                                subtree: false,
                            })

                            clearInterval(interval)
                        }
                    }, intervalTickrate)

                    function clearNotifications() {
                        if (content.childNodes.length === notificationsCount) return

                        console.log("Поиск непотребных уведомлений...")
                        const groups = content.getElementsByClassName("NotificationGroup")
                        content.querySelector(".hiddenHighElem")?.remove()
                        for (let group of groups) {
                            console.log(group)
                            const badges = group.querySelector(".NotificationGroup-badges")
                            const badgesLIs = badges?.querySelectorAll("li")
                            if (badgesLIs) {
                                let deleteConfirmed: boolean = false
                                let isPrivate: boolean = false
                                let userIgnored: boolean = false
                                for (let badgesLI of badgesLIs) {
                                    if (badgesLI.classList.contains("item-user-discussion-ignored")) {
                                        userIgnored = true
                                    }
                                    if (badgesLI.classList.contains("item-private")) {
                                        isPrivate = true
                                    }
                                }

                                if (isPrivate && userIgnored) {
                                    deleteConfirmed = true
                                    console.log(`Удалено уведомление от переписки с заблокированным пользователем`)
                                    group.classList.add(ClassTypes.HideElement)
                                    // @ts-ignore
                                    group.style.display = "none"
                                    break
                                }

                                if (deleteConfirmed) {
                                    continue
                                }
                            }

                            const users = group.querySelector(".NotificationGroup-content")
                            const LIs = users?.getElementsByTagName("li")
                            if (users && LIs) {
                                let hiddenNotificationsCount: number = 0
                                for (let li of LIs) {
                                    const username = li?.querySelector(".username")?.innerHTML as string
                                    if (
                                        !li.classList.contains(ClassTypes.HideElement) &&
                                        ignoredUsers.includes(username)
                                    ) {
                                        hiddenNotificationsCount += 1
                                        console.log(`Удалено уведомление от ${username}`)
                                        li.classList.add(ClassTypes.HideElement)
                                        li.style.display = "none"
                                    }
                                }

                                if (LIs.length === hiddenNotificationsCount) {
                                    group.classList.add(ClassTypes.HideElement)
                                    // @ts-ignore
                                    group.style.display = "none"
                                }
                            }
                        }

                        const contentHeight = content.getBoundingClientRect().height
                        const maxContentHeightInPx = document.documentElement.clientHeight * 0.7
                        if (contentHeight < maxContentHeightInPx) {
                            const hiddenHighElem = document.createElement("div")
                            hiddenHighElem.classList.add("hiddenHighElem")
                            hiddenHighElem.style.height = `${maxContentHeightInPx - contentHeight}px`
                            hiddenHighElem.style.opacity = "0"
                            const lastGroup = groups.item(groups.length - 1)
                            lastGroup?.after(hiddenHighElem)
                        }

                        notificationsCount = content.childNodes.length
                    }
                }
            })
        }
    }, intervalTickrate)
}
