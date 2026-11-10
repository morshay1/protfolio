import { drawGlow } from "./glow.js";
import { createButterflies, drawButterflies } from "./butterfly.js";
import { revealLogo } from "./logo.js";

const canvas = document.getElementById("butterfly-animation");
const ctx = canvas.getContext("2d");

// Animation settings
const DURATION = 6000;
const FADE_START = 3000;
const FADE_END = 5000;

const INITIAL_RADIUS = 35;
const GROWTH_SPEED = 180;

const butterflies = createButterflies();

let startTime = null;

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    butterflies.forEach(butterfly => {
        butterfly.path = null;
        butterfly.trail = [];
    });
}

function animate(time) {
    if (startTime === null) {
        startTime = time;
    }

    const elapsed = time - startTime;
    const progress = Math.min(elapsed / DURATION, 1);

    // Fade the animation effects between 3s and 5s
    const fadeProgress = Math.max(
        0,
        Math.min((elapsed - FADE_START) / (FADE_END - FADE_START), 1)
    );

    const opacity = 1 - fadeProgress;

    // Always start with a black background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (elapsed < FADE_END) {
        ctx.save();
        ctx.globalAlpha = opacity;

        const intensity = 0.15 + progress * 0.85;
        const radius = INITIAL_RADIUS + (elapsed / 1000) * GROWTH_SPEED;

        drawGlow(ctx, intensity, radius);
        drawButterflies(ctx, butterflies, progress, time);

        ctx.restore();
    }

    // Reveal logo after effects disappear
    if (elapsed >= FADE_END) {
        revealLogo();
    }

    // Stop the animation after 6 seconds
    if (elapsed < DURATION) {
        requestAnimationFrame(animate);
    }
}

resizeCanvas();
requestAnimationFrame(animate);

window.addEventListener("resize", resizeCanvas);