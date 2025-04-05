import os
import re

# 游戏链接映射
GAME_LINKS = {
    'super-mario.html': 'fc/super-mario-bros',
    'contra.html': 'fc/contra',
    'tank.html': 'fc/battle-city',
    'pokemon-emerald.html': 'gba/pokemon-emerald',
    'fire-emblem.html': 'gba/fire-emblem',
    'advance-wars.html': 'gba/advance-wars',
    'zelda-minish-cap.html': 'gba/zelda-minish-cap',
    'chrono-trigger.html': 'snes/chrono-trigger',
    'final-fantasy-6.html': 'snes/final-fantasy-6',
    'legend-of-zelda.html': 'snes/legend-of-zelda',
    'super-mario-world.html': 'snes/super-mario-world',
    'monster-survivors.html': 'other/monster-survivors'
}

def update_game_link(file_path):
    """更新游戏页面的链接"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 获取文件名
    file_name = os.path.basename(file_path)
    
    # 获取新的游戏链接
    game_path = GAME_LINKS.get(file_name)
    if not game_path:
        print(f"警告: 未找到 {file_name} 的游戏链接")
        return
    
    # 更新iframe的src属性和相关JavaScript代码
    new_content = re.sub(
        r'<iframe id="gameFrame"[^>]*>.*?</iframe>',
        f'''<iframe id="gameFrame" src="proxy.html"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                style="margin-top: 48px; height: calc(100% - 48px);">
        </iframe>
        <script>
            document.getElementById('gameFrame').onload = function() {{
                this.contentWindow.postMessage({{
                    gameUrl: 'https://www.yikm.net/play/?game={game_path}'
                }}, '*');
            }};
        </script>''',
        content,
        flags=re.DOTALL
    )
    
    # 如果内容有变化，则保存
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"已更新: {file_name}")

def main():
    """主函数"""
    games_dir = 'games'
    
    # 遍历所有游戏页面
    for file_name in os.listdir(games_dir):
        if file_name.endswith('.html'):
            file_path = os.path.join(games_dir, file_name)
            update_game_link(file_path)

if __name__ == '__main__':
    main() 