import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ORDER BY id
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY status_id, card_order;
        """
        , {"board_id": board_id})

    return matching_cards


def change_title(card_data):
    return data_manager.execute_select("""
    UPDATE cards
    SET title = %(title)s
    WHERE id = %(id)s
    RETURNING id;""",
            {'title': card_data['cardTitle'], 'id': card_data['cardId']})


def change_title_board(board_data):
    return data_manager.execute_select("""
    UPDATE boards
    SET title = %(title)s
    WHERE id = %(id)s
    RETURNING id, title;""",
                                       {'title': board_data['boardTitle'], 'id': board_data['boardId']})
