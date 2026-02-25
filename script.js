// 电视剧数据管理
class TVShowManager {
    constructor() {
        this.tvShows = [];
        this.currentShowId = null;
        this.initData();
        this.currentFilter = 'all';
        this.renderTVShows();
        this.renderLeaderboard();
        this.renderStatistics();
        this.bindEvents();
        this.initAudio();
    }

    // 初始化音频播放
    initAudio() {
        const audio = document.getElementById('bgAudio');
        if (audio) {
            audio.volume = 0.5;
            audio.play().catch(error => {
                console.log('音频自动播放失败，可能需要用户交互:', error);
                document.addEventListener('click', () => {
                    audio.play();
                }, { once: true });
            });
        }
    }

    // 切换音频播放状态
    toggleAudio() {
        const audio = document.getElementById('bgAudio');
        const audioIcon = document.getElementById('audioIcon');
        const audioText = document.getElementById('audioText');
        
        if (audio) {
            if (audio.paused) {
                audio.play();
                audioIcon.textContent = '🔊';
                audioText.textContent = '暂停音乐';
            } else {
                audio.pause();
                audioIcon.textContent = '🔇';
                audioText.textContent = '播放音乐';
            }
        }
    }

    // 初始化电视剧数据
    initData() {
        // 预设电视剧数据
        const defaultShows = [
            { id: 1, name: '西游记', year: 1986, actors: '六小龄童, 迟重瑞, 马德华, 闫怀礼', poster: './图片/西游记.jpg', votes: 0, comments: [] },
            { id: 2, name: '红楼梦', year: 1987, actors: '欧阳奋强, 陈晓旭, 邓婕', poster: './图片/红楼梦.jpg', votes: 0, comments: [] },
            { id: 3, name: '三国演义', year: 1994, actors: '唐国强, 鲍国安, 孙彦军', poster: './图片/三国演义.jpg', votes: 0, comments: [] },
            { id: 4, name: '水浒传', year: 1998, actors: '李雪健, 周野芒, 臧金生', poster: './图片/水浒传.jpg', votes: 0, comments: [] },
            { id: 5, name: '还珠格格', year: 1998, actors: '赵薇, 林心如, 苏有朋', poster: './图片/还珠格格.jpg', votes: 0, comments: [] },
            { id: 6, name: '雍正王朝', year: 1999, actors: '唐国强, 焦晃, 王绘春', poster: './图片/雍正王朝.jpg', votes: 0, comments: [] },
            { id: 7, name: '大宅门', year: 2001, actors: '陈宝国, 斯琴高娃, 刘佩琦', poster: './图片/大宅门.jpg', votes: 0, comments: [] },
            { id: 8, name: '康熙王朝', year: 2001, actors: '陈道明, 斯琴高娃, 高兰村', poster: './图片/康熙王朝.jpg', votes: 0, comments: [] },
            { id: 9, name: '铁齿铜牙纪晓岚', year: 2001, actors: '张国立, 王刚, 张铁林', poster: './图片/铁齿铜牙纪晓岚.jpg', votes: 0, comments: [] },
            { id: 10, name: '金粉世家', year: 2003, actors: '陈坤, 董洁, 刘亦菲', poster: './图片/金粉世家.jpg', votes: 0, comments: [] },
            { id: 11, name: '亮剑', year: 2005, actors: '李幼斌, 何政军, 张光北', poster: './图片/亮剑.jpg', votes: 0, comments: [] },
            { id: 12, name: '武林外传', year: 2006, actors: '闫妮, 沙溢, 姚晨', poster: './图片/武林外传.jpg', votes: 0, comments: [] },
            { id: 13, name: '士兵突击', year: 2006, actors: '王宝强, 陈思诚, 段奕宏', poster: './图片/士兵突击.jpg', votes: 0, comments: [] },
            { id: 14, name: '潜伏', year: 2009, actors: '孙红雷, 姚晨, 祖峰', poster: './图片/潜伏.jpg', votes: 0, comments: [] },
            { id: 15, name: '蜗居', year: 2009, actors: '海清, 张嘉益, 李念', poster: './图片/蜗居.jpg', votes: 0, comments: [] }
        ];

        // 从localStorage加载数据，如果没有则使用默认数据
        const storedData = localStorage.getItem('tvShows');
        if (storedData) {
            this.tvShows = JSON.parse(storedData);
            // 更新已有数据的海报URL为本地图片
            this.tvShows.forEach(show => {
                // 根据电视剧名称找到对应的本地图片
                const localPosterMap = {
                    '西游记': './图片/西游记.jpg',
                    '红楼梦': './图片/红楼梦.jpg',
                    '三国演义': './图片/三国演义.jpg',
                    '水浒传': './图片/水浒传.jpg',
                    '还珠格格': './图片/还珠格格.jpg',
                    '雍正王朝': './图片/雍正王朝.jpg',
                    '大宅门': './图片/大宅门.jpg',
                    '康熙王朝': './图片/康熙王朝.jpg',
                    '铁齿铜牙纪晓岚': './图片/铁齿铜牙纪晓岚.jpg',
                    '金粉世家': './图片/金粉世家.jpg',
                    '亮剑': './图片/亮剑.jpg',
                    '武林外传': './图片/武林外传.jpg',
                    '士兵突击': './图片/士兵突击.jpg',
                    '潜伏': './图片/潜伏.jpg',
                    '蜗居': './图片/蜗居.jpg'
                };
                if (localPosterMap[show.name]) {
                    show.poster = localPosterMap[show.name];
                }
                // 确保评论数组存在
                if (!show.comments) {
                    show.comments = [];
                }
            });
            this.saveData();
        } else {
            this.tvShows = defaultShows;
            this.saveData();
        }
    }

    // 保存数据到localStorage
    saveData() {
        localStorage.setItem('tvShows', JSON.stringify(this.tvShows));
    }

    // 根据年代筛选电视剧
    filterTVShows(decade) {
        this.currentFilter = decade;
        this.renderTVShows();
    }

    // 投票功能
    vote(id) {
        const show = this.tvShows.find(show => show.id === id);
        if (show) {
            show.votes++;
            this.saveData();
            this.renderTVShows();
            this.renderLeaderboard();
            this.renderStatistics();
            
            // 添加投票成功动画
            const voteBtn = document.querySelector(`.vote-btn[data-id="${id}"]`);
            if (voteBtn) {
                voteBtn.classList.add('voted');
                setTimeout(() => {
                    voteBtn.classList.remove('voted');
                }, 500);
            }
        }
    }

    // 渲染电视剧卡片
    renderTVShows() {
        const grid = document.getElementById('tvShowsGrid');
        if (!grid) return;

        let filteredShows = this.tvShows;
        if (this.currentFilter !== 'all') {
            const decade = parseInt(this.currentFilter);
            filteredShows = this.tvShows.filter(show => {
                const showDecade = Math.floor(show.year / 10) * 10;
                return showDecade === decade;
            });
        }

        // 按照投票数从大到小排序
        filteredShows.sort((a, b) => b.votes - a.votes);

        grid.innerHTML = filteredShows.map(show => `
            <div class="tv-card" id="tv-card-${show.id}">
                <img src="${show.poster}" alt="${show.name}" class="tv-poster">
                <div class="tv-info">
                    <h3 class="tv-title">${show.name}</h3>
                    <div class="tv-details">
                        <p><strong>年代：</strong>${show.year}</p>
                        <p><strong>主演：</strong>${show.actors}</p>
                    </div>
                    <div class="tv-votes">
                        <span class="vote-count">票数：${show.votes}</span>
                        <button class="vote-btn" data-id="${show.id}">投票</button>
                    </div>
                </div>
            </div>
        `).join('');

        // 绑定投票按钮事件
        this.bindVoteEvents();
        // 绑定卡片点击事件
        this.bindCardClickEvents();
    }

    // 绑定卡片点击事件
    bindCardClickEvents() {
        const cards = document.querySelectorAll('.tv-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是投票按钮，不打开评论
                if (e.target.classList.contains('vote-btn')) return;
                
                const showId = parseInt(card.id.replace('tv-card-', ''));
                this.openCommentsModal(showId);
            });
        });
    }

    // 打开评论模态框
    openCommentsModal(showId) {
        const show = this.tvShows.find(s => s.id === showId);
        if (!show) return;

        this.currentShowId = showId;
        
        // 更新标题
        const commentsTitle = document.getElementById('commentsTitle');
        if (commentsTitle) {
            commentsTitle.textContent = `《${show.name}》评论`;
        }

        // 渲染评论列表
        this.renderComments(show);

        // 打开模态框
        const modal = document.getElementById('commentsModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // 关闭评论模态框
    closeCommentsModal() {
        const modal = document.getElementById('commentsModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.currentShowId = null;
    }

    // 渲染评论列表
    renderComments(show) {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        if (!show.comments || show.comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">暂无评论，快来发表第一条评论吧！</p>';
            return;
        }

        commentsList.innerHTML = show.comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `).join('');
    }

    // 添加评论
    addComment() {
        if (this.currentShowId === null) return;

        const commentText = document.getElementById('commentText');
        if (!commentText) return;

        const content = commentText.value.trim();
        if (!content) {
            alert('请输入评论内容！');
            return;
        }

        const show = this.tvShows.find(s => s.id === this.currentShowId);
        if (!show) return;

        // 创建新评论
        const newComment = {
            id: Date.now(),
            author: '匿名用户',
            content: content,
            time: new Date().toLocaleString('zh-CN')
        };

        // 添加到评论数组
        if (!show.comments) {
            show.comments = [];
        }
        show.comments.push(newComment);

        // 保存数据
        this.saveData();

        // 重新渲染评论列表
        this.renderComments(show);

        // 清空输入框
        commentText.value = '';
    }

    // 渲染统计表
    renderStatistics() {
        const statisticsContent = document.getElementById('statisticsContent');
        if (!statisticsContent) return;

        // 计算统计数据
        const totalVotes = this.tvShows.reduce((sum, show) => sum + show.votes, 0);
        const totalShows = this.tvShows.length;
        const maxVotes = totalShows > 0 ? Math.max(...this.tvShows.map(show => show.votes)) : 0;
        
        // 按票数排序获取前三名
        const sortedShows = [...this.tvShows].sort((a, b) => b.votes - a.votes);
        const champion = sortedShows[0] || { name: '暂无', votes: 0 };
        const runnerUp = sortedShows[1] || { name: '暂无', votes: 0 };
        const thirdPlace = sortedShows[2] || { name: '暂无', votes: 0 };

        // 渲染统计卡片
        statisticsContent.innerHTML = `
            <div class="stat-item stat-highlight">
                <div class="stat-label">总票数</div>
                <div class="stat-value">${totalVotes}</div>
                <div class="stat-description">所有电视剧的总投票数</div>
            </div>
            <div class="stat-item stat-highlight">
                <div class="stat-label">最高票数</div>
                <div class="stat-value">${maxVotes}</div>
                <div class="stat-description">单部电视剧的最高票数</div>
            </div>
            <div class="stat-item stat-highlight">
                <div class="stat-label">电视剧总数</div>
                <div class="stat-value">${totalShows}</div>
                <div class="stat-description">系统中的电视剧数量</div>
            </div>
            <div class="stat-item champion-item">
                <div class="trophy-icon champion-trophy">🏆</div>
                <div class="medal-label">冠军</div>
                <div class="show-name">${champion.name}</div>
                <div class="vote-count">${champion.votes} 票</div>
            </div>
            <div class="stat-item runner-up-item">
                <div class="trophy-icon runner-up-trophy">🥈</div>
                <div class="medal-label">亚军</div>
                <div class="show-name">${runnerUp.name}</div>
                <div class="vote-count">${runnerUp.votes} 票</div>
            </div>
            <div class="stat-item third-place-item">
                <div class="trophy-icon third-place-trophy">🥉</div>
                <div class="medal-label">季军</div>
                <div class="show-name">${thirdPlace.name}</div>
                <div class="vote-count">${thirdPlace.votes} 票</div>
            </div>
        `;
    }

    // 渲染排行榜
    renderLeaderboard() {
        const leaderboard = document.getElementById('leaderboardList');
        if (!leaderboard) return;

        // 按票数排序
        const sortedShows = [...this.tvShows].sort((a, b) => b.votes - a.votes).slice(0, 10);

        // 计算票数范围，用于确定颜色深度
        const maxVotes = sortedShows.length > 0 ? sortedShows[0].votes : 1;
        const minVotes = sortedShows.length > 0 ? sortedShows[sortedShows.length - 1].votes : 0;
        const voteRange = maxVotes - minVotes || 1;

        leaderboard.innerHTML = sortedShows.map((show, index) => {
            // 计算票数比例，用于确定颜色深度
            const voteRatio = maxVotes > 0 ? show.votes / maxVotes : 0;
            
            // 根据票数比例确定颜色深度级别（1-5级）
            let depthLevel;
            if (voteRatio >= 0.8) depthLevel = 5;
            else if (voteRatio >= 0.6) depthLevel = 4;
            else if (voteRatio >= 0.4) depthLevel = 3;
            else if (voteRatio >= 0.2) depthLevel = 2;
            else depthLevel = 1;

            return `
                <div class="leaderboard-item depth-${depthLevel}">
                    <span class="leaderboard-rank">${index + 1}</span>
                    <span class="leaderboard-name">${show.name}</span>
                    <span class="leaderboard-votes">${show.votes} 票</span>
                </div>
            `;
        }).join('');
    }

    // 绑定筛选按钮事件
    bindEvents() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有按钮的active类
                filterBtns.forEach(b => b.classList.remove('active'));
                // 添加当前按钮的active类
                btn.classList.add('active');
                // 筛选电视剧
                this.filterTVShows(btn.dataset.decade);
            });
        });

        // 绑定添加电视剧按钮事件
        const addShowBtn = document.getElementById('addShowBtn');
        if (addShowBtn) {
            addShowBtn.addEventListener('click', () => this.openModal());
        }

        // 绑定模态框关闭按钮事件
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        // 绑定取消按钮事件
        const btnCancel = document.getElementById('btnCancel');
        if (btnCancel) {
            btnCancel.addEventListener('click', () => this.closeModal());
        }

        // 绑定模态框外部点击关闭事件
        const modal = document.getElementById('addShowModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // 绑定表单提交事件
        const addShowForm = document.getElementById('addShowForm');
        if (addShowForm) {
            addShowForm.addEventListener('submit', (e) => this.handleAddShow(e));
        }

        // 绑定搜索按钮事件
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.search());
        }

        // 绑定搜索输入框回车事件
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.search();
                }
            });
        }

        // 绑定音频控制按钮事件
        const audioToggleBtn = document.getElementById('audioToggleBtn');
        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', () => this.toggleAudio());
        }

        // 绑定评论模态框关闭按钮事件
        const commentsModalClose = document.getElementById('commentsModalClose');
        if (commentsModalClose) {
            commentsModalClose.addEventListener('click', () => this.closeCommentsModal());
        }

        // 绑定评论提交按钮事件
        const submitCommentBtn = document.getElementById('submitCommentBtn');
        if (submitCommentBtn) {
            submitCommentBtn.addEventListener('click', () => this.addComment());
        }

        // 绑定评论模态框外部点击关闭事件
        const commentsModal = document.getElementById('commentsModal');
        if (commentsModal) {
            commentsModal.addEventListener('click', (e) => {
                if (e.target === commentsModal) {
                    this.closeCommentsModal();
                }
            });
        }
    }

    // 打开模态框
    openModal() {
        const modal = document.getElementById('addShowModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // 关闭模态框
    closeModal() {
        const modal = document.getElementById('addShowModal');
        if (modal) {
            modal.classList.remove('active');
        }
        // 清空表单
        const form = document.getElementById('addShowForm');
        if (form) {
            form.reset();
        }
    }

    // 生成新的电视剧ID
    generateNewId() {
        const maxId = this.tvShows.reduce((max, show) => Math.max(max, show.id), 0);
        return maxId + 1;
    }

    // 处理添加电视剧
    handleAddShow(event) {
        event.preventDefault();
        
        const form = event.target;
        const name = document.getElementById('showName').value.trim();
        const year = parseInt(document.getElementById('showYear').value);
        const actors = document.getElementById('showActors').value.trim();
        const poster = document.getElementById('showPoster').value.trim();

        // 验证输入
        if (!name || !year || !actors) {
            alert('请填写所有必填项！');
            return;
        }

        // 如果没有提供海报URL，生成一个默认的海报
        const defaultPoster = `https://picsum.photos/seed/${encodeURIComponent(name + year)}/300/300`;

        // 创建新的电视剧对象
        const newShow = {
            id: this.generateNewId(),
            name: name,
            year: year,
            actors: actors,
            poster: poster || defaultPoster,
            votes: 0
        };

        // 添加到电视剧列表
        this.tvShows.push(newShow);
        
        // 保存数据
        this.saveData();
        
        // 重新渲染
        this.renderTVShows();
        this.renderLeaderboard();
        
        // 关闭模态框
        this.closeModal();
        
        // 显示成功提示
        alert(`《${name}》添加成功！`);
    }

    // 搜索电视剧
    search() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            alert('请输入搜索关键词！');
            return;
        }

        // 搜索匹配的电视剧
        const matchedShow = this.tvShows.find(show => 
            show.name.toLowerCase().includes(searchTerm)
        );

        if (matchedShow) {
            // 确保所有卡片都渲染了（特别是在筛选状态下）
            this.renderTVShows();
            
            // 滚动到对应的电视剧卡片
            const cardId = `tv-card-${matchedShow.id}`;
            const matchedCard = document.getElementById(cardId);
            
            if (matchedCard) {
                matchedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // 添加高亮动画效果
                matchedCard.style.boxShadow = '0 0 20px rgba(139, 69, 19, 0.5)';
                setTimeout(() => {
                    matchedCard.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                }, 2000);
            } else {
                // 如果在当前筛选结果中找不到，尝试显示所有电视剧
                this.currentFilter = 'all';
                this.renderTVShows();
                
                const matchedCardAfterFilter = document.getElementById(cardId);
                if (matchedCardAfterFilter) {
                    matchedCardAfterFilter.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // 添加高亮动画效果
                    matchedCardAfterFilter.style.boxShadow = '0 0 20px rgba(139, 69, 19, 0.5)';
                    setTimeout(() => {
                        matchedCardAfterFilter.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                    }, 2000);
                }
            }
        } else {
            alert('未找到匹配的电视剧！');
        }
    }

    // 绑定投票按钮事件
    bindVoteEvents() {
        const voteBtns = document.querySelectorAll('.vote-btn');
        voteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.vote(id);
            });
        });
    }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
    new TVShowManager();
});