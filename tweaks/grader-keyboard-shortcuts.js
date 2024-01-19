(async () => {
    if (!Object.values(
        await chrome.storage.sync.get(
                {'Grading Page Keyboard Shortcuts': true}
            )
        )[0]
    )
        return;

    const styles = document.createElement('style');
    styles.innerHTML = /*css*/`    
            /* Chrome, Safari, Edge, Opera */
            input[aria-label="Grade"]::-webkit-outer-spin-button,
            input[aria-label="Grade"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
            }
        
            /* Firefox */
            input[aria-label="Grade"] {
                -moz-appearance: textfield;
            }
        
            #showshortcuts {
                margin-right: 6px;
                padding-left: 24px;
                padding-right: 24px;
            }
        
            #showshortcuts:hover {
                background: #2c7eea !important;
            }
        
            #showshortcuts:focus {
                background: #5f9def !important;
            }
        
            dialog {
                border: none;
                display: revert !important;
                padding: 24px 16px 8px;
            }
        
            dialog::backdrop {
                background-color: rgba(0,0,0,.5);
            }
        
            dialog ul {
                padding-left: 0px;
            }
        
            dialog li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                list-style: none;
        
                gap: 48px;
                margin-bottom: 16px;
        
                color: rgba(0,0,0,.87);
                font-family: Roboto,Arial,sans-serif;
                line-height: 1.25rem;
                font-size: .875rem;
                letter-spacing: .0142857143em;
                font-weight: 400;
        
            }
        
            dialog header {
                margin: 0px !important;
            }
        
            dialog button {
                float: inline-end;
            }
        
        `;
    document.head.appendChild(styles);

    const purifyModule = document.createElement('script');
    purifyModule.type = "text/javascript";
    purifyModule.src = chrome.runtime.getURL('web_accessible_resources/purify.min.js');
    document.head.appendChild(purifyModule);

    const customElement = document.createElement('script');
    customElement.type = 'module';
    customElement.src = chrome.runtime.getURL('web_accessible_resources/input-shortcut.js');
    document.head.appendChild(customElement);

    let shortcuts, gradeInput;

    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key !== 'shortcuts')
                return;
            console.log(newValue)
            shortcuts = newValue;
            for (const [id, shortcut] of Object.entries(newValue)) {
                document.getElementById(id).shortcut = shortcut;
                console.log(document.getElementById(id).shortcut)
            }
        }
    });

    const setUpGradePage = new MutationObserver(async () => {
        gradeInput = document.querySelector('input[aria-label="Grade"]')
        gradeInput.type = "number";

        const defaultshortcuts = {
            /*'scroll-assignment-up': 'w',
            'scroll-assignment-down': 's',*/
            'previous-student': 'a',
            'next-student': 'd',
            'first-student': 'Home',
            'last-student': 'End',
            'change-grade': 'g',
            'leave-comment': 'c',        
        };

        await chrome.storage.sync.get({'shortcuts': defaultshortcuts})
                                 .then((result) => shortcuts = result.shortcuts);

        let shortcutHTML = ``;
        for (const [shortcut, key] of Object.entries(shortcuts)) {
            shortcutHTML += /*html*/`
                <li>
                    <label for='${shortcut}'>${shortcut.replaceAll('-', ' ')}</label>
                    <input-shortcut 
                        id='${shortcut}'
                        defaultshortcut='${defaultshortcuts[shortcut]}'  
                        shortcut='${key}' >
                    </input-shortcut>              
                </li>`
        }

        const dialog = document.createElement('dialog');
        dialog.classList.add('I7OXgf', 'zziILd', 't11m5e', 'ZEeHrd', 'Inn9w', 'iWO5td');
        dialog.innerHTML = /*html*/`
                <header class='Shk6y bEd2J'>Keyboard Shortcuts</header>
                <ul>
                    ${shortcutHTML}
                </ul>
                <button type="button"
                    class="uArJ5e UQuaGc kCyAyd l3F1ye ARrCac HvOprf evJWRb M9Bg4d">Close</button>
            `;
        document.body.append(dialog);
        dialog.addEventListener('click', function (event) {
            var rect = dialog.getBoundingClientRect();
            var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
                && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                dialog.close();
            }
        });
        dialog.addEventListener('keyup', (e) => e.stopPropagation());
        dialog.querySelector('button').addEventListener('click', () => dialog.close());

        function setShortcut(e) {
            shortcuts[e.detail.id] = e.detail.shortcut;
            chrome.storage.sync.set({ shortcuts });
        }

        document.querySelectorAll('input-shortcut')
            .forEach((element) => {
                element.addEventListener('shortcut-input', setShortcut);
            });

        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'showshortcuts';
        button.classList.add('uArJ5e', 'UQuaGc', 'Y5sE8d', 'gDg6Qc', 'M9Bg4d');
        button.innerHTML = 'Keyboard Shortcuts';
        document.querySelector('div:has(> div > #gbwa)').prepend(button);
        button.addEventListener('click', () => dialog.showModal());

        disconnect();
    });

    function disconnect() {
        setUpGradePage.disconnect();
    }

    setUpGradePage.observe(document.querySelector('body'), { childList: true, subtree: true });

    const gradeInputObserver = new MutationObserver(() => {
        gradeInput.focus();
        gradeInputObserver.disconnect();
    });

    window.addEventListener('keyup', (e) => {
        if (e.target.matches('textarea'))
            return;

        //remove focus from inputs, wait for change, refocus

        //non-navigation shortcuts
        switch(e.key.toLocaleLowerCase()) {
            case shortcuts['leave-comment']:
                document.querySelector('textarea[jscontroller="RKFxf"]').focus();
                return;
            case shortcuts['change-grade']:
                document.querySelector('input[aria-label="Grade"]').focus();
                return;
            /*case shortcuts['scroll-assignment-up']:
                document.querySelector('iframe#material-iframe').contentWindow.scrollBy(0, -100);
                return;
            case shortcuts['scroll-assignment-down']:
                document.querySelector('iframe#material-iframe').contentWindow.scrollBy(0, 100);
                return; */  
        }

        //navigation shortcuts
        function awaitGradeInputUpdate() {
            if(document.activeElement === gradeInput) {
                gradeInput.blur();
                gradeInputObserver.observe(gradeInput, { attributes: true });
            }
        }  
        
        function triggerNavigationButton(selector, attribute) {
            const button = document.querySelector(selector);
            if(button.getAttribute(attribute) === 'true')
                return;

            awaitGradeInputUpdate();
            button.click();
        }

        function triggerListedStudent(selector) {
            document.querySelector('div[jsname="LgbsSe"]').click();            
            setTimeout(
                () => triggerNavigationButton(selector, 'aria-checked'),
                200
            );
        }
        
        switch (e.key.toLowerCase()) {
            case shortcuts['previous-student']:
                triggerNavigationButton('div[aria-label^="Select the previous student"]', 'aria-disabled');
                break;
            case shortcuts['next-student']:
                triggerNavigationButton('div[aria-label^="Select the next student"]', 'aria-disabled');
                break;            
            case shortcuts['first-student']:
                triggerListedStudent('div[jsname="WQIUif"] [role="menuitemradio"]:first-of-type');
                break;
            case shortcuts['last-student']:
                triggerListedStudent('div[jsname="WQIUif"] [role="menuitemradio"]:last-of-type');
                break;
        }
    });
})();


