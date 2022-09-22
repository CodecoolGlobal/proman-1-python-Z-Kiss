import data_manager


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
        SELECT cards.id, cards.status_id, cards.title, s.color FROM cards
        inner join statuses s on s.id = cards.status_id
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
    RETURNING id
    """, {"user_name": user_data['name'], "user_email": user_data['email'], "user_password": user_data['psw']}, False)

def get_password(user_name):
    return data_manager.execute_select(
        """SELECT password FROM user_data
           WHERE name = %(user_name)s""",
        {"user_name": user_name}, False )


def delete_board_by_id(board_id):
    query = '''
        DELETE FROM boards WHERE id=%(id)s
        RETURNING id;
    '''
    return data_manager.execute_select(query, {'id': board_id}, False)


def add_new_board(title):
    return data_manager.execute_select(
        """
        INSERT INTO  boards (title)
        VALUES (%(title)s)
        RETURNING id,title;
        """
    , {"title":title}, False)

def get_order_for_column(board_id):
    return data_manager.execute_select("""
    SELECT MAX(column_order) AS order FROM columns
    WHERE board_id = %(id_of_board)s
    """,{"id_of_board": board_id}, False)

def add_new_status(title, color):
    return data_manager.execute_select("""
    INSERT INTO statuses (title, color)
    VALUES (%(title_of_status)s, %(color_of_status)s)
    RETURNING id
    """,{"title_of_status": title, "color_of_status": color}, False)

def add_new_column(board_id, status_id, order):
    return data_manager.execute_select("""
    INSERT INTO columns (board_id, status_id, column_order)
    VALUES (%(id_of_board)s, %(id_of_status)s, %(order_of_column)s)
    RETURNING id
    """,{"id_of_board": board_id, "id_of_status": status_id, "order_of_column": order}, False)
def add_default_columns(board_id):
    return data_manager.execute_select("""
    WITH new_column AS (
    INSERT INTO columns (board_id, status_id, column_order)
    VALUES 
    (%(id_of_board)s, 1, 1),
    (%(id_of_board)s, 2, 2), 
    (%(id_of_board)s, 3, 3),
    (%(id_of_board)s, 4, 4)
    RETURNING *)
    SELECT * FROM new_column
    ORDER BY column_order;
    """, {"id_of_board": board_id})

def create_new_card(title, order, board_id):

    return data_manager.execute_select(
        """
        INSERT INTO cards (board_id, status_id, title, card_order)
        VALUES (%(board_id)s, 1, %(title)s, %(order)s)
        RETURNING id, board_id;
        """
        ,{"board_id": board_id, "title": title, "order": order}, False)

def get_card_order(board_id):
    return data_manager.execute_select("""
    SELECT COUNT(status_id) FROM cards
    WHERE board_id = %(board_id)s AND status_id = 1
    """, {"board_id": board_id}, False)


def change_title(card_data):
    return data_manager.execute_select("""
    UPDATE cards
    SET title = %(title)s
    WHERE id = %(id)s 
    RETURNING id;""",
            {'title': card_data['cardTitle'], 'id': card_data['cardId']})


def change_column_title(column_data):
    return data_manager.execute_select("""
    UPDATE statuses
    SET title = %(title)s
    WHERE id = %(id)s
    """,
                                       {'title': column_data['columnTitle'], 'id': column_data['columnId']})


def change_title_board(board_data):
    return data_manager.execute_select("""
    UPDATE boards
    SET title = %(title)s
    WHERE id = %(id)s
    RETURNING id, title;""",
                                       {'title': board_data['boardTitle'], 'id': board_data['boardId']})

def get_columns_for_board(board_id):
    return data_manager.execute_select("""
    SELECT columns.id, columns.board_id, columns.status_id, s.title, s.color FROM columns
    INNER JOIN statuses s on columns.status_id = s.id
    WHERE board_id = %(id_of_board)s
    ORDER BY columns.column_order;
    """, {"id_of_board": board_id})