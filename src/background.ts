// Chrome扩展后台脚本

// 当用户点击扩展图标时，打开侧边栏
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 扩展安装时的初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI工具分组管理器已安装');
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentPageInfo') {
    // 获取当前页面信息
    if (sender.tab) {
      sendResponse({
        title: sender.tab.title,
        url: sender.tab.url,
        favIconUrl: sender.tab.favIconUrl
      });
    }
  }
  return true;
});