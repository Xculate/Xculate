// post.js - 正确解析Markdown头部元数据

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        showError('未指定文章ID');
        return;
    }
    
    // 先加载文章列表获取元数据（作为后备）
    fetch('data/posts.json')
        .then(response => response.json())
        .then(postsData => {
            const postMeta = postsData.posts.find(p => p.id == postId);
            if (!postMeta) {
                throw new Error('文章不存在');
            }
            
            // 加载Markdown文件
            return fetch(`data/posts/${postId}.md`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('文章内容不存在');
                    }
                    return response.text();
                })
                .then(markdown => {
                    // 解析Markdown，分离头部和内容
                    const { metadata, content } = parseMarkdownWithFrontmatter(markdown, postMeta);
                    renderPostWithMarkdown(metadata, content);
                    document.title = `${metadata.title} · 灰度科技`;
                });
        })
        .catch(error => {
            console.error('加载失败:', error);
            showError('文章加载失败: ' + error.message);
        });
});

// 解析Markdown的frontmatter (--- 包裹的元数据)
function parseMarkdownWithFrontmatter(markdown, fallbackMeta) {
    const result = {
        metadata: { ...fallbackMeta }, // 先用fallback
        content: markdown
    };
    
    // 检查是否有 --- 开头的frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = markdown.match(frontmatterRegex);
    
    if (match) {
        // 有frontmatter，解析它
        const frontmatterStr = match[1];
        const lines = frontmatterStr.split('\n');
        const metadata = {};
        
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // 移除引号
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }
                if (value.startsWith("'") && value.endsWith("'")) {
                    value = value.substring(1, value.length - 1);
                }
                
                metadata[key] = value;
            }
        });
        
        // 合并metadata，frontmatter优先
        result.metadata = { ...fallbackMeta, ...metadata };
        
        // 移除frontmatter，只保留内容
        result.content = markdown.replace(frontmatterRegex, '');
    }
    
    // 处理tags字段（可能是逗号分隔的字符串）
    if (result.metadata.tags && typeof result.metadata.tags === 'string') {
        result.metadata.tags = result.metadata.tags.split(',').map(tag => tag.trim());
    }
    
    return result;
}

function showError(message) {
    document.getElementById('app').innerHTML = `
        <div class="error-page" style="text-align: center; padding: 100px;">
            <h2 style="font-size: 48px; color: var(--accent); margin-bottom: 20px;">😵</h2>
            <p style="color: var(--text-secondary); margin-bottom: 30px;">${message}</p>
            <a href="posts.html" style="color: var(--accent); text-decoration: none; border: 1px solid var(--border-light); padding: 10px 30px; border-radius: 30px;">← 返回动态列表</a>
        </div>
    `;
}

function renderPostWithMarkdown(metadata, markdownContent) {
    // 配置marked选项
    marked.setOptions({
        highlight: function(code, lang) {
            // 简单高亮
            return code;
        },
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
    });
    
    // 解析Markdown为HTML
    const contentHtml = marked.parse(markdownContent);
    
    const app = document.getElementById('app');
    
    const html = `
        <!-- 返回链接 -->
        <div class="back-nav" style="margin-bottom: 30px;">
            <a href="posts.html" style="color: var(--text-tertiary); text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">←</span> 全部动态
            </a>
        </div>
        
        <!-- 文章头部 -->
        <article style="max-width: 800px; margin: 0 auto;">
            <header style="margin-bottom: 40px;">
                <!-- 元信息行 -->
                <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
                    <span style="background: var(--accent); color: white; padding: 4px 12px; border-radius: 30px; font-size: 13px; font-family: 'JetBrains Mono', monospace;">
                        ${metadata.category || '技术实践'}
                    </span>
                    <span style="color: var(--text-tertiary); font-size: 14px;">📅 ${metadata.date || ''}</span>
                    <span style="color: var(--text-tertiary); font-size: 14px;">⏱️ ${metadata.readTime || '5分钟'}</span>
                </div>
                
                <!-- 标题 -->
                <h1 style="font-size: 42px; font-weight: 600; color: var(--text-primary); line-height: 1.2; margin-bottom: 20px;">
                    ${metadata.title || ''}
                </h1>
                
                <!-- 副标题（如果有） -->
                ${metadata.subtitle ? `
                    <p style="font-size: 20px; color: var(--text-secondary); margin-bottom: 30px; font-weight: 300;">
                        ${metadata.subtitle}
                    </p>
                ` : ''}
                
                <!-- 作者信息 -->
                <div style="display: flex; align-items: center; gap: 15px; padding: 20px 0; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
                    <img src="${metadata.authorAvatar || 'images/team/default-avatar.jpg'}" 
                         alt="${metadata.author}"
                         style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-light);"
                         onerror="this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2250%22%20height%3D%2250%22%20viewBox%3D%220%200%2050%2050%22%3E%3Ccircle%20cx%3D%2225%22%20cy%3D%2225%22%20r%3D%2225%22%20fill%3D%22%23${metadata.category === '技术实践' ? '2563eb' : '7c3aed'}20%22%2F%3E%3Ctext%20x%3D%2225%22%20y%3D%2230%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20fill%3D%22%23999%22%20text-anchor%3D%22middle%22%3E${metadata.author ? metadata.author.charAt(0) : '?'}%3C%2Ftext%3E%3C%2Fsvg%3E';">
                    <div>
                        <div style="font-size: 16px; font-weight: 500; color: var(--text-primary);">${metadata.author || ''}</div>
                        <div style="font-size: 14px; color: var(--text-tertiary);">${metadata.authorRole || ''}</div>
                    </div>
                </div>
            </header>
            
            <!-- 封面图（如果有） -->
            ${metadata.coverImage ? `
                <div style="margin: 40px 0; border-radius: 20px; overflow: hidden; border: 1px solid var(--border-light);">
                    <img src="${metadata.coverImage}" alt="${metadata.title}" style="width: 100%; height: auto; display: block;">
                </div>
            ` : ''}
            
            <!-- 文章内容（Markdown渲染结果） -->
            <div class="post-content markdown-body" style="font-size: 16px; line-height: 1.8; color: var(--text-secondary);">
                ${contentHtml}
            </div>
            
            <!-- 标签 -->
            ${metadata.tags && metadata.tags.length > 0 ? `
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 50px 0 40px; padding: 30px 0; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
                    ${metadata.tags.map(tag => `
                        <span style="padding: 6px 14px; background: var(--bg-secondary); border: 1px solid var(--border-light); border-radius: 30px; font-size: 13px; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">
                            #${tag.trim()}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- 作者简介 -->
            ${metadata.authorBio ? `
                <div style="display: flex; gap: 25px; padding: 30px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 20px; margin: 40px 0;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 18px; color: var(--text-primary); margin-bottom: 10px;">关于 ${metadata.author}</h4>
                        <p style="color: var(--text-secondary); line-height: 1.6; font-size: 14px;">${metadata.authorBio}</p>
                    </div>
                </div>
            ` : ''}
        </article>
    `;
    
    app.innerHTML = html;
}