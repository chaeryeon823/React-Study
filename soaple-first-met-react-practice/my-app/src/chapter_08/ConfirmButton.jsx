import React from "react";

class ConfirmButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isConfirmed: false,
        };
        //bind를 사용하지 않기 위해서는 클래스 필드문법을 사용.
        //this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleConfirm = () => {
        this.setState((preState) => ({
            isConfirmed: !preState.isConfirmed,
        }));
    }
    // handleConfirm() {
    //     this.setState((prevState) => ({
    //         isConfirmed: !prevState.isConfirmed,
    //     }));
    // }

    render() {
        return(
            <button
                onClick={this.handleConfirm}
                disabled={this.state.isConfirmed} >

            {this.state.isConfirmed?"확인됨" : "확인하기"}

            </button>

        );
    }
}

export default ConfirmButton;