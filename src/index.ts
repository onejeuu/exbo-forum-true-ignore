import {ClassTypes, StorageKeys} from "@/constants";
import { MessagesTypes } from "@/constants";

console.log('True Ignore активирован!');

// Удаление дискуссий
async function HideDiscussions() {
    let feed: Element = document.getElementsByClassName('DiscussionList-discussions')[0];
    let discussionCount: number = -1;
    let isCleaningNow: boolean = false;

    const interval = setInterval(() => {
        if (feed === undefined || (feed && feed.classList.contains(ClassTypes.HasEvent))) {
            feed = document.getElementsByClassName('DiscussionList-discussions')[0];
        } else {
            feed.classList.add(ClassTypes.HasEvent)
            chrome.storage.sync.get([StorageKeys.HideDiscussions])
                .then((result) => {
                    if (result[StorageKeys.HideDiscussions]) {
                        hideIgnoredDiscussions();

                        const observer = new MutationObserver(mutationList =>
                            mutationList
                                .filter(m => m.type === 'childList')
                                .forEach(m => {
                                    m.addedNodes.forEach(() => {
                                        if (isCleaningNow)
                                            return;

                                        isCleaningNow = true;
                                        hideIgnoredDiscussions();
                                        isCleaningNow = false;
                                    });
                                }));
                        observer.observe(feed, {childList: true, subtree: true});
                    } else {
                        console.log('Удаление дискуссий выключено.')
                    }
                })

            clearInterval(interval);
        }
    }, 16.6667);

    function hideIgnoredDiscussions() {
        if (feed.childNodes.length === discussionCount)
            return;

        const dataIdsToDelete: string[] = [];

        console.log('Поиск непотребств...');
        feed.childNodes.forEach((li) => {
            const _li: HTMLLIElement = li as HTMLLIElement;
            if (_li.getElementsByClassName('item-user-discussion-ignored')[0] && _li.dataset?.id) {
                dataIdsToDelete.push(_li.dataset.id);
            }
        });

        const elemsToHide: HTMLLIElement[] = [];
        dataIdsToDelete.forEach((dataId: string) => {
            const elem = document.querySelector(`[data-id="${dataId}"]`);
            if (elem && !elem.classList.contains(ClassTypes.HideElement))
            elemsToHide.push(elem as HTMLLIElement);
        });

        if (elemsToHide.length > 0) {
            console.log('Удаление непотребств...');

            elemsToHide.forEach((elem) => {
                elem.style.display = 'none';
                elem.classList.add(ClassTypes.HideElement);
            });

            console.log('Непотребства удалены!');
        }

        discussionCount = feed.childNodes.length;
    }
}

// Сбор инфы о том кто заблокирован
async function CollectIgnoredUsers() {
    let secsToTry = 10;
    const intervalTimeInSec = 1;
    const interval = setInterval(() => {
        if (secsToTry <= 0) {
            clearInterval(interval);
        } else {
            secsToTry -= intervalTimeInSec;
        }
        const table = document.getElementsByClassName('NotificationGrid')[0]
        if (table) {
            const ATags = table.getElementsByTagName('a');
            console.log(ATags)
            clearInterval(interval);
        }
    }, intervalTimeInSec * 1000)
}

// Удаление сообщений в дискуссиях
async function DeleteMessagesInDiscussions() {
    let feed: Element = document.getElementsByClassName('PostStream')[0];
    let messagesCount: number = -1;

    let isCleaningNow: boolean = false;

    if (feed) {
        chrome.storage.sync.get([StorageKeys.HideMessages])
            .then((result) => {
                if (result[StorageKeys.HideMessages]) {
                    deleteMessages();

                    const observer = new MutationObserver(mutationList =>
                        mutationList
                            .filter(m => m.type === 'childList')
                            .forEach(m => {
                                m.addedNodes.forEach(() => {
                                    if (isCleaningNow)
                                        return;

                                    isCleaningNow = true;
                                    deleteMessages();
                                    isCleaningNow = false;
                                });
                            }));
                    observer.observe(feed, {childList: true, subtree: true});
                } else {
                    console.log('Удаление сообщений выключено.')
                }
            })
    }

    function deleteMessages() {
        if (feed.childNodes.length === messagesCount)
            return;

        const dataIdsToDelete: string[] = [];

        console.log('Поиск непотребных сообщений...');
        feed.childNodes.forEach((div) => {
            const _div: HTMLDivElement = div as HTMLDivElement;
            if (_div.getElementsByClassName('Post--hidden')[0] && _div.dataset?.id) {
                dataIdsToDelete.push(_div.dataset.id);
            }
        });

        if (dataIdsToDelete.length > 0) {
            console.log('Удаление непотребных сообщений...');

            dataIdsToDelete.forEach((dataId: string) => {
                document.querySelector(`[data-id="${dataId}"]`)?.remove();
            });

            console.log('Непотребные сообщения удалены!');
        }

        messagesCount = feed.childNodes.length;
    }
}

// Чтение сообщений c service_worker
chrome.runtime.onMessage.addListener(async (message: string, sender, sendResponse) => {
    const response = {result: true, error: ''};
    switch (message) {
        case MessagesTypes.DeleteDiscussionsSubscribe: {
            await HideDiscussions();
            break;
        }
        case MessagesTypes.DeleteMessagesInDiscussions: {
            // await DeleteMessagesInDiscussions(); // как доделаю
            break;
        }
        case MessagesTypes.CollectIgnoredUsers: {
            await CollectIgnoredUsers();
            break;
        }
        default: {
            response.result = false;
            response.error = 'Incorrect message type';
            throw new Error('Incorrect message type');
        }
    }

    await sendResponse(response);
});