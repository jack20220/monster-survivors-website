/**
 * 图片懒加载实现
 * 只有当图片进入视口时才加载图片，减少初始页面加载时间
 */

class LazyLoader {
    constructor(options = {}) {
        // 默认配置
        this.options = {
            selector: 'img[data-src]',  // 默认选择器
            rootMargin: '0px',         // 根元素的边距
            threshold: 0.1,            // 可见性阈值
            loadingClass: 'loading',   // 加载中的类名
            loadedClass: 'loaded',     // 加载完成的类名
            errorClass: 'error',       // 加载错误的类名
            ...options
        };
        
        this.observer = null;
        this.init();
    }
    
    /**
     * 初始化懒加载
     */
    init() {
        // 检查浏览器是否支持 IntersectionObserver
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            });
            
            // 获取所有需要懒加载的元素
            const elements = document.querySelectorAll(this.options.selector);
            elements.forEach(element => {
                // 添加加载中的类名
                element.classList.add(this.options.loadingClass);
                // 开始观察元素
                this.observer.observe(element);
            });
        } else {
            // 如果浏览器不支持 IntersectionObserver，则立即加载所有图片
            this.loadAllImages();
        }
    }
    
    /**
     * 当元素进入视口时的回调函数
     * @param {IntersectionObserverEntry[]} entries - 观察到的元素条目
     */
    onIntersection(entries) {
        entries.forEach(entry => {
            // 如果元素进入视口
            if (entry.isIntersecting) {
                // 停止观察该元素
                this.observer.unobserve(entry.target);
                // 加载图片
                this.loadImage(entry.target);
            }
        });
    }
    
    /**
     * 加载单个图片
     * @param {HTMLImageElement} image - 需要加载的图片元素
     */
    loadImage(image) {
        const src = image.dataset.src;
        const srcset = image.dataset.srcset;
        
        if (src) {
            // 设置图片的 src 属性
            image.src = src;
            // 移除 data-src 属性
            image.removeAttribute('data-src');
        }
        
        if (srcset) {
            // 设置图片的 srcset 属性
            image.srcset = srcset;
            // 移除 data-srcset 属性
            image.removeAttribute('data-srcset');
        }
        
        // 监听图片加载完成事件
        image.addEventListener('load', () => {
            // 移除加载中的类名
            image.classList.remove(this.options.loadingClass);
            // 添加加载完成的类名
            image.classList.add(this.options.loadedClass);
        });
        
        // 监听图片加载错误事件
        image.addEventListener('error', () => {
            // 移除加载中的类名
            image.classList.remove(this.options.loadingClass);
            // 添加加载错误的类名
            image.classList.add(this.options.errorClass);
            // 设置默认的错误图片
            image.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 24 24%22%3E%3Cpath fill%3D%22%23ccc%22 d%3D%22M21.9 21.9l-8.9-8.9-8.9 8.9-3-3L10 10 1.1 1.1l3-3L13 7l8.9-8.9 3 3L15.9 10l8.9 8.9z%22%2F%3E%3C%2Fsvg%3E';
        });
    }
    
    /**
     * 立即加载所有图片（用于不支持 IntersectionObserver 的浏览器）
     */
    loadAllImages() {
        const elements = document.querySelectorAll(this.options.selector);
        elements.forEach(element => {
            this.loadImage(element);
        });
    }
    
    /**
     * 刷新懒加载（当动态添加新元素时调用）
     */
    refresh() {
        if (this.observer) {
            const elements = document.querySelectorAll(this.options.selector);
            elements.forEach(element => {
                if (!element.classList.contains(this.options.loadedClass) && 
                    !element.classList.contains(this.options.errorClass)) {
                    element.classList.add(this.options.loadingClass);
                    this.observer.observe(element);
                }
            });
        }
    }
}

// 页面加载完成后初始化懒加载
document.addEventListener('DOMContentLoaded', () => {
    // 创建懒加载实例
    window.lazyLoader = new LazyLoader();
    
    // 监听窗口大小变化，刷新懒加载
    window.addEventListener('resize', () => {
        if (window.lazyLoader) {
            window.lazyLoader.refresh();
        }
    });
});