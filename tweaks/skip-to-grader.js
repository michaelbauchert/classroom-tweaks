(async () => {
    if (!Object.values(
        await chrome.storage.sync.get(
                {'Skip to Grading Page Links': true}
            )
        )[0]
    )
        return;

    const styles = document.createElement('style');
    styles.innerHTML = /*css*/`    
        .grade-skipper {
            font-family: "Google Sans",Roboto,Arial,sans-serif;
            font-size: .875rem;
            letter-spacing: .0107142857em;
            font-weight: 500;
            background: #1a73e8;
            color: #fff;
            border-radius: 4px;
            width: 100%;
            padding: 3px 28px;
        }

        .grade-skipper:hover {
            background: #2c7eea;
        }

        [data-guided-help-id="gradebookReturnAllMenuGh"] > div:nth-of-type(2) > div:nth-of-type(2) {
            padding-bottom: 6px;
        }
    `;
    document.head.appendChild(styles);

    const checkForAssignmentLinks = new MutationObserver(() => {
        if (document.title.indexOf('gradebook') === -1)
            return;

        const tableHeaderContainers = document.querySelectorAll('[data-guided-help-id="gradebookReturnAllMenuGh"]');

        if (tableHeaderContainers.length === 0)
            return;

       tableHeaderContainers.forEach((container) => {
            const link = container.querySelector('div > div > a');
            if (container.querySelector('.grade-skipper') || link.href.includes('/sa/'))
                return;

            const href = link.getAttribute('href')
                .replace('/c/', '/g/tg/')
                .replace('/a/', '/')
                .split('/submissions/')[0]

            const skipLink = document.createElement('a');
            skipLink.setAttribute('href', href);
            skipLink.innerHTML = 'Grade';
            skipLink.classList.add("grade-skipper")

            container.appendChild(skipLink);
        });
    })

    checkForAssignmentLinks.observe(document.querySelector('body'), { childList: true, subtree: true });

    function dissconnect() {
        checkForAssignmentLinks.disconnect();
    }
})();