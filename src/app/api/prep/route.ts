import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Message, HeaderUtils } from 'coze-coding-dev-sdk';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PrepAnalysisRequest {
  subject: string;
  grade: string;
  chapter: string;
  knowledgePoints: string[];
  objectives?: string[];
  mode: 'analysis' | 'design' | 'development' | 'implementation' | 'evaluation';
}

export async function POST(request: NextRequest) {
  try {
    const body: PrepAnalysisRequest = await request.json();
    const { subject, grade, chapter, knowledgePoints, mode } = body;

    if (!chapter || !knowledgePoints || knowledgePoints.length === 0) {
      return NextResponse.json(
        { error: 'chapter and knowledgePoints are required' },
        { status: 400 }
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const client = new LLMClient(undefined, customHeaders);

    // 根据模式构建不同的提示词
    let prompt = '';
    let systemPrompt = `你是一位专业的数学教育专家，精通教学设计和课程开发。

## 你的职责
根据教师提供的课程信息，提供专业的教学设计支持。

## 输出要求
1. 使用Markdown格式输出结果
2. 内容要专业、实用、可操作
3. 充分考虑数学学科特点
4. 符合中国中学数学教学实际`;

    switch (mode) {
      case 'analysis':
        systemPrompt += `

## 分析模式
你需要对教学内容进行全面分析，包括：
1. 知识点结构梳理
2. 重点、难点识别
3. 学生常见误解预测
4. 与前后知识的关联
5. 教学价值分析`;
        prompt = `请分析以下数学内容的教学要点：

- **学科**: ${subject}
- **年级**: ${grade}
- **章节**: ${chapter}
- **知识点**: ${knowledgePoints.join('、')}

请详细分析教学要点。`;
        break;

      case 'design':
        systemPrompt += `

## 设计模式
你需要为课程设计教学目标、教学策略和评估方案：
1. 基于Bloom认知层次设计教学目标
2. 推荐合适的教学策略
3. 设计评估方式`;
        prompt = `请为以下内容设计教学方案：

- **学科**: ${subject}
- **年级**: ${grade}
- **章节**: ${chapter}
- **知识点**: ${knowledgePoints.join('、')}

请详细设计教学方案。`;
        break;

      case 'development':
        systemPrompt += `

## 开发模式
你需要生成具体的教学资源：
1. 教案详细内容
2. 配套练习题
3. 课件大纲`;
        prompt = `请为以下内容开发教学资源：

- **学科**: ${subject}
- **年级**: ${grade}
- **章节**: ${chapter}
- **知识点**: ${knowledgePoints.join('、')}

请生成详细的教案和练习题。`;
        break;

      case 'implementation':
        systemPrompt += `

## 实施模式
你需要提供课堂实施的具体建议：
1. 课堂节奏把控
2. 师生互动点提示
3. 突发情况应对`;
        prompt = `请为以下内容的课堂实施提供建议：

- **学科**: ${subject}
- **年级**: ${grade}
- **章节**: ${chapter}
- **知识点**: ${knowledgePoints.join('、')}

请提供详细的实施建议。`;
        break;

      case 'evaluation':
        systemPrompt += `

## 评估模式
你需要帮助教师进行教学反思和改进：
1. 评价方式设计
2. 教学反思指导
3. 改进建议`;
        prompt = `请为以下内容提供评估和反思建议：

- **学科**: ${subject}
- **年级**: ${grade}
- **章节**: ${chapter}
- **知识点**: ${knowledgePoints.join('、')}

请提供评估和反思建议。`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ];

    // 流式响应
    const encoder = new TextEncoder();
    const streamData = new ReadableStream({
      async start(controller) {
        try {
          let fullContent = '';
          for await (const chunk of client.stream(messages)) {
            if (chunk.content) {
              fullContent += chunk.content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`)
              );
            }
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true, result: fullContent })}\n\n`)
          );
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(streamData, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Prep API error:', error);
    return NextResponse.json(
      { error: 'Failed to process prep request', details: String(error) },
      { status: 500 }
    );
  }
}
