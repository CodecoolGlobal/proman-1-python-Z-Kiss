import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const root = document.querySelector('#root')
        root.replaceChildren()
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                '#create-board',
                'click',
                this.addNewBoard
            );

        }
    },
    clearCardSlot: async function (boardId) {
        let cardSlots = document.querySelectorAll(`.card-slot[data-board-id="${boardId}"]`)
        for (const slot of cardSlots) {
            slot.replaceChildren()
        }
    }
    addNewBoard: function () {
        const boardTitleBuilder = htmlFactory(htmlTemplates.boardTitle);
        const boardTitle = boardTitleBuilder();
        domManager.addChild('#root', boardTitle)
        domManager.addEventListener('input','change', async (event) => {
            let inputTitle = event.currentTarget.value
            await dataHandler.createNewBoard(inputTitle)
            const root = document.querySelector('#root')
            root.replaceChildren()
            boardsManager.loadBoards()

        } )
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    cardsManager.loadCards(boardId);
}
