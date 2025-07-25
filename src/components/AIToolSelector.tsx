// AI工具选择器组件
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ChevronDown, Plus, Edit, Trash2, Pin } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

const AIToolSelector: React.FC = () => {
  const { 
    currentAITool, 
    aiTools, 
    setCurrentAITool, 
    showAIToolModal,
    setShowAIToolModal,
    setEditingAITool,
    setShowAIToolAddForm,
    pinAITool,
    unpinAITool
  } = useAppStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTool = aiTools.find(tool => tool.id === currentAITool);
  
  // 对AI工具进行排序：置顶的在前面，按置顶时间倒序排列
  const sortedAITools = [...aiTools].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.isPinned && b.isPinned) {
      return (b.pinnedAt || 0) - (a.pinnedAt || 0);
    }
    return 0;
  });

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectTool = (toolId: string) => {
    setCurrentAITool(toolId);
    setIsOpen(false);
  };

  const handleEditTool = (toolId: string) => {
    const tool = aiTools.find(t => t.id === toolId);
    if (tool) {
      setEditingAITool(tool);
      setShowAIToolModal(true);
    }
    setIsOpen(false);
  };

  const handleAddNewTool = () => {
    setEditingAITool(null);
    setShowAIToolAddForm(true);
    setShowAIToolModal(true);
    setIsOpen(false);
  };

  const handleEditGroup = (toolId: string) => {
    // TODO: 实现编辑分组功能
    console.log('编辑分组:', toolId);
    setActiveDropdown(null);
    setIsOpen(false);
  };

  const handleDeleteGroup = (toolId: string) => {
    // TODO: 实现删除分组功能
    console.log('删除分组:', toolId);
    setActiveDropdown(null);
    setIsOpen(false);
  };

  const handlePinTool = (toolId: string) => {
    pinAITool(toolId);
    setActiveDropdown(null);
    setIsOpen(false);
  };

  const handleUnpinTool = (toolId: string) => {
    unpinAITool(toolId);
    setActiveDropdown(null);
    setIsOpen(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };

    if (isOpen || activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, activeDropdown]);

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="relative" ref={dropdownRef}>
          {/* 下拉选择器触发按钮 */}
          <button
            onClick={handleToggleDropdown}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "text-gray-700 dark:text-gray-300"
            )}
          >
            <div className="flex items-center gap-3">
              {currentTool && (
                <>
                  <span className="text-lg">{currentTool.icon}</span>
                  <span>{currentTool.name}</span>
                </>
              )}
            </div>
            <ChevronDown 
              className={cn(
                "w-4 h-4 transition-transform",
                isOpen ? "rotate-180" : ""
              )} 
            />
          </button>

          {/* 下拉菜单 */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-40 dark:bg-gray-800 dark:border-gray-700 max-h-[460px] overflow-y-auto">
              {/* 新增工具按钮 */}
              <button
                onClick={handleAddNewTool}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>添加新工具</span>
              </button>
              
              {/* 分隔线 */}
              <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
              
              {/* AI工具列表 */}
               {sortedAITools.map((tool) => {
                 const isActive = currentAITool === tool.id;
                 return (
                   <div key={tool.id} className="group relative">
                     <button
                       onClick={() => handleSelectTool(tool.id)}
                       className={cn(
                         "w-full flex items-center gap-3 px-4 py-3 pr-12 text-sm transition-colors text-left",
                         isActive
                           ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                           : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                       )}
                     >
                       <span className="text-lg">{tool.icon}</span>
                       <span className="flex-1 truncate">{tool.name}</span>
                     </button>
                     
                     {/* 右侧按钮区域 - 置顶图标和省略号按钮在同一位置 */}
                     <div className="absolute right-2 top-1/2 -translate-y-1/2 z-[99998] w-6 h-6 flex items-center justify-center">
                       {/* 置顶图标 - 默认显示，hover时隐藏，有下拉菜单时也隐藏 */}
                       <div className={cn(
                         "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                         tool.isPinned && !activeDropdown ? "group-hover:opacity-0 opacity-100" : "opacity-0"
                       )}>
                         <Pin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                       </div>
                       
                       {/* 省略号菜单按钮 - hover时显示 */}
                       <div className={cn(
                         "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                         activeDropdown && activeDropdown !== tool.id ? "opacity-0 pointer-events-none" : "",
                         "opacity-0 group-hover:opacity-100"
                       )}>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setActiveDropdown(activeDropdown === tool.id ? null : tool.id);
                           }}
                           className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                           title="更多选项"
                         >
                           <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                         </button>
                         
                         {/* 下拉菜单 */}
                         {activeDropdown === tool.id && (
                           <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[999999] dark:bg-gray-800 dark:border-gray-700 min-w-[120px]">
                             {tool.isPinned ? (
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleUnpinTool(tool.id);
                                 }}
                                 className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                               >
                                 <Pin className="w-3 h-3" />
                                 <span>取消置顶</span>
                               </button>
                             ) : (
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handlePinTool(tool.id);
                                 }}
                                 className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
                               >
                                 <Pin className="w-3 h-3" />
                                 <span>置顶</span>
                               </button>
                             )}
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleEditTool(tool.id);
                               }}
                               className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                             >
                               <Edit className="w-3 h-3" />
                               <span>编辑工具</span>
                             </button>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDeleteGroup(tool.id);
                               }}
                               className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                             >
                               <Trash2 className="w-3 h-3" />
                               <span>删除工具</span>
                             </button>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 );
               })}
            </div>
          )}
        </div>
      </div>


    </>
  );
};

export default AIToolSelector;