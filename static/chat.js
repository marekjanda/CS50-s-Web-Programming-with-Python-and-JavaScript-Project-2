document.addEventListener('DOMContentLoaded', () => {
    // Set this channel as last one in storage so next time the user visists the page he is immediately taken to his last channel
    const channel = document.querySelector('#post').dataset.channel;
    localStorage.setItem('lastChannel', channel);

    // Get the chatbox element for later scrolling down when post is added
    var chatBox = document.getElementById('posts');

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    console.log("DOM Content Loaded");

    // Configure the display_name div
    // Get display name from local storage
    const displayName = localStorage.getItem('displayName');
    // Fill inner html of #display_name
    document.querySelector('#display_name').innerHTML = `Your display name: ${displayName}`;
    console.log('Display name loaded')

    // When connected, configure button
    socket.on('connect', () => {
        console.log("Socket connected");
        // #postSend button should emit a "post_message" event
        document.querySelector('#postSend').onclick = () => {        
            const message = document.querySelector('#post').value;
            const time = moment().format('lll').toString();
            console.log("Message data loaded");
            if (message === '') {
                alert('You must type some text');
            }
            socket.emit('post_message', {'message': message, 'user': displayName, 'time': time, 'channel': channel});
            console.log("Post emmited");
            document.querySelector('#post').value = '';
            return false;
        };
    });

    // When a new new message is posted add to the messages
    socket.on('message_posted', data => {
        console.log("Response received");
        const deleteAllowed = false;
        // Currently posts are added to the dict but they are not returned or templating does not work
        if (data.user === displayName) {
            var template = Handlebars.compile(document.querySelector('#resOwn').innerHTML);
        } else {
            var template = Handlebars.compile(document.querySelector('#res').innerHTML);
        }
        var postContent = template({'user': data.user, 'time': data.time, 'message': data.message, "postID": data.postID});
        document.querySelector('#posts').innerHTML += postContent;
        chatBox.scrollTop = chatBox.scrollHeight;
        console.log("Post published");
        // If hide button is clicked, delete the post.
        document.querySelectorAll('.close').forEach(button => {
            button.onclick = () => {
                console.log('Close button clicked');
                // Emit the delete of a post
                const postID = button.parentElement.id;
                console.log(postID);
                button.parentElement.style.animationPlayState = 'running';
                button.parentElement.addEventListener('animationend', () =>  {
                    button.parentElement.remove();
                });
                socket.emit('delete_post', {'postID': postID, 'channel': channel});
            };
        });
    });

    // Delete post when delete_socket is received from server
    socket.on('post_deleted', data => {
        console.log("Remove post recieved")
        var target = document.getElementById(data.postID);
        target.remove();
        console.log("Post Deleted");
        chatBox.scrollTop = chatBox.scrollHeight;
    });
});