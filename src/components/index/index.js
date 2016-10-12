import _ from "lodash";
import validate from "validate.js";
import React from "react";
import {Button, Col, Glyphicon, Row} from "react-bootstrap";
import FormInputWithValidation from "../../utility/components/form_input_with_validation/form_input_with_validation";
import userConstraints from "./_constraints/user_constraints";

class Index extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    onValueChange(fieldName, newValue) {
        let {user = {}} = this.state;
        user[fieldName] = newValue;
        let validationResult = validate(user, userConstraints.userConstraints(), {fullMessages: false});
        this.setState({user, validationResult});
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({formSubmitted: true});
    }


    render() {
        let {formSubmitted, user = {}, validationResult = {}} = this.state;
        let {name, surname} = user;
        return <div>
            <Row>
                <Col sm={12} md={4} mdOffset={4}>
                    <h2 className="text-center">Form control with validation</h2>
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <label>Form Submitted yet: <Glyphicon glyph={formSubmitted ? "ok" : "remove"}/></label>
                        {formSubmitted && !_.isEmpty(validationResult) && <pre>{JSON.stringify(validationResult)}</pre>}
                        <Row>
                            <Col xs={12} sm={6}>
                                <FormInputWithValidation name="name"
                                                         label="Name"
                                                         type="text"
                                                         formControlClass={this.DEFAULT_FORM_CONTROL_CLASS}
                                                         formGroupClass={this.DEFAULT_FORM_GROUP_CLASS}
                                                         labelClass={this.DEFAULT_LABEL_CLASS}
                                                         formSubmitted={formSubmitted}
                                                         value={name}
                                                         validationFunction={(name) => validate({name}, userConstraints.name(), {fullMessages: false})}
                                                         onValueChange={this.onValueChange.bind(this, "name")}/>
                            </Col>
                            <Col xs={12} sm={6}>
                                <FormInputWithValidation name="surname"
                                                         label="Surname"
                                                         type="text"
                                                         formControlClass={this.DEFAULT_FORM_CONTROL_CLASS}
                                                         formGroupClass={this.DEFAULT_FORM_GROUP_CLASS}
                                                         labelClass={this.DEFAULT_LABEL_CLASS}
                                                         formSubmitted={formSubmitted}
                                                         value={surname}
                                                         validationFunction={(surname) => validate({surname}, userConstraints.surname(), {fullMessages: false})}
                                                         onValueChange={this.onValueChange.bind(this, "surname")}/>
                            </Col>
                        </Row>
                        <Button bsStyle="primary" className="pull-right"
                                onClick={this.onSubmit.bind(this)}>Submit</Button>
                    </form>
                </Col>
            </Row>
        </div>;
    }
}


Index.prototype.DEFAULT_FORM_CONTROL_CLASS = "form-control";
Index.prototype.DEFAULT_LABEL_CLASS = "control-label";
Index.prototype.DEFAULT_FORM_GROUP_CLASS = "form-group";

export default Index;
