// 收藏项组件
import React, { useState } from 'react';
import { ExternalLink, MoreVertical, Edit, Trash2, Globe } from 'lucide-react';
import { Bookmark } from '../types';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

interface BookmarkItemProps {
  bookmark: Bookmark;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
  const {
    setShowBookmarkModal,
    setEditingBookmark,
    deleteBookmark
  } = useAppStore();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd + 点击，新标签页打开
      try {
        await chrome.tabs.create({ url: bookmark.url });
      } catch (error) {
        console.error('Failed to open in new tab:', error);
        // 降级到window.open
        window.open(bookmark.url, '_blank');
      }
    } else {
      // 普通点击，当前标签页打开
      try {
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (currentTab?.id) {
          await chrome.tabs.update(currentTab.id, { url: bookmark.url });
        } else {
          // 降级到window.location
          window.location.href = bookmark.url;
        }
      } catch (error) {
        console.error('Failed to update current tab:', error);
        // 降级到window.location
        window.location.href = bookmark.url;
      }
    }
  };

  const handleEdit = () => {
    setEditingBookmark(bookmark);
    setShowBookmarkModal(true);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个收藏吗？')) {
      deleteBookmark(bookmark.id);
    }
    setShowDropdown(false);
  };

  const getFaviconUrl = () => {
    if (bookmark.favicon && !imageError) {
      return bookmark.favicon;
    }
    
    try {
      const url = new URL(bookmark.url);
      return `${url.origin}/favicon.ico`;
    } catch {
      return null;
    }
  };

  const faviconUrl = getFaviconUrl();

  return (
    <div className="group relative">
      <div
        className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex-shrink-0 w-6 h-6 mr-3 flex items-center justify-center">
          {faviconUrl && !imageError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-4 h-4 rounded"
              onError={() => setImageError(true)}
            />
          ) : (
            <Globe className="w-4 h-4 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-base text-gray-900 dark:text-gray-100 truncate">
            {bookmark.title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {bookmark.url}
          </div>
          {bookmark.description && (
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
              {bookmark.description}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(bookmark.url, '_blank');
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="在新标签页打开"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[100px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  编辑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkItem;