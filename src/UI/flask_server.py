from flask import Flask
import json

app = Flask(__name__)

@app.route("/")
def hello():
    j = {'list': [
      {
        "liciense_id": "sfdfsfsd",
        "name": "xiao fei yang",
        "rating": 4.3,
        "categories": ["hotpot", "chinese"]
      },
      {
        "liciense_id": "asas",
        "name": "pfk",
        "rating": 2.3,
        "categories": ["fastfood", "chicken"]
      }
    ]}
    return json.dumps(j)


if __name__ == '__main__':
    app.run()
