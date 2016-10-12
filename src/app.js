import moment from "moment";
import Promise from "bluebird";
import moment_locale_tr from "moment/locale/tr.js";
import React from "react";
import {render} from "react-dom";
import Index from "./components/index/index";

import "whatwg-fetch";
import "./assets/css/style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

moment.updateLocale("tr", moment_locale_tr);
Promise.config({longStackTraces: true, warnings: true});

render(<Index/>, document.getElementById("content"));