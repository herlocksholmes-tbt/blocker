
updateList();
refreshUserSettings();

document.getElementById("save").addEventListener('click', function () {

    let $btn = document.getElementById("save");
    let textarea = document.getElementById("users");

    $btn.innerText = "Kaydediliyor";
    $btn.disabled = true;

    let users = [];
    localStorage.setItem('users', JSON.stringify(users));

    textarea.value.split("\n").forEach(user => {

        user = user.replace(/[^\d\w]/g, '');

        if (user != "" && user != "HolyOne" && users.indexOf(user) == -1) {
            users.push(user);
        }
    });

    localStorage.setItem('users', JSON.stringify(users));

    location.reload();
});

function updateList() {

    chrome.runtime.sendMessage({ method: "getBlockedUsers" }, function (response) {

        let textarea = document.getElementById("users");

        textarea.innerHTML = '';

        response.users.sort();

        response.users.forEach(user => {
            textarea.append(user + "\n");
        });
    });
}

document.querySelectorAll(".user-setting").forEach(el => el.addEventListener("click", event => {
    chrome.runtime.sendMessage({
        method: "updateUserSetting",
        setting: event.target.getAttribute("name"),
        active: event.target.checked
    });
}));

function refreshUserSettings() {

    chrome.runtime.sendMessage({ method: "getUserSettings" }, function (response) {
        response.settings.forEach(setting => {
            document.getElementsByName(setting.name)[0].checked = setting.active;
        });
    });
}
