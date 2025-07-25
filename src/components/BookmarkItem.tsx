// 收藏项组件
import React, { useState } from 'react';
import { MoreVertical, Edit, Trash2, Globe, Pin } from 'lucide-react';
import { Bookmark } from '../types';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import { ConfirmDialog } from './ConfirmDialog';

interface BookmarkItemProps {
  bookmark: Bookmark;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
  const {
    setShowBookmarkModal,
    setEditingBookmark,
    deleteBookmark,
    pinBookmark,
    unpinBookmark,
    moveBookmarkToGroup
  } = useAppStore();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    setShowDeleteConfirm(true);
    setShowDropdown(false);
  };

  const confirmDelete = () => {
    deleteBookmark(bookmark.id);
    setShowDeleteConfirm(false);
  };

  const handlePin = () => {
    pinBookmark(bookmark.id);
    setShowDropdown(false);
  };

  const handleUnpin = () => {
    unpinBookmark(bookmark.id);
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

  // 拖拽事件处理
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({
      bookmarkId: bookmark.id,
      bookmarkTitle: bookmark.title
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          isDragging && "opacity-50 bg-blue-50 dark:bg-blue-900/20"
        )}
        draggable
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
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
          <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
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
        
        <div className="flex items-center gap-1">
          {/* 置顶图标和省略号图标在同一个位置 */}
          <div className="relative w-6 h-6">
            {/* 置顶图标 - 非hover时显示 */}
            {bookmark.isPinned && (
              <div className={`absolute inset-0 p-1 flex items-center justify-center transition-opacity ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <Pin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            
            {/* 省略号图标 - hover时显示 */}
            <div className={`absolute inset-0 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full h-full"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            
              {showDropdown && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[120px]">
                  {bookmark.isPinned ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnpin();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Pin className="w-4 h-4" />
                      取消置顶
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePin();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Pin className="w-4 h-4" />
                      置顶收藏
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    编辑收藏
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除收藏
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="删除收藏"
        message={`确定要删除收藏「${bookmark.title}」吗？删除后将无法恢复。`}
        confirmText="删除"
        cancelText="取消"
        type="danger"
      />
    </div>
  );
};

export default BookmarkItem;