import data_manager


def get_card_status(status_id):

    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ORDER BY id
        ;
        """
    )


def get_cards_for_board(board_id):


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
