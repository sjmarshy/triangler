export default function rgb2hex(rgb) {
    return rgb && rgb.length === 3
        ? '#' +
          ('0' + rgb[0].toString(16)).slice(-2) +
          ('0' + rgb[1].toString(16)).slice(-2) +
          ('0' + rgb[2].toString(16)).slice(-2)
        : ''
}
