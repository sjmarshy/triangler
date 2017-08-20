import { pure } from 'recompose';
import chunk from 'lodash/chunk';

import isRGBANotBlack from '../../utils/isRGBANotBlack';
import tweak from '../../utils/tweak';
import rgb2hex from '../../utils/rgb2hex';
import averageRGBForArea, { test } from '../../utils/averageRGBForArea';
import {
    filledTriangle,
    flippedFilledTriangle,
} from '../../utils/canvasTriangles';

class Triangler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            img: null,
            canvas: null,
            imgData: null,
        };

        this.initCanvas = this.initCanvas.bind(this);
        this.triangle = this.triangle.bind(this);
    }

    componentDidMount() {
        const canvas = document.createElement('canvas');

        this.container.append(canvas);

        this.setState(old =>
            Object.assign({}, old, {
                canvas: canvas,
            })
        );

        this.loadImage(this.props.src);
    }

    componentWillReceiveProps(nextProps) {
        console.time('propSwap');
        if (this.props.src !== nextProps.src) {
            this.loadImage(nextProps.src);
        }
        console.timeEnd('propSwap');
    }

    loadImage(src) {
        console.time('imageLoad');
        const img = document.createElement('img');
        img.crossOrigin = 'Anonymous';

        img.addEventListener('load', this.initCanvas);
        img.addEventListener('error', () => {
            this.setState({
                error: true,
            });
        });

        img.src = src;

        this.setState(old =>
            Object.assign({}, old, {
                img: img,
            })
        );
    }

    initCanvas() {
        console.timeEnd('imageLoad');
        const { canvas, img } = this.state;

        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        if (img.width > 0 && img.height > 0) {
            this.setState(old =>
                Object.assign({}, old, {
                    imgData: chunk(
                        ctx.getImageData(0, 0, img.width, img.height).data,
                        4
                    ),
                })
            );
        }
    }

    image() {
        const { canvas, img } = this.state;

        if (!canvas || !img) {
            return;
        }

        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
    }

    imgDataForSquare(x, y, w, h) {
        const { imgData, canvas: { width: columns, height } } = this.state;
        const data = [];

        if (!imgData) {
            return data;
        }

        for (let x$ = x; x$ <= x + w; x$++) {
            for (let y$ = y; y$ <= y + h; y$++) {
                if (x$ < 0 || x$ > columns || y$ < 0 || y$ > height) {
                    data.push([0, 0, 0, 0]);
                } else {
                    data.push(imgData[y$ * columns + x$]);
                }
            }
        }

        return data;
    }

    triangle() {
        console.time('triangling');

        const {
            triWidth: triangleWidth,
            triHeight: triangleHeight,
        } = this.props;

        const { img, canvas } = this.state;

        if (!img || !canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        let flipped = true;

        const width = canvas.width + triangleWidth;
        const height = canvas.height + triangleHeight;

        const sampleOffsetX = Math.floor(triangleWidth / 4);
        const sampleOffsetY = Math.floor(triangleHeight / 4);
        const sampleWidth = Math.floor(triangleWidth / 2);
        const sampleHeight = Math.floor(triangleHeight / 2);

        for (let x = 0; x < width; x += triangleWidth / 2) {
            for (let y = 0; y < height; y += triangleHeight) {
                const rawData = this.imgDataForSquare(
                    x - sampleOffsetX,
                    y + sampleOffsetY,
                    sampleWidth,
                    sampleHeight
                );

                const triChance =
                    x + y === 0 ? 1 : 1 - (x + y) / (width + height) * 1.4;

                if (Math.random() < triChance) {
                    const bareSqu = rawData.filter(isRGBANotBlack);
                    const squ = bareSqu.length > 0 ? bareSqu : [[0, 0, 0]];

                    const color = tweak(rgb2hex(averageRGBForArea(squ)));
                    ctx.globalAlpha = Math.random();

                    if (flipped) {
                        flippedFilledTriangle(
                            x - triangleWidth / 2,
                            y,
                            triangleWidth,
                            triangleHeight,
                            color,
                            ctx
                        );
                    } else {
                        filledTriangle(
                            x - triangleWidth / 2,
                            y,
                            triangleWidth,
                            triangleHeight,
                            color,
                            ctx
                        );
                    }
                }
            }
            flipped = !flipped;
        }
        console.timeEnd('triangling');
        if (this.props.active && this.props.animate) {
            requestAnimationFrame(this.triangle);
        } else if (!this.props.active) {
            this.image();
        }
    }

    render() {
        if (this.state.error) {
            return <p>unable to render image</p>;
        }
        if (this.props.active && this.state.imgData) {
            this.triangle();
        } else {
            this.image();
        }
        return <div ref={d => (this.container = d)} />;
    }
}

export default pure(Triangler);
