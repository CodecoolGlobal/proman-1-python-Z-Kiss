import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {boardsManager} from "./boardsManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.card-slot[data-board-id="${boardId}"][data-status="${card.status_id}"]`, content);
            addClassToCard(card)
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
            event.target.innerHTML = `<input id="input-field" type="text">`
            const input_field = document.querySelector('input')
            input_field.addEventListener('change', async (event) => {
                let currentCard = document.querySelector(`.card[data-card-id="${card.id}"]`)
                dataHandler.renameCard(event.currentTarget.value, currentCard.dataset.cardId)
                rename.innerHTML = `<span>${event.currentTarget.value}`
            })
        })
    },
    addNewCard: async function (event) {
        const addCardBuilder = htmlFactory(htmlTemplates.addCard);
        const addCard = addCardBuilder();
        domManager.addChild(`.card-slot[data-board-id="${event.currentTarget.dataset.boardId}"][data-status="${event.currentTarget.dataset.status}"]`, addCard)
        domManager.addEventListener('input', 'change', async (event) => {
            let inputCardTitle = event.currentTarget.value
            let cardSlot = event.currentTarget.closest('.card-slot')
            let promise = await dataHandler.createNewCard(inputCardTitle, cardSlot.dataset.boardId)
            cardSlot.replaceChildren()
            this.loadCards(cardSlot.dataset.boardId)
        })
    }
};

function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.currentTarget.dataset.cardId
    dataHandler.deleteCard(cardId).then( (id) => {
        console.log(id.id)
        const card = document.querySelector(`.card[data-card-id="${id.id}"]`)
        console.log(card)
        card.remove()
    })
}
 function addClassToCard(card){
    let builtCard = document.querySelector(`.card[data-card-id="${card.id}"]`)
    builtCard.classList.add(card.status_id == 1 ? 'new' : card.status_id == 2 ? 'in-progress' : card.status_id == 3 ? 'testing' : 'done')
 }