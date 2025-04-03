/**
 * 游戏页面模板转换脚本
 * 此脚本用于将现有的游戏页面转换为使用统一的游戏页面模板
 */

const fs = require('fs');
const path = require('path');

// 读取模板文件
const templatePath = path.join(__dirname, 'game-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// 游戏页面目录
const gamesDir = path.join(__dirname, 'games');

// 获取所有游戏页面文件
const gameFiles = fs.readdirSync(gamesDir).filter(file => file.endsWith('.html'));

// 处理每个游戏页面
let successCount = 0;
let warningCount = 0;

console.log(`开始处理 ${gameFiles.length} 个游戏页面...`);

gameFiles.forEach(gameFile => {
    console.log(`处理: ${gameFile}`);
    const gamePath = path.join(gamesDir, gameFile);
    const gameContent = fs.readFileSync(gamePath, 'utf8');
    
    // 提取游戏信息
    const gameInfo = extractGameInfo(gameContent, gameFile);
    
    // 验证游戏信息
    const isValid = validateGameInfo(gameInfo, gameFile);
    if (!isValid) {
        warningCount++;
        console.log(`警告: ${gameFile} 信息不完整，但仍将继续转换`);
    }
    
    // 生成新的游戏页面内容
    const newGameContent = generateGameContent(template, gameInfo);
    
    // 备份原始文件
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    const backupPath = path.join(backupDir, `${gameFile}.bak`);
    fs.writeFileSync(backupPath, gameContent);
    
    // 写入新文件
    fs.writeFileSync(gamePath, newGameContent);
    
    successCount++;
    console.log(`转换完成: ${gameFile}`);
});

console.log(`\n转换统计:\n成功: ${successCount}\n警告: ${warningCount}`);

/**
 * 从游戏页面内容中提取游戏信息
 * @param {string} content - 游戏页面内容
 * @param {string} fileName - 游戏文件名
 * @returns {Object} - 游戏信息对象
 */
function extractGameInfo(content, fileName) {
    const gameInfo = {
        GAME_URL: fileName,
        CUSTOM_STYLES: '',
        CUSTOM_SCRIPTS: '',
        // 设置默认值，确保模板中的所有占位符都有对应的值
        GAME_TITLE: '',
        GAME_PLATFORM: '',
        META_DESCRIPTION: '',
        GAME_SRC: '',
        GAME_IMAGE: '',
        GAME_DESCRIPTION: '',
        SCREENSHOT_1: '',
        SCREENSHOT_2: '',
        KEYBOARD_CONTROLS: '',
        GAME_TIPS: ''
    };
    
    // 提取标题
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    if (titleMatch && titleMatch[1]) {
        const titleParts = titleMatch[1].split(' - ');
        gameInfo.GAME_TITLE = titleParts[0];
        gameInfo.GAME_PLATFORM = titleParts[1] ? titleParts[1].replace(' | Yiwu Game', '') : '';
    }
    
    // 提取描述
    const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
    if (descMatch && descMatch[1]) {
        gameInfo.META_DESCRIPTION = descMatch[1];
    } else {
        // 从页面内容中提取游戏描述
        const gameDescMatch = content.match(/<p class="text-gray-600 leading-relaxed mb-6">\s*([\s\S]*?)\s*<\/p>/);
        gameInfo.META_DESCRIPTION = gameDescMatch && gameDescMatch[1] ? 
            gameDescMatch[1].trim().substring(0, 160) : 
            `Play ${gameInfo.GAME_TITLE} online for free on Yiwu Game.`;
    }
    
    // 提取游戏源
    const srcMatch = content.match(/src="([^"]+)"\s+allow="accelerometer/);
    if (srcMatch && srcMatch[1]) {
        gameInfo.GAME_SRC = srcMatch[1];
    }
    
    // 提取游戏图片
    const imageMatch = content.match(/"image": "([^"]+)"/);
    if (imageMatch && imageMatch[1]) {
        gameInfo.GAME_IMAGE = imageMatch[1];
    }
    
    // 尝试从Open Graph标签中提取图片
    if (!gameInfo.GAME_IMAGE) {
        const ogImageMatch = content.match(/<meta property="og:image" content="([^"]+)"/i);
        if (ogImageMatch && ogImageMatch[1]) {
            gameInfo.GAME_IMAGE = ogImageMatch[1];
        }
    }
    
    // 提取游戏描述
    const gameDescriptionMatch = content.match(/<p class="text-gray-600 leading-relaxed mb-6">\s*([\s\S]*?)\s*<\/p>/);
    if (gameDescriptionMatch && gameDescriptionMatch[1]) {
        gameInfo.GAME_DESCRIPTION = gameDescriptionMatch[1].trim();
    }
    
    // 提取截图
    const screenshotMatches = content.match(/src="([^"]+)"\s+alt="[^"]*Screenshot 1"/g);
    if (screenshotMatches && screenshotMatches.length > 0) {
        const screenshot1Match = screenshotMatches[0].match(/src="([^"]+)"/);
        if (screenshot1Match && screenshot1Match[1]) {
            gameInfo.SCREENSHOT_1 = screenshot1Match[1];
        }
    }
    
    const screenshot2Matches = content.match(/src="([^"]+)"\s+alt="[^"]*Screenshot 2"/g);
    if (screenshot2Matches && screenshot2Matches.length > 0) {
        const screenshot2Match = screenshot2Matches[0].match(/src="([^"]+)"/);
        if (screenshot2Match && screenshot2Match[1]) {
            gameInfo.SCREENSHOT_2 = screenshot2Match[1];
        }
    }
    
    // 提取键盘控制
    const keyboardControlsMatch = content.match(/<h3 class="font-semibold text-gray-800 mb-3">Keyboard Controls<\/h3>\s*<ul class="space-y-3 text-gray-600">([\s\S]*?)<\/ul>/);
    if (keyboardControlsMatch && keyboardControlsMatch[1]) {
        const controlItems = keyboardControlsMatch[1].match(/<li>([^<]+)<\/li>/g);
        if (controlItems && controlItems.length > 0) {
            gameInfo.KEYBOARD_CONTROLS = controlItems.join('\n');
        }
    }
    
    // 提取游戏提示
    const gameTipsMatch = content.match(/<h3 class="font-semibold text-gray-800 mb-3">Game Tips<\/h3>\s*<ul class="space-y-3 text-gray-600">([\s\S]*?)<\/ul>/);
    if (gameTipsMatch && gameTipsMatch[1]) {
        const tipItems = gameTipsMatch[1].match(/<li>([^<]+)<\/li>/g);
        if (tipItems && tipItems.length > 0) {
            gameInfo.GAME_TIPS = tipItems.join('\n');
        }
    }
    
    // 提取自定义样式
    const customStyleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    if (customStyleMatch && customStyleMatch[1]) {
        // 过滤掉模板中已有的样式
        const styles = customStyleMatch[1].split('\n').filter(line => {
            return !line.includes('body {') && 
                   !line.includes('.game-container {') && 
                   !line.includes('#gameFrame {') && 
                   !line.includes('.screenshot {') && 
                   !line.includes('.screenshot:hover {');
        }).join('\n');
        
        if (styles.trim()) {
            gameInfo.CUSTOM_STYLES = styles;
        }
    }
    
    // 提取自定义脚本
    const customScriptMatch = content.match(/<script>\s*\/\/ Game loading optimization([\s\S]*?)<\/script>/);    
    if (customScriptMatch && customScriptMatch[1]) {
        // 过滤掉模板中已有的脚本
        const scripts = customScriptMatch[1].split('\n').filter(line => {
            return !line.includes('document.addEventListener') && 
                   !line.includes('const gameFrame') && 
                   !line.includes('const loadingIndicator') && 
                   !line.includes('const fullscreenBtn') && 
                   !line.includes('const gameContainer') && 
                   !line.includes('fullscreenBtn.addEventListener') && 
                   !line.includes('let loadAttempts') && 
                   !line.includes('function checkGameLoaded') && 
                   !line.includes('checkGameLoaded()') && 
                   !line.includes('const favoriteButton') && 
                   !line.includes('const favoriteIcon') && 
                   !line.includes('const favoriteText') && 
                   !line.includes('const gamePath') && 
                   !line.includes('const favorites') && 
                   !line.includes('favoriteButton.addEventListener');
        }).join('\n');
        
        if (scripts.trim()) {
            gameInfo.CUSTOM_SCRIPTS = scripts;
        }
    }
    
    // 确保所有必要的游戏信息都被提取
    if (!gameInfo.GAME_TITLE) {
        const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (h1Match && h1Match[1]) {
            gameInfo.GAME_TITLE = h1Match[1].trim();
        }
    }
    
    if (!gameInfo.GAME_IMAGE && gameInfo.SCREENSHOT_1) {
        gameInfo.GAME_IMAGE = gameInfo.SCREENSHOT_1;
    }
    
    return gameInfo;
}

/**
 * 使用模板和游戏信息生成新的游戏页面内容
 * @param {string} template - 模板内容
 * @param {Object} gameInfo - 游戏信息对象
 * @returns {string} - 新的游戏页面内容
 */
function generateGameContent(template, gameInfo) {
    let content = template;
    
    // 替换所有占位符
    for (const [key, value] of Object.entries(gameInfo)) {
        const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        content = content.replace(placeholder, value || '');
    }
    
    return content;
}

/**
 * 验证游戏信息是否完整
 * @param {Object} gameInfo - 游戏信息对象
 * @param {string} gameFile - 游戏文件名
 * @returns {boolean} - 是否通过验证
 */
function validateGameInfo(gameInfo, gameFile) {
    const requiredFields = ['GAME_TITLE', 'GAME_SRC', 'GAME_DESCRIPTION', 'SCREENSHOT_1'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        if (!gameInfo[field]) {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        console.warn(`警告: ${gameFile} 缺少以下必要信息: ${missingFields.join(', ')}`);
        return false;
    }
    
    return true;
}

console.log('所有游戏页面转换完成！');