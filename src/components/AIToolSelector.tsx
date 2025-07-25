// AI工具选择器组件
import React, { useState, useRef, useEffect } from 'react';
import { Settings, ChevronDown, Plus, Cog } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

const AIToolSelector: React.FC = () => {
  const { 
    currentAITool, 
    aiTools, 
    setCurrentAITool, 
    showAIToolModal,
    setShowAIToolModal,
    setEditingAITool 
  } = useAppStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTool = aiTools.find(tool => tool.id === currentAITool);

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
    setShowAIToolModal(true);
    setIsOpen(false);
  };

  const handleManageTools = () => {
    setEditingAITool(null);
    setShowAIToolModal(true);
    setIsOpen(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 dark:bg-gray-800 dark:border-gray-700 max-h-80 overflow-y-auto">
              {/* AI工具列表 */}
               {aiTools.map((tool) => {
                 const isActive = currentAITool === tool.id;
                 return (
                   <div key={tool.id} className="group relative">
                     <button
                       onClick={() => handleSelectTool(tool.id)}
                       className={cn(
                         "w-full flex items-center gap-3 px-4 py-3 pr-10 text-sm transition-colors text-left",
                         isActive
                           ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                           : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                       )}
                     >
                       <span className="text-lg">{tool.icon}</span>
                       <span className="flex-1">{tool.name}</span>
                     </button>
                     
                     {/* 编辑按钮 */}
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         handleEditTool(tool.id);
                       }}
                       className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                       title="编辑工具"
                     >
                       <Settings className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                     </button>
                   </div>
                 );
               })}
              
              {/* 分隔线 */}
              <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
              
              {/* 管理工具按钮 */}
              <button
                onClick={handleManageTools}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Cog className="w-4 h-4" />
                <span>管理工具</span>
              </button>
              
              {/* 新增工具按钮 */}
              <button
                onClick={handleAddNewTool}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>添加新工具</span>
              </button>
            </div>
          )}
        </div>
      </div>


    </>
  );
};

export default AIToolSelector;