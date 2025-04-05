from PIL import Image, ImageDraw, ImageFont
import os

# 创建必要的目录
dirs = ['nes', 'gba', 'snes', 'other']
for dir in dirs:
    os.makedirs(f'images/games/{dir}', exist_ok=True)

# 游戏列表
games = {
    'nes': [
        {'name': '超级马里奥', 'file': 'super-mario.jpg'},
        {'name': '魂斗罗', 'file': 'contra.jpg'},
        {'name': '坦克大战', 'file': 'tank.jpg'}
    ],
    'gba': [
        {'name': '口袋妖怪绿宝石', 'file': 'pokemon-emerald.jpg'},
        {'name': '火焰纹章', 'file': 'fire-emblem.jpg'},
        {'name': '高级战争', 'file': 'advance-wars.jpg'},
        {'name': '塞尔达传说缩小帽', 'file': 'zelda-minish-cap.jpg'}
    ],
    'snes': [
        {'name': '时空之轮', 'file': 'chrono-trigger.jpg'},
        {'name': '最终幻想6', 'file': 'final-fantasy-6.jpg'},
        {'name': '塞尔达传说', 'file': 'legend-of-zelda.jpg'},
        {'name': '超级马里奥世界', 'file': 'super-mario-world.jpg'}
    ],
    'other': [
        {'name': '怪物幸存者', 'file': 'monster-survivors.jpg'}
    ]
}

def generate_image(text, output_path):
    # 创建图片
    width = 300
    height = 200
    image = Image.new('RGB', (width, height), '#f8f9fa')
    draw = ImageDraw.Draw(image)
    
    # 设置字体
    try:
        font = ImageFont.truetype('/System/Library/Fonts/PingFang.ttc', 20)
    except:
        font = ImageFont.load_default()
    
    # 获取文字大小
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    # 计算文字位置
    x = (width - text_width) / 2
    y = (height - text_height) / 2
    
    # 绘制文字
    draw.text((x, y), text, font=font, fill='#495057')
    
    # 保存图片
    image.save(output_path, 'JPEG')

# 生成所有图片
for platform, platform_games in games.items():
    for game in platform_games:
        output_path = f'images/games/{platform}/{game["file"]}'
        print(f'生成图片: {output_path}')
        generate_image(game['name'], output_path)

print('所有占位图片生成完成！') 