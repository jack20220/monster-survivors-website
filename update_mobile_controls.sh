#!/bin/bash

# 更新所有游戏页面，添加移动端控制器
echo "开始更新游戏页面，添加移动端控制器..."

# 游戏页面目录
GAMES_DIR="/Users/elifchen/CascadeProjects/yiwugame/games"

# 遍历所有游戏页面
for game_file in "$GAMES_DIR"/*.html; do
    echo "处理文件: $game_file"
    
    # 检查文件是否已经包含移动控制器脚本
    if grep -q "mobile-controls.js" "$game_file"; then
        echo "文件已包含移动控制器，跳过: $game_file"
        continue
    fi
    
    # 在</body>标签前添加移动控制器脚本
    sed -i '' 's|</body>|    <script src="../mobile-controls.js"></script>\n</body>|' "$game_file"
    
    echo "已更新: $game_file"
done

echo "所有游戏页面更新完成！"