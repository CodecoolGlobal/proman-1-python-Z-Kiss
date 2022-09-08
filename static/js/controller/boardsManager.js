import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        domManager.addEventListener(
                '#create-board',
                'click',
                this.addNewBoard
            );
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
            domManager.addEventListener(`.delete-board-btn[data-board-id="${board.id}"]`,
                "click",
                deleteButtonHandler
            );


            this.renameBoards(board)

            domManager.addEventListener(
                `.add-new-card[data-board-id = "${board.id}"]`,
                'click',
                (event) => cardsManager.addNewCard(event)
            );

        }
    },
    clearCardSlot: async function (boardId) {
        let cardSlots = document.querySelectorAll(`.card-slot[data-board-id="${boardId}"]`)
        for (const slot of cardSlots) {
            slot.replaceChildren()

        }
    },
    renameBoards: function (board) {
        const rename = document.querySelector(`.board-title[data-board-id="${board.id}"] > span`)
        rename.addEventListener('dblclick', (event) => {
            event.target.innerHTML = `<input id="input-field" type="text">`
            const input_field = document.querySelector('input')
            input_field.addEventListener('change', (change) => {
                let currentBoard = document.querySelector(`.board-title[data-board-id="${board.id}"]`)
                dataHandler.renameBoard(change.currentTarget.value, currentBoard.dataset.boardId)
                rename.innerHTML = `<span>${change.currentTarget.value}`
            })
        })
    },
    addNewBoard: function () {
        const boardTitleBuilder = htmlFactory(htmlTemplates.boardTitle);
        const boardTitle = boardTitleBuilder();
        domManager.addChild('#root', boardTitle)
        domManager.addEventListener('input', 'change', async (event) => {
            let inputTitle = event.currentTarget.value
            await dataHandler.createNewBoard(inputTitle)
            const root = document.querySelector('#root')
            root.replaceChildren()
            boardsManager.loadBoards()

        })
    }
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    boardsManager.clearCardSlot(boardId)
    cardsManager.loadCards(boardId);
}

function deleteButtonHandler(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId
    console.log(boardId)
    dataHandler.deleteBoard(boardId).then( (id) => {
        const board = document.querySelector(`.board-container[data-board-id="${boardId}"]`)
        console.log(board)
        console.log(document.querySelector('#root'))
        document.querySelector('#root').removeChild(board)
    })
}

