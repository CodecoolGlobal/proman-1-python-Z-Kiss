export const htmlTemplates = {
    board: 1,
    card: 2,
    reg: 3,
    log: 4,
    boardTitle: 5,
    addCard: 6
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.reg]: registerBuilder,
    [htmlTemplates.log]: loginBuilder,
    [htmlTemplates.boardTitle]: addNewBoard,
    [htmlTemplates.addCard]: addNewCard
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return ` <div class="board-container" data-board-id=${board.id}>
                <div class="board-header">
                    <div class="board-title" data-board-id=${board.id}><span>${board.title}</span></div>
                    <button class="delete-board-btn" data-board-id="${board.id}">
                        <i class="fa fa-trash-o"></i>
                    </button>
                    <button class="add-new-card" data-board-id=${board.id} data-status="1">Add new card</button>
                    <button class="toggle-board-button" data-board-id=${board.id}>Show Cards</button>
                </div>
                
                <div  class="board-body" >
                   <div class="card-container">
                       <div class="card-title new">New</div>
                       <div class="card-slot" data-board-id="${board.id}" data-status="1"></div>
                   </div>
                   
                   <div class="card-container">
                       <div class="card-title  in-progress" >In progress</div>
                       <div class="card-slot" data-board-id="${board.id}" data-status="2"></div>
                   </div>
                   
                   <div class="card-container">
                       <div class="card-title  testing">Testing</div>
                       <div class="card-slot" data-board-id="${board.id}" data-status="3"></div>
                   </div>
                   
                   <div class="card-container">
                       <div class="card-title  done">Done</div>
                       <div class="card-slot" data-board-id="${board.id}" data-status="4"></div>
                   </div>

               </div>
            </div>`;
}

function cardBuilder(card) {
    return `
            <div class="card" data-board-id="${card.board_id}" data-card-order="${card.card_order}" data-card-id="${card.id}"><span>${card.title}</span>
                <button class="delete-btn" data-card-id="${card.id}">
                    <i class="fa fa-trash-o"></i>
                </button>
            </div>`;


}

function addNewCard() {
    return `
            <div class="card"><span><input type="text" id="add-card-input" name="add-card-input" draggable="true"></span>
            </div>`;
}

function addNewBoard() {
    return `<div class="board-container">
                <div class="board-header">
                    <div class="board-title"><input type="text" id="add-board-input" name="add-board-input"></div>
                    <button class="toggle-board-button">Show Cards</button>
                </div></div>`
}

function loginBuilder(){
    return `
    <div class="reg-container">
        <div class="reg-box">
                <div class="reg-button">
                    <div>Loginr</div>
                    <button id="close">X</button>
                </div>
                <div>
                    <label for="email">E-mail address</label><br>
                    <input type="email" name="email">
                </div>
                <div>
                    <label for="password">Password</label><br>
                    <input type="text" name="password">
                </div>
                <button id="ok" data-func="log">Login</button>
        </div>
    </div>
    `
}
function registerBuilder(){
    return `
    <div class="reg-container">
        <div class="reg-box">
                <div class="reg-button">
                    <div>Register</div>
                    <button id="close">X</button>
                </div>
                
                <div>
                    <label for="username">User name</label><br>
                    <input type="text" name="username">
                </div>
                <div>
                    <label for="email">E-mail address</label><br>
                    <input type="email" name="email">
                </div>
                <div>
                    <label for="password">Password</label><br>
                    <input type="text" name="password">
                </div>
                <button id="ok" data-func="reg">Register</button>
        </div>
    </div>
    `
}



