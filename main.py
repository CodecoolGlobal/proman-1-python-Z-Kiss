import psycopg2.errors
from flask import Flask, render_template, url_for, session, redirect, request, jsonify
from dotenv import load_dotenv
from util import json_response
import util
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = 'fafsa'

@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    session.clear()
    session['user'] = 'Guest'
    return render_template('index.html')

@app.route("/register", methods=['POST'] )
def register():
    user_data = request.get_json()
    user_data['psw'] = util.hash_password(user_data['psw'])
    # try:
    #     return jsonify(queries.register_user(user_data))
    # except psycopg2.errors.UniqueViolation:
    #     return jsonify("id": psycopg2.errors.UniqueViolation)
    return jsonify(queries.register_user(user_data))

@app.route("/login")
@json_response
def login():
    user_data = request.get_json()
    hashed_psw = queries.get_password(user_data['name'])
    if util.verify_password(user_data['psw'], hashed_psw):
        session['user'] = user_data
    return user_data


@app.route("/api/boards/create", methods=['POST'])
@app.route("/api/boards")
@json_response
def get_boards():
    if request.method == 'POST':
        return queries.add_new_board(request.json["title"])
    if request.method == 'GET':
        return queries.get_boards()


@app.route("/api/cards/create", methods=['POST'])
@json_response
def add_cards():
    return queries.create_new_card(request.json["title"],request.json["order"], request.json["boardId"])


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/cards/<int:card_id>", methods=['DELETE'])
@json_response
def delete_card_by_id(card_id: int):
    return queries.delete_card_by_id(card_id)


@app.route("/api/cards", methods=['PATCH'])
@json_response
def change_title():
    card_data = request.get_json()
    return queries.change_title(card_data)


@app.route("/api/boards", methods=['PATCH'])
@json_response
def change_title_for_board():
    board_data = request.get_json()
    return queries.change_title_board(board_data)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
