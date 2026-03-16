// project.js - 项目详情页

document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取id参数
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (!projectId) {
        showError('未指定项目ID');
        return;
    }
    
    // 加载对应的项目详情
    fetch(`data/projects/${projectId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('项目不存在');
            }
            return response.json();
        })
        .then(data => {
            renderProjectDetail(data);
            // 更新页面标题
            document.title = `${data.title} · 灰度科技`;
        })
        .catch(error => {
            console.error('加载失败:', error);
            showError('项目加载失败，可能已被移除');
        });
});

function showError(message) {
    document.getElementById('app').innerHTML = `
        <div class="error-page">
            <div class="error-code">404</div>
            <div class="error-message">${message}</div>
            <a href="projects.html" class="back-link">← 返回项目列表</a>
        </div>
    `;
}

function renderProjectDetail(project) {
    const app = document.getElementById('app');
    
    const html = `
        <!-- 返回链接 -->
        <div class="back-nav">
            <a href="projects.html" class="back-link">← 全部项目</a>
        </div>
        
        <!-- 项目头部 -->
        <div class="project-header">
            <h1 class="project-title-large">${project.title}</h1>
            <p class="project-subtitle">${project.subtitle}</p>
            
            <div class="project-info-grid">
                <div class="info-item">
                    <div class="info-label">客户</div>
                    <div class="info-value">${project.client}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">行业</div>
                    <div class="info-value">${project.industry}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">周期</div>
                    <div class="info-value">${project.duration}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">团队</div>
                    <div class="info-value">${project.team.join(' · ')}</div>
                </div>
            </div>
        </div>
        
        <!-- 封面图 -->
        <div class="project-cover">
            <img src="${project.coverImage}" alt="${project.title}">
        </div>
        
        <!-- 技术栈详细 -->
        <div class="tech-section">
            <h2 class="section-title">技术栈</h2>
            <div class="tech-categories">
                ${renderTechCategories(project.techStack)}
            </div>
        </div>
        
        <!-- 挑战与解决方案 -->
        <div class="challenge-solution">
            <div class="challenge-box">
                <h3>挑战</h3>
                <p>${project.challenge}</p>
            </div>
            <div class="solution-box">
                <h3>解决方案</h3>
                <p>${project.solution}</p>
            </div>
        </div>
        
        <!-- 核心功能 -->
        <div class="features-section">
            <h2 class="section-title">核心功能</h2>
            <ul class="features-list">
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <!-- 成果 -->
        <div class="result-section">
            <h2 class="section-title">成果</h2>
            <p class="result-text">${project.result}</p>
        </div>
        
        <!-- 客户评价（如果有） -->
        ${project.testimonial ? renderTestimonial(project.testimonial) : ''}
        
        <!-- 图库（如果有） -->
        ${project.gallery ? renderGallery(project.gallery) : ''}
        
        <!-- 演示链接（如果有） -->
        ${project.link ? `
            <div class="demo-link">
                <a href="${project.link}" target="_blank" class="button">更多 <span>↗</span></a>
            </div>
        ` : ''}
    `;
    
    app.innerHTML = html;
}

function renderTechCategories(categories) {
    return categories.map(cat => `
        <div class="tech-category">
            <div class="category-name">${cat.category}</div>
            <div class="category-items">
                ${cat.items.map(item => `<span class="tech-item">${item}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderTestimonial(testimonial) {
    return `
        <div class="testimonial-section">
            <div class="testimonial-quote">“${testimonial.quote}”</div>
            <div class="testimonial-author">
                <strong>${testimonial.author}</strong>
                <span>${testimonial.position}</span>
            </div>
        </div>
    `;
}

function renderGallery(images) {
    return `
        <div class="gallery-section">
            <h2 class="section-title">更多截图</h2>
            <div class="gallery-grid">
                ${images.map(img => `
                    <div class="gallery-item">
                        <img src="${img}" alt="项目截图">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}