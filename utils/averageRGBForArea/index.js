const red = rgba => rgba[0];
const green = rgba => rgba[1];
const blue = rgba => rgba[2];

const average = xs => xs.reduce((a, b) => a + b, 0) / xs.length;

const averageColor = (xs, colorGetter) =>
    Math.floor(average(xs.map(colorGetter)));

const averageRGBForArea = xs => [
    averageColor(xs, red),
    averageColor(xs, green),
    averageColor(xs, blue),
];

export default averageRGBForArea;
