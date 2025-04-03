// 评论系统 JavaScript 文件

// 使用localStorage来存储评论数据
// 每个游戏页面的评论将以游戏URL为键存储
const commentsSystem = {
    // 初始化评论系统
    init: function() {
        // 获取当前页面URL作为唯一标识
        const currentPage = window.location.pathname;
        
        // 检查页面是否是游戏页面
        if (currentPage.includes('/games/')) {
            // 添加评论区到页面
            this.addCommentSection();
            
            // 加载已有评论
            this.loadComments();
            
            // 设置评论提交事件
            this.setupCommentForm();
        }
    },
    
    // 添加评论区到页面
    addCommentSection: function() {
        // 获取main元素，在其末尾添加评论区
        const mainElement = document.querySelector('main');
        if (!mainElement) return;
        
        // 创建评论区HTML
        const commentSection = document.createElement('section');
        commentSection.className = 'bg-white/95 rounded-xl shadow-md p-8 mt-12';
        commentSection.innerHTML = `
            <h2 class="text-xl font-semibold text-gray-900 mb-6">用户评论</h2>
            <div id="comments-container" class="mb-8">
                <p id="no-comments" class="text-gray-500 italic">暂无评论，成为第一个评论的用户吧！</p>
            </div>
            <form id="comment-form" class="space-y-4">
                <div>
                    <label for="commenter-name" class="block text-sm font-medium text-gray-700 mb-1">您的昵称</label>
                    <input type="text" id="commenter-name" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                </div>
                <div>
                    <label for="comment-text" class="block text-sm font-medium text-gray-700 mb-1">评论内容</label>
                    <textarea id="comment-text" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required></textarea>
                </div>
                <div>
                    <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">评分</label>
                    <div class="flex items-center space-x-1">
                        <div id="star-rating" class="flex">
                            <span class="star cursor-pointer text-2xl" data-value="1">☆</span>
                            <span class="star cursor-pointer text-2xl" data-value="2">☆</span>
                            <span class="star cursor-pointer text-2xl" data-value="3">☆</span>
                            <span class="star cursor-pointer text-2xl" data-value="4">☆</span>
                            <span class="star cursor-pointer text-2xl" data-value="5">☆</span>
                        </div>
                        <span id="rating-value" class="ml-2">0</span>
                    </div>
                    <input type="hidden" id="rating-input" value="0">
                </div>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">提交评论</button>
            </form>
        `;
        
        // 添加到main元素末尾
        mainElement.appendChild(commentSection);
        
        // 设置星级评分功能
        this.setupStarRating();
    },
    
    // 设置星级评分功能
    setupStarRating: function() {
        const stars = document.querySelectorAll('.star');
        const ratingValue = document.getElementById('rating-value');
        const ratingInput = document.getElementById('rating-input');
        
        stars.forEach(star => {
            // 鼠标悬停效果
            star.addEventListener('mouseover', function() {
                const value = this.getAttribute('data-value');
                highlightStars(value);
            });
            
            // 鼠标离开效果
            star.addEventListener('mouseout', function() {
                const currentRating = ratingInput.value;
                highlightStars(currentRating);
            });
            
            // 点击选择评分
            star.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                ratingInput.value = value;
                ratingValue.textContent = value;
                highlightStars(value);
            });
        });
        
        // 高亮星星函数
        function highlightStars(count) {
            stars.forEach(star => {
                const starValue = star.getAttribute('data-value');
                if (starValue <= count) {
                    star.textContent = '★'; // 实心星
                    star.classList.add('text-yellow-400');
                } else {
                    star.textContent = '☆'; // 空心星
                    star.classList.remove('text-yellow-400');
                }
            });
        }
    },
    
    // 设置评论表单提交事件
    setupCommentForm: function() {
        const form = document.getElementById('comment-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const name = document.getElementById('commenter-name').value;
            const text = document.getElementById('comment-text').value;
            const rating = document.getElementById('rating-input').value;
            
            // 验证数据
            if (!name.trim() || !text.trim() || rating === '0') {
                alert('请填写完整的评论信息并给出评分！');
                return;
            }
            
            // 创建评论对象
            const comment = {
                name: name,
                text: text,
                rating: parseInt(rating),
                date: new Date().toISOString()
            };
            
            // 保存评论
            this.saveComment(comment);
            
            // 重置表单
            form.reset();
            document.getElementById('rating-value').textContent = '0';
            document.getElementById('rating-input').value = '0';
            
            // 重置星星
            const stars = document.querySelectorAll('.star');
            stars.forEach(star => {
                star.textContent = '☆';
                star.classList.remove('text-yellow-400');
            });
        });
    },
    
    // 保存评论
    saveComment: function(comment) {
        // 获取当前页面URL作为唯一标识
        const currentPage = window.location.pathname;
        
        // 从localStorage获取已有评论
        let comments = JSON.parse(localStorage.getItem(`comments_${currentPage}`) || '[]');
        
        // 添加新评论到数组开头（最新的评论显示在前面）
        comments.unshift(comment);
        
        // 保存回localStorage
        localStorage.setItem(`comments_${currentPage}`, JSON.stringify(comments));
        
        // 更新显示
        this.loadComments();
    },
    
    // 加载评论
    loadComments: function() {
        // 获取当前页面URL作为唯一标识
        const currentPage = window.location.pathname;
        
        // 从localStorage获取已有评论
        const comments = JSON.parse(localStorage.getItem(`comments_${currentPage}`) || '[]');
        
        // 获取评论容器
        const commentsContainer = document.getElementById('comments-container');
        if (!commentsContainer) return;
        
        // 清空容器
        commentsContainer.innerHTML = '';
        
        // 如果没有评论，显示提示信息
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p id="no-comments" class="text-gray-500 italic">暂无评论，成为第一个评论的用户吧！</p>';
            return;
        }
        
        // 计算平均评分
        let totalRating = 0;
        comments.forEach(comment => {
            totalRating += comment.rating;
        });
        const averageRating = (totalRating / comments.length).toFixed(1);
        
        // 添加平均评分显示
        const ratingElement = document.createElement('div');
        ratingElement.className = 'mb-4 flex items-center';
        ratingElement.innerHTML = `
            <span class="text-lg font-medium mr-2">平均评分: ${averageRating}</span>
            <div class="flex text-yellow-400">
                ${this.getStarRating(averageRating)}
            </div>
            <span class="ml-2 text-sm text-gray-500">(${comments.length} 条评论)</span>
        `;
        commentsContainer.appendChild(ratingElement);
        
        // 添加所有评论
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'border-t border-gray-200 py-4';
            
            // 格式化日期
            const date = new Date(comment.date);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            
            commentElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-medium text-gray-900">${this.escapeHTML(comment.name)}</h3>
                        <div class="flex items-center mt-1">
                            <div class="flex text-yellow-400">
                                ${this.getStarRating(comment.rating)}
                            </div>
                            <span class="ml-2 text-sm text-gray-500">${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <p class="mt-2 text-gray-600">${this.escapeHTML(comment.text)}</p>
            `;
            
            commentsContainer.appendChild(commentElement);
        });
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
    },
    
    // HTML转义函数，防止XSS攻击
    escapeHTML: function(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

// 当DOM加载完成后初始化评论系统
document.addEventListener('DOMContentLoaded', function() {
    commentsSystem.init();
});