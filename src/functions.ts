export async function GetStorageValue(key: string) {
    return (await chrome.storage.local.get([key]))[key];
}

export async function SetStorageValue(key: string, value: any) {
    const obj: any = {};
    obj[key] = value;
    await chrome.storage.local.set(obj)
    return value;
}