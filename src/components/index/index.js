import React from "react";

class Index extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }


    render() {
        let {children} = this.props;
        return <div>
            <h2>Form control with validation</h2>
            {children}
        </div>;
    }
}

export default Index;
