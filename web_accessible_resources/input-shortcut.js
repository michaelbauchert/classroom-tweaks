const template = /*html*/`
<button title="Clear shortcut">
    <svg width="20" height="20" viewBox="0 0 20 20" class="" aria-hidden="true">
        <path d="M4.09 4.22l.06-.07a.5.5 0 01.63-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 01.63-.06l.07.06c.18.17.2.44.06.63l-.06.07L10.71 10l5.14 5.15c.18.17.2.44.06.63l-.06.07a.5.5 0 01-.63.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 01-.63.06l-.07-.06a.5.5 0 01-.06-.63l.06-.07L9.29 10 4.15 4.85a.5.5 0 01-.06-.63l.06-.07-.06.07z"
            fill-rule="nonzero"></path>
    </svg>
</button>
<input aria-label="Type a shortcut that will Activate " 
    type="text" 
    placeholder="Type a shortcut">


<style>
	:host {	
        display: inline-block;	
		margin: 0;
        display: flex;
        box-sizing: border-box;
        flex-direction: row;
		width: min-content;
		gap: 8px;		
	}

	input, button {
		font-family: Roboto,Arial,sans-serif;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: .2px;
        line-height: 20px;
		border: none;
		color: rgba(0,0,0,.87);
		fill: rgba(0,0,0,.87);
		width: 15ch;
	}

	input {
		border-radius: 4px;
        border: 2px solid #dadce0;
		box-shadow: 0px 4px 0px rgba(0,0,0,.5);
        margin: 0;
        padding: 5px;
		text-transform: capitalize;
		text-align: center;
	}

	button {
		visibility: hidden;
		align-self: center;
		height: 40px;
		width: 40px;
		border-radius: 4px;
		background: transparent;		
		padding: 8px;
	}

	button:hover {
		background: #f9f9f9;
	}

	button:active {
		background: #d6d6d6;
	}

	button.visible {
		visibility: visible;
	}

	svg {
		stroke: rgba(0,0,0,.87);
		height: 100%;
		width: 100%;
	}	
</style>
`;

class InputShortcut extends HTMLElement {
    defaultshortcut;
	shortcut;
    savedShortcut;

    #shadow;    
    #button;
    #input;
    constructor() {
      super();
      this.#shadow = this.attachShadow({ mode: "open" });
      this.#shadow.innerHTML = DOMPurify.sanitize(template, {RETURN_TRUSTED_TYPE: true});
    }
    
    connectedCallback() {
        this.defaultshortcut = this.getAttribute('defaultshortcut') ?? "";        


        this.#button = this.#shadow.querySelector('button');
        this.#button.addEventListener('click', () => {
            this.#updateShortcut(this.defaultshortcut);
			this.#emitEvent();
        });

        this.#input = this.#shadow.querySelector('input');
        this.#input.addEventListener('blur', this.#blur.bind(this));
        this.#input.addEventListener('focus', this.#focus.bind(this));
        this.#input.addEventListener('keydown', this.#keydown.bind(this));

		this.#updateShortcut(this.getAttribute('shortcut') ?? this.defaultshortcut);
		this.savedShortcut = this.shortcut;
    }

    #updateShortcut(newShortcut) {
        this.shortcut = newShortcut;
        this.#input.value = newShortcut;

        if(this.shortcut !== "" && this.shortcut !== this.defaultshortcut) {
            this.#button.classList.add('visible');
        } else {
            this.#button.classList.remove('visible');
        }        
    }

	set shortcut(newShortcut) {
		console.log('changing')
		this.#updateShortcut(newShortcut);
	}

    #focus(e) {
		this.savedShortcut = this.shortcut;
		this.#updateShortcut("");
	}

	#blur(e) {
		if(this.shortcut === "")
            this.#updateShortcut(this.savedShortcut);
	}

	#keydown(e) {
		if(e.key !== "Tab")
			e.preventDefault();

		if(e.key === "Escape") {
			this.#updateShortcut(this.savedShortcut);
			e.target.blur();
			this.#button.focus();
			return;
		}
		
		const allowed = ['-','=','/','Home','End'];
		if (!(allowed.some((key) => key === e.key) || e.key.match(/\w/) && e.key.length === 1))
			return;
		
        this.#updateShortcut(e.key);
        e.target.blur();
        this.#button.focus();    
		
		this.#emitEvent();
	}

	#emitEvent() {
		const event = new CustomEvent("shortcut-input", { detail: {
			id: this.id,
			shortcut: this.shortcut
		}});
        this.dispatchEvent(event);
	}
}

customElements.define("input-shortcut", InputShortcut);