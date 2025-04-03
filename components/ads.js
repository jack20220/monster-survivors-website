import { adConfig } from '../config/ads.config.js';

// 广告组件配置
const adConfig = {
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
        if (typeof adsbygoogle !== 'undefined') {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }
        
        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refreshAds();
            }
        });
        
        // 监听滚动事件
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.handleScroll);
        
        // 监听页面加载时间
        this.checkPageLoadTime();
    }
    
    // 检查页面加载时间
    checkPageLoadTime() {
        const pageLoadTime = performance.now();
        if (pageLoadTime < adConfig.displayRules.minPageLoadTime) {
            setTimeout(() => this.loadAllAds(), adConfig.displayRules.minPageLoadTime - pageLoadTime);
        } else {
            this.loadAllAds();
        }
    }
    
    // 处理滚动事件
    handleScroll() {
        const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollDepth >= adConfig.displayRules.minScrollDepth) {
            this.loadAllAds();
            window.removeEventListener('scroll', this.handleScroll);
        }
    }
    
    // 加载所有广告
    loadAllAds() {
        Object.keys(adConfig.adSlots).forEach(position => {
            this.loadAd(position);
        });
    }
    
    // 加载广告
    loadAd(position) {
        if (this.adsLoaded.has(position)) {
            return;
        }
        
        const adContainer = document.getElementById(`${position}-ad`);
        if (!adContainer) {
            return;
        }
        
        // 检查停留时间
        if (this.getTimeOnPage() < adConfig.displayRules.minTimeOnPage) {
            setTimeout(() => this.loadAd(position), adConfig.displayRules.minTimeOnPage - this.getTimeOnPage());
            return;
        }
        
        // 创建广告容器
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'block';
        adElement.dataset.adClient = adConfig.publisherId;
        
        // 设置广告位ID
        const isMobile = window.innerWidth <= 768;
        adElement.dataset.adSlot = adConfig.adSlots[position][isMobile ? 'mobile' : 'desktop'];
        
        // 设置广告尺寸
        const size = this.getAdSize(position);
        adElement.style.width = size.width;
        adElement.style.height = size.height;
        
        // 添加广告到容器
        adContainer.appendChild(adElement);
        
        // 延迟加载广告
        setTimeout(() => {
            if (typeof adsbygoogle !== 'undefined') {
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        }, adConfig.loadConfig.delay);
        
        this.adsLoaded.add(position);
        this.ads[position] = adElement;
        
        // 监听广告加载错误
        this.handleAdError(position);
    }
    
    // 获取广告尺寸
    getAdSize(position) {
        const isMobile = window.innerWidth <= 768;
        const size = adConfig.adSizes[position][isMobile ? 'mobile' : 'desktop'];
        const [width, height] = size.split('x');
        return { width: `${width}px`, height: `${height}px` };
    }
    
    // 处理广告加载错误
    handleAdError(position) {
        const adElement = this.ads[position];
        if (!adElement) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const style = adElement.getAttribute('style');
                    if (style && style.includes('display: none')) {
                        this.retryAd(position);
                        observer.disconnect();
                    }
                }
            });
        });
        
        observer.observe(adElement, { attributes: true });
    }
    
    // 重试加载广告
    retryAd(position) {
        if (!this.retryCount[position]) {
            this.retryCount[position] = 0;
        }
        
        if (this.retryCount[position] < adConfig.loadConfig.maxRetries) {
            this.retryCount[position]++;
            setTimeout(() => {
                this.loadAd(position);
            }, adConfig.loadConfig.retryInterval);
        } else {
            console.error(`Failed to load ad for position: ${position} after ${adConfig.loadConfig.maxRetries} retries`);
        }
    }
    
    // 获取页面停留时间
    getTimeOnPage() {
        return performance.now();
    }
    
    // 刷新广告
    refreshAds() {
        Object.keys(this.ads).forEach(position => {
            const adElement = this.ads[position];
            if (adElement) {
                adElement.remove();
                this.adsLoaded.delete(position);
                this.loadAd(position);
            }
        });
    }
}

// 创建广告加载器实例
const adLoader = new AdLoader();

// 导出广告加载器
export default adLoader; 