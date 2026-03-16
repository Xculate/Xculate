// theme.js - 主题切换（适配你的按钮结构）

(function() {
    // 获取保存的主题，如果没有则用系统偏好
    const getSavedTheme = () => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        
        // 检查系统偏好
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // 应用主题
    const setTheme = (theme) => {
        // 设置 HTML 的 data-theme 属性
        document.documentElement.setAttribute('data-theme', theme);
        
        // 保存到 localStorage
        localStorage.setItem('theme', theme);
        
        console.log('主题已切换为:', theme); // 调试用
    };

    // 切换主题
    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };

    // 初始化主题
    const initTheme = () => {
        const savedTheme = getSavedTheme();
        setTheme(savedTheme);
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    };

    // 绑定按钮事件
    const bindToggleButton = () => {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            // 移除之前可能绑定的事件（如果有）
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            // 重新获取并绑定事件
            const freshToggle = document.getElementById('themeToggle');
            freshToggle.addEventListener('click', (e) => {
                e.preventDefault();
                toggleTheme();
            });
            
            console.log('主题切换按钮已绑定');
        } else {
            console.warn('未找到主题切换按钮');
        }
    };

    // 立即执行初始化（在DOM加载前先设置主题）
    initTheme();
    
    // DOM加载完成后绑定按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindToggleButton);
    } else {
        bindToggleButton();
    }
})();