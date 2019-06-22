//拡張機能インストール時に実行される(onInstalled)
chrome.runtime.onInstalled.addListener(function() {
    /* 右クリックメニューに追加 */
    var parentId = chrome.contextMenus.create({
        id: "MyTimer_menu",
        title: "MyUtility"
    });
    chrome.contextMenus.create({
        id: "MyTimer_menu_90min",
        title: "90分タイマー",
        parentId: parentId
    });
    chrome.contextMenus.create({
        id: "MyTimer_menu_60min",
        title: "60分タイマー",
        parentId: parentId
    });
    chrome.contextMenus.create({
        id: "MyTimer_menu_5min",
        title: "5分タイマー",
        parentId: parentId
    });
    chrome.contextMenus.create({
        id: "open_page",
        title: "ページを開く",
        parentId: parentId
    })
});

/**
 * 以下、処理を定義する
 */

/* バッジに数字を表示させる */
setDefaultBadge = function() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 50, 255, 100] });
    chrome.browserAction.setBadgeText({ text: "0" });
};

/* バッジの値の更新、アクテイブ時のみの挙動 */
setActiveBadge = function(value) {
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 100] });
    chrome.browserAction.setBadgeText({ text: value });
}

/* 新しいタブを開く */
openNewTab = function(url) {
    chrome.tabs.create({ "url": url });
}

/* 設定値のstorageへの保存 */
saveSettings = function(values) {
    chrome.storage.local.set(values);
};

/* settingの値を取得する */


//Chromeが起動してから
chrome.runtime.onStartup.addListener(function() {
    setDefaultBadge();
});

//追加したメニューがクリックされたときのイベント
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    setDefaultBadge();
    if (info.menuItemId == "open_page") {
        openNewTab('https://www.google.com/');
    }
    if (info.menuItemId == "MyTimer_menu_60min") {
        startTimer(60);
    }
    if (info.menuItemId == "MyTimer_menu_90min") {
        startTimer(90);
    }
    if (info.menuItemId == "MyTimer_menu_5min") {
        startTimer(5);
    }
});

startTimer = function(endTime, silentModeSwitch = false) {
    var date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    alarmName = endTime.toString() + '_ALARM_' + hours.toString() + minutes.toString() + seconds.toString();
    if (silentModeSwitch === false) {
        alert(endTime + '分経ったらお知らせします！');
    }
    chrome.alarms.clearAll();
    chrome.alarms.create(alarmName, { delayInMinutes: 1, periodInMinutes: 1 });
    console.log(alarmName);
    setActiveBadge(0);
    var i = 0;
    pop_message_1 = 'そろそろ休憩しよう！';
    // Run something when the alarm goes off
    chrome.alarms.onAlarm.addListener(function(alarm) {
        i++;
        if (i == endTime) {
            chrome.alarms.clear(alarmName, function() {
                alert(endTime + "分経ったよ！" + pop_message_1);
                console.log(alarmName + 'タイマーを破棄しました');
                setDefaultBadge();
                i = 0;
            });
        }
        setActiveBadge(i.toString());
        console.log(i + "分経ったよ！" + 'name: ' + alarm['name'] + ' : ' + Date());
    });
}


/* 起動時に5分タイマーを発動させる(サイレントモード) */
<<<<<<< Updated upstream
alert("Timer!");
=======
>>>>>>> Stashed changes
startTimer(5, true);