import _ from "lodash";
import React, {PropTypes} from "react";
import ReactDOM from "react-dom";
import {ControlLabel, FormControl, FormGroup} from "react-bootstrap";


class FormInputWithValidation extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = this.propsToState(props);
    }

    propsToState(props) {
        let {value, isFocused, isDirty} = this.props;
        return {value, isFocused, isDirty};
    }

    componentWillReceiveProps(nextProps) {
        let {value, isFocused, isDirty} = this.props;
        let {value: nextValue, isFocused: nextIsFocused, isDirty: nextIsDirty} = nextProps;
        if (value !== nextValue || isFocused !== nextIsFocused || isDirty !== nextIsDirty) {
            this.setState({state: this.propsToState(nextProps)});
        }
    }

    eventToValue(e, trimResults) {
        let {target = {}} = e;
        let {value = "", type = ""} = target;
        if (type === "number" && value !== undefined && value !== null && value !== "") {
            value = Number(value);
        } else {
            value = (value || "");
            if (value && trimResults) {
                value = value.trim();
            }
        }
        return value;
    }


    onInputChanged(e) {
        let value = this.eventToValue(e);
        let {onChange, onValueChange} = this.props;
        if (_.isFunction(onValueChange)) {
            onValueChange(value);
        }
        if (_.isFunction(onChange)) {
            onChange(e);
        }
        this.setState({value});
    }

    onInputFocused(e) {
        let {onFocus} = this.props;
        if (_.isFunction(onFocus)) {
            onFocus(e);
        }
        this.setState({isFocused: true, isDirty: true});
    }

    onInputBlurred(e) {
        let {onBlur} = this.props;
        if (_.isFunction(onBlur)) {
            onBlur(e);
        }
        this.setState({isFocused: false, value: this.eventToValue(e, true)});
    }

    errorsCanBeDisplayed() {
        let {isFocused, isDirty} = this.state;
        let {formSubmitted} = this.props;
        return (!isFocused && isDirty) || formSubmitted;
    }


    getValidationState(validationMessages = []) {
        let {errorClass, defaultClass} = this.props;
        if (this.errorsCanBeDisplayed() && validationMessages.length > 0) {
            return errorClass;
        } else {
            return defaultClass;
        }
    }

    validate(value) {
        let {validationFunction} = this.props;
        let validationMessages = [];
        if (_.isFunction(validationFunction)) {
            let validationResult = validationFunction(value);
            if (validationResult) {
                Object.keys(validationResult).map(errorField => validationResult[errorField].map(validationMessage => validationMessages.push(validationMessage)));
            }
        }

        return validationMessages;
    }

    renderLabel(validationMessages = []) {
        let {labelClass, label} = this.props;
        let subView = label;
        if (this.errorsCanBeDisplayed()) {
            if (validationMessages.length > 0) {
                subView = validationMessages.map((validationMessage, index) => <span
                    key={index}>{validationMessage}</span>);
            }
        }
        return <ControlLabel bsClass={labelClass}>{subView}</ControlLabel>
    }

    focusToInput() {
        let node = ReactDOM.findDOMNode(this.refs.inputNode);
        if (node && node.focus instanceof Function) {
            node.focus();
        }
    }

    render() {
        let {value} = this.state;
        let {formControlClass, formGroupClass, errorClass, defaultClass, onValueChange, formSubmitted, labelClass, validationFunction, name, ...otherProps} = this.props;
        let validationMessages = this.validate(value);
        return <FormGroup bsClass={formGroupClass}
                          onClick={this.focusToInput.bind(this)}
                          validationState={this.getValidationState(validationMessages)}>
            {this.renderLabel(validationMessages)}
            <FormControl name={name}
                         ref="inputNode"
                         bsClass={formControlClass}
                         onBlur={this.onInputBlurred.bind(this)}
                         onFocus={this.onInputFocused.bind(this)}
                         onChange={this.onInputChanged.bind(this)}
                         {...otherProps}/>
        </FormGroup>
    }
}

FormInputWithValidation.propTypes = {
    onValueChange: PropTypes.func,
    formSubmitted: PropTypes.bool,
    formGroupClass: PropTypes.string,
    labelClass: PropTypes.string,
    label: PropTypes.any,
    value: PropTypes.any,
    validationFunction: PropTypes.func,
    errorClass: PropTypes.string,
    defaultClass: PropTypes.string
};

FormInputWithValidation.defaultProps = {
    formControlClass: FormControl.defaultProps.bsClass,
    formGroupClass: FormGroup.defaultProps.bsClass,
    labelClass: ControlLabel.defaultProps.bsClass,
    errorClass: "error",
    defaultClass: undefined
};

export default FormInputWithValidation;
