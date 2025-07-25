// AI工具分组管理器主应用
import React, { useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { useAppStore } from './store/useAppStore';
import AIToolSelector from './components/AIToolSelector';
import GroupList from './components/GroupList';
import GroupModal from './components/GroupModal';
import BookmarkModal from './components/BookmarkModal';
import { AIToolModal } from './components/AIToolModal';
import { Toaster } from 'sonner';

function App() {
  const {
    loadData,
    getCurrentGroups,
    getFilteredGroups,
    isLoading,
    searchQuery,
    setSearchQuery,
    setShowGroupModal
  } = useAppStore();

  // 初始化数据
  useEffect(() => {
    loadData();
  }, [loadData]);

  const groups = getFilteredGroups();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* AI工具选择器 */}
      <AIToolSelector />
      
      {/* 固定的搜索框和新建分组按钮 */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        {/* 搜索框 */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索收藏..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>
        
        {/* 新建分组按钮 */}
        <div className="border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setShowGroupModal(true)}
            className="flex items-center w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
          >
            <div className="mr-3">
              <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">新建分组</span>
          </button>
        </div>
      </div>
      
      {/* 分组列表 */}
      <GroupList groups={groups} />
      
      {/* 模态框 */}
      <GroupModal />
      <BookmarkModal />
      <AIToolModal />
      
      {/* 通知组件 */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)'
          }
        }}
      />
    </div>
  );
}

export default App;
