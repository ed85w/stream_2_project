from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

# MONGODB_HOST = 'localhost'
# MONGODB_PORT = 27017
# DBS_NAME = 'streamTwo'
# COLLECTION_NAME = 'PLDataWithOpponent'

MONGODB_HOST = 'ds141351.mlab.com:41351'
MONGODB_PORT = 33321
DBS_NAME = 'heroku_cs1b94gh'
COLLECTION_NAME = 'PLDataUnNormalisedWithOpponent'

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'streamTwo')


@app.route("/")
def index():
    """
    A Flask view to serve the main dashboard page.
    """
    return render_template("index.html")


@app.route("/dataDashboard/PLData")
def project_data():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format.
    """

    # A constant that defines the record fields that we wish to retrieve.
    FIELDS = {
        '_id': False,
        'matchweek': True,
        'team': True,
        'opponent': True,
        'home': True,
        'attendance': True,
        'goals_for': True,
        'goals_against': True,
        'shots_on_target_for': True,
        'shots_on_target_against': True,
        'shots_off_target_for': True,
        'shots_off_target_against': True,
        'total_shots_for': True,
        'total_shots_against': True,
        'yellow_cards_for': True,
        'yellow_cards_against': True,
        'red_cards_for': True,
        'red_cards_against': True,
        'goal_details_for': True,
        'goal_details_against': True,
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        results = collection.find(projection=FIELDS)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(results))


if __name__ == "__main__":
    app.run(debug=True)


