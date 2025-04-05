const fs = require('fs');
const { createCanvas } = require('canvas');

// 创建必要的目录
const dirs = ['nes', 'gba', 'snes', 'other'];
dirs.forEach(dir => {
    if (!fs.existsSync(`images/games/${dir}`)) {
        fs.mkdirSync(`images/games/${dir}`, { recursive: true });
    }
});

// 游戏列表
const games = {
    nes: [
        { name: '超级马里奥', file: 'super-mario.jpg' },
        { name: '魂斗罗', file: 'contra.jpg' },
        { name: '坦克大战', file: 'tank.jpg' }
    ],
    gba: [
        { name: '口袋妖怪绿宝石', file: 'pokemon-emerald.jpg' },
        { name: '火焰纹章', file: 'fire-emblem.jpg' },
        { name: '高级战争', file: 'advance-wars.jpg' },
        { name: '塞尔达传说缩小帽', file: 'zelda-minish-cap.jpg' }
    ],
    snes: [
        { name: '时空之轮', file: 'chrono-trigger.jpg' },
        { name: '最终幻想6', file: 'final-fantasy-6.jpg' },
        { name: '塞尔达传说', file: 'legend-of-zelda.jpg' },
        { name: '超级马里奥世界', file: 'super-mario-world.jpg' }
    ],
    other: [
        { name: '怪物幸存者', file: 'monster-survivors.jpg' }
    ]
};

// 生成图片函数
function generateImage(text, outputPath) {
    const width = 300;
    const height = 200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 设置背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // 设置文字样式
    ctx.fillStyle = '#495057';
    ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 绘制文字
    ctx.fillText(text, width / 2, height / 2);

    // 保存图片
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(outputPath, buffer);
}

// 生成所有图片
Object.entries(games).forEach(([platform, platformGames]) => {
    platformGames.forEach(game => {
        const outputPath = `images/games/${platform}/${game.file}`;
        console.log(`生成图片: ${outputPath}`);
        generateImage(game.name, outputPath);
    });
});

console.log('所有占位图片生成完成！'); 