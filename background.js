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
        id: "MyTimer_menu_10min",
        title: "10分タイマー",
        parentId: parentId
    });
    chrome.contextMenus.create({
        id: "MyTimer_menu_5min",
        title: "5分タイマー",
        parentId: parentId
    });
    chrome.contextMenus.create({
        id: "MyTimer_menu_1min",
        title: "1分タイマー",
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
    chrome.browserAction.setBadgeText({ text: value.toString() });
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


isAlreadyStartTimer = function() {
    chrome.alarms.getAll(function(timer) {
        if (typeof(timer) === "undefind") {
            return;
        }
        console.log(timer);
    });
};
//追加したメニューがクリックされたときのイベント
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "open_page") {
        openNewTab('https://www.google.com/');
    }
    if (info.menuItemId == "MyTimer_menu_60min") {
        startTimer(60);
    }
    if (info.menuItemId == "MyTimer_menu_90min") {
        startTimer(90);
    }
    if (info.menuItemId == "MyTimer_menu_10min") {
        startTimer(10);
    }
    if (info.menuItemId == "MyTimer_menu_5min") {
        startTimer(5);
    }
    if (info.menuItemId == "MyTimer_menu_1min") {
        startTimer(1);
    }
});

startTimer = function(endTime_) {
    endTime = endTime_;
    var date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    alarmName = endTime.toString() + '_Timer_' + hours.toString() + minutes.toString() + seconds.toString();
    alert(endTime + '分経ったらお知らせします！');
    chrome.alarms.create(alarmName, { delayInMinutes: endTime });
    console.log('start:' + alarmName + ' : ' + Date());
    var t = 0;
    pop_message_1 = '時間だよ！';
    // Run something when the alarm goes off
    chrome.alarms.onAlarm.addListener(function(alarm) {
        alert(endTime + '分経ったよ！' + pop_message_1);
        chrome.alarms.clear(alarmName);
    });
};

startIntervalTimer = function(endTime_, silentModeSwitch = false) {
    endITime = endTime_;
    var date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    alarmName = endITime.toString() + '_IntervalTimer_' + hours.toString() + minutes.toString() + seconds.toString();
    if (silentModeSwitch === false) {
        alert(endITime + '分経ったらお知らせします！');
    }
    chrome.alarms.create(alarmName, { periodInMinutes: 1 });
    console.log('start:' + alarmName + ' : ' + Date());
    var it = 0;
    setActiveBadge(it);
    pop_message_1 = 'そろそろ休憩しよう！';
    // Run something when the alarm goes off
    chrome.alarms.onAlarm.addListener(function(alarm) {
        it++;
        setActiveBadge(it);
        console.log(it + "分経ったよ！" + 'name: ' + alarm['name'] + ' : ' + Date());
        if (it == endITime) {
            alert(endITime + '分経ったよ！' + pop_message_1);
            isAlreadyStartTimer();
            setDefaultBadge();
            it = 0;
        }
    });
}

/* 起動時に90分タイマーを発動させる(サイレントモード) */
chrome.alarms.clearAll();
isAlreadyStartTimer();
setIntervalTime = 90;
timerSwitch = true;
startIntervalTimer(setIntervalTime, true);
chrome.alarms.getAll(function(timers) {
    timers.forEach(function(timer) {
        console.log(timer['name']);
    });
});