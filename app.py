from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Idhu thaan browser-ah server kooda pesa anumadhikkum

# SQL Database create pannura logic
def init_db():
    conn = sqlite3.connect('news.db')
    conn.execute('CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY, title TEXT, link TEXT UNIQUE, pub_date TEXT)')
    conn.close()

# News-ah save panna intha route-ah JS call pannum
@app.route('/save', methods=['POST'])
def save():
    data = request.json
    try:
        conn = sqlite3.connect('news.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO bookmarks (title, link, pub_date) VALUES (?, ?, ?)", 
                       (data['title'], data['link'], data['pubDate']))
        conn.commit()
        return jsonify({"message": "Bookmark Saved in SQL!"})
    except:
        return jsonify({"message": "Already Bookmarked!"}), 400
    finally:
        conn.close()

if __name__ == '__main__':
    init_db()
    app.run(port=5000)
  
