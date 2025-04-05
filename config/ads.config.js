// 广告组件配置
export const adConfig = {
    // 广告位ID映射
    adSlots: {
        header: 'header-ad',
        sidebar: 'sidebar-ad',
        gameCard: 'game-card-ad',
        footer: 'footer-ad'
    },
    
    // 广告尺寸配置
    adSizes: {
        header: {
            desktop: '728x90',
            mobile: '320x50'
        },
        sidebar: {
            desktop: '300x250',
            mobile: '300x100'
        },
        gameCard: {
            desktop: '336x280',
            mobile: '300x250'
        },
        footer: {
            desktop: '728x90',
            mobile: '320x50'
        }
    },
    
    // 广告加载延迟（毫秒）
    loadDelay: 1000,
    
    // 广告刷新间隔（毫秒）
    refreshInterval: 300000
}; 