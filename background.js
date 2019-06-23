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

/* options.jsからの値を取得し、ローカルストレージへ保存する */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.interval_time) {
        chrome.storage.local.set({ interval_time: request.interval_time }, function() {
            sendResponse({ interval_time: request.interval_time + "をセットしました" });
        });
    }
    if (request.pop_message_1) {
        chrome.storage.local.set({ pop_message_1: request.pop_message_1 }, function() {
            sendResponse({ pop_message_1: request.pop_message_1 + "をセットしました" });
        });
    }
    if (request.pop_message_2) {
        chrome.storage.local.set({ pop_message_2: request.pop_message_2 }, function() {
            sendResponse({ pop_message_2: request.pop_message_2 + "をセットしました" });
        });
    }
    if (request.open_URL) {
        chrome.storage.local.set({ open_URL: request.open_URL }, function() {
            sendResponse({ open_URL: request.open_URL + "をセットしました" });
        });
    }
    if (request.hour_num) {
        chrome.storage.local.set({ hour_num: request.hour_num }, function() {
            sendResponse({ hour_num: request.hour_num + "をセットしました" });
        });
    }
    if (request.minutes_num) {
        chrome.storage.local.set({ minutes_num: request.minutes_num }, function() {
            sendResponse({ minutes_num: request.minutes_num + "をセットしました" });
        });
    }
    return true;
});

//Chromeが起動してから
chrome.runtime.onStartup.addListener(function() {
    setDefaultBadge();
    /* 起動時に90分タイマーを発動させる(サイレントモード) */
    chrome.alarms.clearAll();
    setIntervalTime = 90;
    startIntervalTimer(setIntervalTime, true);
    chrome.alarms.getAll(function(timers) {
        timers.forEach(function(timer) {
            console.log(timer['name']);
        });
    });
});

/* Timerがすでに起動していないかをチェックする */
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
/* Interval Timerを定義 */
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