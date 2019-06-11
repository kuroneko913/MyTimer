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
        id: "open_Redmine",
        title: "Redmineを開く",
        parentId: parentId
    })
});
/* バッジに数字を表示させる */
setDefaultBadge = function() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 50, 255, 100] });
    chrome.browserAction.setBadgeText({ text: "0" });
};

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
    if (info.menuItemId == "open_Redmine") {
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

startTimer = function(endTime) {
    alert(endTime + '分経ったらお知らせします！');
    chrome.alarms.clearAll();
    alarmName = endTime.toString() + '_ALARM_' + Date();
    chrome.alarms.create(alarmName, { delayInMinutes: 1, periodInMinutes: 1 });
    console.log(endTime.toString() + '_ALARM_' + Date());
    setDefaultBadge();
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
        chrome.browserAction.setBadgeText({ text: i.toString() });
        console.log(i + "分経ったよ！" + 'name: ' + alarm['name'] + ' : ' + Date());
    });
}