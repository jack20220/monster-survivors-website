#!/bin/bash

# 游戏页面目录
GAMES_DIR="/Users/elifchen/CascadeProjects/yiwugame/games"

# 遍历所有游戏HTML文件
for file in "$GAMES_DIR"/*.html; do
  echo "正在更新: $file"
  
  # 获取游戏标题
  title=$(grep -A1 "<h1" "$file" | tail -1 | sed 's/<[^>]*>//g' | xargs)
  
  # 1. 更新顶部导航栏，添加全屏按钮
  sed -i '' 's/<div class="absolute top-0 left-0 w-full h-10 bg-blue-600 z-10 flex items-center px-4">/<div class="absolute top-0 left-0 w-full h-10 bg-blue-600 z-10 flex items-center justify-between px-4">/g' "$file"
  
  sed -i '' '/<span class="text-white font-medium">Yiwu GAME/a\
                    <button id="fullscreenBtn" class="text-white hover:text-gray-200 focus:outline-none">\
                        <svg xmlns="http:\/\/www.w3.org\/2000\/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">\
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" \/>\
                        <\/svg>\
                    <\/button>' "$file"
  
  # 2. 确保游戏名称正确显示
  sed -i '' 's/<span class="text-white font-medium">Yiwu GAME - .*<\/span>/<span class="text-white font-medium">Yiwu GAME - '"$title"'<\/span>/g' "$file"
  
  # 3. 添加加载指示器（如果不存在）
  if ! grep -q "loadingIndicator" "$file"; then
    sed -i '' '/<iframe id="gameFrame"/i\
                <!-- 添加加载指示器 -->\
                <div id="loadingIndicator" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-5" style="margin-top: 40px;">\
                    <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"><\/div>\
                    <p class="text-gray-700">游戏加载中，请稍候...<\/p>\
                    <p class="text-gray-500 text-sm mt-2">首次加载可能需要较长时间<\/p>\
                <\/div>' "$file"
  fi
  
  # 4. 添加onload事件到iframe
  sed -i '' 's/<iframe id="gameFrame"/<iframe id="gameFrame" onload="document.getElementById('\''loadingIndicator'\'').style.display='\''none'\''"/' "$file"
  
  # 5. 添加JavaScript代码（如果不存在）
  if ! grep -q "toggleFullScreen" "$file"; then
    # 检查是否已有script标签
    if grep -q "<script>" "$file"; then
      # 替换现有script内容
      sed -i '' '/<script>/,/<\/script>/c\
    <script>\
        // 游戏加载优化\
        document.addEventListener('\''DOMContentLoaded'\'', function() {\
            const gameFrame = document.getElementById('\''gameFrame'\'');\
            const loadingIndicator = document.getElementById('\''loadingIndicator'\'');\
            const fullscreenBtn = document.getElementById('\''fullscreenBtn'\'');\
            const gameContainer = document.querySelector('\''.game-container'\'');\
            \
            // 30秒后如果游戏仍未加载，显示提示信息\
            setTimeout(function() {\
                if (loadingIndicator.style.display !== '\''none'\'') {\
                    const loadingText = loadingIndicator.querySelector('\''p'\'');\
                    if (loadingText) {\
                        loadingText.innerHTML = '\''游戏加载时间较长，请继续等待...<br>您也可以<a href="#" onclick="reloadGame()" class="text-blue-600">点击此处刷新</a>尝试重新加载'\'';\
                    }\
                }\
            }, 30000);\
            \
            // 全屏功能\
            fullscreenBtn.addEventListener('\''click'\'', function() {\
                toggleFullScreen(gameContainer);\
            });\
            \
            // 添加键盘快捷键 - F键全屏\
            document.addEventListener('\''keydown'\'', function(e) {\
                if (e.key === '\''f'\'' || e.key === '\''F'\'') {\
                    toggleFullScreen(gameContainer);\
                }\
            });\
        });\
        \
        // 重新加载游戏\
        function reloadGame() {\
            const gameFrame = document.getElementById('\''gameFrame'\'');\
            const loadingIndicator = document.getElementById('\''loadingIndicator'\'');\
            loadingIndicator.style.display = '\''flex'\'';\
            gameFrame.src = gameFrame.src;\
            return false;\
        }\
        \
        // 切换全屏\
        function toggleFullScreen(element) {\
            if (!document.fullscreenElement &&    // 标准方法\
                !document.mozFullScreenElement && // Firefox\
                !document.webkitFullscreenElement && // Chrome, Safari, Opera\
                !document.msFullscreenElement) {  // IE/Edge\
                \
                // 进入全屏\
                if (element.requestFullscreen) {\
                    element.requestFullscreen();\
                } else if (element.mozRequestFullScreen) {\
                    element.mozRequestFullScreen();\
                } else if (element.webkitRequestFullscreen) {\
                    element.webkitRequestFullscreen();\
                } else if (element.msRequestFullscreen) {\
                    element.msRequestFullscreen();\
                }\
            } else {\
                // 退出全屏\
                if (document.exitFullscreen) {\
                    document.exitFullscreen();\
                } else if (document.mozCancelFullScreen) {\
                    document.mozCancelFullScreen();\
                } else if (document.webkitExitFullscreen) {\
                    document.webkitExitFullscreen();\
                } else if (document.msExitFullscreen) {\
                    document.msExitFullscreen();\
                }\
            }\
        }\
    </script>' "$file"
    else
      # 在</body>前添加script标签
      sed -i '' 's/<\/body>/    <script>\
        // 游戏加载优化\
        document.addEventListener('\''DOMContentLoaded'\'', function() {\
            const gameFrame = document.getElementById('\''gameFrame'\'');\
            const loadingIndicator = document.getElementById('\''loadingIndicator'\'');\
            const fullscreenBtn = document.getElementById('\''fullscreenBtn'\'');\
            const gameContainer = document.querySelector('\''.game-container'\'');\
            \
            // 30秒后如果游戏仍未加载，显示提示信息\
            setTimeout(function() {\
                if (loadingIndicator.style.display !== '\''none'\'') {\
                    const loadingText = loadingIndicator.querySelector('\''p'\'');\
                    if (loadingText) {\
                        loadingText.innerHTML = '\''游戏加载时间较长，请继续等待...<br>您也可以<a href="#" onclick="reloadGame()" class="text-blue-600">点击此处刷新</a>尝试重新加载'\'';\
                    }\
                }\
            }, 30000);\
            \
            // 全屏功能\
            fullscreenBtn.addEventListener('\''click'\'', function() {\
                toggleFullScreen(gameContainer);\
            });\
            \
            // 添加键盘快捷键 - F键全屏\
            document.addEventListener('\''keydown'\'', function(e) {\
                if (e.key === '\''f'\'' || e.key === '\''F'\'') {\
                    toggleFullScreen(gameContainer);\
                }\
            });\
        });\
        \
        // 重新加载游戏\
        function reloadGame() {\
            const gameFrame = document.getElementById('\''gameFrame'\'');\
            const loadingIndicator = document.getElementById('\''loadingIndicator'\'');\
            loadingIndicator.style.display = '\''flex'\'';\
            gameFrame.src = gameFrame.src;\
            return false;\
        }\
        \
        // 切换全屏\
        function toggleFullScreen(element) {\
            if (!document.fullscreenElement &&    // 标准方法\
                !document.mozFullScreenElement && // Firefox\
                !document.webkitFullscreenElement && // Chrome, Safari, Opera\
                !document.msFullscreenElement) {  // IE/Edge\
                \
                // 进入全屏\
                if (element.requestFullscreen) {\
                    element.requestFullscreen();\
                } else if (element.mozRequestFullScreen) {\
                    element.mozRequestFullScreen();\
                } else if (element.webkitRequestFullscreen) {\
                    element.webkitRequestFullscreen();\
                } else if (element.msRequestFullscreen) {\
                    element.msRequestFullscreen();\
                }\
            } else {\
                // 退出全屏\
                if (document.exitFullscreen) {\
                    document.exitFullscreen();\
                } else if (document.mozCancelFullScreen) {\
                    document.mozCancelFullScreen();\
                } else if (document.webkitExitFullscreen) {\
                    document.webkitExitFullscreen();\
                } else if (document.msExitFullscreen) {\
                    document.msExitFullscreen();\
                }\
            }\
        }\
    <\/script>\
<\/body>/g' "$file"
    fi
  fi
  
  echo "更新完成: $file"
done

echo "所有游戏页面已更新完成！"
