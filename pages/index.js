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
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(old => ({
            triangler: !old.triangler,
        }));
    }
    render() {
        return (
            <div>
                <StyledButton onClick={this.toggle}>
                    Trianglify: {this.state.triangler.toString()}
                </StyledButton>
                <Triangler
                    src="/static/test.jpg"
                    triWidth={40}
                    triHeight={75}
                    active={this.state.triangler}
                />
            </div>
        );
    }
}
