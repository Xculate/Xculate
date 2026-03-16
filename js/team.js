// team.js - 团队页面渲染（竖版立身像）

document.addEventListener('DOMContentLoaded', function() {
    fetch('data/team.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('加载失败');
            }
            return response.json();
        })
        .then(data => {
            renderTeamPage(data);
        })
        .catch(error => {
            console.error('加载失败:', error);
            document.getElementById('app').innerHTML = '<p style="color: var(--accent); text-align: center; padding: 100px;">加载失败，请刷新重试</p>';
        });
});

function renderTeamPage(data) {
    const app = document.getElementById('app');
    
    const html = `
        <!-- 团队头部 -->
        <div class="team-header">
            <div class="team-name">${data.studio.name}</div>
            <h1 class="team-title">我们是谁</h1>
            <p class="team-culture">${data.studio.culture}</p>
            <div class="team-meta">
                <span>成立 · ${data.studio.founded}</span>
                <span>👥 ${data.studio.teamSize}</span>
            </div>
        </div>
        
        <!-- 团队统计数据 -->
        <div class="team-stats">
            ${renderStats(data.stats)}
        </div>
        
        <!-- 团队成员网格 - 两列竖版 -->
        <div class="team-grid">
            ${renderTeamMembers(data.members)}
        </div>
        
        <!-- 加入我们 -->
        <div class="join-section">
            <h2 class="join-title">${data.joinUs.title}</h2>
            <p class="join-description">${data.joinUs.description}</p>
            
            <div class="positions-list">
                ${data.joinUs.positions.map(pos => `
                    <span class="position-tag">${pos}</span>
                `).join('')}
            </div>

            <div class="join-example-download">
                <a href="${data.joinUs.example}" target="_blank">简历模板 <span>📄</span></a>
            </div> 
            
            <div class="join-contact">
                <span class="contact-label">简历投递</span>
                <a href="mailto:${data.joinUs.contact}" class="contact-email">${data.joinUs.contact}</a>
            </div>
        </div>
    `;
    
    app.innerHTML = html;
}

function renderStats(stats) {
    return stats.map(stat => `
        <div class="stat-item">
            <div class="stat-number">${stat.number}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

function renderTeamMembers(members) {
    return members.map(member => `
        <div class="team-card">
            
            <div class="member-info">
                <h3 class="member-name">${member.name}</h3>
                <div class="member-role">${member.role}</div>
                <p class="member-bio">${member.bio}</p>
                
                <!-- 简洁社交链接（可选） -->
                <div class="member-social">
                    ${renderSocialLinks(member.social)}
                </div>
            </div>
        </div>
    `).join('');
}

function renderSocialLinks(social) {
    const icons = {
        github: '🐙',
        linkedin: '🔗',
        twitter: '🐦',
        behance: '🎨',
        dribbble: '⚽'
    };
    
    return Object.entries(social).map(([platform, url]) => `
        <a href="${url}" target="_blank" class="social-link" rel="noopener" title="${platform}">
            ${icons[platform] || '🔗'}
        </a>
    `).join('');
}