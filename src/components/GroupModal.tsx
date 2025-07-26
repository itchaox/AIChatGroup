// 分组模态框组件
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GROUP_ICONS } from '../types';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

const GroupModal: React.FC = () => {
  const {
    showGroupModal,
    setShowGroupModal,
    editingGroup,
    createGroup,
    updateGroup
  } = useAppStore();
  
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📁');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editingGroup;

  useEffect(() => {
    if (showGroupModal) {
      if (editingGroup) {
        setName(editingGroup.name);
        setSelectedIcon(editingGroup.icon);
      } else {
        setName('');
        setSelectedIcon(GROUP_ICONS[0]); // 默认选中第一个图标
      }
    }
  }, [showGroupModal, editingGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && editingGroup) {
        updateGroup(editingGroup.id, {
          name: name.trim(),
          icon: selectedIcon
        });
      } else {
        createGroup(name.trim(), selectedIcon);
      }
      
      setShowGroupModal(false);
    } catch (error) {
      console.error('保存分组失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowGroupModal(false);
  };

  if (!showGroupModal) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? '编辑分组' : '新建分组'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分组名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入分组名称"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择图标
            </label>
            <div className="grid grid-cols-8 gap-2">
              {GROUP_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={cn(
                    "w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm transition-colors",
                    selectedIcon === icon
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '保存中...' : (isEditing ? '保存' : '创建')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;