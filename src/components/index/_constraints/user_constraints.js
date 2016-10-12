import _ from "lodash";
class UserConstraints {

    name() {
        return {
            name: {
                presence: {message: "You should enter your name"},
            }
        };
    }

    surname() {
        return {
            surname: {
                presence: {message: "You should enter your surname"},
            }
        };
    }

    userConstraints() {
        return _.extend({}, this.name(), this.surname());
    }

}

export default new UserConstraints();
