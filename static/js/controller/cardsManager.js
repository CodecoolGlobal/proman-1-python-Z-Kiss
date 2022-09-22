import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        clearCardSlot(boardId)
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.card-slot[data-board-id="${boardId}"][data-status="${card.status_id}"]`, content);
            domManager.addEventListener(
                `.delete-btn[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
            this.renameCards(card)

        }
    },
    renameCards: function(card) {
        const rename = document.querySelector(`.card[data-card-id="${card.id}"] > span`)
        rename.addEventListener('dblclick', (event)=> {
            let inputField = document.querySelector('input')
            if (inputField === null){
                event.target.innerHTML = `<input id="input-field" type="text"><button data-card-id="${card.id}">Save</button>`
                const saveButton = document.querySelector(`button[data-card-id="${card.id}"]`)
                saveButton.addEventListener('click', async (event) => {
                    let inputField = document.querySelector("#input-field")
                    dataHandler.renameCard(inputField.value, event.currentTarget.dataset.cardId)
                    rename.innerHTML = `<span>${inputField.value}</span>`
            })
            }

        })
    },
    addNewCard: async function (event) {
        const boardBody = document.querySelector(`.board-body[data-board-id="${event.currentTarget.dataset.boardId}"]`)
        if (boardBody.classList.contains('hidden')){
            boardBody.classList.remove('hidden')
        }
        const addCardBuilder = htmlFactory(htmlTemplates.addCard);
        const addCard = addCardBuilder();
        domManager.addChild(`.card-slot[data-board-id="${event.currentTarget.dataset.boardId}"][data-status="${event.currentTarget.dataset.status}"]`, addCard)
        domManager.addEventListener('#new-card-save-btn', 'click', async (event) => {
            let inputField = document.querySelector('input')
            let inputCardTitle = inputField.value
            let cardSlot = event.currentTarget.closest('.card-slot')
            let promise = await dataHandler.createNewCard(inputCardTitle, cardSlot.dataset.boardId)
            let card = {
                "id": promise.id,
                "board_id": promise.board_id,
                "title": inputCardTitle,
                "color": "#590000"
            }
            this.newCardBuilder(card)

        })
    },
    newCardBuilder: function (card){
        let cardPlace = document.querySelector('.card.new-card')
        cardPlace.remove()
        const cardBuilder = htmlFactory(htmlTemplates.card);
        const content = cardBuilder(card);
        domManager.addChild(`.card-slot[data-board-id="${card.board_id}"][data-status="${'1'}"]`, content);
        let newCard = document.querySelector(`.card[data-card-id="${card.id}"]`)
        domManager.addEventListener(
                `.delete-btn[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
        this.renameCards(card)
    }
};

function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.currentTarget.dataset.cardId
    dataHandler.deleteCard(cardId).then( (id) => {
        const card = document.querySelector(`.card[data-card-id="${id.id}"]`)
        card.remove()
    })
}
// function addClassToCard(card){
// let builtCard = document.querySelector(`.card[data-card-id="${card.id}"]`)
// builtCard.classList.add(card.status_id == 1 ? 'new' : card.status_id == 2 ? 'in-progress' : card.status_id == 3 ? 'testing' : 'done')
// }

function clearCardSlot(boardId){
        let cardSlots = document.querySelectorAll(`.card-slot[data-board-id="${boardId}"]`)
        for (const slot of cardSlots) {
            slot.replaceChildren()
        }
 }