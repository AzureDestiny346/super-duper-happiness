"use client";

import { useState } from "react";
import { 
  FolderKanban, 
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  FileText,
  Trash2,
  Copy,
  Download,
  Star,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// 模拟项目数据
const mockProjects = [
  {
    id: "1",
    title: "二次函数图像与性质",
    subject: "初三数学",
    chapter: "二次函数",
    status: "进行中",
    updatedAt: "2024-01-15 14:30",
    createdAt: "2024-01-10 09:00",
    steps: ["analysis", "design", "development"],
    favorite: true,
  },
  {
    id: "2",
    title: "三角函数诱导公式",
    subject: "高一数学",
    chapter: "三角函数",
    status: "已完成",
    updatedAt: "2024-01-14 16:20",
    createdAt: "2024-01-08 10:00",
    steps: ["analysis", "design", "development", "implementation", "evaluation"],
    favorite: false,
  },
  {
    id: "3",
    title: "立体几何初步",
    subject: "高二数学",
    chapter: "空间几何体",
    status: "已完成",
    updatedAt: "2024-01-12 11:00",
    createdAt: "2024-01-05 08:30",
    steps: ["analysis", "design", "development", "implementation", "evaluation"],
    favorite: true,
  },
  {
    id: "4",
    title: "概率的基本性质",
    subject: "高三数学",
    chapter: "概率",
    status: "进行中",
    updatedAt: "2024-01-13 09:45",
    createdAt: "2024-01-11 14:00",
    steps: ["analysis", "design"],
    favorite: false,
  },
];

// 学科分类
const subjects = [
  { value: "math-g7", label: "七年级数学" },
  { value: "math-g8", label: "八年级数学" },
  { value: "math-g9", label: "九年级数学" },
  { value: "math-g10", label: "高一数学" },
  { value: "math-g11", label: "高二数学" },
  { value: "math-g12", label: "高三数学" },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewDialog, setShowNewDialog] = useState(false);
  
  // 新建项目表单
  const [newProject, setNewProject] = useState({
    title: "",
    subject: "",
    chapter: "",
    description: "",
  });

  // 过滤项目
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.includes(searchQuery) || project.subject.includes(searchQuery);
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 获取收藏项目
  const favoriteProjects = mockProjects.filter(p => p.favorite);

  // 格式化时间
  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "刚刚";
    if (hours < 24) return `${hours}小时前`;
    if (hours < 48) return "昨天";
    return time;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <FolderKanban className="h-7 w-7 text-indigo-600" />
              我的项目
            </h1>
            <p className="text-muted-foreground">
              管理您的备课项目，支持版本历史和导出分享
            </p>
          </div>
          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                新建项目
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新备课项目</DialogTitle>
                <DialogDescription>
                  填写基本信息开始智能备课之旅
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">项目名称</label>
                  <Input 
                    placeholder="例如：二次函数图像与性质"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">学科年级</label>
                  <Select 
                    value={newProject.subject}
                    onValueChange={(v) => setNewProject({...newProject, subject: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择学科和年级" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">章节/主题</label>
                  <Input 
                    placeholder="例如：二次函数"
                    value={newProject.chapter}
                    onChange={(e) => setNewProject({...newProject, chapter: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">项目描述（可选）</label>
                  <Textarea 
                    placeholder="简要描述本节课的教学重点..."
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
                <Button 
                  className="w-full gap-2"
                  onClick={() => {
                    // 创建项目逻辑
                    setShowNewDialog(false);
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  开始智能备课
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="筛选状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部项目</SelectItem>
              <SelectItem value="进行中">进行中</SelectItem>
              <SelectItem value="已完成">已完成</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">全部项目</TabsTrigger>
            <TabsTrigger value="favorite">收藏</TabsTrigger>
            <TabsTrigger value="recent">最近编辑</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map(project => (
                  <Card key={project.id} className="card-hover cursor-pointer group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1 flex items-center gap-2">
                            {project.favorite && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                            {project.title}
                          </CardTitle>
                          <CardDescription>{project.subject} · {project.chapter}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              打开
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              const p = mockProjects.find(x => x.id === project.id);
                              if (p) {
                                p.favorite = !p.favorite;
                              }
                            }}>
                              <Star className="h-4 w-4 mr-2" />
                              {project.favorite ? "取消收藏" : "收藏"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              复制项目
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              导出
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={project.status === "进行中" ? "default" : "secondary"}
                          className={project.status === "进行中" ? "bg-amber-500" : ""}
                        >
                          {project.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(project.updatedAt)}
                        </span>
                      </div>
                      
                      {/* ADDIE进度 */}
                      <div className="mt-4">
                        <div className="flex gap-1">
                          {["analysis", "design", "development", "implementation", "evaluation"].map((step, i) => (
                            <div
                              key={step}
                              className={`h-1.5 flex-1 rounded-full ${
                                project.steps.includes(step) 
                                  ? "bg-indigo-500" 
                                  : "bg-slate-200 dark:bg-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>A</span>
                          <span>D</span>
                          <span>D</span>
                          <span>I</span>
                          <span>E</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>没有找到匹配的项目</p>
                <Button variant="link" onClick={() => setShowNewDialog(true)}>
                  创建新项目
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorite">
            {favoriteProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProjects.map(project => (
                  <Card key={project.id} className="card-hover cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg mb-1 flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        {project.title}
                      </CardTitle>
                      <CardDescription>{project.subject} · {project.chapter}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{project.status}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(project.updatedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无收藏项目</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockProjects
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 6)
                .map(project => (
                  <Card key={project.id} className="card-hover cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg mb-1">{project.title}</CardTitle>
                      <CardDescription>{project.subject} · {project.chapter}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant={project.status === "进行中" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(project.updatedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
