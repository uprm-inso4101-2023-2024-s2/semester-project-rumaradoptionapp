#This is the main file. The code starts running from here

import json
from flask import Flask,request, jsonify
from flask_cors import CORS

from src.controller.user import userController


#main
app= Flask(__name__)
CORS(app)


#Example of app route
@app.route('/')
def test():
    return "This is a test"

#Example of app route
@app.route('/example',methods=['GET'])
def User():
    if request.method == 'GET':
        return userController().getAllUsers()
    else:
        return jsonify("Not Supported"), 405
    
    
#Responsible of running app.py 
if __name__ == '__main__':
    app.run(debug=1)