// 数据类型定义

export interface AITool {
  id: string;
  name: string;
  icon: string;
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
    icon: '🤖'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '💎'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🔍'
  },
  {
    id: 'doubao',
    name: '豆包',
    icon: '🚀'
  }
];

// 预设的AI工具图标
export const AI_TOOL_ICONS = [
  '🤖', '🧠', '💎', '🎭', '🎪', '🚀', '⚡', '🔥',
  '💡', '🌟', '🎯', '🎨', '🔧', '📱', '💻', '🖥️'
];



// 默认分组图标
export const GROUP_ICONS = [
  '📁', '📂', '🗂️', '📋', '📌', '⭐', '🔖', '💼',
  '🎯', '🚀', '💡', '🔥', '⚡', '🌟', '🎨', '🔧'
];