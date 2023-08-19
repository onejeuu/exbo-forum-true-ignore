console.log('True Ignore активирован!');


// Удаление дискуссий
let feed: Element = document.getElementsByClassName('DiscussionList-discussions')[0];
let discussionCount: number = -1;

let isCleaningNow: boolean = false;

if (feed) {
    deleteIgnoredDiscussions();

    const observer = new MutationObserver(mutationList =>
        mutationList
            .filter(m => m.type === 'childList')
            .forEach(m => {
                m.addedNodes.forEach(() => {
                    if (isCleaningNow)
                        return;

                    isCleaningNow = true;
                    deleteIgnoredDiscussions();
                    isCleaningNow = false;
                });
            }));
    observer.observe(feed, {childList: true, subtree: true});
}

function deleteIgnoredDiscussions() {
    console.log();
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

    if (dataIdsToDelete.length > 0) {
        console.log('Удаление непотребств...');

        dataIdsToDelete.forEach((dataId: string) => {
            document.querySelector(`[data-id="${dataId}"]`)?.remove();
        });

        console.log('Непотребства удалены!');
    }

    discussionCount = feed.childNodes.length;
}