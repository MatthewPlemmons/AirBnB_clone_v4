#!/usr/bin/python3
"""
Module
"""
from api.v1.views import app_views
from flask import Blueprint, Flask
from models import storage
from os import getenv


@app.teardown_appcontext
def teardown:
    """ closes the session """
    storage.close()

if __name__ == "__main__":
    app = Flask(__name__)
    app.register_blueprint(app_views)
    host = getenv(HBNB_API_HOST, "0.0.0.0")
    port = getenv(HBNB_API_PORT, "5000")
