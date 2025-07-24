// 收藏模态框组件
import React, { useState, useEffect } from 'react';
import { X, Globe, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

const BookmarkModal: React.FC = () => {
  const {
    showBookmarkModal,
    setShowBookmarkModal,
    editingBookmark,
    selectedGroup,
    createBookmark,
    updateBookmark,
    getCurrentGroups
  } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPageInfo, setIsLoadingPageInfo] = useState(false);

  const isEditing = !!editingBookmark;
  const groups = getCurrentGroups();

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title);
      setUrl(editingBookmark.url);
      setDescription(editingBookmark.description || '');
      setGroupId(editingBookmark.groupId);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setGroupId(selectedGroup || (groups[0]?.id || ''));
      // 新增模式时自动加载当前页面信息
      if (showBookmarkModal) {
        loadCurrentPageInfo();
      }
    }
  }, [editingBookmark, selectedGroup, showBookmarkModal]); // 移除groups依赖，避免无限重渲染

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim() || !groupId) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && editingBookmark) {
        updateBookmark(editingBookmark.id, {
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || undefined,
          groupId
        });
      } else {
        createBookmark(
          title.trim(),
          url.trim(),
          groupId,
          undefined, // favicon will be auto-detected
          description.trim() || undefined
        );
      }
      
      setShowBookmarkModal(false);
    } catch (error) {
      console.error('保存收藏失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowBookmarkModal(false);
  };

  const loadCurrentPageInfo = async () => {
    console.log('开始获取当前页面信息...');
    setIsLoadingPageInfo(true);
    
    try {
      // 通过background script获取当前活动标签页信息
      console.log('发送消息到background script...');
      const response = await chrome.runtime.sendMessage({ action: 'getCurrentPageInfo' });
      console.log('收到background script响应:', response);
      
      if (response && response.success) {
        console.log('成功获取页面信息:', { title: response.title, url: response.url });
        if (response.title) {
          setTitle(response.title);
          console.log('设置标题:', response.title);
        }
        if (response.url) {
          setUrl(response.url);
          console.log('设置URL:', response.url);
        }
      } else {
        console.error('获取页面信息失败:', response?.error || '未知错误');
        alert('获取页面信息失败: ' + (response?.error || '未知错误'));
      }
    } catch (error) {
      console.error('获取页面信息异常:', error);
      alert('获取页面信息异常: ' + error.message);
    } finally {
      setIsLoadingPageInfo(false);
      console.log('获取页面信息流程结束');
    }
  };

  const autoFillFromUrl = () => {
    if (url && !title) {
      try {
        const urlObj = new URL(url);
        setTitle(urlObj.hostname);
      } catch (error) {
        console.error('解析URL失败:', error);
      }
    }
  };

  if (!showBookmarkModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? '编辑收藏' : '添加收藏'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {!isEditing && isLoadingPageInfo && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              正在获取当前页面信息...
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入收藏标题"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={autoFillFromUrl}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分组
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">选择分组</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.icon} {group.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              描述（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加描述信息"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !url.trim() || !groupId || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '保存中...' : (isEditing ? '保存' : '添加')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookmarkModal;