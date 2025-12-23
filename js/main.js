/**
 * ====================================
 * 电影网站主程序入口文件
 * ====================================
 * 作者: 杨木霖
 * 学号: 25216950232
 * 功能: 电影数据管理、首页渲染、轮播图功能
 * ====================================
 */

// ==================== 电影数据定义 ====================
// 将电影数据挂载到window对象上，使其全局可访问
window.movies = [
    {
        id: 1,                              // 电影唯一标识ID
        title: "流浪地球2",                  // 电影标题
        year: 2023,                         // 上映年份
        rating: 8.3,                        // 电影评分
        genre: ["科幻", "冒险", "灾难"],      // 电影类型数组
        duration: "173分钟",                 // 片长
        director: "郭帆",                    // 导演
        cast: ["吴京", "刘德华", "李雪健", "沙溢"],  // 主演列表
        country: "中国",                     // 制片国家
        language: "汉语普通话",               // 语言
        poster: "https://picsum.photos/300/450?random=1",  // 海报图片URL
        video: "https://www.w3schools.com/html/mov_bbb.mp4",  // 预告片视频URL
        description: "太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。",  // 电影简介
        releaseDate: "2023-01-22",          // 上映日期
        boxOffice: "40.29亿"                // 票房
    },
    {
        id: 2,
        title: "满江红",
        year: 2023,
        rating: 7.5,
        genre: ["悬疑", "喜剧", "历史"],
        duration: "159分钟",
        director: "张艺谋",
        cast: ["沈腾", "易烊千玺", "张译", "雷佳音"],
        country: "中国",
        language: "汉语普通话",
        poster: "https://picsum.photos/300/450?random=2",
        video: "https://www.w3schools.com/html/movie.mp4",
        description: "南宋绍兴年间，岳飞死后四年，秦桧率兵与金国会谈。会谈前夜，金国使者死在宰相驻地，所携密信也不翼而飞。小兵张大（沈腾 饰）与亲兵营副统领孙均（易烊千玺 饰）机缘巧合被裹挟进这巨大阴谋之中。",
        releaseDate: "2023-01-22",
        boxOffice: "45.44亿"
    },
    {
        id: 3,
        title: "深海",
        year: 2023,
        rating: 7.3,
        genre: ["动画", "奇幻", "冒险"],
        duration: "112分钟",
        director: "田晓鹏",
        cast: ["苏鑫", "王亭文"],
        country: "中国",
        language: "汉语普通话",
        poster: "https://picsum.photos/300/450?random=3",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "在大海的最深处，藏着所有秘密。一位现代少女（参宿）误入梦幻的深海世界，却因此邂逅了一段独特的生命旅程。",
        releaseDate: "2023-01-22",
        boxOffice: "9.19亿"
    },
    {
        id: 4,
        title: "阿凡达：水之道",
        year: 2022,
        rating: 8.0,
        genre: ["科幻", "冒险", "动作"],
        duration: "192分钟",
        director: "詹姆斯·卡梅隆",
        cast: ["萨姆·沃辛顿", "佐伊·索尔达娜", "西格妮·韦弗"],
        country: "美国",
        language: "英语",
        poster: "https://picsum.photos/300/450?random=4",
        video: "https://www.w3schools.com/html/movie.mp4",
        description: "影片设定在《阿凡达》的剧情落幕十余年后，讲述了萨利一家（杰克、奈蒂莉和孩子们）的故事：危机未曾消散，一家人拼尽全力彼此守护、奋力求生，并历经艰险磨难。",
        releaseDate: "2022-12-16",
        boxOffice: "16.97亿"
    },
    {
        id: 5,
        title: "无名",
        year: 2023,
        rating: 6.8,
        genre: ["剧情", "悬疑", "历史"],
        duration: "128分钟",
        director: "程耳",
        cast: ["梁朝伟", "王一博", "周迅", "黄磊"],
        country: "中国",
        language: "汉语普通话",
        poster: "https://picsum.photos/300/450?random=5",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "影片通过对上世纪二十年代开始奋斗在上海的中国共产党领导下的中共特科，在隐蔽战线与各方势力殊死较量过程的再现，表现了在走向胜利过程中不可或缺的党的秘密战线上那些无名英雄的奉献与牺牲。",
        releaseDate: "2023-01-22",
        boxOffice: "9.31亿"
    },
    {
        id: 6,
        title: "交换人生",
        year: 2023,
        rating: 5.8,
        genre: ["喜剧", "家庭", "奇幻"],
        duration: "110分钟",
        director: "苏伦",
        cast: ["雷佳音", "张小斐", "张宥浩", "沙溢"],
        country: "中国",
        language: "汉语普通话",
        poster: "https://picsum.photos/300/450?random=6",
        video: "https://www.w3schools.com/html/movie.mp4",
        description: "如果交换人生会交换家人，你还愿意吗？仲达（雷佳音 饰）与金好（张小斐 饰）相亲后，意外和暗恋金好的少年陆小谷（张宥浩 饰）换身，并误打误撞交换了家人，开启了令人捧腹有笑有泪的奇'换'之旅。",
        releaseDate: "2023-01-22",
        boxOffice: "3.93亿"
    },
    {
        id: 7,
        title: "人生路不熟",
        year: 2023,
        rating: 6.6,
        genre: ["喜剧", "剧情"],
        duration: "101分钟",
        director: "易小星",
        cast: ["乔杉", "范丞丞", "马丽", "张婧仪"],
        country: "中国",
        language: "汉语普通话",
        poster: "https://picsum.photos/300/450?random=7",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "车队大佬周东海（乔杉 饰）和老婆霍梅梅（马丽 饰）阴差阳错地与女儿周微雨（张婧仪 饰）及女儿的男朋友万一帆（范丞丞 饰）同行自驾，踏上人生路不熟的探亲之旅。",
        releaseDate: "2023-04-28",
        boxOffice: "11.84亿"
    },
    {
        id: 8,
        title: "毒舌律师",
        year: 2023,
        rating: 7.5,
        genre: ["剧情", "犯罪"],
        duration: "134分钟",
        director: "吴炜伦",
        cast: ["黄子华", "谢君豪", "王丹妮", "廖子妤"],
        country: "中国香港",
        language: "粤语",
        poster: "https://picsum.photos/300/450?random=8",
        video: "https://www.w3schools.com/html/movie.mp4",
        description: "一宗国际名模涉嫌虐待女儿的冤案，竟成了法律界、权贵与名媛之间的角力场！社会金字塔顶层的钟氏家族，如何用尽权力与资源去自保？以林凉水（黄子华 饰）为代表的律师们又如何在重重困难下伸张正义？",
        releaseDate: "2023-02-24",
        boxOffice: "1.87亿"
    },
    {
        id: 9,
        title: "保你平安",
        year: 2023,
        rating: 7.7,
        genre: ["喜剧", "剧情"],
        duration: "112分钟",
        director: "大鹏",
        cast: ["大鹏", "李雪琴", "尹正", "王迅"],
        country: "中国",
        language: "汉语普通话",
        poster: "https://picsum.photos/300/450?random=9",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "中年落魄的魏平安（大鹏 饰）已过世的客户被人造谣抹黑。为了一句承诺，魏平安踏上了漫漫查谣言之路。一路阻碍重重，笑料频出，不仅查到亲妹妹魏如意（李雪琴 饰）头上，还遭遇了财大气粗的冯总（马丽 饰）围追堵截。",
        releaseDate: "2023-03-10",
        boxOffice: "7.00亿"
    },
    {
        id: 10,
        title: "长空之王",
        year: 2023,
        rating: 6.8,
        genre: ["剧情", "动作"],
        duration: "127分钟",
        director: "刘晓世",
        cast: ["王一博", "胡军", "周冬雨", "于适"],
        country: "中国",
        language: "汉语普通话",
        poster: "https://picsum.photos/300/450?random=10",
        video: "https://www.w3schools.com/html/movie.mp4",
        description: "雷宇（王一博 饰）等优秀飞行员经过严苛选拔正式成为试飞员，他们在队长张挺（胡军 饰）的带领下，参与到了最新型战机的试飞。高空之上，发动机骤停甚至失火，飞机失去控制……他们一次次与死神过招，只为获取最极限的数据。",
        releaseDate: "2023-04-28",
        boxOffice: "8.50亿"
    }
];

// ==================== 电影卡片渲染函数 ====================
/**
 * 渲染单个电影卡片的HTML结构
 * @param {Object} movie - 电影对象，包含id、title、poster、year、rating、description、genre等属性
 * @returns {string} 返回电影卡片的HTML字符串
 */
function renderMovieCard(movie) {
    // 使用模板字符串生成电影卡片HTML
    return `
        <div class="movie-card" data-id="${movie.id}">
            <!-- 电影海报图片 -->
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <!-- 电影标题 -->
                <h3 class="movie-title">${movie.title}</h3>
                <!-- 电影元信息：年份和评分 -->
                <div class="movie-meta">
                    <span>${movie.year}</span>
                    <span class="movie-rating">${movie.rating}</span>
                </div>
                <!-- 电影简介，截取前80个字符并添加省略号 -->
                <p class="movie-desc">${movie.description.substring(0, 80)}...</p>
                <!-- 电影类型标签，最多显示2个 -->
                <div class="movie-tags">
                    ${movie.genre.slice(0, 2).map(genre => `<span class="tag">${genre}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// ==================== 轮播图类 ====================
/**
 * 首页轮播图功能类
 * 实现自动轮播、手动切换、鼠标悬停暂停等功能
 */
class HeroSlider {
    /**
     * 构造函数 - 初始化轮播图
     */
    constructor() {
        // 获取所有轮播图幻灯片元素
        this.slides = document.querySelectorAll('.slide');
        // 当前显示的幻灯片索引
        this.currentSlide = 0;
        // 自动轮播定时器引用
        this.interval = null;
        // 调用初始化方法
        this.init();
    }

    /**
     * 初始化轮播图
     * 设置初始状态、绑定事件监听器、启动自动轮播
     */
    init() {
        // 如果没有幻灯片元素，直接返回不执行
        if (this.slides.length === 0) return;
        
        // 显示第一张幻灯片
        this.showSlide(0);
        
        // 绑定"上一张"按钮点击事件（使用可选链操作符防止元素不存在时报错）
        document.querySelector('.slider-btn.prev')?.addEventListener('click', () => this.prevSlide());
        // 绑定"下一张"按钮点击事件
        document.querySelector('.slider-btn.next')?.addEventListener('click', () => this.nextSlide());
        
        // 启动自动轮播
        this.startAutoSlide();
        
        // 鼠标移入轮播区域时暂停自动轮播（提升用户体验）
        document.querySelector('.hero')?.addEventListener('mouseenter', () => this.stopAutoSlide());
        // 鼠标移出轮播区域时恢复自动轮播
        document.querySelector('.hero')?.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    /**
     * 显示指定索引的幻灯片
     * @param {number} index - 要显示的幻灯片索引（从0开始）
     */
    showSlide(index) {
        // 遍历所有幻灯片，移除active类（隐藏所有幻灯片）
        this.slides.forEach(slide => slide.classList.remove('active'));
        // 为目标幻灯片添加active类（显示该幻灯片）
        this.slides[index].classList.add('active');
        // 更新当前幻灯片索引记录
        this.currentSlide = index;
    }

    /**
     * 切换到下一张幻灯片
     * 如果已经是最后一张，则循环回到第一张
     */
    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        // 如果索引超出幻灯片数量，循环回到第一张（索引0）
        if (nextIndex >= this.slides.length) nextIndex = 0;
        this.showSlide(nextIndex);
    }

    /**
     * 切换到上一张幻灯片
     * 如果已经是第一张，则循环到最后一张
     */
    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        // 如果索引小于0，循环到最后一张
        if (prevIndex < 0) prevIndex = this.slides.length - 1;
        this.showSlide(prevIndex);
    }

    /**
     * 启动自动轮播
     * 每5秒自动切换到下一张幻灯片
     */
    startAutoSlide() {
        // 先停止之前的自动轮播，避免多个定时器同时运行
        this.stopAutoSlide();
        // 设置定时器，每5000毫秒（5秒）自动切换到下一张
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    /**
     * 停止自动轮播
     * 清除定时器
     */
    stopAutoSlide() {
        // 如果存在定时器，则清除它
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}
// ==================== 轮播图类结束 ====================

// ==================== 页面初始化 ====================
/**
 * DOM加载完成后执行的初始化函数
 * 负责初始化轮播图、渲染电影列表、绑定事件等
 */
document.addEventListener('DOMContentLoaded', function() {
    // 创建轮播图实例，初始化轮播功能
    new HeroSlider();
    
    // 判断是否为首页（通过检查热门电影容器是否存在）
    if (document.getElementById('hotMovies')) {
        // ===== 热门电影：按评分从高到低排序，取前6部 =====
        const hotMovies = [...window.movies].sort((a, b) => b.rating - a.rating).slice(0, 6);
        renderMovies('hotMovies', hotMovies);
        
        // ===== 最新电影：按年份从新到旧排序，取前6部 =====
        const newMovies = [...window.movies].sort((a, b) => b.year - a.year).slice(0, 6);
        renderMovies('newMovies', newMovies);
        
        // 渲染新片速递区域
        renderNewReleases();
        
        // 渲染排行榜区域
        renderRankings();
    }
    
    // ===== 事件委托：处理电影卡片点击事件 =====
    // 使用事件委托可以减少事件监听器数量，提高性能
    document.addEventListener('click', function(e) {
        // 使用closest方法查找点击目标最近的电影卡片祖先元素
        const movieCard = e.target.closest('.movie-card');
        if (movieCard) {
            // 获取电影ID并跳转到详情页
            const movieId = movieCard.dataset.id;
            window.location.href = `movie-detail.html?id=${movieId}`;
        }
    });
    
    // 如果用户管理器存在，更新用户界面状态（显示登录/登出按钮等）
    if (window.userManager) {
        window.userManager.updateUI();
    }
    
    // ===== 为锚点链接添加平滑滚动效果 =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 处理新片(#new)和排行榜(#top)的锚点链接
            if (href === '#new' || href === '#top') {
                e.preventDefault();  // 阻止默认的瞬间跳转行为
                // 根据锚点确定目标元素ID
                const targetId = href === '#new' ? 'new-releases' : (href === '#top' ? 'top' : null);
                if (targetId) {
                    const target = document.getElementById(targetId);
                    if (target) {
                        // 使用scrollIntoView实现平滑滚动
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
        });
    });
});

// ==================== 电影列表渲染函数 ====================
/**
 * 渲染电影列表到指定容器
 * @param {string} containerId - 目标容器的DOM元素ID
 * @param {Array} moviesList - 要渲染的电影数组
 */
function renderMovies(containerId, moviesList) {
    // 获取目标容器元素
    const container = document.getElementById(containerId);
    // 如果容器不存在，直接返回不执行
    if (!container) return;
    
    // 使用map将电影数组转换为HTML字符串数组，再用join拼接成完整HTML
    container.innerHTML = moviesList.map(renderMovieCard).join('');
}

// ==================== 新片速递渲染函数 ====================
/**
 * 渲染新片速递区域
 * 包括一个大的主推新片展示和多个小的新片列表项
 */
function renderNewReleases() {
    // 获取主推新片容器
    const featuredContainer = document.getElementById('featuredRelease');
    // 获取新片列表容器
    const listContainer = document.getElementById('releaseList');
    
    // 如果任一容器不存在，直接返回
    if (!featuredContainer || !listContainer) return;
    
    // 获取最新的5部电影（按年份从新到旧排序）
    const releases = [...window.movies]
        .sort((a, b) => b.year - a.year)
        .slice(0, 5);
    
    // ===== 渲染主推新片（取排序后的第一部电影） =====
    const featured = releases[0];
    featuredContainer.innerHTML = `
        <div class="featured-release-inner" data-id="${featured.id}">
            <!-- 主推电影海报 -->
            <img src="${featured.poster}" alt="${featured.title}">
            <div class="featured-release-info">
                <!-- 电影标题 -->
                <h3>${featured.title}</h3>
                <!-- 年份和类型信息，用·分隔 -->
                <div class="release-meta">${featured.year} · ${featured.genre.join(' / ')}</div>
                <!-- 电影评分 -->
                <div class="release-rating"><i class="fas fa-star"></i> ${featured.rating}</div>
            </div>
        </div>
    `;
    
    // 为主推新片绑定点击跳转事件
    featuredContainer.querySelector('.featured-release-inner').addEventListener('click', () => {
        window.location.href = `movie-detail.html?id=${featured.id}`;
    });
    
    // ===== 渲染其余新片列表（第2到第5部电影） =====
    listContainer.innerHTML = releases.slice(1).map(movie => `
        <div class="release-item" data-id="${movie.id}">
            <!-- 电影海报缩略图 -->
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="release-item-info">
                <!-- 电影标题 -->
                <h4>${movie.title}</h4>
                <!-- 年份和评分 -->
                <div class="item-meta">
                    <span>${movie.year}</span> · 
                    <span><i class="fas fa-star"></i> ${movie.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // 为每个新片列表项绑定点击跳转事件
    listContainer.querySelectorAll('.release-item').forEach(item => {
        item.addEventListener('click', function() {
            const movieId = this.dataset.id;
            window.location.href = `movie-detail.html?id=${movieId}`;
        });
    });
}

// ==================== 排行榜渲染函数 ====================
/**
 * 渲染排行榜区域
 * 包括高分榜、热门榜、票房榜三个标签页
 */
function renderRankings() {
    // 获取三个排行榜标签页容器
    const ratingTab = document.getElementById('ratingTab');       // 高分榜容器
    const popularTab = document.getElementById('popularTab');     // 热门榜容器
    const boxofficeTab = document.getElementById('boxofficeTab'); // 票房榜容器
    
    // 如果任一容器不存在，直接返回
    if (!ratingTab || !popularTab || !boxofficeTab) return;
    
    // ===== 高分榜：按评分从高到低排序，取前10部 =====
    const topRated = [...window.movies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);
    
    // 渲染高分榜列表
    ratingTab.innerHTML = `
        <div class="ranking-list">
            ${topRated.map((movie, index) => renderRankingItem(movie, index + 1, 'rating')).join('')}
        </div>
    `;
    
    // ===== 热门榜：综合评分和年份计算热度分数 =====
    const popular = [...window.movies]
        .sort((a, b) => {
            // 热度计算公式：评分权重0.7 + 年份新鲜度权重3
            // 年份越新、评分越高的电影排名越靠前
            const scoreA = a.rating * 0.7 + (a.year / 2023) * 3;
            const scoreB = b.rating * 0.7 + (b.year / 2023) * 3;
            return scoreB - scoreA;
        })
        .slice(0, 10);
    
    // 渲染热门榜列表
    popularTab.innerHTML = `
        <div class="ranking-list">
            ${popular.map((movie, index) => renderRankingItem(movie, index + 1, 'popular')).join('')}
        </div>
    `;
    
    // ===== 票房榜：按票房数值从高到低排序 =====
    const boxoffice = [...window.movies]
        .filter(m => m.boxOffice)  // 过滤掉没有票房数据的电影
        .sort((a, b) => {
            // 解析票房字符串为数值（去除"亿""万"等单位字符）
            const parseBox = (str) => parseFloat(str.replace(/[亿万]/g, ''));
            return parseBox(b.boxOffice) - parseBox(a.boxOffice);
        })
        .slice(0, 10);
    
    // 渲染票房榜列表
    boxofficeTab.innerHTML = `
        <div class="ranking-list">
            ${boxoffice.map((movie, index) => renderRankingItem(movie, index + 1, 'boxoffice')).join('')}
        </div>
    `;
    
    // ===== 为所有排行榜项绑定点击跳转事件 =====
    document.querySelectorAll('.ranking-item').forEach(item => {
        item.addEventListener('click', function() {
            const movieId = this.dataset.id;
            window.location.href = `movie-detail.html?id=${movieId}`;
        });
    });
    
    // ===== 标签切换功能 =====
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;  // 获取点击按钮对应的标签类型
            
            // 移除所有按钮的active状态
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加active状态
            this.classList.add('active');
            
            // 隐藏所有标签页内容
            document.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
            // 根据点击的按钮显示对应的标签页内容
            if (tab === 'rating') {
                ratingTab.classList.add('active');
            } else if (tab === 'popular') {
                popularTab.classList.add('active');
            } else if (tab === 'boxoffice') {
                boxofficeTab.classList.add('active');
            }
        });
    });
}

// ==================== 排行榜项渲染函数 ====================
/**
 * 渲染单个排行榜项的HTML结构
 * @param {Object} movie - 电影对象
 * @param {number} rank - 排名（从1开始）
 * @param {string} type - 排行榜类型（'rating'评分榜 | 'popular'热门榜 | 'boxoffice'票房榜）
 * @returns {string} 返回排行榜项的HTML字符串
 */
function renderRankingItem(movie, rank, type) {
    // 根据排行榜类型决定显示票房还是评分
    // 票房榜显示票房数据，其他榜显示评分
    const statsHtml = type === 'boxoffice' && movie.boxOffice
        ? `<div class="ranking-boxoffice">${movie.boxOffice}</div>`
        : `<div class="ranking-rating"><i class="fas fa-star"></i> ${movie.rating}</div>`;
    
    // 返回排行榜项的完整HTML结构
    return `
        <div class="ranking-item" data-id="${movie.id}">
            <!-- 排名数字 -->
            <div class="ranking-number">${rank}</div>
            <!-- 电影海报缩略图 -->
            <img src="${movie.poster}" alt="${movie.title}" class="ranking-poster">
            <div class="ranking-info">
                <!-- 电影标题 -->
                <h3>${movie.title}</h3>
                <!-- 年份和导演信息 -->
                <div class="ranking-meta">${movie.year} · ${movie.director}</div>
                <!-- 电影类型标签，最多显示3个 -->
                <div class="ranking-genres">
                    ${movie.genre.slice(0, 3).map(g => `<span class="tag">${g}</span>`).join('')}
                </div>
            </div>
            <!-- 统计数据区域（评分或票房） -->
            <div class="ranking-stats">
                ${statsHtml}
            </div>
        </div>
    `;
}

