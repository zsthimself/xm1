// 定义聊天消息的类型接口
export interface ChatMessage {
  // role: 消息的角色，可以是'system'(系统消息),'user'(用户消息)或'assistant'(AI助手消息)
  role: 'system' | 'user' | 'assistant';
  // content: 消息的具体内容
  content: string;
} 