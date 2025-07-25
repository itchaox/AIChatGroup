// AI工具分组管理器主应用
import React, { useEffect } from 'react';
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
    isLoading
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

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* AI工具选择器 */}
      <AIToolSelector />
      
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
