// Community System for Yiwu Game

const communitySystem = {
    // Store for community posts
    posts: [],
    
    // Initialize the community system
    init: function() {
        // Load saved posts from localStorage
        this.loadPosts();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check if user is logged in
        this.checkLoginStatus();
        
        // Display posts
        this.displayPosts();
    },
    
    // Load posts from localStorage
    loadPosts: function() {
        const savedPosts = localStorage.getItem('communityPosts');
        if (savedPosts) {
            try {
                this.posts = JSON.parse(savedPosts);
                console.log(`Loaded ${this.posts.length} posts from storage`);
            } catch (e) {
                console.error('Error loading posts:', e);
                // Initialize with sample posts if there's an error
                this.initializeSamplePosts();
            }
        } else {
            // Initialize with sample posts if none exist
            this.initializeSamplePosts();
        }
    },
    
    // Initialize with sample posts
    initializeSamplePosts: function() {
        // Sample posts data
        this.posts = [
            {
                id: 1,
                title: "How to defeat Lavos in Chrono Trigger",
                game: "chrono-trigger",
                gameName: "Chrono Trigger",
                tag: "strategy",
                content: "I've been struggling with the final boss Lavos in Chrono Trigger. Here's the strategy that worked for me: make sure to have Crono, Marle, and Lucca in your party for the final battle. Focus on using their triple tech \"Delta Force\" whenever possible. Also, make sure to have plenty of Mid-Ethers and Hi-Ethers to restore MP. The key is to target the right part of Lavos in each phase of the battle. In the first phase, focus on the center part. In the second phase, target the left arm first, then the right arm, and finally the center. Good luck!",
                author: "GameMaster",
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                likes: 42,
                comments: 18
            },
            {
                id: 2,
                title: "Best team composition for Pokemon Emerald?",
                game: "pokemon-emerald",
                gameName: "Pokemon Emerald",
                tag: "discussion",
                content: "I'm starting a new playthrough of Pokemon Emerald and wondering what team composition would be best for the Elite Four. I'm thinking of using Swampert as my starter, but not sure about the rest of the team. Any suggestions for a well-balanced team that can handle all types of Pokemon in the Elite Four?",
                author: "PokeMaster99",
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                likes: 35,
                comments: 24
            },
            {
                id: 3,
                title: "How do I access the secret area in Super Mario World?",
                game: "super-mario-world",
                gameName: "Super Mario World",
                tag: "question",
                content: "I've heard there's a secret Star Road in Super Mario World, but I can't figure out how to access it. I've found a few secret exits but none of them seem to lead to the Star Road. Can anyone help me with detailed instructions on how to find and access the Star Road?",
                author: "MarioFan2000",
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
                likes: 28,
                comments: 15
            }
        ];
        
        // Save to localStorage
        this.savePosts();
    },
    
    // Save posts to localStorage
    savePosts: function() {
        localStorage.setItem('communityPosts', JSON.stringify(this.posts));
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Create post button
        const createPostBtn = document.getElementById('create-post-btn');
        if (createPostBtn) {
            createPostBtn.addEventListener('click', () => this.showCreatePostModal());
        }
        
        // Close modal button
        const closeModalBtn = document.getElementById('close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.hideCreatePostModal());
        }
        
        // Cancel post button
        const cancelPostBtn = document.getElementById('cancel-post-btn');
        if (cancelPostBtn) {
            cancelPostBtn.addEventListener('click', () => this.hideCreatePostModal());
        }
        
        // Post form submission
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createNewPost();
            });
        }
        
        // Filter by game
        const gameFilter = document.getElementById('gameFilter');
        if (gameFilter) {
            gameFilter.addEventListener('change', () => this.filterPosts());
        }
        
        // Filter by tag
        const tagFilter = document.getElementById('tagFilter');
        if (tagFilter) {
            tagFilter.addEventListener('change', () => this.filterPosts());
        }
        
        // Search posts
        const searchPosts = document.getElementById('searchPosts');
        if (searchPosts) {
            searchPosts.addEventListener('input', () => this.filterPosts());
        }
    },
    
    // Check if user is logged in
    checkLoginStatus: function() {
        // Get current user from localStorage (if using the user system)
        const currentUser = localStorage.getItem('currentUser');
        const createPostBtn = document.getElementById('create-post-btn');
        
        if (!currentUser && createPostBtn) {
            // If user is not logged in, modify the create post button to prompt login
            createPostBtn.textContent = 'Login to Post';
            createPostBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Check if userSystem exists and has showAuthModal method
                if (window.userSystem && typeof window.userSystem.showAuthModal === 'function') {
                    window.userSystem.showAuthModal('login');
                } else {
                    alert('Please login to create posts');
                }
            });
        }
    },
    
    // Show create post modal
    showCreatePostModal: function() {
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            // If user is not logged in, show login modal instead
            if (window.userSystem && typeof window.userSystem.showAuthModal === 'function') {
                window.userSystem.showAuthModal('login');
            } else {
                alert('Please login to create posts');
            }
            return;
        }
        
        const modal = document.getElementById('create-post-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    },
    
    // Hide create post modal
    hideCreatePostModal: function() {
        const modal = document.getElementById('create-post-modal');
        if (modal) {
            modal.classList.add('hidden');
            // Reset form
            document.getElementById('post-form').reset();
        }
    },
    
    // Create new post
    createNewPost: function() {
        // Get form values
        const title = document.getElementById('post-title').value;
        const game = document.getElementById('post-game').value;
        const tag = document.getElementById('post-tag').value;
        const content = document.getElementById('post-content').value;
        
        // Get game name from selected option
        const gameSelect = document.getElementById('post-game');
        const gameName = gameSelect.options[gameSelect.selectedIndex].text;
        
        // Get current user
        let author = 'Anonymous';
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                author = userData.username;
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        
        // Create new post object
        const newPost = {
            id: Date.now(), // Use timestamp as unique ID
            title,
            game,
            gameName,
            tag,
            content,
            author,
            date: new Date(),
            likes: 0,
            comments: 0
        };
        
        // Add to posts array
        this.posts.unshift(newPost); // Add to beginning of array
        
        // Save to localStorage
        this.savePosts();
        
        // Hide modal
        this.hideCreatePostModal();
        
        // Refresh posts display
        this.displayPosts();
    },
    
    // Display posts
    displayPosts: function(filteredPosts = null) {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;
        
        // Clear container
        postsContainer.innerHTML = '';
        
        // Get posts to display (filtered or all)
        const postsToDisplay = filteredPosts || this.posts;
        
        if (postsToDisplay.length === 0) {
            // No posts to display
            postsContainer.innerHTML = `
                <div class="bg-white/95 rounded-xl shadow-md p-6 text-center">
                    <p class="text-gray-500">No posts found. Be the first to create a post!</p>
                </div>
            `;
            return;
        }
        
        // Loop through posts and create HTML
        postsToDisplay.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card p-6';
            
            // Format date
            const formattedDate = this.formatDate(post.date);
            
            // Get tag class
            const tagClass = `tag-${post.tag}`;
            
            postElement.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 mb-2">${post.title}</h2>
                        <div class="flex items-center space-x-4">
                            <span class="tag ${tagClass}">${this.capitalizeFirstLetter(post.tag)}</span>
                            <span class="text-sm text-gray-500">Game: ${post.gameName}</span>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500">Posted ${formattedDate} by <span class="font-medium text-blue-600">${post.author}</span></div>
                </div>
                <p class="text-gray-700 mb-4">${this.truncateText(post.content, 200)}</p>
                <div class="flex justify-between items-center">
                    <div class="flex space-x-4 text-sm">
                        <button class="flex items-center text-gray-500 hover:text-blue-500" data-post-id="${post.id}" data-action="like">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span>${post.likes} Likes</span>
                        </button>
                        <button class="flex items-center text-gray-500 hover:text-blue-500" data-post-id="${post.id}" data-action="comment">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span>${post.comments} Comments</span>
                        </button>
                    </div>
                    <a href="#" class="text-blue-500 hover:text-blue-700 text-sm font-medium" data-post-id="${post.id}" data-action="view">Read More</a>
                </div>
            `;
            
            // Add to container
            postsContainer.appendChild(postElement);
        });
        
        // Add event listeners to post actions
        this.setupPostActionListeners();
    },
    
    // Setup post action listeners (like, comment, view)
    setupPostActionListeners: function() {
        // Like buttons
        const likeButtons = document.querySelectorAll('[data-action="like"]');
        likeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(button.getAttribute('data-post-id'));
                this.likePost(postId);
            });
        });
        
        // Comment buttons
        const commentButtons = document.querySelectorAll('[data-action="comment"]');
        commentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(button.getAttribute('data-post-id'));
                this.viewPost(postId, 'comment'); // View post with comment section focused
            });
        });
        
        // View buttons
        const viewButtons = document.querySelectorAll('[data-action="view"]');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(button.getAttribute('data-post-id'));
                this.viewPost(postId);
            });
        });
    },
    
    // Like a post
    likePost: function(postId) {
        // Check if user is logged in
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            // If user is not logged in, show login modal
            if (window.userSystem && typeof window.userSystem.showAuthModal === 'function') {
                window.userSystem.showAuthModal('login');
            } else {
                alert('Please login to like posts');
            }
            return;
        }
        
        // Find post by ID
        const postIndex = this.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            // Increment likes
            this.posts[postIndex].likes++;
            
            // Save to localStorage
            this.savePosts();
            
            // Refresh posts display
            this.displayPosts();
        }
    },
    
    // View a post (placeholder for future implementation)
    viewPost: function(postId, action = 'view') {
        // Find post by ID
        const post = this.posts.find(post => post.id === postId);
        if (post) {
            // For now, just show an alert with the post content
            alert(`${post.title}\n\n${post.content}\n\nThis is a placeholder. In a full implementation, this would open a detailed post view page.`);
        }
    },
    
    // Filter posts based on selected filters
    filterPosts: function() {
        const gameFilter = document.getElementById('gameFilter').value;
        const tagFilter = document.getElementById('tagFilter').value;
        const searchQuery = document.getElementById('searchPosts').value.toLowerCase();
        
        // Filter posts
        let filteredPosts = this.posts;
        
        // Filter by game
        if (gameFilter !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.game === gameFilter);
        }
        
        // Filter by tag
        if (tagFilter !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.tag === tagFilter);
        }
        
        // Filter by search query
        if (searchQuery) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(searchQuery) || 
                post.content.toLowerCase().includes(searchQuery)
            );
        }
        
        // Display filtered posts
        this.displayPosts(filteredPosts);
    },
    
    // Helper function to format date
    formatDate: function(date) {
        if (!(date instanceof Date)) {
            try {
                date = new Date(date);
            } catch (e) {
                return 'unknown date';
            }
        }
        
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'today';
        } else if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else {
            return date.toLocaleDateString();
        }
    },
    
    // Helper function to truncate text
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    // Helper function to capitalize first letter
    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

// Initialize community system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    communitySystem.init();
});