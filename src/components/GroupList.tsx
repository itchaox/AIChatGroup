// 分组列表组件
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MoreVertical, Edit, Trash2, Plus, Search, X } from 'lucide-react';
import { Group } from '../types';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import BookmarkItem from './BookmarkItem';

interface GroupListProps {
  groups: Group[];
}

const GroupList: React.FC<GroupListProps> = ({ groups }) => {
  const {
    selectedGroup,
    setSelectedGroup,
    setShowGroupModal,
    setShowBookmarkModal,
    setEditingGroup,
    deleteGroup,
    getGroupBookmarks,
    quickAddBookmark,
    searchQuery,
    setSearchQuery
  } = useAppStore();
  
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowGroupModal(true);
    setShowDropdown(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('确定要删除这个分组吗？分组下的所有收藏也会被删除。')) {
      deleteGroup(groupId);
    }
    setShowDropdown(null);
  };

  const handleAddBookmark = async (groupId: string) => {
    setShowDropdown(null);
    const success = await quickAddBookmark(groupId);
    if (!success) {
      // 如果快速添加失败，回退到手动模式
      setSelectedGroup(groupId);
      setShowBookmarkModal(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };



  // 检查是否有搜索查询
  const hasSearchQuery = searchQuery.trim().length > 0;
  
  if (groups.length === 0) {
    if (hasSearchQuery) {
      // 搜索无结果的情况
      return (
        <div className="flex-1 overflow-y-auto">
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
          
          {/* 搜索无结果状态 */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              暂无搜索结果
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              没有找到包含 "{searchQuery}" 的分组或收藏
            </p>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              清除搜索
            </button>
          </div>
        </div>
      );
    } else {
      // 没有分组的情况
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            还没有分组
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            创建第一个分组来开始管理你的AI工具收藏
          </p>
          <button
            onClick={() => setShowGroupModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            创建分组
          </button>
        </div>
      );
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
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
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-600 dark:text-gray-400 text-base">
              新建分组
            </div>
          </div>
        </button>
      </div>
      
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.id);
        const allBookmarks = getGroupBookmarks(group.id);
        
        // 根据搜索查询过滤收藏
        const filteredBookmarks = hasSearchQuery 
          ? allBookmarks.filter(bookmark => 
              bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : allBookmarks;
        
        return (
          <div key={group.id} className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center flex-1 text-left"
              >
                <div className="mr-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className="text-lg mr-3">{group.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-lg">
                    {group.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {hasSearchQuery ? `${filteredBookmarks.length}/${allBookmarks.length}` : allBookmarks.length} 个收藏
                  </div>
                </div>
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === group.id ? null : group.id)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
                
                {showDropdown === group.id && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[140px]">
                    <button
                      onClick={() => handleAddBookmark(group.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      快速收藏
                    </button>

                    <button
                      onClick={() => handleEditGroup(group)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      编辑分组
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除分组
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {isExpanded && (
              <div className="bg-gray-50 dark:bg-gray-900">
                {filteredBookmarks.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    {hasSearchQuery ? (
                      <p className="mb-2 text-base">没有匹配的收藏</p>
                    ) : (
                      <>
                        <p className="mb-2 text-base">这个分组还没有收藏</p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleAddBookmark(group.id)}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-base"
                          >
                            快速收藏
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBookmarks.map((bookmark) => (
                      <BookmarkItem key={bookmark.id} bookmark={bookmark} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupList;