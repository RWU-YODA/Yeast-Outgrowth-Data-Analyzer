# YASA BAIG
# Harvard Univeristy - (C) 2017
# YODA Backend: Yeast Outgrowth Data Analyzer web application backend, written in Flask with Flask-RESTful framework
# and numpy for data analysis.



#This is a monkey fix for a known issue that awaits to be solved
# here:  https://github.com/flask-restful/flask-restful/pull/913
#Remove from this line to....
import flask.scaffold
flask.helpers._endpoint_from_view_func = flask.scaffold._endpoint_from_view_func
# This line, at some point down the line!!




# Importing essential dependencies

from flask import Flask, send_file, request, jsonify
from flask_restful import Api
from flask_jwt import JWT, jwt_required
# Importing resources
from resources.StrainResource import StrainResource, StrainListResource, StrainRegister
# Setting up application
app = Flask(__name__)

# Configure the SQLAlchemy database connections
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

api = Api(app)

# Setting up a basic route for the homepage without using Flask-RESTful. This enables us to run our angular on the front end
@app.route("/")
def home():
    return send_file("templates/index.html")


# Adding resources:
from resources.UploadResource import UploadResource
api.add_resource(UploadResource,"/upload")
api.add_resource(StrainResource,"/strain/<int:id>")
api.add_resource(StrainListResource,"/strains")
api.add_resource(StrainRegister,"/strains/new")

if __name__ == "__main__":
    from db import db
    db.init_app(app)
    app.run(port=5000,debug=True)
