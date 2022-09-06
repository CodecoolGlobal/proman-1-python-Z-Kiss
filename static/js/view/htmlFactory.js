export const htmlTemplates = {
    board: 1,
    card: 2
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder
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
    return ` <div class="board-container">
                <div class="board-header">
                    <div class="board-title" data-board-id=${board.id}>${board.title}</div>
                    <button class="toggle-board-button">Show Cards</button>
                </div>
                <div  class="board-body" >
                   <div class="card-container">
                       <div class="card-title new">New</div>
                       <div class="card-slot" data-board-id="${board.id}"data-status="1"></div>
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
    return `<div class="card" data-board-id="${card.board_id}" data-card-order="${card.card_order}" data-card-id="${card.id}">${card.title}</div>`;
}

