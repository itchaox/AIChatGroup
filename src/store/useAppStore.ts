// Zustand状态管理
import { create } from 'zustand';
import { Group, Bookmark, AI_TOOLS } from '../types';
import {
  getGroups,
  getBookmarks,
  getCurrentAITool,
  saveCurrentAITool,
  createGroup as createGroupStorage,
  updateGroup as updateGroupStorage,
  deleteGroup as deleteGroupStorage,
  createBookmark as createBookmarkStorage,
  updateBookmark as updateBookmarkStorage,
  deleteBookmark as deleteBookmarkStorage,
  getGroupsByAITool,
  getBookmarksByGroup
} from '../utils/storage';

interface AppStore {
  // 状态
  currentAITool: string;
  groups: Group[];
  bookmarks: Bookmark[];
  searchQuery: string;
  isLoading: boolean;
  selectedGroup: string | null;
  showGroupModal: boolean;
  showBookmarkModal: boolean;
  editingGroup: Group | null;
  editingBookmark: Bookmark | null;

  // 动作
  setCurrentAITool: (toolId: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGroup: (groupId: string | null) => void;
  setShowGroupModal: (show: boolean) => void;
  setShowBookmarkModal: (show: boolean) => void;
  setEditingGroup: (group: Group | null) => void;
  setEditingBookmark: (bookmark: Bookmark | null) => void;
  
  // 数据操作
  loadData: () => void;
  createGroup: (name: string, icon?: string) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  createBookmark: (title: string, url: string, groupId: string, favicon?: string, description?: string) => void;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (bookmarkId: string) => void;
  
  // 计算属性
  getCurrentGroups: () => Group[];
  getGroupBookmarks: (groupId: string) => Bookmark[];
  getFilteredGroups: () => Group[];
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 初始状态
  currentAITool: getCurrentAITool(),
  groups: [],
  bookmarks: [],
  searchQuery: '',
  isLoading: false,
  selectedGroup: null,
  showGroupModal: false,
  showBookmarkModal: false,
  editingGroup: null,
  editingBookmark: null,

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

  // 设置编辑中的分组
  setEditingGroup: (group: Group | null) => {
    set({ editingGroup: group });
  },

  // 设置编辑中的收藏
  setEditingBookmark: (bookmark: Bookmark | null) => {
    set({ editingBookmark: bookmark });
  },

  // 加载数据
  loadData: () => {
    set({ isLoading: true });
    try {
      const groups = getGroups();
      const bookmarks = getBookmarks();
      set({ groups, bookmarks, isLoading: false });
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

  // 获取当前AI工具的分组
  getCurrentGroups: () => {
    const { currentAITool } = get();
    return getGroupsByAITool(currentAITool);
  },

  // 获取分组的收藏
  getGroupBookmarks: (groupId: string) => {
    return getBookmarksByGroup(groupId);
  },

  // 获取过滤后的分组
  getFilteredGroups: () => {
    const { searchQuery } = get();
    const groups = get().getCurrentGroups();
    
    if (!searchQuery.trim()) {
      return groups;
    }
    
    const query = searchQuery.toLowerCase();
    return groups.filter(group => 
      group.name.toLowerCase().includes(query)
    );
  }
}));