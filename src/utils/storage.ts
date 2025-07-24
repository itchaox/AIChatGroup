// 存储管理工具
import { Group, Bookmark, AI_TOOLS } from '../types';

const STORAGE_KEYS = {
  GROUPS: 'ai_tool_groups',
  BOOKMARKS: 'ai_tool_bookmarks',
  CURRENT_TOOL: 'current_ai_tool',
  SETTINGS: 'app_settings'
};

// 获取所有分组
export const getGroups = (): Group[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('获取分组数据失败:', error);
    return [];
  }
};

// 保存分组
export const saveGroups = (groups: Group[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  } catch (error) {
    console.error('保存分组数据失败:', error);
  }
};

// 获取所有收藏
export const getBookmarks = (): Bookmark[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('获取收藏数据失败:', error);
    return [];
  }
};

// 保存收藏
export const saveBookmarks = (bookmarks: Bookmark[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('保存收藏数据失败:', error);
  }
};

// 获取当前选中的AI工具
export const getCurrentAITool = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_TOOL) || AI_TOOLS[0].id;
  } catch (error) {
    console.error('获取当前AI工具失败:', error);
    return AI_TOOLS[0].id;
  }
};

// 保存当前选中的AI工具
export const saveCurrentAITool = (toolId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TOOL, toolId);
  } catch (error) {
    console.error('保存当前AI工具失败:', error);
  }
};

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 创建新分组
export const createGroup = (name: string, aiToolId: string, icon: string = '📁'): Group => {
  const groups = getGroups();
  const maxOrder = groups.filter(g => g.aiToolId === aiToolId).reduce((max, g) => Math.max(max, g.order), 0);
  
  const newGroup: Group = {
    id: generateId(),
    name,
    icon,
    aiToolId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    order: maxOrder + 1
  };
  
  const updatedGroups = [...groups, newGroup];
  saveGroups(updatedGroups);
  return newGroup;
};

// 更新分组
export const updateGroup = (groupId: string, updates: Partial<Group>): void => {
  const groups = getGroups();
  const updatedGroups = groups.map(group => 
    group.id === groupId 
      ? { ...group, ...updates, updatedAt: Date.now() }
      : group
  );
  saveGroups(updatedGroups);
};

// 删除分组
export const deleteGroup = (groupId: string): void => {
  const groups = getGroups();
  const bookmarks = getBookmarks();
  
  // 删除分组下的所有收藏
  const updatedBookmarks = bookmarks.filter(bookmark => bookmark.groupId !== groupId);
  saveBookmarks(updatedBookmarks);
  
  // 删除分组
  const updatedGroups = groups.filter(group => group.id !== groupId);
  saveGroups(updatedGroups);
};

// 创建新收藏
export const createBookmark = (title: string, url: string, groupId: string, aiToolId: string, favicon?: string, description?: string): Bookmark => {
  const bookmarks = getBookmarks();
  const maxOrder = bookmarks.filter(b => b.groupId === groupId).reduce((max, b) => Math.max(max, b.order), 0);
  
  const newBookmark: Bookmark = {
    id: generateId(),
    title,
    url,
    favicon,
    groupId,
    aiToolId,
    description,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    order: maxOrder + 1
  };
  
  const updatedBookmarks = [...bookmarks, newBookmark];
  saveBookmarks(updatedBookmarks);
  return newBookmark;
};

// 更新收藏
export const updateBookmark = (bookmarkId: string, updates: Partial<Bookmark>): void => {
  const bookmarks = getBookmarks();
  const updatedBookmarks = bookmarks.map(bookmark => 
    bookmark.id === bookmarkId 
      ? { ...bookmark, ...updates, updatedAt: Date.now() }
      : bookmark
  );
  saveBookmarks(updatedBookmarks);
};

// 删除收藏
export const deleteBookmark = (bookmarkId: string): void => {
  const bookmarks = getBookmarks();
  const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
  saveBookmarks(updatedBookmarks);
};

// 获取指定AI工具的分组
export const getGroupsByAITool = (aiToolId: string): Group[] => {
  const groups = getGroups();
  return groups.filter(group => group.aiToolId === aiToolId).sort((a, b) => a.order - b.order);
};

// 获取指定分组的收藏
export const getBookmarksByGroup = (groupId: string): Bookmark[] => {
  const bookmarks = getBookmarks();
  return bookmarks.filter(bookmark => bookmark.groupId === groupId).sort((a, b) => a.order - b.order);
};