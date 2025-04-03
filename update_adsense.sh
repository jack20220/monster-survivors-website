#!/bin/bash

# 更新所有HTML文件的AdSense代码
echo "开始更新AdSense代码..."

# 定义AdSense代码
ADSENSE_CODE='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8507638522906227" crossorigin="anonymous"></script>'

# 更新根目录的HTML文件
for html_file in *.html; do
    if [ -f "$html_file" ]; then
        echo "处理文件: $html_file"
        # 检查文件是否已包含AdSense代码
        if ! grep -q "ca-pub-8507638522906227" "$html_file"; then
            # 在</head>标签前插入AdSense代码
            sed -i '' "/<\/head>/i\\
    $ADSENSE_CODE" "$html_file"
            echo "已更新AdSense代码: $html_file"
        else
            echo "文件已包含AdSense代码，跳过: $html_file"
        fi
    fi
done

# 更新games目录下的HTML文件
if [ -d "games" ]; then
    for html_file in games/*.html; do
        if [ -f "$html_file" ]; then
            echo "处理文件: $html_file"
            # 检查文件是否已包含AdSense代码
            if ! grep -q "ca-pub-8507638522906227" "$html_file"; then
                # 在</head>标签前插入AdSense代码
                sed -i '' "/<\/head>/i\\
    $ADSENSE_CODE" "$html_file"
                echo "已更新AdSense代码: $html_file"
            else
                echo "文件已包含AdSense代码，跳过: $html_file"
            fi
        fi
    done
fi

echo "所有HTML文件的AdSense代码更新完成！"

# 添加执行权限
chmod +x "$0" 