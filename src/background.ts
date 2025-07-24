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

// 监听来自侧边栏的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'getCurrentPageInfo') {
    // 获取当前活动标签页信息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('Active tabs found:', tabs);
      if (tabs[0]) {
        const pageInfo = {
          success: true,
          title: tabs[0].title,
          url: tabs[0].url,
          favIconUrl: tabs[0].favIconUrl
        };
        console.log('Sending page info:', pageInfo);
        sendResponse(pageInfo);
      } else {
        console.log('No active tab found');
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // 保持消息通道开启，等待异步响应
  }
  
  return false;
});