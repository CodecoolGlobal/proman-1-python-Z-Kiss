import {boardsManager} from "./controller/boardsManager.js";

function init() {
    console.log('init')
    boardsManager.loadBoards();
}

init();
