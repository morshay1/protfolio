const BUTTERFLY_FILES = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png"
];

const BUTTERFLY_COUNTS = [5,5,5,5,5,5,10];
const FLY_SPEED = 0.5;

function getStartingPosition(width, height) {
    const margin = 100;
    const side = Math.floor(Math.random() * 4);

    switch (side) {
        case 0:
            return { x: Math.random() * width, y: -margin };
        case 1:
            return { x: width + margin, y: Math.random() * height };
        case 2:
            return { x: Math.random() * width, y: height + margin };
        default:
            return { x: -margin, y: Math.random() * height };
    }
}

function bezierPoint(t, p0, p1, p2, p3) {
    const u = 1 - t;

    return u ** 3 * p0
        + 3 * u ** 2 * t * p1
        + 3 * u * t ** 2 * p2
        + t ** 3 * p3;
}

export function createButterflies() {
    const butterflies = [];

    // Load each image once
    const images = BUTTERFLY_FILES.map(filename => {
        const image = new Image();
        image.src = `images/butterflies/${filename}`;
        return image;
    });

    images.forEach((image, colorIndex) => {
        for (let i = 0; i < BUTTERFLY_COUNTS[colorIndex]; i++) {
            butterflies.push({
                image,
                size: 45 + Math.random() * 35,
                phase: Math.random() * Math.PI * 2,
                delay: Math.random() * 0.2,
                flutterSpeed: 0.004 + Math.random() * 0.004,
                path: null
            });
        }
    });

    return butterflies;
}

export function drawButterflies(ctx, butterflies, progress, time) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const centerX = width / 2;
    const centerY = height / 2;

    butterflies.forEach(butterfly => {
        const { image, size, phase, delay, flutterSpeed } = butterfly;

        if (!image.complete || image.naturalWidth === 0) return;

        // Create an individual path once
        if (!butterfly.path) {
            const start = getStartingPosition(width, height);

            butterfly.path = {
                start,
                control1: {
                    x: Math.random() * width,
                    y: Math.random() * height
                },
                control2: {
                    x: Math.random() * width,
                    y: Math.random() * height
                },
                end: {
                    x: centerX + (Math.random() - 0.5) * 40,
                    y: centerY + (Math.random() - 0.5) * 40
                }
            };
        }

        // Stagger their entrances
        const t = Math.max(
            0,
            Math.min(((progress - delay) / (1 - delay)) * FLY_SPEED, 1)
        );

        if (progress < delay) return;

        const { start, control1, control2, end } = butterfly.path;

        // Follow the curved path
        let x = bezierPoint(
            t, start.x, control1.x, control2.x, end.x
        );

        let y = bezierPoint(
            t, start.y, control1.y, control2.y, end.y
        );

        // Add gentle irregular flutter
        x += Math.sin(time * 0.001 + phase) * 12;
        y += Math.sin(time * 0.002 + phase) * 9;

        // Save the current position for the explosion
        butterfly.x = x;
        butterfly.y = y;

        // Keep size stable, then shrink near the end
        const shrinkProgress = Math.max(0, (t - 0.7) / 0.3);
        const scale = 1 - shrinkProgress;

        const butterflyWidth = size * scale;
        const butterflyHeight =
            butterflyWidth * image.naturalHeight / image.naturalWidth;

        // Flap wings
        const wingScale =
            0.2 + Math.abs(Math.sin(time * flutterSpeed + phase)) * 0.8;

        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(Math.sin(time * 0.003 + phase) * 0.2);
        ctx.scale(wingScale, 1);

        ctx.drawImage(
            image,
            -butterflyWidth / 2,
            -butterflyHeight / 2,
            butterflyWidth,
            butterflyHeight
        );

        ctx.restore();
    });
}