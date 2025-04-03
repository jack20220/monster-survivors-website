#!/bin/bash

# 创建图片目录
mkdir -p images/games

# 下载并转换NES游戏图片
echo "Processing NES game images..."
curl -o images/games/monster-survivors.png "https://img.itch.zone/aW1nLzEwNzE0MDI2LnBuZw==/original/dm3%2B4E.png"
curl -o images/games/super-mario.png "https://www.yikm.net/storage/images/games/fc/Super-Mario-Bros.jpg"
curl -o images/games/contra.png "https://www.yikm.net/storage/images/games/fc/Contra.jpg"
curl -o images/games/tank.png "https://www.yikm.net/storage/images/games/fc/Battle-City.jpg"

# 下载并转换GBA游戏图片
echo "Processing GBA game images..."
curl -o images/games/pokemon-emerald.png "https://www.yikm.net/storage/images/games/gba/Pokemon-Emerald.jpg"
curl -o images/games/advance-wars.png "https://www.yikm.net/storage/images/games/gba/Advance-Wars.jpg"
curl -o images/games/fire-emblem.png "https://www.yikm.net/storage/images/games/gba/Fire-Emblem.jpg"
curl -o images/games/zelda-minish-cap.png "https://www.yikm.net/storage/images/games/gba/The-Legend-of-Zelda-The-Minish-Cap.jpg"

# 下载并转换SNES游戏图片
echo "Processing SNES game images..."
curl -o images/games/chrono-trigger.png "https://www.yikm.net/storage/images/games/sfc/Chrono-Trigger.jpg"
curl -o images/games/final-fantasy-6.png "https://www.yikm.net/storage/images/games/sfc/Final-Fantasy-VI.jpg"
curl -o images/games/super-mario-world.png "https://www.yikm.net/storage/images/games/sfc/Super-Mario-World.jpg"
curl -o images/games/zelda-link-to-past.png "https://www.yikm.net/storage/images/games/sfc/The-Legend-of-Zelda-A-Link-to-the-Past.jpg"

# 转换为WebP格式
echo "Converting to WebP format..."
for img in images/games/*.png; do
    cwebp -q 80 "$img" -o "${img%.*}.webp"
    rm "$img"  # 删除原始PNG文件
done

echo "Image optimization complete!" 