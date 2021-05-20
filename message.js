
filter();

function filter() {

    chrome.runtime.sendMessage({method: "getBlockedUsers"}, function(response) {

        response.users.forEach(user => {
            hideMessages(user);
        });
    });
}

function hideMessages(user) {

    let messages = document.querySelectorAll('a[href="/Members/' + user + '"]');

    messages.forEach(message => {
        message.closest('tr').style.display = 'none';
    });
}
