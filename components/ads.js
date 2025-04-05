// 广告加载器类
class AdLoader {
    constructor() {
        this.adsLoaded = new Set();
        this.ads = {};
        this.retryCount = {};
        this.init();
    }
    
    init() {
        // 初始化Google AdSense
        (adsbygoogle = window.adsbygoogle || []).push({});
        
        // 检查页面加载时间
        this.checkPageLoadTime();
        
        // 监听滚动事件
        window.addEventListener('scroll', () => this.handleScroll());
        
        // 加载所有广告
        this.loadAllAds();
    }
    
    checkPageLoadTime() {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`页面加载时间: ${loadTime}ms`);
    }
    
    handleScroll() {
        // 检查是否滚动到广告位置
        Object.keys(adConfig.adSlots).forEach(position => {
            const element = document.getElementById(adConfig.adSlots[position]);
            if (element && !this.adsLoaded.has(position)) {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    this.loadAd(position);
                }
            }
        });
    }
    
    loadAllAds() {
        // 加载所有广告
        Object.keys(adConfig.adSlots).forEach(position => {
            this.loadAd(position);
        });
    }
    
    loadAd(position) {
        if (this.adsLoaded.has(position)) return;
        
        const element = document.getElementById(adConfig.adSlots[position]);
        if (!element) return;
        
        const adSize = this.getAdSize(position);
        const adSlot = adConfig.adSlots[position];
        
        // 创建广告容器
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container';
        adContainer.style.width = adSize.width + 'px';
        adContainer.style.height = adSize.height + 'px';
        adContainer.style.margin = '0 auto';
        
        // 添加广告标签
        const adLabel = document.createElement('div');
        adLabel.className = 'ad-label';
        adLabel.textContent = 'Advertisement';
        adContainer.appendChild(adLabel);
        
        // 添加广告
        const ad = document.createElement('ins');
        ad.className = 'adsbygoogle';
        ad.style.display = 'block';
        ad.setAttribute('data-ad-client', 'ca-pub-8507638522906227');
        ad.setAttribute('data-ad-slot', adSlot);
        ad.setAttribute('data-ad-format', 'auto');
        ad.setAttribute('data-full-width-responsive', 'true');
        
        adContainer.appendChild(ad);
        element.appendChild(adContainer);
        
        // 记录已加载的广告
        this.adsLoaded.add(position);
        this.ads[position] = ad;
        
        // 加载广告
        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
            console.error(`广告加载错误 (${position}):`, error);
            this.handleAdError(position);
        }
    }
    
    getAdSize(position) {
        const isMobile = window.innerWidth < 768;
        const size = adConfig.adSizes[position][isMobile ? 'mobile' : 'desktop'];
        const [width, height] = size.split('x').map(Number);
        return { width, height };
    }
    
    handleAdError(position) {
        console.error(`广告加载失败: ${position}`);
        this.retryCount[position] = (this.retryCount[position] || 0) + 1;
        
        if (this.retryCount[position] <= 3) {
            setTimeout(() => this.retryAd(position), 5000);
        }
    }
    
    retryAd(position) {
        const element = document.getElementById(adConfig.adSlots[position]);
        if (element) {
            element.innerHTML = '';
            this.adsLoaded.delete(position);
            this.loadAd(position);
        }
    }
    
    getTimeOnPage() {
        return Date.now() - window.performance.timing.navigationStart;
    }
    
    refreshAds() {
        if (this.getTimeOnPage() > adConfig.refreshInterval) {
            Object.keys(adConfig.adSlots).forEach(position => {
                if (this.ads[position]) {
                    this.adsLoaded.delete(position);
                    this.loadAd(position);
                }
            });
        }
    }
}

// 初始化广告加载器
const adLoader = new AdLoader();

// 定期刷新广告
setInterval(() => adLoader.refreshAds(), 60000);

// 导出广告加载器
export default adLoader; 