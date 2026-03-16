// posts.js - 卡片式文章列表

document.addEventListener('DOMContentLoaded', function() {
    fetch('data/posts.json')
        .then(response => response.json())
        .then(data => {
            renderPostsPage(data);
        })
        .catch(error => {
            console.error('加载失败:', error);
            document.getElementById('app').innerHTML = '<p style="text-align: center; padding: 100px; color: var(--accent);">加载失败，请刷新重试</p>';
        });
});

function renderPostsPage(data) {
    const app = document.getElementById('app');
    
    const html = `
        <!-- 页面头部 -->
        <div class="posts-header" style="text-align: center; margin-bottom: 50px;">
            <h1 style="font-size: 42px; font-weight: 500; color: var(--text-primary); margin-bottom: 16px;">${data.pageTitle}</h1>
            <p style="font-size: 18px; color: var(--text-secondary); max-width: 600px; margin: 0 auto 30px;">${data.pageSubtitle}</p>
            
            <!-- 分类筛选 -->
            <div class="categories-filter" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                ${data.categories.map(cat => `
                    <button class="category-btn ${cat === '全部' ? 'active' : ''}" 
                            style="padding: 8px 20px; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: 30px; color: var(--text-secondary); font-size: 14px; font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s;"
                            onmouseover="this.style.background='var(--accent)'; this.style.color='white'; this.style.borderColor='var(--accent)';"
                            onmouseout="this.style.background=this.classList.contains('active') ? 'var(--accent)' : 'var(--bg-secondary)'; this.style.color=this.classList.contains('active') ? 'white' : 'var(--text-secondary)'; this.style.borderColor='var(--border-light)';"
                            data-category="${cat}">${cat}</button>
                `).join('')}
            </div>
        </div>
        
        <!-- 文章卡片网格 -->
        <div class="posts-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; margin: 40px 0;">
            ${data.posts.map(post => renderPostCard(post)).join('')}
        </div>
    `;
    
    app.innerHTML = html;
    
    // 分类筛选功能
    setupCategoryFilter(data.posts);
}

function renderPostCard(post) {
    return `
        <a href="post.html?id=${post.id}" class="post-card" style="text-decoration: none; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 20px; overflow: hidden; transition: all 0.3s ease; display: block; height: 100%;"
           onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='var(--accent)'; this.style.boxShadow='0 15px 30px -10px rgba(0,0,0,0.2)';"
           onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='var(--border-light)'; this.style.boxShadow='none';">
            
            <!-- 封面图区域 - 固定比例 -->
            <div style="position: relative; padding-top: 56.25%; overflow: hidden; background: var(--bg-secondary);">
                <img src="${post.coverImage || 'images/default-post.jpg'}" 
                     alt="${post.title}"
                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;"
                     onerror="this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22225%22%20viewBox%3D%220%200%20400%20225%22%3E%3Crect%20width%3D%22400%22%20height%3D%22225%22%20fill%3D%22%23${post.category === '技术实践' ? '2563eb' : '7c3aed'}20%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20fill%3D%22%23999%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3E${post.category}%3C%2Ftext%3E%3C%2Fsvg%3E';">
                
                <!-- 分类标签浮层 -->
                <span style="position: absolute; top: 15px; left: 15px; background: var(--accent); color: white; padding: 4px 12px; border-radius: 30px; font-size: 12px; font-family: 'JetBrains Mono', monospace; z-index: 2;">
                    ${post.category}
                </span>
                
                <!-- 阅读时长 -->
                <span style="position: absolute; bottom: 15px; right: 15px; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); color: white; padding: 4px 10px; border-radius: 30px; font-size: 12px; font-family: 'JetBrains Mono', monospace; z-index: 2;">
                    ⏱️ ${post.readTime}
                </span>
            </div>
            
            <!-- 卡片内容区域 -->
            <div style="padding: 20px;">
                <!-- 标题 -->
                <h3 style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin: 0 0 12px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${post.title}
                </h3>
                
                <!-- 摘要 -->
                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 15px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${post.excerpt}
                </p>
                
                <!-- 标签列表 -->
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 15px;">
                    ${post.tags.map(tag => `
                        <span style="font-size: 11px; background: var(--bg-secondary); color: var(--text-tertiary); padding: 3px 8px; border-radius: 20px; border: 1px solid var(--border-light); font-family: 'JetBrains Mono', monospace;">
                            #${tag}
                        </span>
                    `).join('')}
                </div>
                
                <!-- 作者信息 -->
                <div style="display: flex; align-items: center; gap: 10px; padding-top: 15px; border-top: 1px solid var(--border-light);">
                    <img src="${post.authorAvatar || 'images/team/default-avatar.jpg'}" 
                         alt="${post.author}"
                         style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-light);"
                         onerror="this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2216%22%20fill%3D%22%23${post.category === '技术实践' ? '2563eb' : '7c3aed'}20%22%2F%3E%3Ctext%20x%3D%2216%22%20y%3D%2220%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23999%22%20text-anchor%3D%22middle%22%3E${post.author.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E';">
                    <div style="flex: 1;">
                        <div style="font-size: 14px; font-weight: 500; color: var(--text-primary);">${post.author}</div>
                        <div style="font-size: 12px; color: var(--text-tertiary);">${post.date}</div>
                    </div>
                </div>
            </div>
        </a>
    `;
}

function setupCategoryFilter(allPosts) {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            categoryBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'var(--bg-secondary)';
                b.style.color = 'var(--text-secondary)';
            });
            btn.classList.add('active');
            btn.style.background = 'var(--accent)';
            btn.style.color = 'white';
            
            const category = btn.dataset.category;
            
            // 筛选文章
            const postsGrid = document.querySelector('.posts-grid');
            const filteredPosts = category === '全部' 
                ? allPosts 
                : allPosts.filter(post => post.category === category);
            
            // 重新渲染文章列表
            postsGrid.innerHTML = filteredPosts.map(post => renderPostCard(post)).join('');
        });
    });
}