// Because user is not on channel page lastChannel should be deleted from local storage so next time user is redirected to home page
localStorage.removeItem('lastChannel');

// Script for channel creation
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");

    // Configure the display_name div
    // Get display name from local storage
    const displayName = localStorage.getItem('displayName');
    // Fill inner html of #display_name
    document.querySelector('#display_name').innerHTML = `Your display name: ${displayName}`;
    console.log('Display name loaded')

    // Create channel
    document.querySelector('#createChannel').onsubmit = () => {
        console.log('Form submitted');
        // Create new request
        const request = new XMLHttpRequest
        console.log('Request created');
        // Get channel name from the form
        const channelName = document.querySelector('#channelName').value;
        console.log('Channel name loaded');
        // Check that user filled in the channel name
        if (channelName === '') {
            alert('Please fill in the channel name!');
            return false;
        }
        request.open('POST', '/home');
        console.log('Request open');
        // When request is loaded:
        request.onload = () => {
            console.log('Response loaded');
            // Parse the response text
            const res = JSON.parse(request.responseText);
            console.log(`Response data parsed: ${res.error}`);
            // Check the response
            if (res.error === 'noname') {
                document.querySelector('#errorMessage').innerHTML = 'Please fill in the channel name!';
                return false;
            }
            if (res.error === 'existing') {
                document.querySelector('#errorMessage').innerHTML = 'Channel with that name already exists. Please choose other channel name or go to that channel.';
                return false;
            }
            // If channel was created redirect user to the channel page
            if (res.created === true) {
                window.location.href = `/channel/${channelName}`;
                console.log(`Redirected to channel ${channelName}`)
                return false;
            }
        };
         // Append data to the request and send
         const data = new FormData();
         console.log('FormData created');
         data.append('channelName', channelName);
         console.log('Data appended');
         request.send(data);
         console.log('Login request sent');
         return false;
    };
});