import { pure } from 'recompose';
import chunk from 'lodash/chunk';

import isRGBANotBlack from '../../utils/isRGBANotBlack';
import tweak from '../../utils/tweak';
import rgb2hex from '../../utils/rgb2hex';
import averageRGBForArea from '../../utils/averageRGBForArea';
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
        };

        this.triangle = this.triangle.bind(this);
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
        if (this.props.src !== nextProps.src) {
            this.loadImage(nextProps.src);
        }
    }

    loadImage(src) {
        const img = document.createElement('img');
        img.crossOrigin = 'Anonymous';

        img.addEventListener('load', this.initCanvas);

        img.src = src;

        this.setState(old =>
            Object.assign({}, old, {
                img: img,
            })
        );
    }

    initCanvas() {
        const { canvas, img } = this.state;

        canvas.width = img.width;
        canvas.height = img.height;

        this.image();
    }

    image() {
        const { canvas, img } = this.state;

        if (!canvas || !img) {
            return;
        }

        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    }

    triangle() {
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
                const rawData = ctx.getImageData(
                    x - triangleWidth / 2,
                    y,
                    triangleWidth,
                    triangleHeight
                ).data;

                const bareSqu = chunk(rawData, 4).filter(isRGBANotBlack);
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
    }

    render() {
        console.log(this.props);

        if (this.props.active) {
            this.triangle();
        } else {
            this.image();
        }

        return <div ref={d => (this.container = d)} />;
    }
}

export default pure(Triangler);
