// 数据类型定义

export interface AITool {
  id: string;
  name: string;
  icon: string;
  color: string;
  url?: string;
}

export interface Group {
  id: string;
  name: string;
  icon: string;
  aiToolId: string;
  createdAt: number;
  updatedAt: number;
  order: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  groupId: string;
  aiToolId: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  order: number;
}

export interface AppState {
  currentAITool: string;
  aiTools: AITool[];
  groups: Group[];
  bookmarks: Bookmark[];
  searchQuery: string;
  isLoading: boolean;
}

// 默认的AI工具
export const DEFAULT_AI_TOOLS: AITool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: '🤖',
    color: '#10A37F',
    url: 'https://chat.openai.com'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠',
    color: '#FF6B35',
    url: 'https://claude.ai'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '💎',
    color: '#4285F4',
    url: 'https://gemini.google.com'
  },
  {
    id: 'poe',
    name: 'Poe',
    icon: '🎭',
    color: '#8B5CF6',
    url: 'https://poe.com'
  },
  {
    id: 'character',
    name: 'Character.AI',
    icon: '🎪',
    color: '#FF4081',
    url: 'https://character.ai'
  }
];

// 预设的AI工具图标
export const AI_TOOL_ICONS = [
  '🤖', '🧠', '💎', '🎭', '🎪', '🚀', '⚡', '🔥',
  '💡', '🌟', '🎯', '🎨', '🔧', '📱', '💻', '🖥️'
];

// 预设的AI工具颜色
export const AI_TOOL_COLORS = [
  '#10A37F', '#FF6B35', '#4285F4', '#8B5CF6', '#FF4081',
  '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6',
  '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
];

// 默认分组图标
export const GROUP_ICONS = [
  '📁', '📂', '🗂️', '📋', '📌', '⭐', '🔖', '💼',
  '🎯', '🚀', '💡', '🔥', '⚡', '🌟', '🎨', '🔧'
];