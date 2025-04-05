from PIL import Image, ImageDraw, ImageFont
import os

def create_game_image(game_name, output_path):
    # 创建400x400的图片
    img = Image.new('RGB', (400, 400), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)
    
    # 添加边框
    draw.rectangle([(10, 10), (390, 390)], outline=(200, 200, 200), width=2)
    
    # 添加游戏名称
    try:
        font = ImageFont.truetype("Arial", 36)
    except:
        font = ImageFont.load_default()
    
    # 计算文本位置使其居中
    text_bbox = draw.textbbox((0, 0), game_name, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    x = (400 - text_width) / 2
    y = (400 - text_height) / 2
    
    # 绘制文本
    draw.text((x, y), game_name, fill=(0, 0, 0), font=font)
    
    # 保存为PNG格式
    img.save(output_path, 'PNG', optimize=True, quality=95)

def main():
    # 确保输出目录存在
    os.makedirs('images/games', exist_ok=True)
    
    # 游戏列表
    games = [
        'monster-survivors.png',
        'super-mario.png',
        'contra.png',
        'tank.png',
        'pokemon-emerald.png',
        'advance-wars.png',
        'fire-emblem.png',
        'zelda-minish-cap.png',
        'chrono-trigger.png',
        'final-fantasy-6.png',
        'zelda-link-to-past.png',
        'super-mario-world.png'
    ]
    
    # 为每个游戏生成图片
    for game in games:
        game_name = os.path.splitext(game)[0].replace('-', ' ').title()
        output_path = os.path.join('images/games', game)
        create_game_image(game_name, output_path)
        print(f'已生成: {output_path}')

if __name__ == '__main__':
    main() 