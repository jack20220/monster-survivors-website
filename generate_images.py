from PIL import Image, ImageDraw, ImageFont
import os

def create_game_image(text, platform, output_path):
    # 创建一个300x200的图片
    img = Image.new('RGB', (300, 200), color='#f8f9fa')
    d = ImageDraw.Draw(img)
    
    # 添加平台标签
    platform_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 12)
    d.text((280, 10), platform, fill='white', font=platform_font, anchor="rt")
    
    # 添加游戏名称
    title_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 20)
    d.text((150, 100), text, fill='#495057', font=title_font, anchor="mm")
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 保存为WebP格式
    img.save(output_path, 'WEBP', quality=90)

# 创建游戏图片
games = [
    ('nes/super-mario.webp', '超级马里奥', 'NES'),
    ('nes/contra.webp', '魂斗罗', 'NES'),
    ('nes/tank.webp', '坦克大战', 'NES'),
    ('gba/pokemon-emerald.webp', '口袋妖怪绿宝石', 'GBA'),
    ('gba/fire-emblem.webp', '火焰纹章', 'GBA'),
    ('gba/advance-wars.webp', '高级战争', 'GBA'),
    ('gba/zelda-minish-cap.webp', '塞尔达传说缩小帽', 'GBA'),
    ('snes/chrono-trigger.webp', '时空之轮', 'SNES'),
    ('snes/final-fantasy-6.webp', '最终幻想6', 'SNES'),
    ('snes/legend-of-zelda.webp', '塞尔达传说', 'SNES'),
    ('snes/super-mario-world.webp', '超级马里奥世界', 'SNES'),
    ('other/monster-survivors.webp', '怪物幸存者', 'Other')
]

for path, text, platform in games:
    output_path = os.path.join('images/games', path)
    create_game_image(text, platform, output_path)
    print(f'已生成: {output_path}') 