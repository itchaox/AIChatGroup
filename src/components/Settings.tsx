import React, { useState, useRef } from 'react';
import { Download, Upload, Settings as SettingsIcon, X, FileText, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { exportData, importData } = useAppStore();
  const [importMode, setImportMode] = useState<'merge' | 'overwrite'>('merge');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理弹窗关闭
  const handleClose = () => {
    setImportResult(null); // 清除导入结果状态
    setImportMode('merge'); // 重置导入模式为默认的合并模式
    onClose();
  };

  if (!isOpen) return null;

  // 导出数据
  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AIChatGroup-${new Date().toISOString().split('T')[0].replace(/-/g, '')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImportFile(file);
    }
  };

  // 处理拖拽上传
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleImportFile(file);
    } else {
      alert('请选择有效的JSON文件');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // 导入文件
  const handleImportFile = async (file: File) => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const result = await importData(text, importMode);
      setImportResult(result);
    } catch (error) {
      console.error('读取文件失败:', error);
      setImportResult({ success: false, message: '读取文件失败，请检查文件格式' });
    } finally {
      setIsImporting(false);
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
      onClick={handleClose}
    >
      <div
        className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center space-x-2'>
            <SettingsIcon className='w-5 h-5 text-blue-600' />
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>设置</h2>
          </div>
          <button
            onClick={handleClose}
            className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* 内容 */}
        <div className='p-6 space-y-6'>
          {/* 数据导出 */}
          <div className='space-y-3'>
            <h3 className='text-md font-medium text-gray-900 dark:text-white flex items-center space-x-2'>
              <Download className='w-4 h-4' />
              <span>数据导出</span>
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              导出所有AI工具、分组和收藏数据为JSON文件，用于备份或迁移到其他设备。
            </p>
            <button
              onClick={handleExport}
              className='w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
            >
              <Download className='w-4 h-4' />
              <span>导出数据</span>
            </button>
          </div>

          {/* 分割线 */}
          <div className='border-t border-gray-200 dark:border-gray-700'></div>

          {/* 数据导入 */}
          <div className='space-y-4'>
            <h3 className='text-md font-medium text-gray-900 dark:text-white flex items-center space-x-2'>
              <Upload className='w-4 h-4' />
              <span>数据导入</span>
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>从JSON文件导入数据，可以选择合并或覆盖现有数据。</p>

            {/* 导入模式选择 */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>导入模式</label>
              <div className='space-y-2'>
                <label className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='importMode'
                    value='merge'
                    checked={importMode === 'merge'}
                    onChange={(e) => setImportMode(e.target.value as 'merge' | 'overwrite')}
                    className='text-blue-600'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>合并模式（保留现有数据，添加新数据）</span>
                </label>
                <label className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='importMode'
                    value='overwrite'
                    checked={importMode === 'overwrite'}
                    onChange={(e) => setImportMode(e.target.value as 'merge' | 'overwrite')}
                    className='text-blue-600'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>覆盖模式（清空现有数据，导入新数据）</span>
                </label>
              </div>
            </div>

            {/* 文件上传区域 */}
            <div
              className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer'
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className='w-8 h-8 text-gray-400 mx-auto mb-2' />
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>点击选择文件或拖拽JSON文件到此处</p>
              <p className='text-xs text-gray-500 dark:text-gray-500'>支持 .json 格式文件</p>
            </div>

            <input
              ref={fileInputRef}
              type='file'
              accept='.json,application/json'
              onChange={handleFileSelect}
              className='hidden'
            />

            {/* 导入状态 */}
            {isImporting && (
              <div className='flex items-center space-x-2 text-blue-600'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                <span className='text-sm'>正在导入数据...</span>
              </div>
            )}

            {/* 导入结果 */}
            {importResult && (
              <div
                className={`flex items-start space-x-2 p-3 rounded-lg ${
                  importResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}
              >
                {importResult.success ? (
                  <CheckCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
                ) : (
                  <AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
                )}
                <span className='text-sm'>{importResult.message}</span>
              </div>
            )}
          </div>

          {/* 分割线 */}
          <div className='border-t border-gray-200 dark:border-gray-700'></div>

          {/* 关于作者 */}
          <div className='space-y-3'>
            <h3 className='text-md font-medium text-gray-900 dark:text-white flex items-center space-x-2'>
              <ExternalLink className='w-4 h-4' />
              <span>关于作者</span>
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              这个插件是免费提供给大家使用的，如果觉得好用，请支持一下我，欢迎关注我的B站频道，获取插件更新和更多 AI 工具分享！
            </p>
            <button
              onClick={() => window.open('https://space.bilibili.com/521041866', '_blank')}
              className='w-full flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors'
            >
              <ExternalLink className='w-5 h-5' />
              <span className='text-base font-medium'>访问作者的B站主页 🎬</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
