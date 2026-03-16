// main.js - 内容渲染（保持不变，只改一下数据结构字段）
document.addEventListener('DOMContentLoaded', function() {
    fetch('data/homepage.json')
        .then(response => response.json())
        .then(data => {
            renderHomepage(data);
        })
        .catch(error => {
            console.error('加载失败:', error);
            document.getElementById('app').innerHTML = '<p style="color: var(--accent);">加载失败，请刷新重试</p>';
        });
});

function renderHomepage(data) {
    const app = document.getElementById('app');
    
    const html = `
        <div class="studio-header">
            <div class="studio-name">${data.studio.name}</div>
            <h1 class="studio-slogan">
                ${data.studio.slogan.split('代码')[0]}<span>代码</span>${data.studio.slogan.split('代码')[1] || ''}
            </h1>
            <div class="studio-sub">${data.studio.subSlogan}</div>
        </div>
        
        <div class="projects-grid">
            ${renderProjects(data.featuredProjects)}
        </div>
        
        <div class="tech-cloud">
            ${renderTechTags(data.techTags)}
        </div>
        
        <div class="quick-links">
            ${renderQuickLinks(data.quickLinks)}
        </div>
    `;
    
    app.innerHTML = html;
}

function renderProjects(projects) {
    return projects.map(project => `
        <a href="${project.link}" class="project-card">
            <div class="project-image" style="background-image: url('${project.image}'); background-color: ${project.accentColor}20;"></div>
            <h2 class="project-title">${project.title}</h2>
            <div class="tech-stack">
                ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <p class="project-description">${project.description}</p>
        </a>
    `).join('');
}

function renderTechTags(tags) {
    return tags.map(tag => `<span class="tech-cloud-item">${tag}</span>`).join('');
}

function renderQuickLinks(links) {
    return links.map(link => `
        <a href="${link.link}" class="quick-link">
            ${link.title} <span style="font-family: monospace;">${link.icon}</span>
        </a>
    `).join('');
}