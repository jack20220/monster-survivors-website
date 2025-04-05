import os
import re

# 游戏链接映射
GAME_LINKS = {
    'super-mario.html': 'https://www.yikm.net/play/?game=fc/super-mario-bros',
    'contra.html': 'https://www.yikm.net/play/?game=fc/contra',
    'tank.html': 'https://www.yikm.net/play/?game=fc/battle-city',
    'pokemon-emerald.html': 'https://www.yikm.net/play/?game=gba/pokemon-emerald',
    'fire-emblem.html': 'https://www.yikm.net/play/?game=gba/fire-emblem',
    'advance-wars.html': 'https://www.yikm.net/play/?game=gba/advance-wars',
    'zelda-minish-cap.html': 'https://www.yikm.net/play/?game=gba/zelda-minish-cap',
    'chrono-trigger.html': 'https://www.yikm.net/play/?game=snes/chrono-trigger',
    'final-fantasy-6.html': 'https://www.yikm.net/play/?game=snes/final-fantasy-6',
    'legend-of-zelda.html': 'https://www.yikm.net/play/?game=snes/legend-of-zelda',
    'super-mario-world.html': 'https://www.yikm.net/play/?game=snes/super-mario-world',
    'monster-survivors.html': 'https://www.yikm.net/play/?game=other/monster-survivors'
}

def update_game_link(file_path):
    """更新游戏页面的链接"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 获取文件名
    file_name = os.path.basename(file_path)
    
    # 获取新的游戏链接
    new_link = GAME_LINKS.get(file_name)
    if not new_link:
        print(f"警告: 未找到 {file_name} 的游戏链接")
        return
    
    # 更新iframe的src属性
    new_content = re.sub(
        r'src="[^"]+"\s+allow="accelerometer',
        f'src="{new_link}" allow="accelerometer',
        content
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