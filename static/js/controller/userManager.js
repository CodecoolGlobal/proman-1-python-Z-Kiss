import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";

export let userManager = {
    registerUser: function () {
        let registerForm = htmlFactory(htmlTemplates.reg)
        console.log(registerForm())
    }


}