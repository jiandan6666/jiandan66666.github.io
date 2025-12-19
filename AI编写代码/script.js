// JavaScript文件用于添加交互功能

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 音频控制功能
    const audio = document.getElementById('background-music');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = audioToggle.querySelector('i');
    
    // 页面加载后自动播放音频
    audio.play().catch(error => {
        console.log('音频自动播放失败:', error);
    });
    
    audioToggle.addEventListener('click', function() {
        if (audio.paused) {
            // 播放音频
            audio.play().catch(error => {
                console.log('音频播放失败:', error);
            });
            // 更新按钮状态
            audioToggle.classList.remove('muted');
            audioIcon.className = 'fas fa-volume-up';
        } else {
            // 暂停音频
            audio.pause();
            // 更新按钮状态
            audioToggle.classList.add('muted');
            audioIcon.className = 'fas fa-volume-mute';
        }
    });
    // 导航栏滚动效果
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = '#333';
            header.style.boxShadow = 'none';
        }
    });
    
    // 平滑滚动
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // 照片画廊悬停效果
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // 英雄区域打字效果
    const heroText = document.querySelector('.hero-content h1');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';

        let i = 0;
        const typingSpeed = 100;
        
        function typeWriter() {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        
        typeWriter();
    }
    
    // 添加滚动动画
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // 留言板功能
    const messageForm = document.getElementById('message-form');
    const messagesContainer = document.getElementById('messages');

    // 从localStorage加载留言
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.forEach(msg => addMessageToDOM(msg));
    }

    // 添加留言到DOM
    function addMessageToDOM(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-item';
        messageDiv.innerHTML = `
            <h4>${message.name}</h4>
            <p class="message-email">${message.email}</p>
            <p class="message-content">${message.content}</p>
            <p class="message-date">${new Date(message.timestamp).toLocaleString()}</p>
        `;
        messagesContainer.prepend(messageDiv);
    }

    // 处理表单提交
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            content: document.getElementById('content').value,
            timestamp: Date.now()
        };
        // 保存到localStorage
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
        addMessageToDOM(message);
        messageForm.reset();
    });

    loadMessages(); // 页面加载时初始化
    
    // 成为好朋友表单功能
    const friendForm = document.getElementById('friend-form');
    
    if (friendForm) {
        friendForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // 显示对话框
            alert('哈哈，恭喜你成为我的好朋友，愿你平安喜乐，健康快乐，早日成为富婆。');
            // 重置表单
            friendForm.reset();
        });
    }
    
    // 图片查看器功能
    const imageViewer = document.getElementById('image-viewer');
    const viewerImage = document.getElementById('viewer-image');
    const closeBtn = document.querySelector('.close-btn');
    const viewerOverlay = document.querySelector('.viewer-overlay');
    const viewableImages = document.querySelectorAll('.viewable-image');
    
    // 打开图片查看器
    function openImageViewer(src, alt) {
        viewerImage.src = src;
        viewerImage.alt = alt;
        imageViewer.classList.add('active');
        document.body.style.overflow = 'hidden'; // 禁止页面滚动
    }
    
    // 关闭图片查看器
    function closeImageViewer() {
        imageViewer.classList.remove('active');
        document.body.style.overflow = 'auto'; // 恢复页面滚动
        viewerImage.src = '';
        viewerImage.alt = '';
    }
    
    // 为所有可查看图片添加点击事件
    viewableImages.forEach(image => {
        image.addEventListener('click', () => {
            openImageViewer(image.src, image.alt);
        });
    });
    
    // 点击关闭按钮关闭查看器
    if (closeBtn) {
        closeBtn.addEventListener('click', closeImageViewer);
    }
    
    // 点击覆盖层关闭查看器
    if (viewerOverlay) {
        viewerOverlay.addEventListener('click', closeImageViewer);
    }
    
    // 按ESC键关闭查看器
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageViewer.classList.contains('active')) {
            closeImageViewer();
        }
    });
});