import { API_CONFIG, APIError } from '@/config/api';

// 带重试机制的 fetch 函数
export async function fetchWithRetry(
  url: string,           // API 地址
  options: RequestInit,  // 请求配置
  retries = API_CONFIG.MAX_RETRIES  // 剩余重试次数
): Promise<Response> {
  try {
    // 发送请求
    const response = await fetch(url, options);
    
    // 如果响应不成功，抛出错误
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || '请求失败',
        response.status,
        errorData.code
      );
    }
    
    return response;
  } catch (error: unknown) {
    // 如果还有重试次数且错误类型适合重试，则进行重试
    if (retries > 0 && shouldRetry(error)) {
      // 计算延迟时间，使用指数退避策略
      const delay = Math.min(1000 * (API_CONFIG.MAX_RETRIES - retries + 1), 5000);
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

// 判断是否应该重试的函数
function shouldRetry(error: unknown): boolean {
  if (error instanceof APIError) {
    // 对于限流(429)和服务器错误(5xx)进行重试
    return error.status === 429 || (error.status ?? 0) >= 500;
  }
  // 网络错误也重试
  return error instanceof TypeError && error.message === 'Failed to fetch';
} 