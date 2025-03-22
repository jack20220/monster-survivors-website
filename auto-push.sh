#!/bin/bash

# 监控文件变化并自动提交推送
while true; do
    # 检查是否有变化
    if [[ -n $(git status -s) ]]; then
        echo "检测到文件变化，正在提交..."
        git add .
        git commit -m "自动更新: $(date)"
        git push
        echo "更新完成！"
    fi
    
    # 每30秒检查一次
    sleep 30
done