from flask import Flask, render_template, url_for, session, redirect, request, jsonify
from dotenv import load_dotenv
from util import json_response
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
    if not session:
        session['user'] = 'Guest'
    return render_template('index.html')

# @app.route("/register")
# def register():
#
#     return


@app.route("/api/boards/create",methods=['GET','POST'])
@app.route("/api/boards")
@json_response
def get_boards():
    if request.method == 'POST':
        title = request.get_json()
        return queries.add_new_board(request.json["title"])
    if request.method == 'GET':
        return queries.get_boards()



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


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
