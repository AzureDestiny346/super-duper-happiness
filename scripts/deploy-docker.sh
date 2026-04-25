#!/bin/bash
# ===========================================
# 智课工坊 - Docker 部署脚本
# ===========================================

set -e

echo "=========================================="
echo "  智课工坊 - Docker 快速部署"
echo "=========================================="
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 镜像名称
IMAGE_NAME="zhike-studio"
IMAGE_TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

echo "🔨 构建 Docker 镜像..."
docker build -t ${FULL_IMAGE_NAME} .

echo "🚀 停止并删除旧容器（如果存在）..."
docker stop ${IMAGE_NAME} 2>/dev/null || true
docker rm ${IMAGE_NAME} 2>/dev/null || true

echo "🚀 启动新容器..."
docker run -d \
    --name ${IMAGE_NAME} \
    -p 5000:5000 \
    --restart unless-stopped \
    ${FULL_IMAGE_NAME}

echo ""
echo "=========================================="
echo "  ✅ 部署完成！"
echo "=========================================="
echo ""
echo "  访问地址: http://localhost:5000"
echo ""
echo "  常用命令:"
echo "  - 查看日志: docker logs -f ${IMAGE_NAME}"
echo "  - 停止服务: docker stop ${IMAGE_NAME}"
echo "  - 重启服务: docker restart ${IMAGE_NAME}"
echo ""
