import styled from 'styled-components';

import Triangler from '../components/triangler';

const StyledButton = styled.button`
    width: 700px;
    border-radius: 0;
    background-color: #0288d1;
    color: #263238;
    font-size: 16px;
    font-weight: 800;
    border: none;
    padding: 10px;
    margin-bottom: 10px;
`;

export default class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            triangler: true,
            animate: false,
            img: '/static/test.jpg',
            nextImg: '',
            triangle: {
                w: 40,
                h: 75,
            },
        };

        this.toggle = this.toggle.bind(this);
        this.animate = this.animate.bind(this);
        this.setImage = this.setImage.bind(this);
        this.nextImg = this.nextImg.bind(this);
    }

    triangleWidth(w) {
        this.setState(old =>
            Object.assign({}, old, {
                triangler: false,
                triangle: Object.assign({}, old.triangle, { w }),
            })
        );
    }

    triangleHeight(h) {
        this.setState(old =>
            Object.assign({}, old, {
                triangler: false,
                triangle: Object.assign({}, old.triangle, { h }),
            })
        );
    }

    nextImg(e) {
        const nextImg = e.target.value;
        this.setState(old => Object.assign({}, old, { nextImg }));
    }

    setImage(img) {
        this.setState(old => Object.assign({}, old, { img, triangler: false }));
    }

    toggle() {
        this.setState(old =>
            Object.assign({}, old, {
                triangler: !old.triangler,
            })
        );
    }

    animate() {
        this.setState(old =>
            Object.assign({}, old, {
                animate: !old.animate,
            })
        );
    }

    render() {
        return (
            <div>
                <div>
                    <label>add a URL to see with another image</label>
                    <br />
                    <input
                        value={this.state.nextImg}
                        onChange={this.nextImg}
                        type="text"
                    />
                    <button onClick={() => this.setImage(this.state.nextImg)}>
                        change image
                    </button>
                </div>
                <div>
                    <label>
                        triangle width: {this.state.triangle.w}
                    </label>
                    <input
                        type="range"
                        onChange={e =>
                            this.triangleWidth(parseInt(e.target.value, 10))}
                        value={this.state.triangle.w}
                        min={10}
                    />
                    <br />
                    <label>
                        triangle height: {this.state.triangle.h}
                    </label>
                    <input
                        type="range"
                        onChange={e =>
                            this.triangleHeight(parseInt(e.target.value, 10))}
                        min={10}
                        value={this.state.triangle.h}
                    />
                </div>
                <p>
                    NOTE: changing the above will turn the Triangler off. That's
                    totes on purpose. Just turn it back on again. And remember,
                    bigger triangles means a faster response time
                </p>
                <StyledButton onClick={this.toggle}>
                    Trianglify: {this.state.triangler.toString()}
                </StyledButton>
                <br />
                <StyledButton onClick={this.animate}>
                    Animation: {this.state.animate.toString()}
                </StyledButton>
                <Triangler
                    src={this.state.img}
                    triWidth={this.state.triangle.w}
                    triHeight={this.state.triangle.h}
                    active={this.state.triangler}
                    animate={this.state.animate}
                />
            </div>
        );
    }
}
