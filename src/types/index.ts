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
  groups: Group[];
  bookmarks: Bookmark[];
  searchQuery: string;
  isLoading: boolean;
}

// 预定义的AI工具
export const AI_TOOLS: AITool[] = [
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
  },
  {
    id: 'other',
    name: '其他',
    icon: '📝',
    color: '#6B7280'
  }
];

// 默认分组图标
export const GROUP_ICONS = [
  '📁', '📂', '🗂️', '📋', '📌', '⭐', '🔖', '💼',
  '🎯', '🚀', '💡', '🔥', '⚡', '🌟', '🎨', '🔧'
];