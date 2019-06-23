/**
 * 基本方針
 * localStorageへアクセスできるのはbackground.jsの中のみ
 * sendMessage, onMessageでやり取りする
 **/

/* formの値を取得する */
getFormValue = function(formName) {
    value = document.getElementsByName(formName)[0]['value'];
    if (value == '') value = document.getElementsByName(formName)[0]['placeholder'];
    return value;
}

/* 更新ボタンが押されたら、各フォームから値を取得し、message passingにてbackground.jsに送信し、ローカルストレージに値を保存させる */
$('#update').click(function() {
    console.log("update button pushed");
    alert("update button pushed");
    chrome.runtime.sendMessage({ interval_time: getFormValue('interval_time') }, function(response) {
        console.log('send to background.js: ' + getFormValue('interval_time'));
        console.log(response.interval_time);
    });
    chrome.runtime.sendMessage({ pop_message_1: getFormValue('pop_message_1') }, function(response) {
        console.log('send to background.js: ' + getFormValue('pop_message_1'));
        console.log(response.pop_message_1);
    });
    chrome.runtime.sendMessage({ pop_message_2: getFormValue('pop_message_2') }, function(response) {
        console.log('send to background.js: ' + getFormValue('pop_message_2'));
        console.log(response.pop_message_2);
    });
    chrome.runtime.sendMessage({ open_URL: getFormValue('open_URL') }, function(response) {
        console.log('send to background.js: ' + getFormValue('open_URL'));
        console.log(response.open_URL);
    });
    chrome.runtime.sendMessage({ hour_num: getFormValue('hour_num') }, function(response) {
        console.log('send to background.js: ' + getFormValue('hour_num'));
        console.log(response.hour_num);
    });
    chrome.runtime.sendMessage({ minutes_num: getFormValue('minutes_num') }, function(response) {
        console.log('send to background.js: ' + getFormValue('minutes_num'));
        console.log(response.minutes_num);
    });
});