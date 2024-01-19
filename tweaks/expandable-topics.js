(async () => {
    if (!Object.values(
        await chrome.storage.sync.get(
                {'Expandable Topics': true}
            )
        )[0]
    )
    return;

    const styles = document.createElement('style');
    styles.innerHTML = /*css*/`  
        /*.raZwr > div:nth-of-type(1) > div {
            padding-left: 0px;
        }*/
    
        [aria-label~="Topic"][data-open="false"]  div:nth-of-type(2) {
            display:none;
        }

        [aria-label~="Topic"]  a {
            width: initial !important;
            margin-left: 1ch;
        }

        [aria-label~="Topic"] > div:nth-of-type(1) a:hover {
            text-decoration: underline;
        }

        [aria-label~="Topic"] > div:nth-of-type(1) > div::before {
            color: #3c4043;
            position: absolute;
        }

        [aria-label~="Topic"][data-open="false"] > div:nth-of-type(1) > div::before {
        content: '▸'; 
        }

        [aria-label~="Topic"][data-open="true"] > div:nth-of-type(1) > div::before {
            content: '▾';         
        }
    `;
    document.head.appendChild(styles);

    const checkForTopics = new MutationObserver(() => {
        if (document.title.indexOf('Classwork') === -1)
            return;

        const topics = document.querySelectorAll('[aria-label~="Topic"]:has(h2)');

        if (topics.length === 0)
            return;

        topics.forEach((topic) => {
            if (topic.hasAttribute('data-open'))
                return;

            topic.setAttribute('data-open', false);

            topic.querySelector('div:nth-of-type(1)')
                .addEventListener('click', (e) => {
                    console.log(e.target);
                    e.stopPropagation();
                    topic.setAttribute('data-open', (topic.getAttribute('data-open') === "false"));
                });

            topic.querySelector('a + div')
                .addEventListener('click', (e) => {
                    e.stopPropagation();
                });
        });
    })

    checkForTopics.observe(document.querySelector('body'), { childList: true, subtree: true });
})();
