#DB connection

from src.config.pg_config import pg
import psycopg2


class userDAO:

    #Establish Connection with the database
    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host ='aws-0-us-east-1.pooler.supabase.com'"%(pg['DATABASE'],pg['USER'],pg['PASS'],pg['PORT'])
        self.conn=psycopg2.connect(connection_url)



    #Function that will run the query
    def getAllUsers(self):
        query="select * from example"
        cursor=self.conn.cursor()
        cursor.execute(query)
        result=[]
        for row in cursor:
            result.append(row)
        return result