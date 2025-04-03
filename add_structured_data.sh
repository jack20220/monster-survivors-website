#!/bin/bash

# 为所有游戏页面添加JSON-LD结构化数据
echo "开始为游戏页面添加结构化数据..."

# 游戏页面目录
GAMES_DIR="/Users/elifchen/CascadeProjects/yiwugame/games"

# 遍历所有游戏页面
for game_file in "$GAMES_DIR"/*.html; do
    echo "处理文件: $game_file"
    
    # 获取游戏名称（从文件名）
    game_name=$(basename "$game_file" .html)
    
    # 将连字符替换为空格并首字母大写（用于显示）
    display_name=$(echo "$game_name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1))substr($i,2)} 1')
    
    # 获取游戏类型（从文件内容）
    game_type=$(grep -A2 '<p class="text-xs text-gray-500 mt-1">' "$game_file" | tail -1 | sed 's/<[^>]*>//g' | xargs)
    
    # 如果没有找到游戏类型，设置默认值
    if [ -z "$game_type" ]; then
        game_type="Video Game"
    fi
    
    # 获取游戏平台（从文件路径或内容）
    if grep -q "NES Games" "$game_file" || grep -q "fc" "$game_file"; then
        platform="NES"
    elif grep -q "GBA Games" "$game_file" || grep -q "gba" "$game_file"; then
        platform="GBA"
    elif grep -q "SNES Games" "$game_file" || grep -q "sfc" "$game_file"; then
        platform="SNES"
    else
        platform="Retro"
    fi
    
    # 获取游戏图片URL
    image_url=$(grep -o 'src="[^"]*\.jpg"' "$game_file" | head -1 | sed 's/src="//;s/"$//')
    
    # 如果没有找到图片URL，设置默认值
    if [ -z "$image_url" ]; then
        image_url="https://yiwugame.com/images/default-game.jpg"
    fi
    
    # 获取游戏描述
    description=$(grep -A5 '<p class="text-gray-600 leading-relaxed mb-6">' "$game_file" | tail -1 | sed 's/<[^>]*>//g' | xargs)
    
    # 如果没有找到描述，创建一个默认描述
    if [ -z "$description" ]; then
        description="Play $display_name online for free. Experience this classic $platform $game_type on Yiwu Game."
    fi
    
    # 检查文件是否已经包含结构化数据
    if grep -q "application/ld+json" "$game_file"; then
        echo "文件已包含结构化数据，跳过: $game_file"
        continue
    fi
    
    # 创建JSON-LD结构化数据文件
    cat > "${game_file}.json" << EOF
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "${display_name}",
  "description": "${description}",
  "image": "${image_url}",
  "url": "https://yiwugame.com/games/${game_name}.html",
  "gamePlatform": "${platform}",
  "applicationCategory": "Game",
  "genre": "${game_type}",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Yiwu Game"
  }
}
</script>
EOF

    # 在</head>标签前添加结构化数据
    # 使用临时文件来处理
    head_line=$(grep -n "</head>" "$game_file" | cut -d ':' -f 1)
    if [ -n "$head_line" ]; then
        head -n $(($head_line - 1)) "$game_file" > "${game_file}.tmp"
        cat "${game_file}.json" >> "${game_file}.tmp"
        tail -n +$head_line "$game_file" >> "${game_file}.tmp"
        mv "${game_file}.tmp" "$game_file"
    else
        echo "警告: 在 $game_file 中找不到 </head> 标签"
    fi
    
    # 删除临时JSON文件
    rm -f "${game_file}.json"
    
    echo "已添加结构化数据: $game_file"
done

echo "所有游戏页面结构化数据添加完成！"

# 添加执行权限
chmod +x "$0"