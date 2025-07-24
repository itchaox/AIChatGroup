// 底部操作栏组件
import React, { useState } from 'react';
import { Plus, Search, Settings, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import SearchBar from './SearchBar';

const ActionBar: React.FC = () => {
  const { setShowGroupModal } = useAppStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleNewGroup = () => {
    setShowGroupModal(true);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {showSearch && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
      )}
      
      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                设置
              </span>
              <button
                onClick={toggleSettings}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                清空所有数据
              </button>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                AI工具分组管理器 v1.0.0
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-around p-3">
        <button
          onClick={handleNewGroup}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="新建分组"
        >
          <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">新建</span>
        </button>
        
        <button
          onClick={toggleSearch}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            showSearch
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
          title="搜索"
        >
          <Search className="w-5 h-5" />
          <span className="text-xs">搜索</span>
        </button>
        
        <button
          onClick={toggleSettings}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
            showSettings
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
          title="设置"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">设置</span>
        </button>
      </div>
    </div>
  );
};

export default ActionBar;