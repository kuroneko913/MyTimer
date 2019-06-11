/**
 * 基本方針
 * localStorageへアクセスできるのはbackground.jsの中のみ
 * sendMessage, onMessageでやり取りする
 **/


let formNames = [
    "interval_time",
    "pop_message_1",
    "pop_message_2",
    "hour_num",
    "minutes_num",
    "open_URL"
];

/* formの値を取得する */
getFormValue = function(formName) {
    value = document.getElementsByName(formName)[0]['value'];
    if (value == '') value = document.getElementsByName(formName)[0]['placeholder'];
    return value;
}

/* localのストレージに保存したいデータをbackground.jsに送る */
function sendStorage(formName) {
    formValue = getFormValue(formName);
    chrome.runtime.sendMessage({ formName: formValue }, function(response) {
        console.log('send to background.js: ' + formName, getFormValue(formName));
    });
}

// localストレージにある値をそのままformにセットする
// loadAndSet = function(formName) {
//     chrome.storage.local.get(formName, function(value) {
//         if (typeof value[formName] !== 'undefined') {
//             formValue = value[formName];
//         } else {
//             formValue = document.getElementsByName(formName)[0]['placeholder']
//         }
//         document.getElementsByName(formName)[0]['value'] = formValue;
//         console.log(formName + ' : ' + formValue);
//     })
// };

// formにある値をそのままlocal storageに保存する
readAndSave = function(formName) {
    value = getFormValue(formName);
    console.log("get from form : " + formName + ' ' + value);
    chrome.storage.local.set({ formName: value }, function() {
        value = getFormValue(formName);
        console.log("save : " + formName + ' ' + value);
    })
}

for (formName of formNames) {
    console.log("initialize ... " + Date());
    loadAndSet(formName);
}

$('#update').click(function() {
    alert("update button pushed");
    console.log("update button pushed");
    for (formName of formNames) {
        readAndSave(formName);
    }
});