"use client";

import { useState } from "react";
import { 
  Library, 
  Sparkles, 
  Search,
  Copy,
  Check,
  Lightbulb,
  BookOpen,
  FileText,
  Target,
  Users,
  Settings,
  ChevronRight,
  Play
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 提示词模板分类
const promptCategories = [
  { id: "knowledge", label: "知识点讲解", icon: BookOpen, color: "bg-blue-500" },
  { id: "exercise", label: "习题设计", icon: FileText, color: "bg-green-500" },
  { id: "teaching", label: "教学设计", icon: Target, color: "bg-purple-500" },
  { id: "assessment", label: "学情分析", icon: Users, color: "bg-orange-500" },
  { id: "reflection", label: "教学反思", icon: Lightbulb, color: "bg-amber-500" },
];

// 预设提示词模板
const promptTemplates = [
  {
    id: "1",
    category: "knowledge",
    title: "数学概念讲解",
    description: "生成清晰易懂的数学概念讲解，包含定义、例子和常见误解",
    prompt: `你是一位经验丰富的高中数学教师，擅长用通俗易懂的方式讲解数学概念。

## 任务
请为【知识点】设计一个清晰易懂的讲解方案。

## 内容要求
1. 【核心定义】给出严格的数学定义，并解释每个符号的含义
2. 【直观理解】提供生活中的实例或几何直观
3. 【类比说明】用类比帮助理解抽象概念
4. 【典型例题】提供3道由易到难的例题
5. 【常见误解】列出学生常犯的错误及纠正方法
6. 【记忆技巧】提供记忆口诀或方法

## 格式要求
- 使用Markdown格式
- 数学公式使用LaTeX格式
- 例题要给出详细解答步骤`,
    variables: ["知识点", "年级"],
    usageCount: 128,
    rating: 4.8,
  },
  {
    id: "2",
    category: "knowledge",
    title: "定理证明讲解",
    description: "详细讲解数学定理的证明过程和思路",
    prompt: `你是一位大学数学教师，精通数学证明方法。

## 任务
请详细讲解【定理名称】的证明。

## 内容要求
1. 【定理内容】完整陈述定理
2. 【证明思路】解释为什么这样证明，关键思想是什么
3. 【证明步骤】分步证明，每步说明理由
4. 【证明方法】说明这种证明方法的特点和适用范围
5. 【应用举例】定理的应用场景
6. 【思考延伸】能否用其他方法证明

## 注意
- 证明过程中每一步都要说明依据
- 适当使用图形或直观说明
- 标注证明中的关键步骤`,
    variables: ["定理名称", "证明方法偏好"],
    usageCount: 86,
    rating: 4.9,
  },
  {
    id: "3",
    category: "exercise",
    title: "分层习题设计",
    description: "根据知识点设计基础题、变式题和拓展题",
    prompt: `你是一位资深数学教研员，擅长设计分层练习。

## 任务
为【知识点】设计一套分层练习题。

## 题目要求

### 基础题（5道）
- 考察基本概念和公式的直接应用
- 难度：初级
- 覆盖核心知识点

### 变式题（3道）
- 变换条件或提问方式
- 难度：中等
- 考察灵活运用能力

### 拓展题（2道）
- 综合应用或探索性问题
- 难度：较难
- 可结合实际情境

## 输出格式
请按以下结构输出：
【基础题】
1. 题目... 答案... 解析...

【变式题】
1. 题目... 答案... 解析...

【拓展题】
1. 题目... 答案... 解析...

## 注意事项
- 每道题都要有详细解析
- 注明题目考察的知识点
- 基础题要有足够的练习量`,
    variables: ["知识点", "难度系数", "题目数量"],
    usageCount: 203,
    rating: 4.7,
  },
  {
    id: "4",
    category: "teaching",
    title: "教学目标设计",
    description: "基于Bloom认知层次设计教学目标",
    prompt: `你是一位教育学专家，精通教学目标设计。

## 任务
根据【教学内容】设计完整的教学目标。

## 要求
基于Bloom认知层次分类，从以下六个层次设计：

1. 【记忆层】能说出/列出/辨认...
2. 【理解层】能用自己的话解释/举例说明/比较...
3. 【应用层】能运用...解决...问题
4. 【分析层】能分析...的区别/关系/原因
5. 【评价层】能评价...的合理性/有效性
6. 【创造层】能设计/提出/构建...

## 输出要求
- 每个层次至少1条目标
- 使用可观察、可测量的行为动词
- 目标要具体、可达成

## 示例格式
| 认知层次 | 教学目标 |
|---------|---------|
| 记忆 | ... |
| 理解 | ... |`,
    variables: ["教学内容", "学生年级", "课时数"],
    usageCount: 156,
    rating: 4.6,
  },
  {
    id: "5",
    category: "teaching",
    title: "课堂导入设计",
    description: "设计引人入胜的课堂导入环节",
    prompt: `你是一位教学设计专家，擅长课堂导入设计。

## 任务
为【教学内容】设计一个精彩的课堂导入。

## 导入方式（可选择或组合）
1. 【情境导入】创设生活或问题情境
2. 【旧知导入】从已学知识自然过渡
3. 【问题导入】提出引发思考的问题
4. 【实验探究导入】通过动手操作引入
5. 【故事历史导入】数学史或趣味故事

## 设计要求
1. 【时间控制】控制在3-5分钟
2. 【激发兴趣】引起学生好奇心
3. 【明确目标】让学生知道要学什么
4. 【建立联系】与学生已有知识关联
5. 【难度适中】符合学生认知水平

## 输出内容
1. 导入方式选择及理由
2. 具体导入过程（详细步骤）
3. 设计意图说明
4. 可能遇到的问题及应对`,
    variables: ["教学内容", "学生特点", "课时类型"],
    usageCount: 178,
    rating: 4.8,
  },
  {
    id: "6",
    category: "assessment",
    title: "学情分析诊断",
    description: "分析学生学情，识别学习障碍",
    prompt: `你是一位教学诊断专家，擅长学情分析。

## 任务
分析学生学习【知识点】可能遇到的困难。

## 分析维度

### 1. 知识基础分析
- 学生已具备哪些相关知识？
- 存在哪些知识漏洞可能影响新知学习？

### 2. 认知障碍分析
- 哪些概念容易混淆？
- 哪些地方容易产生误解？
- 思维障碍在哪里？

### 3. 学习特点分析
- 抽象概念理解困难
- 符号运算不熟练
- 几何直观欠缺
- 数学语言表达弱

### 4. 情感态度分析
- 学习动机如何？
- 对该内容是否有畏难情绪？

## 教学建议
根据分析结果，给出针对性教学建议。

## 输出格式
使用Markdown格式，分点详细说明。`,
    variables: ["知识点", "学生年级", "班级特点"],
    usageCount: 92,
    rating: 4.5,
  },
  {
    id: "7",
    category: "reflection",
    title: "教学反思生成",
    description: "帮助教师进行课后教学反思",
    prompt: `你是一位教学反思指导专家。

## 任务
帮助教师对【教学内容】进行教学反思。

## 反思框架

### 1. 教学目标达成
- 预设目标是否达成？
- 哪些目标达成得好？哪些有欠缺？

### 2. 教学过程回顾
- 哪些环节进行顺利？
- 哪些环节出现问题？
- 时间安排是否合理？

### 3. 学生学习情况
- 大部分学生掌握情况如何？
- 哪些学生遇到困难？
- 生成性资源是否有效利用？

### 4. 教学策略反思
- 哪些教学方法有效？
- 需要改进的地方？
- 下次如何调整？

### 5. 改进计划
- 针对问题的改进措施
- 需要强化的内容
- 后续跟进计划

## 输出要求
- 结合具体教学情境
- 给出可操作的改进建议
- 使用引导性问题促进思考`,
    variables: ["教学内容", "教学时长", "班级情况"],
    usageCount: 134,
    rating: 4.7,
  },
];

export default function PromptPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<typeof promptTemplates[0] | null>(null);
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("templates");

  // 复制提示词
  const handleCopyPrompt = (template: typeof promptTemplates[0]) => {
    let prompt = template.prompt;
    Object.entries(customVariables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\[${key}\\]`, "g"), value || `[${key}]`);
    });
    navigator.clipboard.writeText(prompt);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 使用模板
  const handleUseTemplate = (template: typeof promptTemplates[0]) => {
    const variables: Record<string, string> = {};
    template.variables.forEach(v => {
      variables[v] = "";
    });
    setCustomVariables(variables);
    setSelectedPrompt(template);
  };

  // 过滤模板
  const filteredTemplates = promptTemplates.filter(t => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch = t.title.includes(searchQuery) || t.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Library className="h-7 w-7 text-indigo-600" />
            提示词工坊
          </h1>
          <p className="text-muted-foreground">
            专为数学学科设计的GAI提示词框架，帮助您快速生成高质量教学内容
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索提示词模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {promptCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {promptCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? "all" : cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? `${cat.color} text-white`
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="templates">模板库</TabsTrigger>
            <TabsTrigger value="builder">提示词构建器</TabsTrigger>
            <TabsTrigger value="cases">优秀案例</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="card-hover cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary"
                        className={
                          template.category === "knowledge" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                          template.category === "exercise" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                          template.category === "teaching" ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" :
                          template.category === "assessment" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" :
                          "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        }
                      >
                        {promptCategories.find(c => c.id === template.category)?.label}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="text-sm font-medium">{template.rating}</span>
                        <span className="text-xs">★</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        使用 {template.usageCount} 次
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCopyPrompt(template)}
                        >
                          {copiedId === template.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleUseTemplate(template)}
                        >
                          使用
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  <CardTitle>提示词构建器</CardTitle>
                </div>
                <CardDescription>
                  通过可视化组件组合，自定义您的专属提示词
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 角色设定 */}
                <div>
                  <label className="text-sm font-medium mb-2 block">角色设定</label>
                  <Textarea 
                    placeholder="例如：你是一位具有10年教学经验的高中数学教师..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* 任务描述 */}
                <div>
                  <label className="text-sm font-medium mb-2 block">任务描述</label>
                  <Textarea 
                    placeholder="描述你要AI完成的任务..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* 约束条件 */}
                <div>
                  <label className="text-sm font-medium mb-2 block">约束条件</label>
                  <Textarea 
                    placeholder="列出对输出的具体要求..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* 输出格式 */}
                <div>
                  <label className="text-sm font-medium mb-2 block">输出格式</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择输出格式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="markdown">Markdown</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="plain">纯文本</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 温度参数 */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    创造性温度: <span className="text-indigo-600">0.7</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    defaultValue="0.7"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>精确</span>
                    <span>创意</span>
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  测试提示词
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases" id="cases" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>二次函数图像与性质 - 教案设计</CardTitle>
                  <CardDescription>使用知识点讲解+教学目标模板组合</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="font-medium text-indigo-600 mb-1">核心知识点</div>
                      <p>二次函数的定义、图像特征、顶点坐标、对称轴</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="font-medium text-green-600 mb-1">教学目标</div>
                      <p>理解二次函数概念，掌握图像绘制方法，能够应用性质解决问题</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="font-medium text-purple-600 mb-1">课堂活动</div>
                      <p>情境导入 → 概念讲解 → 图像绘制 → 小组探究 → 总结提升</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>三角函数诱导公式 - 分层练习</CardTitle>
                  <CardDescription>使用分层习题模板生成</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">基础题 5道</Badge>
                      <p className="text-sm text-muted-foreground">直接应用公式计算 sin(π/6), cos(π/3) 等</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">变式题 3道</Badge>
                      <p className="text-sm text-muted-foreground">sin(π/6 + α) 类型题的化简</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">拓展题 2道</Badge>
                      <p className="text-sm text-muted-foreground">综合应用证明题</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 使用模板对话框 */}
      <Dialog open={!!selectedPrompt} onOpenChange={() => setSelectedPrompt(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPrompt?.title}</DialogTitle>
            <DialogDescription>{selectedPrompt?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 变量填充 */}
            <div className="grid grid-cols-2 gap-4">
              {selectedPrompt?.variables.map((variable) => (
                <div key={variable}>
                  <label className="text-sm font-medium mb-1 block">{variable}</label>
                  <Input
                    placeholder={`输入${variable}...`}
                    value={customVariables[variable] || ""}
                    onChange={(e) => setCustomVariables({
                      ...customVariables,
                      [variable]: e.target.value
                    })}
                  />
                </div>
              ))}
            </div>

            {/* 预览 */}
            <div>
              <label className="text-sm font-medium mb-1 block">提示词预览</label>
              <Textarea 
                value={
                  selectedPrompt?.prompt.replace(
                    /\[([^\]]+)\]/g, 
                    (match, key) => customVariables[key] || match
                  ) || ""
                }
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => selectedPrompt && handleCopyPrompt(selectedPrompt)}
              >
                {copiedId === selectedPrompt?.id ? (
                  <>
                    <Check className="h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    复制提示词
                  </>
                )}
              </Button>
              <Button className="flex-1 gap-2">
                <Sparkles className="h-4 w-4" />
                使用此模板备课
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
