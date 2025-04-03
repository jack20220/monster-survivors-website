/**
 * 移动端触控控制器
 * 为游戏页面添加触控控制功能，适配移动设备
 */

class MobileControls {
    constructor() {
        this.isInitialized = false;
        this.isMobile = false;
        this.gameFrame = null;
        this.controlsContainer = null;
        this.keyMap = {
            'ArrowUp': false,
            'ArrowRight': false,
            'ArrowDown': false,
            'ArrowLeft': false,
            'KeyZ': false,  // A按钮，通常对应跳跃
            'KeyX': false,  // B按钮，通常对应攻击/确认
            'Enter': false  // Start按钮
        };
        
        // 绑定方法到实例
        this.init = this.init.bind(this);
        this.createControlsUI = this.createControlsUI.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.handleButtonDown = this.handleButtonDown.bind(this);
        this.handleButtonUp = this.handleButtonUp.bind(this);
        this.simulateKeyEvent = this.simulateKeyEvent.bind(this);
        this.checkMobile = this.checkMobile.bind(this);
    }
    
    /**
     * 初始化移动端控制器
     */
    init() {
        if (this.isInitialized) return;
        
        // 检查是否为移动设备
        this.isMobile = this.checkMobile();
        if (!this.isMobile) return;
        
        // 获取游戏iframe
        this.gameFrame = document.getElementById('gameFrame');
        if (!this.gameFrame) return;
        
        // 创建控制器UI
        this.createControlsUI();
        
        // 设置事件监听
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Mobile controls initialized');
    }
    
    /**
     * 检查是否为移动设备
     */
    checkMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    }
    
    /**
     * 创建控制器UI
     */
    createControlsUI() {
        // 创建控制器容器
        this.controlsContainer = document.createElement('div');
        this.controlsContainer.className = 'mobile-controls';
        
        // 创建方向键
        const dPad = document.createElement('div');
        dPad.className = 'd-pad';
        
        // 上下左右按钮
        const dPadUp = document.createElement('div');
        dPadUp.className = 'd-pad-button d-pad-up';
        dPadUp.innerHTML = '&#9650;';
        dPadUp.dataset.key = 'ArrowUp';
        
        const dPadRight = document.createElement('div');
        dPadRight.className = 'd-pad-button d-pad-right';
        dPadRight.innerHTML = '&#9654;';
        dPadRight.dataset.key = 'ArrowRight';
        
        const dPadDown = document.createElement('div');
        dPadDown.className = 'd-pad-button d-pad-down';
        dPadDown.innerHTML = '&#9660;';
        dPadDown.dataset.key = 'ArrowDown';
        
        const dPadLeft = document.createElement('div');
        dPadLeft.className = 'd-pad-button d-pad-left';
        dPadLeft.innerHTML = '&#9664;';
        dPadLeft.dataset.key = 'ArrowLeft';
        
        dPad.appendChild(dPadUp);
        dPad.appendChild(dPadRight);
        dPad.appendChild(dPadDown);
        dPad.appendChild(dPadLeft);
        
        // 创建动作按钮
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        const buttonA = document.createElement('div');
        buttonA.className = 'action-button button-a';
        buttonA.textContent = 'A';
        buttonA.dataset.key = 'KeyZ';
        
        const buttonB = document.createElement('div');
        buttonB.className = 'action-button button-b';
        buttonB.textContent = 'B';
        buttonB.dataset.key = 'KeyX';
        
        actionButtons.appendChild(buttonA);
        actionButtons.appendChild(buttonB);
        
        // 创建开始按钮
        const startButton = document.createElement('div');
        startButton.className = 'button-start';
        startButton.textContent = 'START';
        startButton.dataset.key = 'Enter';
        
        // 添加所有元素到控制器容器
        this.controlsContainer.appendChild(dPad);
        this.controlsContainer.appendChild(actionButtons);
        this.controlsContainer.appendChild(startButton);
        
        // 添加控制器到页面
        document.body.appendChild(this.controlsContainer);
    }
    
    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 获取所有按钮
        const buttons = this.controlsContainer.querySelectorAll('[data-key]');
        
        // 为每个按钮添加触摸/点击事件
        buttons.forEach(button => {
            // 触摸开始事件
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleButtonDown(button.dataset.key);
            });
            
            // 触摸结束事件
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleButtonUp(button.dataset.key);
            });
            
            // 鼠标按下事件（用于测试）
            button.addEventListener('mousedown', () => {
                this.handleButtonDown(button.dataset.key);
            });
            
            // 鼠标抬起事件（用于测试）
            button.addEventListener('mouseup', () => {
                this.handleButtonUp(button.dataset.key);
            });
            
            // 鼠标离开事件（用于测试）
            button.addEventListener('mouseleave', () => {
                this.handleButtonUp(button.dataset.key);
            });
        });
    }
    
    /**
     * 处理按钮按下事件
     */
    handleButtonDown(key) {
        if (!this.keyMap[key]) {
            this.keyMap[key] = true;
            this.simulateKeyEvent(key, 'keydown');
        }
    }
    
    /**
     * 处理按钮抬起事件
     */
    handleButtonUp(key) {
        if (this.keyMap[key]) {
            this.keyMap[key] = false;
            this.simulateKeyEvent(key, 'keyup');
        }
    }
    
    /**
     * 模拟键盘事件
     */
    simulateKeyEvent(key, eventType) {
        // 创建键盘事件
        const event = new KeyboardEvent(eventType, {
            key: key.replace('Key', '').toLowerCase(),
            code: key,
            keyCode: this.getKeyCode(key),
            which: this.getKeyCode(key),
            bubbles: true,
            cancelable: true
        });
        
        // 向游戏iframe发送事件
        if (this.gameFrame && this.gameFrame.contentWindow) {
            try {
                this.gameFrame.contentWindow.document.dispatchEvent(event);
            } catch (e) {
                // 如果无法直接向iframe发送事件（跨域限制），则向父页面发送
                document.dispatchEvent(event);
            }
        } else {
            // 如果没有iframe，则向当前页面发送
            document.dispatchEvent(event);
        }
    }
    
    /**
     * 获取键码
     */
    getKeyCode(key) {
        const keyCodeMap = {
            'ArrowUp': 38,
            'ArrowRight': 39,
            'ArrowDown': 40,
            'ArrowLeft': 37,
            'KeyZ': 90,
            'KeyX': 88,
            'Enter': 13
        };
        
        return keyCodeMap[key] || 0;
    }
}

// 在页面加载完成后初始化移动端控制器
document.addEventListener('DOMContentLoaded', function() {
    // 添加CSS样式表
    if (!document.querySelector('link[href="../mobile-controls.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../mobile-controls.css';
        document.head.appendChild(link);
    }
    
    // 初始化控制器
    const mobileControls = new MobileControls();
    mobileControls.init();
});