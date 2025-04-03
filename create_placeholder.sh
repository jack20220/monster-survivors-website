#!/bin/bash

# 创建图片目录
mkdir -p images/games/{nes,gba,snes,other}

# 使用convert命令创建占位图片
for platform in nes gba snes other; do
    for game in $(ls games/*.html 2>/dev/null | grep -o '[^/]*\.html$' | sed 's/\.html$//'); do
        if [ -f "games/$game.html" ]; then
            # 检查游戏平台
            if grep -q "NES Games" "games/$game.html" || grep -q "fc" "games/$game.html"; then
                current_platform="nes"
            elif grep -q "GBA Games" "games/$game.html" || grep -q "gba" "games/$game.html"; then
                current_platform="gba"
            elif grep -q "SNES Games" "games/$game.html" || grep -q "sfc" "games/$game.html"; then
                current_platform="snes"
            else
                current_platform="other"
            fi
            
            # 如果平台匹配，创建占位图片
            if [ "$current_platform" = "$platform" ]; then
                echo "创建占位图片: images/games/$platform/$game.jpg"
                convert -size 800x600 xc:white -gravity center -pointsize 24 -annotate 0 "$game" "images/games/$platform/$game.jpg"
            fi
        fi
    done
done

echo "所有占位图片创建完成！"

# 添加执行权限
chmod +x "$0" 