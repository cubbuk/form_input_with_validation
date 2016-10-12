# Validation with Form Inputs in ReactJS

Validation of forms in react is a bit cumbersome especially for someone used to easy form handling in AngularJS. With two-way data binding and form utilities of Angular, form validation is quite trivial in Angular. However that was not the case for me using React as you need to keep track of state of form inputs yourself.

For example you need to keep track of focused and touched state of your input field. In addition to that you need to keep the value of your state too. For a multi field value this turns into a lots of state variables which makes it quite difficult to keep track of state in your application. 

I come up with an example of a stateful form input control which might be helpful while handling forms in ReactJS. The idea is quite simple this is just an extended html input controller which holds its own state for focus, value, and touched values. It uses props to let the parent component know about changed value of the input. And it also uses `componentWillReceiveProps` event to update its state according to new props if that is ever required.

For showing validations this component depends on [validate.js](http://www.validatejs.org) which is a very handy library for defining constraints on your modals. I also used [React-Bootstrap](https://react-bootstrap.github.io/) for styling form inputs, but any other library or pure inputs can be used instead too.

##An Example Usage

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
                             
                            

  There are many props here but the main props you should focus on are `value`, `formSubmitted`, `validationFunction` and `onValueChange`. Props named `formControlClass`, `formGroupClass` and `labelClass` are merely used for styling `React-Bootstrap Form Control` component so they can be changed or omitted according to the requirements of your use case. And other props are attributes of html input controller.
  
  `value` prop is used for initializing `value` of `FormInputWithValidation` component. `validationFunction` is a function which will be called by our component in each `render` method for displaying any errors if there exist any and the requirements for displaying errors are met. This component does not show any error unless `formSubmitted` prop is true which represents whether the form is submitted or not. In some cases such as update forms, `formSubmitted` can be initalized to true to see existing errors immediately. By using `onValueChange` prop parent component sychronize itself with the value of the component. `onValueChange` returns immediately the value of the input rather than `event` object, it also trims the result of the input if the `type` is text. If you need `event` object you can use default prop of input i.e. `onValueChange` too.
  
### Details of FormInputWithValidation Component
  
  Let's get into details of our component which handles displaying validations for us. First thing we need to focus on is initializing our component and updating its state when the received props changes.
  
    constructor(props, context, ...args) {
        super(props, context, ...args);
        let {value, isFocused, isDirty} = this.props;
        this.state = {value, isFocused, isDirty};
    }

    componentWillReceiveProps(nextProps) {
        let {value, isFocused, isDirty} = this.props;
        let {value: nextValue, isFocused: nextIsFocused, isDirty: nextIsDirty} = nextProps;
        if (value !== nextValue || isFocused !== nextIsFocused || isDirty !== nextIsDirty) {
            let nextState = {};
            if (value !== nextValue) {
                nextState.value = nextValue;
            }
            if (value !== isFocused) {
                nextState.isFocused = nextIsFocused;
            }
            if (value !== isDirty) {
                nextState.isDirty = nextIsDirty;
            }
            this.setState(nextState);
        }
    }
    

In the `constructor` we initialize our state variables `value`, `isDirty` and `isFocused`. By using `componentWillReceiveProps` event, we synchronize our state with new props. If the nextProps are the same with existing props we don't update the state. But if any of the new props is different from the existing ones, we initialize our state with the value of `nextProps`. 
    
This is needed because after the initialization of our component, it has no knowledge about outside world. For example in case of a reset button in a form, the parent component will reset its `modal object` but the component would still use its own existing state value. And this would result in a divergence between the modal and the view. For synchronizing them we need `componentWillReceiveProps` which is an event called whenever the `render` method of parent component is called which eventually sends new props to this component. We simply update our state with new props if they are different from the last given props.
    
Lets check our `render` method:
    
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
    
It uses the value of its state for input control. We extended `FormControl` using `...otherProps`by using spread operator of ES6. We implemented our `onBlur`, `onFocus` and `onChange` event for this component and in these methods we update `value`, `isFocused`, `isDirty` of our state. Let's take a look at `onInputChanged` method of our component:
    
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
    
As you can see from the `eventToValue` method, according to the type of the input we convert the input into a number, or trim the string. This is not necessary but can be handy in your form manipulations as you don't want to send string to your backend service when a numeric field expected most of the time. The important part of this function here is that, it checks whether the parent component passed `onValueChange` or `onChange` props to this component and they pass the value or event to parent component through these props. By doing so even this component is holding its state on its own, the parent of this component can be aware of updated values.

For showing errors `renderLabel` and `validate` methods are used. In each render phase result of `validate` function is passed to `renderLabel` method which displays validation messages of the component. `validate` function uses the `validationFunction` passed to component through props. Validation messages are only displayed if `errorsCanBeDisplayed` method returns true which checks whether the `formSubmitted` prop is true or the input is not focused but is dirty.

    errorsCanBeDisplayed() {
        let {isFocused, isDirty} = this.state;
        let {formSubmitted} = this.props;
        return (!isFocused && isDirty) || formSubmitted;
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

So by wrapping the state of input in a controlled component it is possible to have form manipulation with validation messages in React without having an enormous parent controller. What do you think of this approach, if you have any suggestions please let me know through comments. You can find the example project from github repo.

Cheers
