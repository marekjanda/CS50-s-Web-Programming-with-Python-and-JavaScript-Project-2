// If there already is a display name in local storage log user in
if (localStorage.getItem('displayName')) {
    console.log('Display name in local storage');
    if (localStorage.getItem('lastChannel')) {
        displayName = localStorage.getItem('displayName');
        lastChannel = localStorage.getItem('lastChannel');
        window.location.href = `/channel/${lastChannel}`
    } else {
        window.location.href = '/home';
    }    
}

// define function to login user with his display name
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    document.querySelector('#nameSelect').onsubmit = () => {
        console.log('form submitted');
        // Create new request
        const login_request = new XMLHttpRequest();
        console.log('XML HTTP request created');
        // Get user's display name
        const dispName = document.querySelector('#dispName').value;
        console.log('Display Name Extracted from Form');
        // Check that user provided username
        if (dispName === '') {
            alert('Please choose your display name');
            return false;
        }
        login_request.open('POST', '/login')
        console.log('Request open');
        // When response is loaded check the response
        login_request.onload = () => {
            console.log('Response loaded');
            const res = JSON.parse(login_request.responseText);
            console.log(`Response data parsed: ${res.error}`);
            if (res.error === 'noname') {
                document.querySelector('#errorMessage').innerHTML = 'Please choose your display name!';
                return false;
            }
            if (res.error === 'taken') {
                document.querySelector('#errorMessage').innerHTML = 'Sorry, the display name is already taken!';
                return false;
            }
            if (res.error === 'none') {
                localStorage.setItem('displayName', dispName)
                window.location.href = '/home';
                console.log('Redirected to /home')
                return false;
            }
        }

        // Append data to the request and send
        const data = new FormData();
        console.log('FormData created');
        data.append('dispName', dispName);
        console.log('Data appended');
        login_request.send(data);
        console.log('Login request sent');
        return false;
    };
});
