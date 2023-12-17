

// Ensure the DOM content is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', (event) => {
// Function to create and display the menu overlay with fade-in animation
function showMenuOverlay() {
    const chatDisplay = document.getElementById('chat-display');
    const menuOverlay = document.createElement('div');
    menuOverlay.id = 'menu-overlay';
    menuOverlay.innerHTML = `
        <div id="menu-content">
            <h2>Menu</h2>
            <ul>
                <li class="menu-item">User Settings</li>
                <ul>
                    <li class="menu-item">Note Settings</li>
                    <li class="menu-item">Event Settings</li>
                    <li class="menu-item">Task Settings</li>
                </ul>
                <li class="menu-item">System Settings</li>
                <ul>
                    <li class="menu-item" id="clear-data">Clear Data</li>
                </ul>
            </ul>
        </div>
    `;
    menuOverlay.classList.add('menu-overlay');
    menuOverlay.onclick = hideMenuOverlay; // Hide overlay on click anywhere on the overlay
    menuOverlay.querySelector('#menu-content').onclick = function(event) {
        event.stopPropagation(); // Prevents the overlay from closing when clicking on menu-content
    };
    document.getElementById('clear-data').onclick = function() {
        if (window.confirm('Are you sure you want to clear all data?')) {
            localStorage.clear();
            location.reload();
        }
    };
    chatDisplay.appendChild(menuOverlay);
    setTimeout(() => { menuOverlay.style.opacity = '1'; }, 10); // Trigger fade-in
}

// Function to remove the menu overlay with fade-out animation
function hideMenuOverlay() {
    const menuOverlay = document.getElementById('menu-overlay');
    if (menuOverlay) {
        menuOverlay.style.opacity = '0';
        setTimeout(() => { menuOverlay.remove(); }, 300); // Wait for fade-out to complete
    }
}

const menuButton = document.getElementById('menu-button');
if (menuButton) {
    menuButton.addEventListener('click', showMenuOverlay);
} else {
    console.error("'menu-button' does not exist in the DOM.");
}
document.getElementById('menu-button').addEventListener('click', showMenuOverlay);
});
