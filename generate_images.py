from PIL import Image, ImageDraw, ImageFont
import os

def create_game_image(text, platform, output_path):
    # 创建一个300x300的正方形图片
    img = Image.new('RGB', (300, 300), color='#f8f9fa')
    d = ImageDraw.Draw(img)
    
    try:
        # 尝试使用Arial字体
        platform_font = ImageFont.truetype("Arial", 12)
        title_font = ImageFont.truetype("Arial", 20)
    except:
        try:
            # 如果没有Arial，尝试使用DejaVuSans
            platform_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
        except:
            # 如果都没有，使用默认字体
            platform_font = ImageFont.load_default()
            title_font = ImageFont.load_default()
    
    # 创建一个深色背景的矩形区域
    d.rectangle([0, 0, 300, 40], fill='#343a40')
    
    # 添加平台标签（白色文字在深色背景上）
    d.text((280, 20), platform, fill='white', font=platform_font, anchor="rm")
    
    # 在图片中心添加游戏名称
    d.text((150, 150), text, fill='#495057', font=title_font, anchor="mm")
    
    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 保存为WebP格式，使用最高质量
    img.save(output_path, 'WEBP', quality=100)

# 创建游戏图片
games = [
    ('super-mario.webp', '超级马里奥', 'NES'),
    ('contra.webp', '魂斗罗', 'NES'),
    ('tank.webp', '坦克大战', 'NES'),
    ('pokemon-emerald.webp', '口袋妖怪绿宝石', 'GBA'),
    ('fire-emblem.webp', '火焰纹章', 'GBA'),
    ('advance-wars.webp', '高级战争', 'GBA'),
    ('zelda-minish-cap.webp', '塞尔达传说缩小帽', 'GBA'),
    ('chrono-trigger.webp', '时空之轮', 'SNES'),
    ('final-fantasy-6.webp', '最终幻想6', 'SNES'),
    ('zelda-link-to-past.webp', '塞尔达传说', 'SNES'),
    ('super-mario-world.webp', '超级马里奥世界', 'SNES'),
    ('monster-survivors.webp', '怪物幸存者', 'Other')
]

for path, text, platform in games:
    output_path = os.path.join('images/games', path)
    create_game_image(text, platform, output_path)
    print(f'已生成: {output_path}') 