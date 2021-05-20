
chrome.runtime.sendMessage({ method: "getBlockedUsers" }, function (response) {

    let ul = document.getElementById('userList');

    ul.innerHTML = '';

    response.users.sort();

    response.users.forEach(user => {

        let li = document.createElement('li');
        li.innerHTML = user;
        li.className = 'unblock';
        li.addEventListener('click', unblockUser);
        ul.appendChild(li);
    });
});

function unblockUser() {

    let el = this;

    chrome.runtime.sendMessage({ method: "unblock", user: el.innerHTML }, function (response) {
        el.remove();
    });
}

document.getElementById("options").addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
});
