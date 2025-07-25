// 底部操作栏组件
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SearchBar from './SearchBar';

const ActionBar: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };



  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {showSearch && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
      )}
      

      
      <div className="flex items-center justify-center p-3">
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
      </div>
    </div>
  );
};

export default ActionBar;