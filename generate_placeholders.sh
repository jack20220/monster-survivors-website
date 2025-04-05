#!/bin/bash

# 创建必要的目录
mkdir -p images/games/{nes,gba,snes,other}

# 使用wkhtmltoimage生成图片
# 注意：需要先安装wkhtmltoimage
# brew install wkhtmltoimage

# NES游戏
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/nes/super-mario.jpg
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/nes/contra.jpg
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/nes/tank.jpg

# GBA游戏
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/gba/pokemon-emerald.jpg
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/gba/fire-emblem.jpg
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/gba/advance-wars.jpg
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/gba/zelda-minish-cap.jpg

# SNES游戏
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/snes/chrono-trigger.jpg
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/snes/final-fantasy-6.jpg
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/snes/zelda-link-to-the-past.jpg
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/snes/super-mario-world.jpg

# 其他游戏
wkhtmltoimage --width 300 --height 200 create_placeholder.html images/games/other/monster-survivors.jpg

echo "所有占位图片已生成完成" 