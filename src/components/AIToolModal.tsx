import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AITool, AI_TOOL_ICONS, AI_TOOL_COLORS } from '../types';

interface AIToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIToolModal: React.FC<AIToolModalProps> = ({ isOpen, onClose }) => {
  const {
    aiTools,
    editingAITool,
    createAITool,
    updateAITool,
    deleteAITool,
    setEditingAITool
  } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    icon: '🤖',
    color: '#10A37F',
    url: ''
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (editingAITool) {
      setFormData({
        name: editingAITool.name,
        icon: editingAITool.icon,
        color: editingAITool.color,
        url: editingAITool.url || ''
      });
      setShowForm(true);
    } else {
      setFormData({
        name: '',
        icon: '🤖',
        color: '#10A37F',
        url: ''
      });
      setShowForm(false);
    }
  }, [editingAITool]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingAITool) {
      updateAITool(editingAITool.id, formData);
    } else {
      createAITool(formData.name, formData.icon, formData.color, formData.url || undefined);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      icon: '🤖',
      color: '#10A37F',
      url: ''
    });
    setShowForm(false);
    setEditingAITool(null);
  };

  const handleEdit = (tool: AITool) => {
    setEditingAITool(tool);
  };

  const handleDelete = (toolId: string) => {
    if (confirm('确定要删除这个AI工具吗？删除后该工具下的所有分组和收藏也会被删除。')) {
      deleteAITool(toolId);
    }
  };

  const handleAddNew = () => {
    setEditingAITool(null);
    setShowForm(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            AI工具管理
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {!showForm ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">已有工具</h3>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加工具
                </button>
              </div>

              <div className="grid gap-3">
                {aiTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                        style={{ backgroundColor: tool.color }}
                      >
                        {tool.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                        {tool.url && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {tool.url}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {aiTools.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>暂无AI工具</p>
                  <button
                    onClick={handleAddNew}
                    className="mt-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    点击添加第一个工具
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAITool ? '编辑工具' : '添加工具'}
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工具名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入工具名称"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工具图标
                </label>
                <div className="grid grid-cols-8 gap-2 mb-3">
                  {AI_TOOL_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors ${
                        formData.icon === icon
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="或输入自定义图标"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主题颜色
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {AI_TOOL_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-12 h-8 rounded-lg transition-all ${
                        formData.color === color
                          ? 'ring-2 ring-gray-400 ring-offset-2'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  工具网址（可选）
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingAITool ? '保存' : '添加'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};