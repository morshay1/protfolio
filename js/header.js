
const header = document.querySelector("header");
const headerTrigger = document.querySelector(".header-trigger");

function revealHeader() {
    header.classList.add("visible");
}

// Reveal when hovering over the hidden header area
headerTrigger.addEventListener("mouseenter", revealHeader);

// Reveal when scrolling
window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
        revealHeader();
    }
}, { passive: true });
