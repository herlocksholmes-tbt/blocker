
const BLOCK_USER = 'block-user';

chrome.runtime.onInstalled.addListener(function () {

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {
                            hostEquals: 'www.tahribat.com'
                        },
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });

    chrome.contextMenus.create({
        id: BLOCK_USER,
        title: "Engelle",
        documentUrlPatterns: [
            "*://*.tahribat.com/*"
        ],
        targetUrlPatterns: [
            "*://*.tahribat.com/Members/*"
        ],
        contexts: ["link"],
        type: "normal"
    });

});

chrome.contextMenus.onClicked.addListener(function (info, tab) {

    if (info.menuItemId != BLOCK_USER) {
        return;
    }

    if (!info.linkUrl.includes('Members')) {
        return;
    }

    if (info.linkUrl.includes('HolyOne')) {
        return;
    }

    let user = info.linkUrl.split('/');

    block(user[user.length - 1]);
});

function blockedUsers() {

    let users = localStorage.getItem('users');

    if (users == null) {
        return [];
    }

    return JSON.parse(users);
}

function block(user) {

    let users = blockedUsers();
    let exists = false;

    users.forEach(u => {
        if (u == user) {
            exists = true;
        }
    });

    if (!exists) {
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function unblock(user) {

    let users = blockedUsers();
    let index = users.indexOf(user);

    if (index > -1) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function settings() {

    let settings = localStorage.getItem('settings');

    if (settings == null) {
        return [];
    }

    return JSON.parse(settings);
}

function updateSetting(name, active) {

    let settings = localStorage.getItem('settings');

    if (settings == null) {
        settings = [];
    } else {
        settings = JSON.parse(settings);
    }

    let exists = false;
    settings.forEach((s, i) => {
        console.log(s, i);
        if (s.name == name) {
            console.log(s, i, name, active);
            settings[i].active = active;
            exists = true;
        }
    })

    if (!exists) {
        settings.push({
            name: name,
            active: active,
        })
    }

    localStorage.setItem("settings", JSON.stringify(settings));
}

function getSetting(name) {

    let settings = localStorage.getItem('settings');

    if (settings == null) {
        settings = [];
    } else {
        settings = JSON.parse(settings);
    }

    let active = false;

    settings.forEach(setting => {

        if (setting.name == name) {
            active = setting.active;
        }
    })

    return active;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    switch (request.method) {
        case "getBlockedUsers":
            sendResponse({ users: blockedUsers() });
            break;
        case "getUserSettings":
            sendResponse({ settings: settings() });
            break;
        case "getUserSetting":
            sendResponse({ active: getSetting(request.setting) });
            break;
        case "updateUserSetting":
            updateSetting(request.setting, request.active);
            break;
        case "unblock":
            unblock(request.user);
            break;
        case "block":
            block(request.user);
            break;
    }
});
