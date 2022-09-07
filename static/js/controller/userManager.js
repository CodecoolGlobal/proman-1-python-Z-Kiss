import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {dataHandler} from "../data/dataHandler";

export let userManager = {
    registerButton: function () {
        domManager.addEventListener('#register',
            'click',
            register)
    }

}

 function register() {
    let regBuilder = htmlFactory(htmlTemplates.reg)
        let regForm = regBuilder()
        domManager.addChild('#root',regForm)
        registerCloseButton()
        registerSendButton ()


 }
function registerCloseButton () {
    domManager.addEventListener('#close','click',() => {
      let element = document.querySelector('.reg-container')
        element.remove()
    })
    // domManager.addEventListener('.reg-container','click', (event) => {
    //     event.currentTarget.remove()
    // })
}
function registerSendButton () {
    domManager.addEventListener('#reg','click', (event) => {
        let input = document.querySelectorAll('input')
        let promise = dataHandler.registerUser(input)
    })
}