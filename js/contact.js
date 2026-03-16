// contact.js - 联络页面

document.addEventListener('DOMContentLoaded', function() {
    fetch('data/contact.json')
        .then(response => response.json())
        .then(data => {
            renderContactPage(data);
        })
        .catch(error => {
            console.error('加载失败:', error);
            document.getElementById('app').innerHTML = '<p style="text-align: center; padding: 100px; color: var(--accent);">加载失败，请刷新重试</p>';
        });
});

function renderContactPage(data) {
    const app = document.getElementById('app');
    
    const html = `
        <!-- 页面头部 -->
        <div style="text-align: center; margin: 60px 0 50px;">
            <h1 style="font-size: 48px; font-weight: 500; color: var(--text-primary); margin-bottom: 16px;">
                ${data.pageTitle}
            </h1>
            <p style="font-size: 18px; color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
                ${data.pageSubtitle}
            </p>
        </div>
        
        <!-- 联系方式卡片网格 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 25px; margin: 40px 0;">
            ${data.contactMethods.map(method => `
                <div style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 20px; padding: 30px 25px; transition: all 0.3s;"
                     onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--accent)'; this.style.boxShadow='0 15px 30px -10px rgba(0,0,0,0.2)';"
                     onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='var(--border-light)'; this.style.boxShadow='none';">
                    <div style="font-size: 40px; margin-bottom: 20px;">${method.icon}</div>
                    <h3 style="font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">${method.title}</h3>
                    ${method.link 
                        ? `<a href="${method.link}" style="font-size: 16px; color: var(--accent); text-decoration: none; display: block; margin-bottom: 8px;">${method.value}</a>`
                        : `<div style="font-size: 16px; color: var(--text-primary); margin-bottom: 8px;">${method.value}</div>`
                    }
                    <p style="font-size: 14px; color: var(--text-tertiary); margin: 0;">${method.description}</p>
                </div>
            `).join('')}
        </div>
        
        <!-- 主内容：两列布局 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 60px 0;">
            
            <!-- 左侧：联系表单 -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 24px; padding: 0; overflow: hidden;">
                <iframe src="https://tally.so/r/68xLYO" 
                        width="100%" 
                        height="100%"
                        frameborder="0" 
                        marginheight="0" 
                        marginwidth="0"
                        style="background: transparent; display: block;">
                </iframe>
            </div>
            
            <!-- 右侧：办公信息 + FAQ -->
            <div>
                <!-- 办公地址卡片 -->
                
                
                <!-- FAQ 卡片 -->
                <div style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 24px; padding: 35px;">
                    <h2 style="font-size: 24px; font-weight: 500; color: var(--text-primary); margin-bottom: 25px;">常见问题</h2>
                    
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        ${data.faq.map((item, index) => `
                            <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 20px; ${index === data.faq.length - 1 ? 'border-bottom: none; padding-bottom: 0;' : ''}">
                                <div style="display: flex; gap: 12px; margin-bottom: 10px;">
                                    <span style="color: var(--accent); font-family: 'JetBrains Mono', monospace;">Q${index + 1}.</span>
                                    <h3 style="font-size: 16px; font-weight: 500; color: var(--text-primary); margin: 0;">${item.question}</h3>
                                </div>
                                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-left: 28px;">${item.answer}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 社交媒体区域 -->
        <div style="margin: 60px 0 40px; text-align: center;">
            <h2 style="font-size: 24px; font-weight: 500; color: var(--text-primary); margin-bottom: 30px;">关注我们</h2>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                ${data.social.map(platform => `
                    <a href="${platform.url}" 
                       target="_blank"
                       style="display: flex; align-items: center; gap: 12px; padding: 12px 25px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 40px; text-decoration: none; transition: all 0.2s;"
                       onmouseover="this.style.transform='translateY(-3px)'; this.style.borderColor='var(--accent)';"
                       onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='var(--border-light)';">
                        <span style="font-size: 24px;">${platform.icon}</span>
                        <div style="text-align: left;">
                            <div style="font-size: 16px; font-weight: 500; color: var(--text-primary);">${platform.platform}</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
    
    app.innerHTML = html;
}

// 表单提交处理
window.handleSubmit = function(event) {
    event.preventDefault();
    
    // 这里可以添加表单提交逻辑
    alert('消息已发送！我们会尽快回复你。');
    
    // 重置表单
    event.target.reset();
    
    return false;
};