import {ClassTypes, StorageKeys} from "@/constants";
import { MessagesTypes } from "@/constants";
import {GetStorageValue, SetStorageValue} from "@/functions";

console.log('True Ignore активирован!');

// Удаление дискуссий
async function HideDiscussions() {
    let feed: Element = document.getElementsByClassName('DiscussionList-discussions')[0];
    let discussionCount: number = -1;
    let isCleaningNow: boolean = false;

    const interval = setInterval(async () => {
        if (feed === undefined || (feed && feed.classList.contains(ClassTypes.HasEvent))) {
            feed = document.getElementsByClassName('DiscussionList-discussions')[0];
        } else {
            feed.classList.add(ClassTypes.HasEvent)
            const result: boolean = await GetStorageValue(StorageKeys.HideDiscussions);
            if (result) {
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
            clearInterval(interval);
        }
    }, 16.6667);

    function hideIgnoredDiscussions() {
        if (feed.childNodes.length === discussionCount)
            return;

        const dataIdsToDelete: string[] = [];

        console.log('Поиск непотребных дискуссий...');
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
            console.log('Удаление непотребных дискуссий...');

            elemsToHide.forEach((elem) => {
                elem.style.display = 'none';
                elem.classList.add(ClassTypes.HideElement);
            });

            console.log('Непотребные дискуссии удалены!');
        }

        discussionCount = feed.childNodes.length;
    }
}

// Удаление сообщений в дискуссиях
async function HideMessagesInDiscussions() {
    let messagesFeed: Element = document.getElementsByClassName('PostStream')[0];
    let messagesCount: number = -1;
    let isCleaningNow: boolean = false;

    const interval = setInterval(async () => {
        if (messagesFeed === undefined || (messagesFeed && messagesFeed.classList.contains(ClassTypes.HasEvent))) {
            messagesFeed = document.getElementsByClassName('PostStream')[0];
        } else {
            messagesFeed.classList.add(ClassTypes.HasEvent);
            const result: boolean = await GetStorageValue(StorageKeys.HideMessages);
            if (result) {
                hideMessages();
                const observer = new MutationObserver(mutationList =>
                    mutationList
                        .filter(m => m.type === 'childList')
                        .forEach(m => {
                            m.addedNodes.forEach(() => {
                                if (isCleaningNow)
                                    return;

                                isCleaningNow = true;
                                hideMessages();
                                isCleaningNow = false;
                            });
                        }));
                observer.observe(messagesFeed, {childList: true, subtree: true});
            } else {
                console.log('Удаление сообщений выключено.')
            }
            clearInterval(interval);
        }
    }, 16.6667);

    function hideMessages() {
        if (messagesFeed.childNodes.length === messagesCount)
            return;


        const dataIdsToDelete: string[] = [];

        console.log('Поиск непотребных сообщений...');
        messagesFeed.childNodes.forEach((div) => {
            const _div: HTMLDivElement = div as HTMLDivElement;
            if (_div.getElementsByClassName('Post--hidden')[0] && _div.dataset?.id) {
                dataIdsToDelete.push(_div.dataset.id);
            }
        });

        const elemsToHide: HTMLDivElement[] = [];
        dataIdsToDelete.forEach((dataId: string) => {
            const elem = document.querySelector(`[data-id="${dataId}"]`);
            if (elem && !elem.classList.contains(ClassTypes.HideElement))
                elemsToHide.push(elem as HTMLDivElement);
        });

        if (elemsToHide.length > 0) {
            console.log('Удаление непотребных сообщений...');

            elemsToHide.forEach((elem) => {
                elem.style.display = 'none';
                elem.classList.add(ClassTypes.HideElement);
            });

            console.log('Непотребные сообщения удалены!');
        }

        messagesCount = messagesFeed .childNodes.length;
    }
}

// Сбор инфы о том кто заблокирован
async function CollectIgnoredUsers() {
    let secsToTry = 10;
    const intervalTimeInSec = 0.1666667;
    const interval = setInterval(async () => {
        if (secsToTry <= 0) {
            clearInterval(interval);
        } else {
            secsToTry -= intervalTimeInSec;
        }
        const table = document.getElementsByClassName('NotificationGrid')[0]
        if (table) {
            const names: string[] = []
            for (let aTag of table.getElementsByTagName('a')) {
                names.push(aTag.innerText.replaceAll(' ', ''));
            }
            console.log(await SetStorageValue(StorageKeys.IgnoredUsers, names));
            clearInterval(interval);
        }
    }, intervalTimeInSec * 1000);
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
            await HideMessagesInDiscussions(); // как доделаю
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
