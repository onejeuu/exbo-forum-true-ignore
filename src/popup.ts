import { StorageKeys, SwitchTypes } from "@/constants";
import {GetStorageValue, SetStorageValue} from "@/functions";

async function SwitchValues(elemId: string, switchType: number) {
    const elem = document.getElementById(elemId);
    if (elem === null || switchType === -1)
        throw new Error("Incorrect elemId or switchType!");

    async function invertAndSync(key: string): Promise<boolean> {
        return await SetStorageValue(key, !(await GetStorageValue(key)));
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

const init = async () => {
    // Дискуссии
    const togglePostsId = 'toggle-posts';
    const togglePosts = document.getElementById(togglePostsId)! as HTMLInputElement;

    if (await GetStorageValue(StorageKeys.HideDiscussions) === undefined) {
        await SetStorageValue(StorageKeys.HideDiscussions, true);
    }

    if (await GetStorageValue(StorageKeys.HideDiscussions) === true && togglePosts) {
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

    if (await GetStorageValue(StorageKeys.HideMessages) === undefined) {
        await SetStorageValue(StorageKeys.HideMessages, true);
    }

    if (await GetStorageValue(StorageKeys.HideMessages) === true && toggleMessages) {
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
