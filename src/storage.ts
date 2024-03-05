export function GetStorageValue(key: string): Promise<any> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key])
        })
    })
}

export function SetStorageValue(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
        const data = { [key]: value }
        chrome.storage.local.set(data, () => {
            resolve()
        })
    })
}

export function ToggleStorageValue(key: string): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            const currentValue = result[key]
            const newValue = !currentValue

            const data = { [key]: newValue }

            chrome.storage.local.set(data, () => {
                resolve()
            })
        })
    })
}

export function SetDefaultStorageValue(key: string, newValue: any): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            const currentValue = result[key]

            if (currentValue === undefined) {
                const data = { [key]: newValue }

                chrome.storage.local.set(data, () => {
                    resolve()
                })
            }
        })
    })
}
