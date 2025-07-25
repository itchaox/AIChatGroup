// Content script - 注入到网页中的脚本

// 监听来自侧边栏的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    // 获取当前页面信息
    const pageInfo = {
      title: document.title,
      url: window.location.href,
      favicon: getFavicon()
    };
    sendResponse(pageInfo);
  }
  return true;
});

// 获取网站图标
function getFavicon(): string {
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement ||
                 document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement ||
                 document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
  
  if (favicon) {
    return favicon.href;
  }
  
  // 默认favicon路径
  return `${window.location.origin}/favicon.ico`;
}

// 检测AI工具类型
function detectAITool(): string {
  const hostname = window.location.hostname;
  
  if (hostname.includes('chat.openai.com') || hostname.includes('chatgpt.com')) {
    return 'ChatGPT';
  } else if (hostname.includes('claude.ai')) {
    return 'Claude';
  } else if (hostname.includes('gemini.google.com')) {
    return 'Gemini';
  } else if (hostname.includes('chat.deepseek.com')) {
    return 'DeepSeek';
  } else if (hostname.includes('doubao.com')) {
    return '豆包';
  }
  
  return 'Other';
}

// 导出检测到的AI工具类型
if (detectAITool() !== 'Other') {
  chrome.runtime.sendMessage({
    action: 'aiToolDetected',
    tool: detectAITool(),
    url: window.location.href,
    title: document.title
  });
}