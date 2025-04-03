#!/usr/bin/env python3
"""
游戏页面模板验证脚本
此脚本用于验证转换后的游戏页面是否符合预期

作者：Yiwu Game 开发团队
日期：2024年6月
版本：1.1 - 增强验证功能
"""

import os
import re
import json
from pathlib import Path
from urllib.parse import urlparse

# 游戏页面目录
script_dir = Path(__file__).parent
games_dir = script_dir / 'games'

# 获取所有游戏页面文件
game_files = [f for f in os.listdir(games_dir) if f.endswith('.html')]

# 验证结果统计
valid_count = 0
error_count = 0

print(f"开始验证 {len(game_files)} 个游戏页面...")

# 必要元素列表
required_elements = [
    r'<title>[^<]+</title>',
    r'<meta name="description" content="[^"]+"',
    r'<meta property="og:image" content="[^"]+"',
    r'src="[^"]+"\s+allow="accelerometer',
    r'<h2 class="text-xl font-semibold text-gray-900 mb-6">Game Introduction</h2>',
    r'<h2 class="text-xl font-semibold text-gray-900 mb-6">Controls & Tips</h2>',
    r'<h3 class="font-semibold text-gray-800 mb-3">Keyboard Controls</h3>',
    r'<h3 class="font-semibold text-gray-800 mb-3">Game Tips</h3>',
    r'<script type="application/ld\+json">',
    r'<meta property="og:title"',
    r'<meta property="og:description"',
    r'<meta property="og:url"',
    r'<meta property="twitter:card"',
    r'<meta property="twitter:title"',
    r'<meta property="twitter:description"',
    r'<meta property="twitter:image"',
    r'<meta name="keywords"',
    r'<meta name="author"',
    r'<link rel="canonical"'
]

def validate_structured_data(content, game_file):
    """验证结构化数据的完整性"""
    ld_json_match = re.search(r'<script type="application/ld\+json">(\s*\{[\s\S]*?\}\s*)</script>', content)
    if not ld_json_match:
        return ["结构化数据格式不正确或不完整"]
    
    errors = []
    try:
        ld_json = json.loads(ld_json_match.group(1))
        required_fields = ['@context', '@type', 'name', 'description', 'image', 'url', 'gamePlatform']
        for field in required_fields:
            if field not in ld_json:
                errors.append(f"结构化数据缺少必要字段: {field}")
    except json.JSONDecodeError:
        errors.append("结构化数据JSON格式不正确")
    
    return errors

def validate_game_url(content, game_file):
    """验证游戏源URL的有效性"""
    src_match = re.search(r'src="([^"]+)"\s+allow="accelerometer', content)
    if not src_match:
        return ["未找到游戏源URL"]
    
    errors = []
    game_src = src_match.group(1)
    
    # 检查URL格式
    parsed_url = urlparse(game_src)
    if not parsed_url.scheme or not parsed_url.netloc:
        errors.append(f"游戏源URL格式不正确: {game_src}")
    
    return errors

def validate_game_platform(content, game_file):
    """验证游戏平台信息"""
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if not title_match:
        return ["未找到标题信息"]
    
    errors = []
    title = title_match.group(1)
    
    # 检查标题格式是否包含游戏平台
    if ' - ' not in title:
        errors.append("标题格式不正确，应为'游戏名称 - 游戏平台 | Yiwu Game'")
    
    return errors

def validate_screenshots(content, game_file):
    """验证游戏截图"""
    errors = []
    
    # 检查是否有至少一张截图
    screenshot1_match = re.search(r'src="([^"]+)"\s+alt="[^"]*Screenshot 1"', content)
    if not screenshot1_match:
        errors.append("缺少游戏截图1")
    
    return errors

# 验证每个游戏页面
for game_file in game_files:
    print(f"\n验证: {game_file}")
    game_path = games_dir / game_file
    
    try:
        with open(game_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 基本元素验证
        missing_elements = []
        for element in required_elements:
            if not re.search(element, content):
                missing_elements.append(element)
        
        # 高级验证
        structured_data_errors = validate_structured_data(content, game_file)
        game_url_errors = validate_game_url(content, game_file)
        game_platform_errors = validate_game_platform(content, game_file)
        screenshot_errors = validate_screenshots(content, game_file)
        
        all_errors = missing_elements + structured_data_errors + game_url_errors + game_platform_errors + screenshot_errors
        
        if all_errors:
            error_count += 1
            print(f"错误: {game_file} 存在以下问题:")
            
            if missing_elements:
                print("  缺少必要元素:")
                for element in missing_elements:
                    print(f"    - {element}")
            
            if structured_data_errors:
                print("  结构化数据问题:")
                for error in structured_data_errors:
                    print(f"    - {error}")
            
            if game_url_errors:
                print("  游戏源URL问题:")
                for error in game_url_errors:
                    print(f"    - {error}")
            
            if game_platform_errors:
                print("  游戏平台问题:")
                for error in game_platform_errors:
                    print(f"    - {error}")
            
            if screenshot_errors:
                print("  游戏截图问题:")
                for error in screenshot_errors:
                    print(f"    - {error}")
        else:
            valid_count += 1
            print(f"验证通过: {game_file}")
    
    except Exception as e:
        error_count += 1
        print(f"错误: 验证 {game_file} 时发生异常: {str(e)}")

print(f"\n验证统计:\n通过: {valid_count}\n错误: {error_count}\n总计: {len(game_files)}")

if error_count > 0:
    print("\n警告: 有游戏页面未通过验证，请检查并修复这些问题。")
    print("提示: 可以使用 convert_to_template.py 脚本重新生成不符合要求的页面。")
else:
    print("\n恭喜! 所有游戏页面都符合模板要求。")

# 输出验证结果摘要
if error_count > 0:
    print("\n验证结果摘要:")
    print(f"- 通过率: {valid_count/len(game_files)*100:.1f}%")
    print(f"- 错误率: {error_count/len(game_files)*100:.1f}%")