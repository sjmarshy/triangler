const red = rgba => rgba[0];
const green = rgba => rgba[1];
const blue = rgba => rgba[2];

const average = xs => xs.reduce((a, b) => a + b, 0) / xs.length;

const averageColor = (xs, colorGetter) =>
    Math.floor(average(xs.map(colorGetter)));

const averageRGBForArea = xs =>
    xs
        .reduce(([sr, sg, sb], [r, g, b]) => [sr + r, sg + g, sb + b], [
            0,
            0,
            0,
        ])
        .map(sum => Math.floor(sum / xs.length));

export default averageRGBForArea;

export function test() {
    const area = [[1, 2, 3], [1, 2, 3], [1, 2, 3]];
    const expected = [1, 2, 3];
    const actual = averageRGBForArea(area);

    console.log('expected', expected);
    console.log('actual', actual);
}
