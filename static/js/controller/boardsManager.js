import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const root = document.querySelector('#root')
        root.replaceChildren()
        const boards= await dataHandler.getBoards();
        createMultipleBoard(boards)
        await createMultipleContainers(boards)
        boards.forEach((board) => {
            cardsManager.loadCards(board.id)
        })
    },
    renameBoards: function (board) {
        const rename = document.querySelector(`.board-title[data-board-id="${board.id}"] > span`)
        rename.addEventListener('dblclick', (event) => {
            let inputField = document.querySelector('input')
            if (inputField === null) {
                event.target.innerHTML = `<input id="input-field" type="text" required><button data-board-id="${board.id}" >Save</button>`
                const saveButton = document.querySelector(`button[data-board-id="${board.id}"]`)
                saveButton.addEventListener('click', (event) => {
                    let inputField = document.querySelector('input')
                    dataHandler.renameBoard(inputField.value, event.currentTarget.dataset.boardId)
                    rename.innerHTML = `<span>${inputField.value}</span>`
                })
            }
        })
    },
    addNewBoard: function () {
        const boardTitleBuilder = htmlFactory(htmlTemplates.boardTitle);
        const boardTitle = boardTitleBuilder();
        domManager.addChild('#root', boardTitle)
        domManager.addEventListener('#board-save-button', 'click', async () => {
            let inputTitle = document.querySelector("#add-board-input").value
            let boardDatas = await dataHandler.createNewBoard(inputTitle)
            createNewBoard(boardDatas)

        })
    }
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const boardBody = document.querySelector(`.board-body[data-board-id="${boardId}"]`)
    boardBody.classList.toggle('hidden')
}

function deleteButtonHandler(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId
    dataHandler.deleteBoard(boardId)
    const board = document.querySelector(`.board-container[data-board-id="${boardId}"]`)
    document.querySelector('#root').removeChild(board)
}

async function createNewBoard(board) {
    const boardTitle = document.querySelector(".new-board-title")
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const newBoard = boardBuilder(board);
    boardTitle.remove()
    domManager.addChild("#root", newBoard)
    initBoardEvents(board)
    let container = await createContainers(board.id)
    console.log(container)
    domManager.addChild(`.board-body[data-board-id="${board.id}"`, container)

}

function initBoardEvents(board) {
    domManager.addEventListener(
        `.toggle-board-button[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler);
    domManager.addEventListener(`.delete-board-btn[data-board-id="${board.id}"]`,
        "click",
        deleteButtonHandler);
    boardsManager.renameBoards(board)
    domManager.addEventListener(
        `.add-new-card[data-board-id = "${board.id}"]`,
        'click',
        (event) => cardsManager.addNewCard(event));
    domManager.addEventListener(`.add-new-column[data-board-id="${board.id}"]`,'click', (event) =>{
        let inputFields = document.querySelector('input')
        if (inputFields === null){
            createNewContainer(event.currentTarget.dataset.boardId)
        }

    })
}

function createMultipleBoard(boards){
    for (let board of boards){
        createBoard(board)
        initBoardEvents(board)
    }
}
function createBoard(boardData){
    const boardBuilder = htmlFactory(htmlTemplates.board)
    let board = boardBuilder(boardData)
    domManager.addChild('#root', board)
}
async function createMultipleContainers(boards){
    for (let board of boards){
        let container = await createContainers(board.id)
        domManager.addChild(`.board-body[data-board-id="${board.id}"`, container)
        initDropZone(board.id)
    }
}
async function createContainers(boardId){
    const containerBuilder = htmlFactory(htmlTemplates.cardContainer)
    let container = ""
    let containersData = await dataHandler.getColumns(boardId)
        for (let containerData of containersData){
            container += containerBuilder(containerData)
        }
    return container
}

function createNewContainer(boardId){
    const inputContainerBuilder = htmlFactory(htmlTemplates.addNewContainer)
    let inputContainer = inputContainerBuilder(boardId)
    domManager.addChild(`.board-body[data-board-id="${boardId}"]`,inputContainer)

    domManager.addEventListener(`#save-column[data-board-id="${boardId}"]`, 'click', async () => {
        let containerTitle = document.querySelector('#column-title').value
        let containerColor = document.querySelector('#column-color').value
        let containerData = await dataHandler.registerNewContainer(boardId, containerTitle, containerColor)
        const containerBuilder = htmlFactory(htmlTemplates.cardContainer)
        document.querySelector(`#card-container-input`).remove()
        domManager.addChild(`.board-body[data-board-id="${boardId}"]`, containerBuilder(containerData))

    })
}

function initDropZone(boardId){
    const dropZones = document.querySelectorAll(`.card-slot[data-board-id="${boardId}"]`)
    dropZones.forEach((zone) => {
        zone.addEventListener('dragover',(event)=>{
            event.preventDefault()
        })
    })
    dropZones.forEach((zone) => {
        zone.addEventListener('dragenter',(event)=>{
            event.preventDefault()
        })
    })
    dropZones.forEach((zone) =>{
        zone.addEventListener('drop',(event)=>{

            let card = document.querySelector(`.dragging`)
            if (card.dataset.boardId === event.target.dataset.boardId && event.target.classList.contains('card-slot')){
                card.style.background = event.target.dataset.color
                event.target.appendChild(document.querySelector(`.dragging`))
                dataHandler.updateCardStatus(card.dataset.cardId, event.target.dataset.status)
            }

        })
    })

}