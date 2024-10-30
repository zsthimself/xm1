// API 相关配置
export const API_CONFIG = {
  // 从环境变量中获取 API 密钥，如果未设置则为空字符串
  API_KEY: process.env.DEEPSEEK_API_KEY || '',
  // API 的基础 URL，如果环境变量未设置则使用默认值
  API_URL: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions',
  // 使用的 AI 模型名称
  MODEL: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  // 最大重试次数，从环境变量中获取，默认为 3 次
  MAX_RETRIES: Number(process.env.MAX_RETRIES) || 3,
};

// 自定义 API 错误类，用于处理 API 调用时的错误
export class APIError extends Error {
  constructor(
    message: string,    // 错误信息
    public status?: number,  // HTTP 状态码
    public code?: string    // 错误代码
  ) {
    super(message);
    this.name = 'APIError';
  }
} 