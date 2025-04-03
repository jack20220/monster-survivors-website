#!/usr/bin/env python3
"""
游戏页面模板转换脚本
此脚本用于将现有的游戏页面转换为使用统一的游戏页面模板

更新日期：2024年6月
作者：Yiwu Game 开发团队
"""

import os
import re
import json
import shutil
from pathlib import Path

# 读取模板文件
script_dir = Path(__file__).parent
template_path = script_dir / 'game-template.html'
with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

# 游戏页面目录
games_dir = script_dir / 'games'

# 获取所有游戏页面文件
game_files = [f for f in os.listdir(games_dir) if f.endswith('.html')]

# 处理每个游戏页面
success_count = 0
warning_count = 0

print(f"开始处理 {len(game_files)} 个游戏页面...")


def extract_game_info(content, file_name):
    """
    从游戏页面内容中提取游戏信息
    :param content: 游戏页面内容
    :param file_name: 游戏文件名
    :return: 游戏信息字典
    """
    print(f"正在提取 {file_name} 的游戏信息...")
    game_info = {
        'GAME_URL': file_name,
        'CUSTOM_STYLES': '',
        'CUSTOM_SCRIPTS': '',
        # 设置默认值，确保模板中的所有占位符都有对应的值
        'GAME_TITLE': '',
        'GAME_PLATFORM': '',
        'META_DESCRIPTION': '',
        'GAME_SRC': '',
        'GAME_IMAGE': '',
        'GAME_DESCRIPTION': '',
        'SCREENSHOT_1': '',
        'SCREENSHOT_2': '',
        'KEYBOARD_CONTROLS': '',
        'GAME_TIPS': ''
    }
    
    # 提取标题
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if title_match:
        title_parts = title_match.group(1).split(' - ')
        game_info['GAME_TITLE'] = title_parts[0]
        if len(title_parts) > 1:
            game_info['GAME_PLATFORM'] = title_parts[1].replace(' | Yiwu Game', '')
    
    # 提取描述
    desc_match = re.search(r'<meta name="description" content="([^"]+)"', content)
    if desc_match:
        game_info['META_DESCRIPTION'] = desc_match.group(1)
    else:
        # 从页面内容中提取游戏描述
        game_desc_match = re.search(r'<p class="text-gray-600 leading-relaxed mb-6">\s*([\s\S]*?)\s*</p>', content)
        if game_desc_match:
            game_info['META_DESCRIPTION'] = game_desc_match.group(1).strip()[:160]
        else:
            game_info['META_DESCRIPTION'] = f"Play {game_info['GAME_TITLE']} online for free on Yiwu Game."
    
    # 提取游戏源
    src_match = re.search(r'src="([^"]+)"\s+allow="accelerometer', content)
    if src_match:
        game_info['GAME_SRC'] = src_match.group(1)
    
    # 提取结构化数据中的游戏信息
    ld_json_match = re.search(r'<script type="application/ld\+json">([\s\S]*?)</script>', content)
    if ld_json_match:
        try:
            ld_json = json.loads(ld_json_match.group(1))
            # 从结构化数据中提取游戏平台
            if 'gamePlatform' in ld_json and not game_info['GAME_PLATFORM']:
                game_info['GAME_PLATFORM'] = ld_json['gamePlatform']
            # 从结构化数据中提取游戏图片
            if 'image' in ld_json:
                game_info['GAME_IMAGE'] = ld_json['image']
            # 从结构化数据中提取游戏名称（如果之前没有提取到）
            if 'name' in ld_json and not game_info['GAME_TITLE']:
                game_info['GAME_TITLE'] = ld_json['name']
        except json.JSONDecodeError:
            print(f"警告: {file_name} 中的结构化数据格式不正确")
    
    # 尝试从Open Graph标签中提取图片
    if not game_info['GAME_IMAGE']:
        og_image_match = re.search(r'<meta property="og:image" content="([^"]+)"', content, re.IGNORECASE)
        if og_image_match:
            game_info['GAME_IMAGE'] = og_image_match.group(1)
    
    # 提取游戏描述
    game_description_match = re.search(r'<p class="text-gray-600 leading-relaxed mb-6">\s*([\s\S]*?)\s*</p>', content)
    if game_description_match:
        game_info['GAME_DESCRIPTION'] = game_description_match.group(1).strip()
    
    # 提取截图
    screenshot1_matches = re.findall(r'src="([^"]+)"\s+alt="[^"]*Screenshot 1"', content)
    if screenshot1_matches:
        game_info['SCREENSHOT_1'] = screenshot1_matches[0]
    
    screenshot2_matches = re.findall(r'src="([^"]+)"\s+alt="[^"]*Screenshot 2"', content)
    if screenshot2_matches:
        game_info['SCREENSHOT_2'] = screenshot2_matches[0]
    
    # 提取键盘控制
    keyboard_controls_match = re.search(r'<h3 class="font-semibold text-gray-800 mb-3">Keyboard Controls</h3>\s*<ul class="space-y-3 text-gray-600">([\s\S]*?)</ul>', content)
    if keyboard_controls_match:
        control_items = re.findall(r'<li>([^<]+)</li>', keyboard_controls_match.group(1))
        if control_items:
            game_info['KEYBOARD_CONTROLS'] = '\n'.join([f'<li>{item}</li>' for item in control_items])
    
    # 提取游戏提示
    game_tips_match = re.search(r'<h3 class="font-semibold text-gray-800 mb-3">Game Tips</h3>\s*<ul class="space-y-3 text-gray-600">([\s\S]*?)</ul>', content)
    if game_tips_match:
        tip_items = re.findall(r'<li>([^<]+)</li>', game_tips_match.group(1))
        if tip_items:
            game_info['GAME_TIPS'] = '\n'.join([f'<li>{item}</li>' for item in tip_items])
    
    # 提取自定义样式
    custom_style_match = re.search(r'<style>([\s\S]*?)</style>', content)
    if custom_style_match:
        # 过滤掉模板中已有的样式
        styles = [line for line in custom_style_match.group(1).split('\n') 
                 if not ('body {' in line or 
                        '.game-container {' in line or 
                        '#gameFrame {' in line or 
                        '.screenshot {' in line or 
                        '.screenshot:hover {' in line)]
        
        if ''.join(styles).strip():
            game_info['CUSTOM_STYLES'] = '\n'.join(styles)
    
    # 提取自定义脚本
    custom_script_match = re.search(r'<script>\s*// Game loading optimization([\s\S]*?)</script>', content)
    if custom_script_match:
        # 过滤掉模板中已有的脚本
        scripts = [line for line in custom_script_match.group(1).split('\n') 
                  if not ('document.addEventListener' in line or 
                         'const gameFrame' in line or 
                         'const loadingIndicator' in line or 
                         'const fullscreenBtn' in line or 
                         'const gameContainer' in line or 
                         'fullscreenBtn.addEventListener' in line or 
                         'let loadAttempts' in line or 
                         'function checkGameLoaded' in line or 
                         'checkGameLoaded()' in line or 
                         'const favoriteButton' in line or 
                         'const favoriteIcon' in line or 
                         'const favoriteText' in line or 
                         'const gamePath' in line or 
                         'const favorites' in line or 
                         'favoriteButton.addEventListener' in line)]
        
        if ''.join(scripts).strip():
            game_info['CUSTOM_SCRIPTS'] = '\n'.join(scripts)
    
    # 确保所有必要的游戏信息都被提取
    if not game_info['GAME_TITLE']:
        h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content, re.IGNORECASE)
        if h1_match:
            game_info['GAME_TITLE'] = h1_match.group(1).strip()
    
    # 如果没有提取到游戏平台，尝试从文件内容中推断
    if not game_info['GAME_PLATFORM']:
        if 'NES' in content or 'fc' in content.lower() or 'famicom' in content.lower():
            game_info['GAME_PLATFORM'] = 'NES'
        elif 'SNES' in content or 'sfc' in content.lower() or 'super famicom' in content.lower():
            game_info['GAME_PLATFORM'] = 'SNES'
        elif 'GBA' in content or 'gba' in content.lower() or 'game boy advance' in content.lower():
            game_info['GAME_PLATFORM'] = 'GBA'
        elif 'GB' in content or 'gameboy' in content.lower() or 'game boy' in content.lower():
            game_info['GAME_PLATFORM'] = 'Game Boy'
        elif 'GBC' in content or 'gbc' in content.lower() or 'game boy color' in content.lower():
            game_info['GAME_PLATFORM'] = 'Game Boy Color'
        else:
            game_info['GAME_PLATFORM'] = 'Classic Game'
            print(f"警告: 无法从 {file_name} 中确定游戏平台，使用默认值: Classic Game")
    
    if not game_info['GAME_IMAGE'] and game_info['SCREENSHOT_1']:
        game_info['GAME_IMAGE'] = game_info['SCREENSHOT_1']
    elif not game_info['GAME_IMAGE']:
        # 如果没有找到游戏图片，使用默认图片
        game_info['GAME_IMAGE'] = f"https://yiwugame.com/images/{game_info['GAME_PLATFORM'].lower()}/{file_name.replace('.html', '.jpg')}"
        print(f"警告: 无法从 {file_name} 中提取游戏图片，使用默认图片路径")
        
    # 确保游戏描述不为空
    if not game_info['GAME_DESCRIPTION']:
        game_info['GAME_DESCRIPTION'] = game_info['META_DESCRIPTION']
        print(f"警告: 无法从 {file_name} 中提取游戏描述，使用元描述作为游戏描述")
        
    # 确保游戏源不为空
    if not game_info['GAME_SRC']:
        print(f"错误: 无法从 {file_name} 中提取游戏源，这是必需的信息")
    
    return game_info


def generate_game_content(template, game_info):
    """
    使用模板和游戏信息生成新的游戏页面内容
    :param template: 模板内容
    :param game_info: 游戏信息字典
    :return: 新的游戏页面内容
    """
    content = template
    
    # 替换所有占位符
    for key, value in game_info.items():
        placeholder = f'{{{{{key}}}}}'
        content = content.replace(placeholder, value or '')
    
    # 检查是否有未替换的占位符
    remaining_placeholders = re.findall(r'\{\{([A-Z_]+)\}\}', content)
    if remaining_placeholders:
        print(f"警告: 以下占位符未被替换: {', '.join(remaining_placeholders)}")
    
    return content


def validate_game_info(game_info, game_file):
    """
    验证游戏信息是否完整
    :param game_info: 游戏信息字典
    :param game_file: 游戏文件名
    :return: 是否通过验证
    """
    required_fields = ['GAME_TITLE', 'GAME_SRC', 'GAME_DESCRIPTION', 'SCREENSHOT_1', 'GAME_IMAGE', 'META_DESCRIPTION']
    missing_fields = []
    
    for field in required_fields:
        if not game_info[field]:
            missing_fields.append(field)
    
    if missing_fields:
        print(f"警告: {game_file} 缺少以下必要信息: {', '.join(missing_fields)}")
        return False
    
    # 检查游戏源URL是否有效
    if not game_info['GAME_SRC'].startswith('http'):
        print(f"警告: {game_file} 的游戏源URL可能无效: {game_info['GAME_SRC']}")
        return False
    
    return True


# 创建备份目录
backup_dir = script_dir / 'backups'
if not backup_dir.exists():
    os.makedirs(backup_dir)

# 处理每个游戏页面
for game_file in game_files:
    print(f"\n处理: {game_file}")
    game_path = games_dir / game_file
    
    try:
        with open(game_path, 'r', encoding='utf-8') as f:
            game_content = f.read()
        
        # 提取游戏信息
        game_info = extract_game_info(game_content, game_file)
        
        # 验证游戏信息
        is_valid = validate_game_info(game_info, game_file)
        if not is_valid:
            warning_count += 1
            print(f"警告: {game_file} 信息不完整，但仍将继续转换")
        
        # 生成新的游戏页面内容
        new_game_content = generate_game_content(template, game_info)
        
        # 备份原始文件
        backup_path = backup_dir / f"{game_file}.bak"
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(game_content)
        
        # 写入新文件
        with open(game_path, 'w', encoding='utf-8') as f:
            f.write(new_game_content)
        
        success_count += 1
        print(f"转换完成: {game_file}")
    except Exception as e:
        warning_count += 1
        print(f"错误: 处理 {game_file} 时发生异常: {str(e)}")

print(f"\n转换统计:\n成功: {success_count}\n警告: {warning_count}")
print("所有游戏页面转换完成！")

# 检查是否有游戏页面未被处理
if success_count < len(game_files):
    print(f"警告: 有 {len(game_files) - success_count} 个游戏页面未被成功处理！")
else:
    print("所有游戏页面都已成功转换为统一模板！")

print("\n提示: 请检查转换后的游戏页面，确保所有内容正确显示。")
print("如需恢复原始文件，可以从 backups 目录中复制备份文件。")