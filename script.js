function isPastTense(word) {
    return word.endsWith('ed') || word.endsWith('d');
}

function getSettings() {}

function handleInputFocus() {
    const entryBox = document.getElementById('entry-box');
    if (!entryBox.value.trim()) {
        entryBox.value = '- ';
    }
    entryBox.focus();
}

function modifyInputPrefix(prefix) {
    const entryBox = document.getElementById('entry-box');
    let entryText = entryBox.value.trim();

    if (!entryText) {
        entryBox.value = prefix + ' ';
    } else {
        const specialPrefixes = ['+', 'o', '-', '!'];
        const isPrefixed = specialPrefixes.includes(entryText[0]);
        entryBox.value = isPrefixed ? prefix + ' ' + entryText.slice(2) : prefix + ' ' + entryText;
    }
    entryBox.focus();
}

function toggleStyle(event) {
    const entry = event.target;
    const styleStates = ['normal', 'bold'];

    let currentState = entry.getAttribute('data-style-state') || 'normal';
    let newStateIndex = (styleStates.indexOf(currentState) + 1) % styleStates.length;
    let newState = styleStates[newStateIndex];

    switch (newState) {
        case 'bold':
            entry.style.fontWeight = 'bold';
            entry.style.fontStyle = 'normal';
            break;
        case 'italic':
            entry.style.fontStyle = 'italic';
            entry.style.fontWeight = 'normal';
            break;
        case 'bold-italic':
            entry.style.fontWeight = 'bold';
            entry.style.fontStyle = 'italic';
            break;
        default:
            entry.style.fontWeight = 'normal';
            entry.style.fontStyle = 'normal';
    }

    entry.setAttribute('data-style-state', newState);
    saveNotes();
}

function removeEntry(event) {
    event.target.remove();
    saveNotes();
}

let history = [];

function addEntry() {
    const entryBox = document.getElementById('entry-box');
    let entryText = entryBox.value.trim();

    if (!entryText) {
        return;
    }

    const specialPrefixes = ['+', 'o', '-'];
    let prefix = entryText[0];

    if (!specialPrefixes.includes(prefix)) {
        prefix = '-';
        entryText = entryText;
    } else {
        entryText = entryText.slice(2).trim();
    }

    if (history.length >= 50) {
        history.shift();
    }

    history.push(entryText);

    const chatDisplay = document.getElementById('chat-display');
    const newEntry = document.createElement('div');
    newEntry.textContent = `${prefix} ${entryText}`;
    newEntry.onclick = toggleStyle;
    newEntry.ondblclick = removeEntry;
    chatDisplay.appendChild(newEntry);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;

    entryBox.value = `${prefix} `;
    saveNotes();
}

document.getElementById('entry-box').addEventListener('focus', handleInputFocus);
document.getElementById('task-button').addEventListener('click', () => modifyInputPrefix('+'));
document.getElementById('event-button').addEventListener('click', () => modifyInputPrefix('o'));
document.getElementById('note-button').addEventListener('click', () => modifyInputPrefix('-'));
document.getElementById('enter-button').addEventListener('click', addEntry);
document.getElementById('entry-box').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addEntry();
    }
});

function saveNotes() {
    const chatDisplay = document.getElementById('chat-display');
    const notes = Array.from(chatDisplay.children).map(entry => {
        const textContent = entry.textContent.trim();
        const type = textContent[0];
        const text = textContent.slice(2);
        const time = new Date().toISOString();
        const style = entry.getAttribute('data-style-state') || 'normal';

        return { type, text, time, style };
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    const chatDisplay = document.getElementById('chat-display');
    const savedNotes = JSON.parse(localStorage.getItem('notes'));

    if (savedNotes) {
        savedNotes.forEach(note => {
            const newEntry = document.createElement('div');
            newEntry.textContent = `${note.type} ${note.text}`;

            if (note.style.includes('bold')) {
                newEntry.style.fontWeight = 'bold';
            }

            newEntry.onclick = toggleStyle;
            newEntry.ondblclick = removeEntry;

            chatDisplay.appendChild(newEntry);
        });
    }
}

function showMenu() {
    const existingMenu = document.getElementById('menu-overlay');
    if (existingMenu) {
        hideMenu(existingMenu);
        return;
    }
    const menu = document.createElement('div');
    menu.id = 'menu-overlay';
    menu.innerHTML = `
        <div id="menu-content">
            <h2>Menu</h2>
            <ul>
                <li>User Settings</li>
                <li>- Settings</li>
                <li>o Settings</li>
                <li>+ Settings</li>
                <li id="clear-data">&#128465; Clear Data</li>
            </ul>
        </div>`;
    menu.style.transform = 'translateY(100%)';
    document.getElementById('chat-display').appendChild(menu);
    setTimeout(() => {
        menu.style.transform = 'translateY(0)';
    }, 10);
    menu.addEventListener('click', (e) => {
        if (e.target.id === 'clear-data') {
            if (window.confirm('Are you sure you want to clear all data?')) {
                localStorage.clear();
                location.reload();
            }
        } else {
            hideMenu(menu);
        }
    });
    const chatDisplay = document.getElementById('chat-display');
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function hideMenu(menuElement) {
    menuElement.style.transform = 'translateY(100%)';
    setTimeout(() => {
        menuElement.remove();
    }, 300);
}

document.getElementById('menu-button').addEventListener('click', showMenu);

document.addEventListener('DOMContentLoaded', (event) => {
    loadNotes();
});