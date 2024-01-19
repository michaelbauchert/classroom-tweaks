let switches = {};

async function initializeState() {
    const syncedTweaks = [
        'Contextual Class Links',
        'Expandable Topics',
        'Skip to Grading Page Links',
        'Grading Page Keyboard Shortcuts',
    ];

    const tweaksUl = document.getElementById("tweaks");
    syncedTweaks.forEach(async (tweak) => {
        const li = document.createElement('li');

        const element = document.createElement('generic-switch');
        element.innerHTML = tweak;
        await chrome.storage.sync.get({[tweak]: true })
                                 .then((result) => element.checked = Object.values(result)[0]);
        element.addEventListener('checked-changed', (e) => {
            chrome.storage.sync.set({[e.target.innerHTML]: e.detail});  
            refreshButton.style.display = 'initial';      
        });
        switches[tweak] = element; 

        li.appendChild(element);
        tweaksUl.appendChild(li);
    });
}

initializeState();

const refreshButton = document.getElementById('refresh');
refreshButton.addEventListener('click', (e) => {
    chrome.tabs.query({ url: "https://classroom.google.com/*" }, tabs => {
        tabs.forEach(tab => {
        chrome.tabs.reload(tab.id);
      });
    });
    refreshButton.style.display = 'none';
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if( key in tweaks ) {
            switches[key].checked = Object.values(newValue)[0];
        }         
    }
});
