// about.js - 简介页面渲染

document.addEventListener('DOMContentLoaded', function() {
    fetch('data/about.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('加载失败');
            }
            return response.json();
        })
        .then(data => {
            renderAboutPage(data);
        })
        .catch(error => {
            console.error('加载失败:', error);
            document.getElementById('app').innerHTML = '<p style="color: var(--accent); text-align: center; padding: 100px;">加载失败，请刷新重试</p>';
        });
});

function renderAboutPage(data) {
    const app = document.getElementById('app');
    
    const html = `
        <!-- 头部信息 -->
        <div class="about-header">
            <div class="about-name">${data.studio.name}</div>
            <h1 class="about-title">关于我们</h1>
            <div class="about-meta">
                <span>成立 · ${data.studio.founded}</span>
                <span>📍 ${data.studio.location}</span>
                <span>👥 ${data.studio.teamSize}</span>
            </div>
        </div>
        
        <!-- 使命宣言 -->
        <div class="mission-section">
            <div class="mission-title">/${data.mission.title}</div>
            <div class="mission-description">${data.mission.description}</div>
        </div>
        
        <!-- 故事 -->
        <div class="story-section">
            <div class="story-label">${data.story.title}</div>
            <div class="story-content">${data.story.content}</div>
        </div>
        
        <!-- 价值观 -->
        <div class="values-section">
            <div class="section-header">
                <h2>价值观</h2>
                <div class="section-sub">/* 我们相信的 */</div>
            </div>
            <div class="values-grid">
                ${renderValues(data.values)}
            </div>
        </div>
        
        <!-- 数据统计 -->
        <div class="stats-section">
            ${renderStats(data.stats)}
        </div>
        
        <!-- 理念 -->
        <div class="philosophy-section">
            <div class="philosophy-quote">${data.philosophy.quote}</div>
            <div class="philosophy-author">${data.philosophy.author}</div>
        </div>
    `;
    
    app.innerHTML = html;
}

function renderValues(values) {
    return values.map(value => `
        <div class="value-card">
            <div class="value-icon">${value.icon}</div>
            <h3 class="value-title">${value.title}</h3>
            <p class="value-description">${value.description}</p>
        </div>
    `).join('');
}

function renderStats(stats) {
    return stats.map(stat => `
        <div class="stat-item">
            <div class="stat-number">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}