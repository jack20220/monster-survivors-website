#!/bin/bash

# 更新所有游戏页面的SEO元标签
echo "开始更新游戏页面的SEO元标签..."

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
        game_type="Classic Game"
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
    
    # 检查文件是否已经包含SEO元标签
    if grep -q "<meta name=\"description\"" "$game_file"; then
        echo "文件已包含SEO元标签，跳过: $game_file"
        continue
    fi
    
    # 创建描述文本
    description="Play $display_name online for free. Experience this classic $platform $game_type on Yiwu Game, the best retro gaming platform."
    
    # 创建关键词文本
    keywords="$display_name, $platform game, online game, retro game, classic game, $game_type, free game"
    
    # 在</head>标签前添加SEO元标签
    sed -i '' "/<title>/,/<\/title>/c\
    <title>$display_name - Classic $platform Game | Yiwu Game</title>\n    <meta name=\"description\" content=\"$description\">\n    <meta name=\"keywords\" content=\"$keywords\">\n    <meta name=\"author\" content=\"Yiwu Game\">\n    <meta name=\"robots\" content=\"index, follow\">\n    <link rel=\"canonical\" href=\"https://yiwugame.com/games/$game_name.html\">\n    \n    <!-- Open Graph / Facebook -->\n    <meta property=\"og:type\" content=\"website\">\n    <meta property=\"og:url\" content=\"https://yiwugame.com/games/$game_name.html\">\n    <meta property=\"og:title\" content=\"$display_name - Classic $platform Game | Yiwu Game\">\n    <meta property=\"og:description\" content=\"$description\">\n    <meta property=\"og:image\" content=\"$image_url\">\n    \n    <!-- Twitter -->\n    <meta property=\"twitter:card\" content=\"summary_large_image\">\n    <meta property=\"twitter:url\" content=\"https://yiwugame.com/games/$game_name.html\">\n    <meta property=\"twitter:title\" content=\"$display_name - Classic $platform Game | Yiwu Game\">\n    <meta property=\"twitter:description\" content=\"$description\">\n    <meta property=\"twitter:image\" content=\"$image_url\"" "$game_file"
    
    echo "已更新SEO元标签: $game_file"
done

echo "所有游戏页面SEO元标签更新完成！"

# 添加执行权限
chmod +x "$0"