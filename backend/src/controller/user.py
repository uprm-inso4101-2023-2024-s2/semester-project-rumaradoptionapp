from flask import jsonify


from src.dao.user import userDAO



class userController:

    #Dictionary of the Example table (We could have multiple dictionaries, everything will depend on our needs)
    def build_dictionary(self,row):
        result={}
        result['id']=row[0]
        result['Name']=row[1]
        result['LastName']=row[2]
        return result
    


    #Function that will manipulate the received data from the query
    def getAllUsers(self):
        dao= userDAO()
        result_tuples= dao.getAllUsers()
        result=[]
        for row in result_tuples:
            dictionary=self.build_dictionary(row)
            result.append(dictionary)
        return jsonify(result)
    