import { StorageKeys, SwitchTypes } from "@/constants";

async function SwitchValues(elemId: string, switchType: number) {
    const elem = document.getElementById(elemId);
    if (elem === null || switchType === -1)
        throw new Error("Incorrect elemId or switchType!");

    async function invertAndSync(key: string): Promise<boolean> {
        let result = await chrome.storage.sync.get([key]);
        result[key] = !result[key];
        return await chrome.storage.sync.set(result).then(() => result[key]);
    }

    switch (switchType) {
        case SwitchTypes.HideDiscussions: {
            await invertAndSync(StorageKeys.HideDiscussions);
            break;
        }
        case SwitchTypes.HideMessages: {
            await invertAndSync(StorageKeys.HideMessages)
            break;
        }
        default: {
            throw new Error("Incorrect switchType!");
        }
    }
}

async function GetSyncValueByKey(key: string) {
    return (await chrome.storage.sync.get([key]))[key];
}

const init = async () => {
    // Дискуссии
    const togglePostsId = 'toggle-posts';
    const togglePosts = document.getElementById(togglePostsId)! as HTMLInputElement;

    if (await GetSyncValueByKey(StorageKeys.HideDiscussions) === undefined) {
        const obj: any = {};
        obj[StorageKeys.HideDiscussions] = true;
        await chrome.storage.sync.set(obj);
    }

    if (await GetSyncValueByKey(StorageKeys.HideDiscussions) === true && togglePosts) {
        togglePosts.checked = true;
    }

    if (togglePosts) {
        togglePosts.addEventListener('change', (event: Event) => {
            const isChecked = (event.target as HTMLInputElement).checked;
            if (isChecked) {
                SwitchValues(togglePostsId, SwitchTypes.HideDiscussions);
            } else {
                SwitchValues(togglePostsId, SwitchTypes.HideDiscussions);
            }
        });
    }

    // Сообщения
    const toggleMessagesId = 'toggle-messages';
    const toggleMessages = document.getElementById(toggleMessagesId)! as HTMLInputElement;

    if (await GetSyncValueByKey(StorageKeys.HideMessages) === undefined) {
        const obj: any = {};
        obj[StorageKeys.HideMessages] = true;
        await chrome.storage.sync.set(obj);
    }

    if (await GetSyncValueByKey(StorageKeys.HideMessages) === true && toggleMessages) {
        toggleMessages.checked = true;
    }

    if (toggleMessages) {
        toggleMessages.addEventListener('change', (event: Event) => {
            const isChecked = (event.target as HTMLInputElement).checked;
            if (isChecked) {
                SwitchValues(toggleMessagesId, SwitchTypes.HideMessages);
            } else {
                SwitchValues(toggleMessagesId, SwitchTypes.HideMessages);
            }
        });
    }
}

init();
