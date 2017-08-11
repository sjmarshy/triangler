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
            triangler: false,
            img: '/static/test.jpg',
            nextImg: '',
        };

        this.toggle = this.toggle.bind(this);
        this.setImage = this.setImage.bind(this);
        this.nextImg = this.nextImg.bind(this);
    }

    nextImg(e) {
        const nextImg = e.target.value;
        this.setState(old => Object.assign({}, old, { nextImg }));
    }

    setImage(img) {
        console.log(img);
        this.setState(old => Object.assign({}, old, { img }));
    }

    toggle() {
        this.setState(old =>
            Object.assign({}, old, {
                triangler: !old.triangler,
            })
        );
    }

    render() {
        return (
            <div>
                <div>
                    <input
                        value={this.state.nextImg}
                        onChange={this.nextImg}
                        type="text"
                    />
                    <button onClick={() => this.setImage(this.state.nextImg)}>
                        change image
                    </button>
                </div>
                <StyledButton onClick={this.toggle}>
                    Trianglify: {this.state.triangler.toString()}
                </StyledButton>
                <Triangler
                    src={this.state.img}
                    triWidth={40}
                    triHeight={75}
                    active={this.state.triangler}
                />
            </div>
        );
    }
}
