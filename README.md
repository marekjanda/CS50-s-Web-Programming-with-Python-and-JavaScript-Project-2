# Project 2

https://youtu.be/Ahuki9NKaMU

Web Programming with Python and JavaScript

Marek Janda
2019

APPLICATION LAYOUT
@ app route "/"
At first page "index.html" is rendered and index.js script is loaded. If user did not visited the page before he is asked to register by filling in his display name. If the user choose already axisting display name he is prompted to choose different one.
If he visited the page before he is redirect to his last channel page or to the home page if he closed the browser window at home page.

@ app route "/home"
"home.html" is rendered where on the left side a list of existing channels is displayed and on the right side there is a form to create a new channel. There are a few preexisting channels with common topics defined. This channels are defined in a dictionary in"application.py". After channel is created the channel is added to the list of channels as well as to the channels dictionary at the server. When the user clicks on the channel in the channel list he is redirected to the channel page ("channel.html)

@ app route "/channel/<channelName>"
On the left side of the channel page there is a list of posts in the channel and on the right side there is a form where the user can type in and submit his post. When the page is loaded maximum 100 posts are loaded (and stored in the server).

SOCKETS
Post message
When 'post_message' is emitted from client side the server process the data and store in a dictionary at the server. As a response a 'message_posted' is emitted from the server to all users at the channel where the emitted data are processed and filled in handlebars template and appended to the list of posts.

Delete message - Personal touch
There is a delete button displayed (cross sign), at the right side of the post box, in the users own posts. If the user wants to delete his own post he can click the cross and the message will be deleted, with an animation. "delete_post" will be emitted to the server socket were the post will be removed from posts dictionary and "post_deleted" will be emitted to clients and the post will be removed from the post list at all client machines.

STYLING
For web page styling mainly bootstrap is used, with some modifications (color, width etc.) and an animation is defined in "style.css". For page layout bootstrap grid is applied.