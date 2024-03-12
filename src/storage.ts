export class Storage {
    static async get(key: string): Promise<any> {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (result) => {
                resolve(result[key])
            })
        })
    }

    static async set(key: string, value: any): Promise<void> {
        return new Promise((resolve) => {
            const data = { [key]: value }
            chrome.storage.local.set(data, () => {
                resolve()
            })
        })
    }

    static async toggle(key: string): Promise<void> {
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

    static async setDefault(key: string, newValue: any): Promise<void> {
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
}
