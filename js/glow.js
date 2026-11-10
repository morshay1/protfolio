
export function drawGlow(ctx, intensity, radius) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    const glow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
    );

    glow.addColorStop(
        0,
        `rgba(255, 250, 252, ${intensity})`
    );

    glow.addColorStop(
        0.12,
        `rgba(255, 225, 237, ${intensity * 0.95})`
    );

    glow.addColorStop(
        0.35,
        `rgba(255, 180, 210, ${intensity * 0.65})`
    );

    glow.addColorStop(
        0.65,
        `rgba(255, 145, 185, ${intensity * 0.25})`
    );

    glow.addColorStop(
        1,
        "rgba(255, 145, 185, 0)"
    );

    ctx.save();
    ctx.fillStyle = glow;
    ctx.fillRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );
    ctx.restore();
}

export function drawLightWash(ctx, progress) {
    // Start flooding the screen near the end
    const start = 0.72;
    const end = 0.95;

    let t = Math.max(
        0,
        Math.min((progress - start) / (end - start), 1)
    );

    // Smooth transition instead of sudden brightness
    t = t * t * (3 - 2 * t);

    ctx.save();

    ctx.globalAlpha = t;
    ctx.fillStyle = "#FFF8FC";

    ctx.fillRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );

    ctx.restore();
}
