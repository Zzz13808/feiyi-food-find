// 轮播图逻辑 + 自动播放 + 鼠标悬停
(function(){
    const track = document.getElementById('track');
    const slides = document.querySelectorAll('.carousel-track .slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');
    let currentIndex = 0;
    let autoTimer = null;
    const total = slides.length;
    const AUTO_INTERVAL = 5000; // 5秒自动切换

    // 创建圆点
    function createDots() {
        dotsContainer.innerHTML = '';
        for(let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if(i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // 更新位置和圆点样式
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            if(idx === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function goToSlide(index) {
        if(index < 0) index = total - 1;
        if(index >= total) index = 0;
        currentIndex = index;
        updateCarousel();
        resetAutoPlay(); // 手动切换后重置计时器
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // 自动播放
    function startAutoPlay() {
        if(autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            nextSlide();
        }, AUTO_INTERVAL);
    }
    function stopAutoPlay() {
        if(autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 绑定事件与悬停
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
    });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
    });

    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // 初始化
    createDots();
    updateCarousel();
    startAutoPlay();

})();


// ========== 新增：长三角美食地图交互逻辑 ==========
// 请将此段代码合并到您的 javascript测试版本.js 文件中（或直接追加在末尾）

(function() {
    // ---------- 依据 Excel 数据整理的长三角城市非遗美食列表 (食物+地址) ----------
    const cityFoodData = [
        { name: "上海", left: 74, top: 44, foods: [
            "南翔小笼 · 上海市嘉定区", "功德林素食 · 上海市黄浦区", "凯司令蛋糕 · 上海市静安区",
            "扣三丝 · 上海本帮菜", "杏花楼广式月饼 · 上海市黄浦区", "梨膏糖 · 上海市黄浦区",
            "王家沙本帮点心 · 上海市静安区", "上海黄酒 · 上海市属单位"
        ] },
        { name: "南京", left: 44, top: 34, foods: [
            "南京板鸭/盐水鸭 · 南京市江宁区", "绿柳居素食 · 南京市", "雨花茶 · 南京市",
            "秦淮风味小吃 · 南京市秦淮区", "马祥兴清真菜 · 南京市鼓楼区"
        ] },
        { name: "苏州", left: 58, top: 30, foods: [
            "碧螺春 · 苏州市吴中区", "苏式糕团 · 苏州市", "昆山奥灶面 · 昆山市",
            "藏书羊肉 · 苏州市吴中区", "苏式汤面 · 苏州市"
        ] },
        { name: "无锡", left: 53, top: 38, foods: [
            "三凤桥酱排骨 · 无锡市", "惠山油酥 · 无锡市梁溪区", "无锡老式面 · 无锡市惠山区",
            "太湖船菜 · 无锡市", "清水油面筋 · 无锡市新吴区"
        ] },
        { name: "扬州", left: 41, top: 25, foods: [
            "富春茶点 · 扬州市", "扬州炒饭 · 扬州市", "高邮咸鸭蛋 · 高邮市",
            "扬州三头宴 · 扬州市", "共和春小吃 · 扬州市广陵区"
        ] },
        { name: "镇江", left: 54, top: 34, foods: [
            "镇江恒顺香醋 · 镇江市", "镇江锅盖面 · 镇江市", "丹阳封缸酒 · 丹阳市",
            "镇江肴肉 · 镇江市"
        ] },
        { name: "常州", left: 49, top: 40, foods: [
            "常州梨膏糖 · 常州市", "常州大麻糕 · 常州市武进区", "横山桥百叶 · 常州市武进区",
            "溧阳扎肝 · 常州市溧阳市", "天目湖砂锅鱼头 · 常州市溧阳市"
        ] },
        { name: "杭州", left: 68, top: 52, foods: [
            "西湖龙井 · 杭州市", "东坡肉 · 杭州市", "杭州小笼包 · 杭州市",
            "王星记扇面(美食文化延伸) · 杭州市"
        ] },
        { name: "宁波", left: 79, top: 62, foods: [
            "宁波汤圆 · 宁波市", "溪口千层饼 · 宁波市奉化区", "象山海鲜 · 宁波市象山县"
        ] },
        { name: "绍兴", left: 73, top: 59, foods: [
            "绍兴黄酒 · 绍兴市", "茴香豆 · 绍兴市", "霉干菜焖肉 · 绍兴市"
        ] },
        { name: "合肥", left: 28, top: 47, foods: [
            "合肥四大名点(麻饼/烘糕/寸金/白切) · 合肥市", "吴山贡鹅 · 合肥市",
            "三河米饺 · 合肥市肥西县"
        ] },
        { name: "黄山", left: 48, top: 69, foods: [
            "黄山毛峰 · 黄山市", "徽州臭鳜鱼 · 黄山市", "徽州烧饼 · 黄山市",
            "徽州顶市酥 · 黄山市", "五城豆腐干 · 休宁县"
        ] },
        { name: "芜湖", left: 42, top: 54, foods: [
            "芜湖蟹黄汤包 · 芜湖市", "无为板鸭 · 无为市", "四季春传统小吃 · 芜湖市镜湖区"
        ] }
    ];

    // 获取容器元素
    const dotsContainer = document.getElementById('mapDotsContainer');
    const infoCard = document.getElementById('foodInfoCard');
    const infoContent = document.getElementById('foodInfoContent');
    const closeBtn = document.getElementById('closeInfoCard');
    const mapContainer = document.getElementById('mapContainer');

    if (!dotsContainer || !infoCard || !infoContent || !mapContainer) return;

    // 存储当前显示的卡片对应的圆点元素 (用于位置更新)
    let currentDotElement = null;
    let isCardVisible = false;

    // 生成所有圆点
    function createDots() {
        dotsContainer.innerHTML = '';
        cityFoodData.forEach(city => {
            const dot = document.createElement('div');
            dot.className = 'food-dot';
            // 百分比定位 (基于父容器宽高)
            dot.style.left = `${city.left}%`;
            dot.style.top = `${city.top}%`;
            dot.setAttribute('data-city', city.name);
            dot.setAttribute('data-foods', JSON.stringify(city.foods));
            
            // 点击事件
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showFoodInfo(city, dot);
            });
            dotsContainer.appendChild(dot);
        });
    }

    // 显示美食信息卡片 (在圆点附近)
    function showFoodInfo(city, dotElement) {
        // 构建内容html
        let foodsHtml = '';
        city.foods.forEach(food => {
            foodsHtml += `<p><strong>🥢</strong> ${food}</p>`;
        });
        if (foodsHtml === '') foodsHtml = '<p>暂无非遗记录，即将收录</p>';
        
        infoContent.innerHTML = `<div style="font-weight:500; margin-bottom:8px;">📍 ${city.name} · 非遗味道</div>${foodsHtml}`;
        
        // 显示卡片
        infoCard.style.display = 'block';
        isCardVisible = true;
        currentDotElement = dotElement;
        
        // 计算卡片位置 (位于圆点右侧/下方，避免溢出)
        const dotRect = dotElement.getBoundingClientRect();
        const containerRect = mapContainer.getBoundingClientRect();
        const cardRect = infoCard.getBoundingClientRect();
        
        // 相对 mapContainer 的偏移量 (px)
        let leftPos = dotRect.right - containerRect.left + 12;
        let topPos = dotRect.top - containerRect.top - 10;
        
        // 边界检测 (防止右侧溢出)
        if (leftPos + (cardRect.width || 260) > containerRect.width) {
            leftPos = dotRect.left - containerRect.left - (cardRect.width || 260) - 12;
        }
        // 下方溢出则向上调整
        if (topPos + (cardRect.height || 200) > containerRect.height) {
            topPos = dotRect.bottom - containerRect.top - (cardRect.height || 200) - 8;
        }
        if (topPos < 5) topPos = 8;
        
        infoCard.style.left = `${leftPos}px`;
        infoCard.style.top = `${topPos}px`;
    }

    // 关闭卡片
    function closeCard() {
        infoCard.style.display = 'none';
        isCardVisible = false;
        currentDotElement = null;
    }

    // 点击其他地方关闭卡片（可选，提升体验）
    document.addEventListener('click', function(e) {
        if (!isCardVisible) return;
        // 如果点击的目标不是圆点也不是卡片内部，则关闭
        const isDot = e.target.classList && e.target.classList.contains('food-dot');
        const isCardInside = infoCard.contains(e.target);
        if (!isDot && !isCardInside) {
            closeCard();
        }
    });

    // 关闭按钮事件
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCard();
        });
    }

    // 窗口大小改变时重新定位当前打开的卡片
    window.addEventListener('resize', function() {
        if (isCardVisible && currentDotElement) {
            const cityName = currentDotElement.getAttribute('data-city');
            const cityData = cityFoodData.find(c => c.name === cityName);
            if (cityData) {
                showFoodInfo(cityData, currentDotElement);
            } else {
                closeCard();
            }
        }
    });

    // 初始化所有圆点
    createDots();
})();