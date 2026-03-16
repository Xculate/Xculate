// projects.js - 项目列表页

document.addEventListener('DOMContentLoaded', function() {
    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
            renderProjectsList(data.projects);
        })
        .catch(error => {
            console.error('加载失败:', error);
            document.getElementById('app').innerHTML = '<p style="color: var(--accent); text-align: center; padding: 100px;">加载失败，请刷新重试</p>';
        });
});

function renderProjectsList(projects) {
    const app = document.getElementById('app');
    
    const html = `
        <div class="page-header">
            <h1 class="page-title">项目案例</h1>
            <p class="page-subtitle">我们交付的不仅是一行行代码，更是可靠的解决方案</p>
            <div class="page-meta">
                <span>${projects.length}个项目</span>
                <span>·</span>
                <span>2018-2024</span>
            </div>
        </div>
        
        <div class="projects-grid">
            ${renderProjectCards(projects)}
        </div>
    `;
    
    app.innerHTML = html;
}

function renderProjectCards(projects) {
    return projects.map(project => `
        <a href="project.html?id=${project.id}" class="project-card">
            <div class="project-image" style="background-image: url('${project.image}'); background-color: ${project.accentColor}20;"></div>
            <div class="project-meta">
                <span class="project-client">${project.client}</span>
                <span class="project-duration">${project.duration}</span>
            </div>
            <h2 class="project-title">${project.title}</h2>
            <div class="tech-stack">
                ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-link">
                查看详情 <span class="arrow">→</span>
            </div>
        </a>
    `).join('');
}