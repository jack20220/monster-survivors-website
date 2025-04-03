#!/bin/bash

# 游戏页面目录
GAMES_DIR="/Users/elifchen/CascadeProjects/yiwugame/games"

# 更新所有游戏页面的函数
update_game_pages() {
  for file in "$GAMES_DIR"/*.html; do
    game_name=$(basename "$file" .html)
    
    # 提取游戏标题
    title=$(grep -A1 "<h1" "$file" | tail -1 | sed 's/<[^>]*>//g' | xargs)
    
    # 提取iframe源
    src=$(grep -o 'src="[^"]*"' "$file" | head -1 | sed 's/src="//;s/"$//')
    
    # 更新游戏区域部分
    sed -i '' '/<section class="mb-8">/,/<\/section>/c\
        <!-- 游戏区域 -->\
        <section class="mb-8">\
            <div class="game-container bg-gray-100 rounded-lg shadow-xl relative">\
                <div class="absolute top-0 left-0 w-full h-10 bg-blue-600 z-10 flex items-center px-4">\
                    <span class="text-white font-medium">Yiwu GAME - '"$title"'</span>\
                </div>\
                <iframe id="gameFrame" \
                        src="'"$src"'" \
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\
                        allowfullscreen\
                        style="margin-top: 40px; height: calc(100% - 40px);">\
                </iframe>\
            </div>\
        </section>' "$file"
    
    echo "已更新: $file"
  done
}

# 立即执行一次更新
update_game_pages

# 监控文件变化并自动更新
fswatch -o "$GAMES_DIR" | while read f; do
  update_game_pages
done
