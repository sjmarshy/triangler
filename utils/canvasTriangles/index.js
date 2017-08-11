export function filledTriangle(x, y, w, h, color, ctx) {
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.fillStyle = color;
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();

    return ctx;
}

export function flippedFilledTriangle(x, y, w, h, color, ctx) {
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h);
    ctx.fillStyle = color;
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();

    return ctx;
}
