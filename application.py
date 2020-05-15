import os
import requests

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Define list of channels (with some predefined channels)
channels = {"Sport": {"name": "Sport", "posts": []},
            "Politics": {"name": "Politics", "posts": []},
            "Culture": {"name": "Culture", "posts": []},
            "Traveling": {"name": "Traveling", "posts": []},
            "Science": {"name": "Science", "posts": []}}

# Define list of display names
display_names = []

# Set global variable idCount to keep track of post ID's
idCount = 0


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    # Get display name from the form
    name = request.form.get("dispName")
    # Check if name was submitted, if not return 
    if not name:
        return jsonify({"error": 'noname'})
    # If name is in names retur
    if name in display_names:
        return jsonify({"error": 'taken'})
    
    # Add name to names and render template channels.html
    display_names.append(name)
    print(display_names)
    return jsonify({"error": 'none'})

@app.route("/home", methods=["POST", "GET"])
def home():
    # If user wants to create a new channel
    if request.method == 'POST':
        channelName = request.form.get('channelName')
        # Check if channel name is provided
        if not channelName:
            return jsonify({"error": "noname", "created": False})
        # Check wether such channel exists
        elif channelName in channels:
            return jsonify({"error": "existing", "created": False})
        # If checks are passed add channel to channels
        else:
            channels[channelName] = {"name": channelName, "posts": []}
            return jsonify({"error": "none", "created": True})
    # To avoid sending all channel data (with all the posts) at this stage, when only channel names are needed, create list of channel names
    # and return in render template
    channel_names = []
    for key in channels:
        channel_names.append(channels[key]["name"])
    return render_template("home.html", channels=channel_names)

@app.route("/channel/<channelName>")
def channel(channelName):
    return render_template("channel.html", channel=channels[channelName])

# define socket 
@socketio.on("post_message")
def post(data):
    # Get information from received object
    channelName = data["channel"]
    user = data["user"]
    message = data["message"]
    time = data["time"]
    global idCount
    idCount += 1
    # define object containing posted data
    posted = {"postID": idCount, "user": user, "time": time, "message": message}
    #print(posted)
    # If there is more than 100 posts in a channel delete the first post
    if len(channels[channelName]["posts"]) > 100:
        del channels[channelName]["posts"][0]
    # add message to the channel in channels dict
    channels[channelName]["posts"].append(posted)
    #print(channels[channelName]["posts"])
    # Emit posted message
    emit("message_posted", posted, broadcast=True)

# Create socket from deleting messages
@socketio.on("delete_post")
def delete(data):
    #print("data recieved")
    # Get post ID from received data
    postID = int(data["postID"])
    # Find the post in the dict
    for post in channels[data["channel"]]["posts"]:
        #print(postID)
        if post["postID"] == postID:
            #print("Post found")
            # Remove post
            channels[data["channel"]]["posts"].remove(post)
    #print(channels[data["channel"]]["posts"])
    # Emit 'post_deleted' to clients
    emit('post_deleted', {'postID': postID}, broadcast=True)


