// footer.js - 内容美化版

document.addEventListener('DOMContentLoaded', function() {
    // 延迟一点执行，确保主内容已渲染
    setTimeout(loadFooter, 150);
});

function loadFooter() {
    if (document.querySelector('.site-footer')) return;
    
    fetch('data/footer.json')
        .then(response => response.json())
        .then(data => {
            renderFooter(data);
        })
        .catch(error => {
            console.warn('页脚加载失败:', error);
        });
}

function renderFooter(data) {
    const main = document.querySelector('.main');
    if (!main) return;
    
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    
    footer.innerHTML = `
        <div class="container">
            <!-- 主区域：四列布局 -->
            <div class="footer-main">
                <!-- 第1列：工作室简介 -->
                <div class="footer-col studio-col">
                    <div class="footer-logo">
                        <span class="logo-code">&lt;/&gt;</span>
                        <span class="logo-text">${data.studio.name}</span>
                    </div>
                    <p class="studio-brief">${data.studio.brief}</p>
                    <div class="studio-since">Est. ${data.studio.since}</div>
                    
                    <!-- 社交卡片 -->
                    <div class="social-cards">
                        ${data.social.map(item => `
                            <a href="${item.url}" class="social-card" target="_blank" rel="noopener" title="${item.label}">
                                <span class="social-icon">${item.icon}</span>
                                <span class="social-info">
                                    <span class="social-platform">${item.label}</span>
                                    <span class="social-followers">${item.followers}</span>
                                </span>
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 第2列：快速链接（两列） -->
                <div class="footer-col links-col">
                    ${data.quickLinks.map(section => `
                        <div class="link-section">
                            <h4 class="footer-title">${section.title}</h4>
                            <ul class="footer-menu">
                                ${section.links.map(link => `
                                    <li><a href="${link.url}" class="footer-link">${link.label}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <!-- 第3列：近期项目 -->
                <div class="footer-col projects-col">
                    <h4 class="footer-title">${data.projects.title}</h4>
                    <ul class="project-list">
                        ${data.projects.items.map(project => `
                            <li class="project-item">
                                <span class="project-name">${project.name}</span>
                                <span class="project-year">${project.year}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- 第4列：联系与订阅 -->
                <div class="footer-col contact-col">
                    <h4 class="footer-title">联系</h4>
                    
                    <div class="contact-info">
                        <div class="contact-item">
                            <span class="contact-icon">✉️</span>
                            <a href="mailto:${data.contact.email}" class="contact-text">${data.contact.email}</a>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📍</span>
                            <span class="contact-text">${data.contact.address}</span>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
            
            <!-- 底部：版权与备案 -->
            <div class="footer-bottom">
                <div class="copyright">
                    ${data.copyright.text} ${data.copyright.rights}
                </div>
                <div class="credit">
                    ${data.credit}
                </div>
            </div>
        </div>
    `;
    
    main.parentNode.insertBefore(footer, main.nextSibling);
}