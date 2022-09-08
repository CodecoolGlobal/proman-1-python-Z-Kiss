import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.card-slot[data-board-id="${boardId}"][data-status="${card.status_id}"]`, content);
            addClassToCard(card)
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
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
    }
};

function deleteButtonHandler(clickEvent) {

}
 function addClassToCard(card){
    let builtCard = document.querySelector(`.card[data-card-id="${card.id}"]`)
    builtCard.classList.add(card.status_id == 1 ? 'new' : card.status_id == 2 ? 'in-progress' : card.status_id == 3 ? 'testing' : 'done')
 }