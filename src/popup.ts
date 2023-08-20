export const StorageKeys = {
    HideDiscussions: "hideDiscussions",
    HideUsersInDiscussions: "hideUsersInDiscussions"
}

const SwitchTypes = {
    HideDiscussions: 0,
    HideUsersInDiscussions: 1,
}

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
        case SwitchTypes.HideUsersInDiscussions: {
            await invertAndSync(StorageKeys.HideUsersInDiscussions)
            break;
        }
        default: {
            throw new Error("Incorrect switchType!");
        }
    }
}

async function GetSyncValueByKey(key = '') {
    return (await chrome.storage.sync.get([key]))[key];
}

const init = async () => {
    const elementId = 'toggle-posts';
    const togglePosts = document.getElementById(elementId)! as HTMLInputElement;

    if (await GetSyncValueByKey(StorageKeys.HideDiscussions) === undefined) {
        const obj = {};
        // @ts-ignore
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
                SwitchValues(elementId, SwitchTypes.HideDiscussions);
            } else {
                SwitchValues(elementId, SwitchTypes.HideDiscussions);
            }
        });
    }
}

init();
