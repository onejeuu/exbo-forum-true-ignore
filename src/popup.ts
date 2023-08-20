export const StorageKeys = {
    HideDiscussions: "hideDiscussions",
    HideUsersInDiscussions: "hideUsersInDiscussions"
}

const SwitchTypes = {
    HideDiscussions: 0,
    HideUsersInDiscussions: 1,
}

const ClassTypes = {
    activated: "on",
    deactivated: "off"
}

async function SwitchValues(elemId: string, switchType: number) {
    const elem = document.getElementById(elemId);
    if (elem === null || switchType === -1)
        throw new Error("Incorrect elemId or switchType!");

    async function invertAndSync(key: string): Promise<boolean> {
        let result = await chrome.storage.sync.get([key]);
        result[key] = !result[key];

        const newValue: boolean = await chrome.storage.sync.set(result).then(() => result[key]);
        return newValue;
    }

    let result: boolean;
    switch (switchType) {
        case SwitchTypes.HideDiscussions: {
            result = await invertAndSync(StorageKeys.HideDiscussions);
            break;
        }
        case SwitchTypes.HideUsersInDiscussions: {
            result = await invertAndSync(StorageKeys.HideUsersInDiscussions)
            break;
        }
        default: {
            throw new Error("Incorrect switchType!");
        }
    }

    if (result) {
        elem.classList.remove(ClassTypes.deactivated);
        elem.classList.add(ClassTypes.activated);
    } else {
        elem.classList.remove(ClassTypes.activated);
        elem.classList.add(ClassTypes.deactivated);
    }
}

async function GetSyncValueByKey(key = '') {
    return (await chrome.storage.sync.get([key]))[key];
}

const hrefIDsAndLinks: string[][] = [
    ['razrab_vk', 'https://vk.com/grafonmeister'],
    ['razrab_youtube', 'https://www.youtube.com/@newgrafon5185'],
    ['razrab_github', 'https://github.com/NewGrafon'],
    ['sclab_vk', 'https://vk.com/stalcraftlab'],
    ['sclab_github', 'https://github.com/Stalcraft-Dev-Team'],
]

const init = async () => {

    if (await GetSyncValueByKey(StorageKeys.HideDiscussions) === undefined) {
        const obj = {};
        // @ts-ignore
        obj[StorageKeys.HideDiscussions] = true;
        await chrome.storage.sync.set(obj);
    }


    const hdKey = 'hd';
    let hd = document.getElementById(hdKey);
    if (hd && !hd.classList.contains('hasEvent')) {
        hd.classList.add('hasEvent');
        hd.addEventListener('click', () => {
            SwitchValues(hdKey, SwitchTypes.HideDiscussions);
        })
        hd.classList.add(await GetSyncValueByKey(StorageKeys.HideDiscussions) ? ClassTypes.activated : ClassTypes.deactivated);
    }


    // links
    hrefIDsAndLinks.forEach(arr => {
        let elem = document.getElementById(arr[0]);
        if (elem && !elem.classList.contains('hasEvent')) {
            elem.classList.add('hasEvent');
            elem.addEventListener('click', () => {
                chrome.tabs.create({ url: arr[1] }, (tab) => {})
            });
        }
    })
}

init();