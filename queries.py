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


def delete_card_by_id(card_id):
    query = '''
        DELETE FROM cards WHERE id=%(card_id)s
        RETURNING id;
    '''
    return data_manager.execute_select(query, {'card_id': card_id}, False)


def register_user(user_data):
    data_manager.execute_select(
    """INSERT INTO user_data (name, email, password)
    VALUES (%(user_name)s, %(user_email)s, %(user_password)s)
    returning id
    """, {"user_name": user_data['name'], "user_email": user_data['email'], "user_password": user_data['psw']}, False)

def get_password(user_name):
    return data_manager.execute_select(
        """SELECT password FROM user_data
           WHERE name = %(user_name)s""",
        {"user_name": user_name}, False )

def add_new_board(title):

    return data_manager.execute_select(
        """
        INSERT INTO  boards (title)
        VALUES (%(title)s)
        RETURNING id,title;
        """
    , {"title":title}, False)