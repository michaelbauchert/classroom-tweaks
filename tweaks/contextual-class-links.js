(async () => {
    if (!Object.values(
            await chrome.storage.sync.get(
                    {'Contextual Class Links': true}
                )
            )[0]
        )
        return;
    
    const changeSidebarLinks = new MutationObserver(() => {
        const selectedTabLink = document.querySelector('div.wZTANe a[aria-label$="(selected)"]');
        if (selectedTabLink === null)
            return;

        const selectedTabLabel = selectedTabLink.getAttribute('aria-label');
        if (!['Stream', 'Classwork', 'People', 'Grades'].some((label) => selectedTabLabel.includes(label)))
            return;

        const selectedTabSplit = selectedTabLink.getAttribute('href').split('/');

        const classLinks = document.querySelectorAll('a.TMOcX');

        classLinks.forEach((link) => {
            const classId = link.getAttribute('href').split('/')[2];
            let newLink = selectedTabSplit;
            newLink[2] = classId;

            link.setAttribute('href', newLink.join('/'));
        });
    });

    changeSidebarLinks.observe(document.querySelector('body'), { childList: true, subtree: true });
})();