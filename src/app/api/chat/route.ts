import { API_CONFIG, APIError } from '@/config/api';
import { NextResponse } from 'next/server';
import { ChatMessage } from '@/types/chat';
import { fetchWithRetry } from '@/utils/api';

// Next.js API 路由处理函数
export async function POST(request: Request) {
  try {
    // 解析请求体中的消息数据
    const { messages } = await request.json();

    // 检查 API 密钥是否配置
    if (!API_CONFIG.API_KEY) {
      throw new APIError('API 密钥未配置', 500);
    }

    // 调用 AI API
    const response = await fetchWithRetry(
      API_CONFIG.API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        },
        body: JSON.stringify({
          model: API_CONFIG.MODEL,
          messages: messages,
          temperature: 0.7,  // 控制回答的随机性，0-1之间
        }),
      }
    );

    const data = await response.json();
    
    // 处理 API 返回的错误
    if (data.error) {
      throw new APIError(data.error.message, 500, data.error.code);
    }

    // 返回 AI 的回答
    return NextResponse.json({
      message: data.choices[0].message,
    });
  } catch (error) {
    // 错误处理和日志记录
    console.error('Chat API Error:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
} 