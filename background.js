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
        id: "MyTimer_menu_30min",
        title: "30分タイマー",
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
    });
    /* デフォルト値を設定しておく */
    chrome.storage.local.set({ interval_time: '90' }, function() {
        console.log('init interval_time');
    });
    chrome.storage.local.set({ pop_message_1: 'そろそろ休もう?' }, function() {
        console.log('init pop_message_1');
    });
    chrome.storage.local.set({ pop_message_2: 'そろそろ記録しようね' }, function() {
        console.log('init pop_message_2');
    });
    chrome.storage.local.set({ open_URL: '' }, function() {
        console.log('init open_URL');
    });
    chrome.storage.local.set({ hour_num: 17 }, function() {
        console.log('init hour_num');
    });
    chrome.storage.local.set({ minutes_num: 30 }, function() {
        console.log('init minutes_num');
    });
    main();
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
};

/* 新しいタブを開く */
openNewTab = function(url) {
    chrome.tabs.create({ "url": url });
};

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

/** 
 * 時刻(hour_num時minutes_num分)をmilisecに変換する
 * 設定時刻からアラームをセットする日時を求める
 * 設定日時-現在時刻が負なら、すでにその時刻を通過しているため、
 * 設定日時を1日追加する
 */
getTargetDate = function(hour_num, minutes_num) {
    target_date = new Date();
    target_date.setHours(hour_num);
    target_date.setMinutes(minutes_num);
    target_date.setSeconds(0);
    delta = target_date - Date.now();
    if (delta < 0) {
        target_date.setDate(target_date.getDate() + 1);
        delta = target_date - Date.now();
    }
    return target_date;
};

/* Timerがすでに起動していないかをチェックする */
isAlreadyStartTimer = function() {
    chrome.alarms.getAll(function(timer) {
        if (typeof(timer) === "undefind") {
            return;
        }
        console.log(timer);
    });
};

/* 追加したメニューがクリックされたときのイベント */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "open_page") {
        chrome.storage.local.get(['open_URL'], function(value) {
            openNewTab(value.open_URL);
        });
    }
    if (info.menuItemId == "MyTimer_menu_90min") {
        startTimer(90);
    }
    if (info.menuItemId == "MyTimer_menu_60min") {
        startTimer(60);
    }
    if (info.menuItemId == "MyTimer_menu_30min") {
        startTimer(30);
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

/* Timerを定義 */
startTimer = function(endTime_) {
    endTime = endTime_;
    alarmName = endTime.toString() + '_Timer_' + buildTimeString();
    alert(endTime + '分経ったらお知らせします！');
    chrome.alarms.create(alarmName, { "delayInMinutes": endTime });
    console.log('start:' + alarmName + ' : ' + Date());
    chrome.storage.local.get(['pop_message_1'], function(value) {
        pop_message_1 = value.pop_message_1;
    });
    /* 時刻になったらメッセージを表示する */
    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === alarmName) {
            alert(endTime + '分経ったよ！!' + pop_message_1);
            chrome.alarms.clear(alarmName);
            console.log('destroy:' + alarmName);
        }
    });
};

/* Interval Timerを定義 */
startIntervalTimer = function(endTime_, silentModeSwitch = false) {
    endITime = parseInt(endTime_);
    alarmName = endITime.toString() + '_IntervalTimer_' + buildTimeString();
    if (silentModeSwitch === false) {
        alert(endITime.toString() + '分経ったらお知らせします！');
    }
    chrome.alarms.create(alarmName, { periodInMinutes: 1 });
    console.log('start:' + alarmName + ' : ' + Date());
    var it = 0;
    setActiveBadge(it);
    chrome.storage.local.get(['pop_message_1'], function(value) {
        pop_message_1 = value.pop_message_1;
    });
    /* 時間が経過したらアラートを表示 */
    chrome.alarms.onAlarm.addListener(function(alarm) {
        it++;
        setActiveBadge(it);
        console.log(it + "分経ったよ！" + 'name: ' + alarm['name'] + ' : ' + Date());
        if (it === endITime) {
            alert(endITime.toString() + '分経ったよ！' + pop_message_1);
            it = 0;
            setActiveBadge(it);
        }
    });
};

/* 現在時刻だけをstringで返す */
buildTimeString = function() {
    var date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return hours.toString() + minutes.toString() + seconds.toString();
};

/* 時刻になったらページを開く */
startAlarm = function(hour_num, minutes_num) {
    alarmName = 'Action_Alarm';
    target_date = getTargetDate(hour_num, minutes_num);
    target_milisec = target_date.getTime();
    chrome.alarms.create(alarmName, { "when": target_milisec });
    console.log('start:' + target_date + alarmName + ' : ' + Date());
    console.log('delta:' + delta + '[milsec]');
    /* 時間が経過したらアラートを表示 */
    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === 'Action_Alarm') {
            chrome.storage.local.get(['pop_message_2', 'open_URL'], function(value) {
                alert(target_date + 'ですよ!' + value.pop_message_2);
                openNewTab(value.open_URL);
            });
        }
    });
};

main = function() {
    setDefaultBadge();
    /* 起動時に一定時間ごとにタイマーを発動させる(サイレントモード) */
    chrome.alarms.clearAll();
    chrome.storage.local.get(['interval_time'], function(value) {
        startIntervalTimer(value.interval_time, true);
    });
    chrome.alarms.getAll(function(timers) {
        timers.forEach(function(timer) {
            console.log(timer['name']);
        });
    });
    /* 時間になったら、ページを移動する */
    chrome.storage.local.get(['hour_num', 'minutes_num'], function(value) {
        hour_num = value.hour_num;
        minutes_num = value.minutes_num;
        startAlarm(hour_num, minutes_num);
    });
};

/* 起動後にmain関数を実行する */
timerStart = function() {
    alert("起動!");
    main();
    console.log('timerstart!');
};

/* 起動後すぐに行う処理を記述 */
chrome.runtime.onStartup.addListener(function() {
    timerStart();
    console.log('startup!');
});

setTimeout(timerStart, 1000);