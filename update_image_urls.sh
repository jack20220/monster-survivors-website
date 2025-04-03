#!/bin/bash

# 更新所有游戏页面的图片URL
echo "开始更新游戏页面的图片URL..."

# 定义新的图片URL
NEW_IMAGE_URL="https://www.yiwugame.online/images/games"

# 更新games目录下的HTML文件
if [ -d "games" ]; then
    for html_file in games/*.html; do
        if [ -f "$html_file" ]; then
            echo "处理文件: $html_file"
            
            # 获取游戏名称（从文件名）
            game_name=$(basename "$html_file" .html)
            
            # 根据游戏类型设置图片URL
            if grep -q "NES Games" "$html_file" || grep -q "fc" "$html_file"; then
                platform="nes"
            elif grep -q "GBA Games" "$html_file" || grep -q "gba" "$html_file"; then
                platform="gba"
            elif grep -q "SNES Games" "$html_file" || grep -q "sfc" "$html_file"; then
                platform="snes"
            else
                platform="other"
            fi
            
            # 新的图片URL
            new_url="$NEW_IMAGE_URL/$platform/$game_name.jpg"
            
            # 更新og:image和twitter:image
            sed -i '' "s|https://www.yikm.net/storage/images/games/[^/]*/[^\"']*|$new_url|g" "$html_file"
            
            echo "已更新图片URL: $html_file -> $new_url"
        fi
    done
fi

echo "所有游戏页面的图片URL更新完成！"

# 添加执行权限
chmod +x "$0" 