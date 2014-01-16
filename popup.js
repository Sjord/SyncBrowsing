
var currentTab;
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var tab = tabs[0];
    var url = tab.url;
    $('.url').val(url);
    currentTab = tab;
});

$('#confirmButton').click(function () {
    var secondUrl = $('#secondUrl').val();
    var splitSessions = $('#splitSessions').is(':checked'); 
    chrome.runtime.getBackgroundPage(function (bgpage) {
        bgpage.createSyncTab(currentTab, secondUrl, splitSessions);
    });
});

