import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AITool, AI_TOOL_ICONS } from '../types';

export const AIToolModal: React.FC = () => {
  const {
    showAIToolModal,
    setShowAIToolModal,
    showAIToolAddForm,
    setShowAIToolAddForm,
    aiTools,
    editingAITool,
    createAITool,
    updateAITool,
    deleteAITool,
    setEditingAITool
  } = useAppStore();

  const [formData, setFormData] = useState({
    name: '',
    icon: '🤖'
  });

  const [showForm, setShowForm] = useState(false);
  const [showManagement, setShowManagement] = useState(false);

  useEffect(() => {
    if (showAIToolModal) {
      if (editingAITool) {
        setFormData({
          name: editingAITool.name,
          icon: editingAITool.icon
        });
        setShowForm(true);
        setShowManagement(false);
      } else if (showAIToolAddForm) {
        setFormData({ name: '', icon: '🤖' });
        setShowForm(true);
        setShowManagement(false);
      } else {
        setShowForm(false);
        setShowManagement(true);
      }
    } else {
      setFormData({ name: '', icon: '🤖' });
      setShowForm(false);
      setShowManagement(false);
    }
  }, [showAIToolModal, editingAITool, showAIToolAddForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingAITool) {
      updateAITool(editingAITool.id, { name: formData.name, icon: formData.icon });
    } else {
      createAITool(formData.name, formData.icon);
    }

    handleCancel();
  };

  const handleCancel = () => {
    if (showForm) {
      // 如果是编辑模式，直接关闭整个弹窗
      if (editingAITool) {
        setShowAIToolModal(false);
      } else if (showAIToolAddForm) {
        // 如果是从"添加新工具"按钮进入的，直接关闭弹窗
        setShowAIToolModal(false);
      } else {
        // 如果是从管理界面进入的新增模式，回到管理界面
        setShowForm(false);
        setShowManagement(true);
      }
      setEditingAITool(null);
      setShowAIToolAddForm(false);
      setFormData({ name: '', icon: '🤖' });
    } else {
      setShowAIToolModal(false);
    }
  };

  const handleEdit = (tool: AITool) => {
    setEditingAITool(tool);
    setFormData({
      name: tool.name,
      icon: tool.icon
    });
    setShowForm(true);
    setShowManagement(false);
  };

  const handleDelete = (toolId: string) => {
    if (confirm('确定要删除这个AI工具吗？删除后该工具下的所有分组和收藏也会被删除。')) {
      deleteAITool(toolId);
    }
  };

  const handleAddNew = () => {
    setEditingAITool(null);
    setFormData({ name: '', icon: '🤖' });
    setShowForm(true);
    setShowManagement(false);
  };

  if (!showAIToolModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {showForm ? (editingAITool ? '编辑工具' : '添加工具') : 'AI工具管理'}
          </h2>
          <button
            onClick={() => setShowAIToolModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {showManagement ? (
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
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-lg">
                        {tool.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
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