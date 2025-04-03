// 游戏评分系统 JavaScript 文件

// 使用localStorage来存储评分数据
// 每个游戏页面的评分将以游戏URL为键存储
const ratingSystem = {
    // 初始化评分系统
    init: function() {
        // 获取当前页面URL作为唯一标识
        const currentPage = window.location.pathname;
        
        // 检查是否是首页
        if (currentPage === '/' || currentPage === '/index.html') {
            // 在首页显示所有游戏的评分
            this.displayRatingsOnHomepage();
        }
        // 检查页面是否是游戏页面
        else if (currentPage.includes('/games/')) {
            // 添加评分区到页面
            this.addRatingSection();
            
            // 加载已有评分
            this.loadRating();
            
            // 设置评分提交事件
            this.setupRatingForm();
        }
    },
    
    // 在首页显示所有游戏的评分
    displayRatingsOnHomepage: function() {
        // 获取所有游戏卡片
        const gameCards = document.querySelectorAll('.game-card');
        
        // 遍历每个游戏卡片
        gameCards.forEach(card => {
            // 获取游戏链接
            const gameLink = card.getAttribute('href');
            if (!gameLink) return;
            
            // 从localStorage获取该游戏的评分数据
            const ratingData = JSON.parse(localStorage.getItem(`rating_${gameLink}`) || '{}');
            
            // 如果有评分数据，显示在卡片上
            if (ratingData.averageRating) {
                // 创建评分显示元素
                const ratingElement = document.createElement('div');
                ratingElement.className = 'flex items-center mt-1';
                ratingElement.innerHTML = `
                    <div class="flex text-yellow-400">
                        ${this.getStarRating(ratingData.averageRating)}
                    </div>
                    <span class="ml-1 text-xs text-gray-500">(${ratingData.count})</span>
                `;
                
                // 添加到卡片信息区域
                const infoDiv = card.querySelector('.p-4');
                if (infoDiv) {
                    infoDiv.appendChild(ratingElement);
                }
            }
        });
    },
    
    // 添加评分区到游戏页面
    addRatingSection: function() {
        // 获取游戏标题元素
        const gameTitle = document.querySelector('main h1');
        if (!gameTitle) return;
        
        // 创建评分区HTML
        const ratingSection = document.createElement('div');
        ratingSection.className = 'flex items-center mb-6';
        ratingSection.innerHTML = `
            <div id="game-rating" class="flex items-center">
                <span class="text-lg font-medium mr-2">游戏评分:</span>
                <div class="flex text-yellow-400" id="average-rating">
                    <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                </div>
                <span id="rating-count" class="ml-2 text-sm text-gray-500">(0)</span>
            </div>
            <button id="rate-game-btn" class="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">评分</button>
        `;
        
        // 插入到标题后面
        gameTitle.insertAdjacentElement('afterend', ratingSection);
        
        // 创建评分弹窗
        const ratingModal = document.createElement('div');
        ratingModal.id = 'rating-modal';
        ratingModal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 hidden';
        ratingModal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-xl font-semibold text-gray-900 mb-4">为游戏评分</h3>
                <div class="mb-4">
                    <div id="modal-star-rating" class="flex justify-center">
                        <span class="star cursor-pointer text-3xl" data-value="1">☆</span>
                        <span class="star cursor-pointer text-3xl" data-value="2">☆</span>
                        <span class="star cursor-pointer text-3xl" data-value="3">☆</span>
                        <span class="star cursor-pointer text-3xl" data-value="4">☆</span>
                        <span class="star cursor-pointer text-3xl" data-value="5">☆</span>
                    </div>
                    <div class="text-center mt-2">
                        <span id="modal-rating-value">0</span> / 5
                    </div>
                </div>
                <div class="flex justify-end space-x-3">
                    <button id="cancel-rating" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">取消</button>
                    <button id="submit-rating" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">提交</button>
                </div>
            </div>
        `;
        
        // 添加到body
        document.body.appendChild(ratingModal);
        
        // 设置评分按钮点击事件
        document.getElementById('rate-game-btn').addEventListener('click', () => {
            document.getElementById('rating-modal').classList.remove('hidden');
        });
        
        // 设置取消按钮点击事件
        document.getElementById('cancel-rating').addEventListener('click', () => {
            document.getElementById('rating-modal').classList.add('hidden');
        });
        
        // 设置星级评分功能
        this.setupModalStarRating();
    },
    
    // 设置弹窗中的星级评分功能
    setupModalStarRating: function() {
        const stars = document.querySelectorAll('#modal-star-rating .star');
        const ratingValue = document.getElementById('modal-rating-value');
        let selectedRating = 0;
        
        stars.forEach(star => {
            // 鼠标悬停效果
            star.addEventListener('mouseover', function() {
                const value = parseInt(this.getAttribute('data-value'));
                highlightStars(value);
            });
            
            // 鼠标离开效果
            star.addEventListener('mouseout', function() {
                highlightStars(selectedRating);
            });
            
            // 点击选择评分
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                selectedRating = value;
                ratingValue.textContent = value;
                highlightStars(value);
            });
        });
        
        // 高亮星星函数
        function highlightStars(count) {
            stars.forEach(star => {
                const starValue = parseInt(star.getAttribute('data-value'));
                if (starValue <= count) {
                    star.textContent = '★'; // 实心星
                    star.classList.add('text-yellow-400');
                } else {
                    star.textContent = '☆'; // 空心星
                    star.classList.remove('text-yellow-400');
                }
            });
        }
        
        // 设置提交按钮点击事件
        document.getElementById('submit-rating').addEventListener('click', () => {
            if (selectedRating === 0) {
                alert('请选择评分！');
                return;
            }
            
            // 保存评分
            this.saveRating(selectedRating);
            
            // 关闭弹窗
            document.getElementById('rating-modal').classList.add('hidden');
            
            // 重置选中的评分
            selectedRating = 0;
            ratingValue.textContent = '0';
            highlightStars(0);
        });
    },
    
    // 设置评分表单提交事件
    setupRatingForm: function() {
        // 已在setupModalStarRating中实现
    },
    
    // 保存评分
    saveRating: function(rating) {
        // 获取当前页面URL作为唯一标识
        const currentPage = window.location.pathname;
        
        // 从localStorage获取已有评分数据
        let ratingData = JSON.parse(localStorage.getItem(`rating_${currentPage}`) || '{}');
        
        // 如果没有评分数据，初始化
        if (!ratingData.ratings) {
            ratingData = {
                ratings: [],
                count: 0,
                total: 0,
                averageRating: 0
            };
        }
        
        // 添加新评分
        ratingData.ratings.push(rating);
        ratingData.count = ratingData.ratings.length;
        ratingData.total = ratingData.ratings.reduce((sum, r) => sum + r, 0);
        ratingData.averageRating = (ratingData.total / ratingData.count).toFixed(1);
        
        // 保存回localStorage
        localStorage.setItem(`rating_${currentPage}`, JSON.stringify(ratingData));
        
        // 更新显示
        this.loadRating();
    },
    
    // 加载评分
    loadRating: function() {
        // 获取当前页面URL作为唯一标识
        const currentPage = window.location.pathname;
        
        // 从localStorage获取已有评分数据
        const ratingData = JSON.parse(localStorage.getItem(`rating_${currentPage}`) || '{}');
        
        // 获取评分显示元素
        const averageRatingElement = document.getElementById('average-rating');
        const ratingCountElement = document.getElementById('rating-count');
        
        if (!averageRatingElement || !ratingCountElement) return;
        
        // 如果有评分数据，更新显示
        if (ratingData.averageRating) {
            // 更新星级显示
            averageRatingElement.innerHTML = this.getStarRating(ratingData.averageRating);
            
            // 更新评分数量
            ratingCountElement.textContent = `(${ratingData.count})`;
        }
    },
    
    // 生成星级评分HTML
    getStarRating: function(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // 添加实心星
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span>★</span>';
        }
        
        // 添加半星（如果需要）
        if (halfStar) {
            starsHTML += '<span>★</span>';
        }
        
        // 添加空心星
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span>☆</span>';
        }
        
        return starsHTML;
    }
};

// 当DOM加载完成后初始化评分系统
document.addEventListener('DOMContentLoaded', function() {
    ratingSystem.init();
});