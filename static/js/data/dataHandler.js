export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
        return await apiGet(`/api/statuses`)
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
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (title) {
        // creates new board, saves it and calls the callback function with its data
        let boardTitle = {}
        boardTitle.title = title
        await apiPost('/api/boards/create', boardTitle)

    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    },
    renameCard: async function (cardTitle, cardId) {
       const payload = {
            "cardId" : cardId,
            "cardTitle" : cardTitle
        }
        return await apiPatch(`/api/cards`, payload)
    },
    renameBoard: async function (boardTitle, boardId) {
        const payload = {
            'boardTitle' : boardTitle,
            'boardId' : boardId
        }
        return await apiPatch(`/api/boards`, payload)
    }
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
    await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            return data
        })
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

async function apiPatch(url, payload) {
    let response = await fetch(url,{
      method: "PATCH",
        body: JSON.stringify(payload),
      headers: {
      'Content-Type': 'application/json'
    }});
  if(response.status === 200){
    let data = response.json();
    console.log(data);
  }
}
