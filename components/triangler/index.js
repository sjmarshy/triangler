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
        console.log('go');
        const img = document.createElement('img');
        img.crossOrigin = 'Anonymous';

        img.addEventListener('load', this.initCanvas);

        img.src = src;

        this.setState(old =>
            Object.assign({}, old, {
                imgDataStale: true,
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

        this.image();
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

        for (
            let x = 0;
            x < canvas.width + triangleWidth;
            x += triangleWidth / 2
        ) {
            for (
                let y = 0;
                y < canvas.height + triangleHeight;
                y += triangleHeight
            ) {
                const rawData = this.imgDataForSquare(
                    x - Math.floor(triangleWidth / 4),
                    y + Math.floor(triangleHeight / 4),
                    Math.floor(triangleWidth / 2),
                    Math.floor(triangleHeight / 2)
                );

                const bareSqu = rawData.filter(isRGBANotBlack);
                const squ = bareSqu.length > 0 ? bareSqu : [[0, 0, 0]];

                const color = tweak(rgb2hex(averageRGBForArea(squ)));

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
            flipped = !flipped;
        }
        console.timeEnd('triangling');
    }

    render() {
        if (this.props.active) {
            this.triangle();
        } else {
            this.image();
        }
        return <div ref={d => (this.container = d)} />;
    }
}

export default pure(Triangler);
