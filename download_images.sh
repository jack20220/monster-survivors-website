#!/bin/bash

# 创建图片目录
mkdir -p images/games/{nes,gba,snes,other}

# 定义图片下载函数
download_image() {
    local url=$1
    local output=$2
    echo "下载: $url -> $output"
    curl -L "$url" -o "$output" --max-time 10
}

# 下载NES游戏图片
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/nes/super-mario-bros.jpg" "images/games/nes/super-mario.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/nes/contra.jpg" "images/games/nes/contra.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/nes/battle-city.jpg" "images/games/nes/tank.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/nes/chrono-trigger.jpg" "images/games/nes/chrono-trigger.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/nes/final-fantasy-6.jpg" "images/games/nes/final-fantasy-6.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/nes/zelda-link-to-the-past.jpg" "images/games/nes/legend-of-zelda.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/nes/super-mario-world.jpg" "images/games/nes/super-mario-world.jpg"

# 下载GBA游戏图片
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/gba/pokemon-emerald.jpg" "images/games/gba/pokemon-emerald.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/gba/fire-emblem.jpg" "images/games/gba/fire-emblem.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/gba/advance-wars.jpg" "images/games/gba/advance-wars.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/gba/zelda-minish-cap.jpg" "images/games/gba/zelda-minish-cap.jpg"

# 下载SNES游戏图片
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/snes/chrono-trigger.jpg" "images/games/snes/chrono-trigger.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/snes/final-fantasy-6.jpg" "images/games/snes/final-fantasy-6.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/snes/super-mario-world.jpg" "images/games/snes/super-mario-world.jpg"
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/snes/zelda-link-to-the-past.jpg" "images/games/snes/legend-of-zelda.jpg"

# 下载其他游戏图片
download_image "https://raw.githubusercontent.com/retrogamehandbook/retrogamehandbook.github.io/master/images/other/monster-survivors.jpg" "images/games/other/monster-survivors.jpg"

echo "所有图片下载完成！"

# 添加执行权限
chmod +x "$0" 