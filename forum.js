
filter();

function filter() {

    chrome.runtime.sendMessage({ method: "getBlockedUsers" }, function (response) {

        response.users.forEach(user => {
            hidePosts(user);
            hideQuotes(user);
        });
    });

    chrome.runtime.sendMessage({ method: "getUserSetting", setting: "hide_quotes" }, function (response) {

        if (response.active) {
            let quotes = document.querySelectorAll('div[class="bunuyazdidiv"]:not([tbtblocked])');

            quotes.forEach(quote => {
                quote.querySelector("div.bunuyazdi").style = "display:none";
            });
        }
    });
}

function hidePosts(user) {

    let posts = document.querySelectorAll('a[href="/Members/' + user + '"]');

    posts.forEach(post => {

        let el = post.closest('.ForumMessage');
        if (el == null) {
            return;
        }

        el.innerHTML = '<strong>engellenen kullanıcı&lt;' + user + '&gt; : içerik silindi</strong>';
        el.style.padding = '15px';
    });
}

function hideQuotes(user) {

    let quotes = document.querySelectorAll('div[class="bunuyazdidiv"][data-user="' + user + '"]');

    quotes.forEach(quote => {
        quote.innerHTML = '<strong>engellenen kullanıcı&lt;' + user + '&gt; : içerik silindi</strong>';
        quote.classList.add("tbtblocked");
    });
}

function collapse() {
    console.log(this);
}