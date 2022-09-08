export let dataHandler = {
    getBoards: async function () {
        const response = apiGet("/api/boards");
        return response

    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response
    },
    deleteCard: async function (cardId) {
         const response = apiDelete(`/api/cards/${cardId}`);
         return response
    },
        // the card is retrieved and then the callback function is called with the card
    // getCard: async function (cardId) {
    //     const response = await api__(`/api/cards/${cardId}`)
    //     // the card is retrieved and then the callback function is called with the card
    // },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
    },
    deleteBoard: async function (boardId) {
         const response = apiDelete(`/api/cards/${boardId}`);
         return response
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    },
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
}

async function apiDelete(url) {
    let response = await fetch (url, {
        method: "DELETE",
    });
    if (response.status === 200) {
    let data = response.json();
    return data;
    }
}

async function apiPut(url) {
}

async function apiPatch(url) {
}
