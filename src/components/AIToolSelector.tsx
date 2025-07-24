// AI工具选择器组件
import React from 'react';
import { AI_TOOLS } from '../types';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

const AIToolSelector: React.FC = () => {
  const { currentAITool, setCurrentAITool } = useAppStore();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex overflow-x-auto scrollbar-hide">
        {AI_TOOLS.map((tool) => {
          const isActive = currentAITool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setCurrentAITool(tool.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                "border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300",
                "dark:hover:text-gray-300 dark:hover:border-gray-600",
                isActive
                  ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
              style={{
                borderBottomColor: isActive ? tool.color : undefined
              }}
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="whitespace-nowrap">{tool.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AIToolSelector;