// Zustand状态管理
import { create } from 'zustand';
import { Group, Bookmark, AITool } from '../types';
import {
  getAITools,
  getGroups,
  getBookmarks,
  getCurrentAITool,
  saveCurrentAITool,
  createGroupStorage,
  updateGroupStorage,
  deleteGroupStorage,
  createBookmarkStorage,
  updateBookmarkStorage,
  deleteBookmarkStorage,
  createAITool as createAIToolStorage,
  updateAITool as updateAIToolStorage,
  deleteAITool as deleteAIToolStorage,
  getGroupsByAITool,
  getBookmarksByGroup
} from '../utils/storage';

interface AppStore {
  // 状态
  currentAITool: string;
  aiTools: AITool[];
  groups: Group[];
  bookmarks: Bookmark[];
  searchQuery: string;
  isLoading: boolean;
  selectedGroup: string | null;
  showGroupModal: boolean;
  showBookmarkModal: boolean;
  showAIToolModal: boolean;
  showAIToolAddForm: boolean;
  editingGroup: Group | null;
  editingBookmark: Bookmark | null;
  editingAITool: AITool | null;

  // 动作
  setCurrentAITool: (toolId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGroup: (groupId: string | null) => void;
  setShowGroupModal: (show: boolean) => void;
  setShowBookmarkModal: (show: boolean) => void;
  setShowAIToolModal: (show: boolean) => void;
  setShowAIToolAddForm: (show: boolean) => void;
  setEditingGroup: (group: Group | null) => void;
  setEditingBookmark: (bookmark: Bookmark | null) => void;
  setEditingAITool: (aiTool: AITool | null) => void;
  
  // 数据操作
  loadData: () => void;
  createGroup: (name: string, icon?: string) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  createBookmark: (title: string, url: string, groupId: string, favicon?: string, description?: string) => void;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (bookmarkId: string) => void;
  quickAddBookmark: (groupId: string) => Promise<boolean>;
  pinBookmark: (bookmarkId: string) => void;
  unpinBookmark: (bookmarkId: string) => void;
  createAITool: (name: string, icon: string) => void;
  updateAITool: (toolId: string, updates: Partial<AITool>) => void;
  deleteAITool: (toolId: string) => void;
  pinAITool: (toolId: string) => void;
  unpinAITool: (toolId: string) => void;
  
  // 计算属性
  getCurrentAITool: () => AITool | undefined;
  getCurrentGroups: () => Group[];
  getGroupBookmarks: (groupId: string) => Bookmark[];
  getFilteredGroups: () => Group[];
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 初始状态
  currentAITool: getCurrentAITool(),
  aiTools: [],
  groups: [],
  bookmarks: [],
  searchQuery: '',
  isLoading: false,
  selectedGroup: null,
  showGroupModal: false,
  showBookmarkModal: false,
  showAIToolModal: false,
  showAIToolAddForm: false,
  editingGroup: null,
  editingBookmark: null,
  editingAITool: null,

  // 设置当前AI工具
  setCurrentAITool: (toolId: string) => {
    saveCurrentAITool(toolId);
    set({ currentAITool: toolId, selectedGroup: null });
  },

  // 设置搜索查询
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  // 设置选中的分组
  setSelectedGroup: (groupId: string | null) => {
    set({ selectedGroup: groupId });
  },

  // 设置分组模态框显示状态
  setShowGroupModal: (show: boolean) => {
    set({ showGroupModal: show });
    if (!show) {
      set({ editingGroup: null });
    }
  },

  // 设置收藏模态框显示状态
  setShowBookmarkModal: (show: boolean) => {
    set({ showBookmarkModal: show });
    if (!show) {
      set({ editingBookmark: null });
    }
  },

  // 设置AI工具模态框显示状态
  setShowAIToolModal: (show: boolean) => {
    set({ showAIToolModal: show });
    if (!show) {
      set({ editingAITool: null, showAIToolAddForm: false });
    }
  },

  // 设置AI工具添加表单显示状态
  setShowAIToolAddForm: (show: boolean) => {
    set({ showAIToolAddForm: show });
  },

  // 快速添加当前页面收藏
  quickAddBookmark: async (groupId: string) => {
    try {
      // 获取当前页面信息
      const response = await chrome.runtime.sendMessage({ action: 'getCurrentPageInfo' });
      
      if (response && response.success && response.title && response.url) {
        const { currentAITool } = get();
        const newBookmark = createBookmarkStorage(
          response.title,
          response.url,
          groupId,
          currentAITool,
          undefined, // favicon will be auto-detected
          undefined // no description
        );
        const bookmarks = getBookmarks();
        set({ bookmarks });
        return true;
      } else {
        console.error('获取页面信息失败:', response?.error || '未知错误');
        return false;
      }
    } catch (error) {
      console.error('快速添加收藏失败:', error);
      return false;
    }
  },

  // 设置编辑中的分组
  setEditingGroup: (group: Group | null) => {
    set({ editingGroup: group });
  },

  // 设置编辑中的收藏
  setEditingBookmark: (bookmark: Bookmark | null) => {
    set({ editingBookmark: bookmark });
  },

  // 设置编辑中的AI工具
  setEditingAITool: (aiTool: AITool | null) => {
    set({ editingAITool: aiTool });
  },

  // 加载数据
  loadData: () => {
    set({ isLoading: true });
    try {
      const aiTools = getAITools();
      const groups = getGroups();
      const bookmarks = getBookmarks();
      set({ aiTools, groups, bookmarks, isLoading: false });
    } catch (error) {
      console.error('加载数据失败:', error);
      set({ isLoading: false });
    }
  },

  // 创建分组
  createGroup: (name: string, icon: string = '📁') => {
    const { currentAITool } = get();
    const newGroup = createGroupStorage(name, currentAITool, icon);
    const groups = getGroups();
    set({ groups });
  },

  // 更新分组
  updateGroup: (groupId: string, updates: Partial<Group>) => {
    updateGroupStorage(groupId, updates);
    const groups = getGroups();
    set({ groups });
  },

  // 删除分组
  deleteGroup: (groupId: string) => {
    deleteGroupStorage(groupId);
    const groups = getGroups();
    const bookmarks = getBookmarks();
    set({ groups, bookmarks, selectedGroup: null });
  },

  // 创建收藏
  createBookmark: (title: string, url: string, groupId: string, favicon?: string, description?: string) => {
    const { currentAITool } = get();
    const newBookmark = createBookmarkStorage(title, url, groupId, currentAITool, favicon, description);
    const bookmarks = getBookmarks();
    set({ bookmarks });
  },

  // 更新收藏
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => {
    updateBookmarkStorage(bookmarkId, updates);
    const bookmarks = getBookmarks();
    set({ bookmarks });
  },

  // 删除收藏
  deleteBookmark: (bookmarkId: string) => {
    deleteBookmarkStorage(bookmarkId);
    const bookmarks = getBookmarks();
    set({ bookmarks });
  },

  // 置顶收藏
  pinBookmark: (bookmarkId: string) => {
    updateBookmarkStorage(bookmarkId, { 
      isPinned: true, 
      pinnedAt: Date.now() 
    });
    const bookmarks = getBookmarks();
    set({ bookmarks });
  },

  // 取消置顶收藏
  unpinBookmark: (bookmarkId: string) => {
    updateBookmarkStorage(bookmarkId, { 
      isPinned: false, 
      pinnedAt: undefined 
    });
    const bookmarks = getBookmarks();
    set({ bookmarks });
  },

  // 创建AI工具
  createAITool: (name: string, icon: string) => {
    const newAITool = createAIToolStorage(name, icon);
    const aiTools = getAITools();
    set({ aiTools });
  },

  // 更新AI工具
  updateAITool: (toolId: string, updates: Partial<AITool>) => {
    updateAIToolStorage(toolId, updates);
    const aiTools = getAITools();
    set({ aiTools });
  },

  // 删除AI工具
  deleteAITool: (toolId: string) => {
    deleteAIToolStorage(toolId);
    const aiTools = getAITools();
    const groups = getGroups();
    const bookmarks = getBookmarks();
    set({ aiTools, groups, bookmarks, selectedGroup: null });
  },

  // 置顶AI工具
  pinAITool: (toolId: string) => {
    updateAIToolStorage(toolId, { 
      isPinned: true, 
      pinnedAt: Date.now() 
    });
    const aiTools = getAITools();
    set({ aiTools });
  },

  // 取消置顶AI工具
  unpinAITool: (toolId: string) => {
    updateAIToolStorage(toolId, { 
      isPinned: false, 
      pinnedAt: undefined 
    });
    const aiTools = getAITools();
    set({ aiTools });
  },

  // 获取当前AI工具对象
  getCurrentAITool: () => {
    const { currentAITool, aiTools } = get();
    return aiTools.find(tool => tool.id === currentAITool);
  },

  // 获取当前AI工具的分组
  getCurrentGroups: () => {
    const { currentAITool } = get();
    return getGroupsByAITool(currentAITool);
  },

  // 获取分组的收藏
  getGroupBookmarks: (groupId: string) => {
    const bookmarks = getBookmarksByGroup(groupId);
    // 对收藏进行排序：置顶的在前面，按置顶时间倒序排列
    return [...bookmarks].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isPinned && b.isPinned) {
        return (b.pinnedAt || 0) - (a.pinnedAt || 0);
      }
      return 0;
    });
  },

  // 获取过滤后的分组
  getFilteredGroups: () => {
    const { searchQuery } = get();
    const groups = get().getCurrentGroups();
    
    if (!searchQuery.trim()) {
      return groups;
    }
    
    const query = searchQuery.toLowerCase();
    return groups.filter(group => {
      // 搜索分组名称
      if (group.name.toLowerCase().includes(query)) {
        return true;
      }
      
      // 搜索分组下的收藏标题
      const bookmarks = getBookmarksByGroup(group.id);
      return bookmarks.some(bookmark => 
        bookmark.title.toLowerCase().includes(query)
      );
    });
  }
}));