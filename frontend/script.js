document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const queryButton = document.getElementById('query-button');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const resultsContainer = document.getElementById('results-container');

    const API_URL = '/api/statistics';
    const chartInstances = {};

    // --- Helper function to format date for datetime-local input ---
    const formatDateForInput = (date) => {
        const pad = (num) => num.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // --- Helper function to format date for display ---
    const formatDateForDisplay = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year} 年 ${month} 月 ${day} 日`;
    };

    // --- Helper function to get last complete week range (Monday to Sunday) ---
    const getLastWeekRange = () => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const daysToLastMonday = dayOfWeek === 0 ? 13 : dayOfWeek + 6; // 上周一
        
        const lastMonday = new Date(now);
        lastMonday.setDate(now.getDate() - daysToLastMonday);
        lastMonday.setHours(0, 0, 0, 0);
        
        const lastSunday = new Date(lastMonday);
        lastSunday.setDate(lastMonday.getDate() + 6);
        lastSunday.setHours(23, 59, 59, 999);
        
        return { start: lastMonday, end: lastSunday };
    };

    // --- Helper function to get current month range ---
    const getCurrentMonthRange = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        firstDay.setHours(0, 0, 0, 0);
        
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0); // 当月最后一天
        lastDay.setHours(23, 59, 59, 999);
        
        return { start: firstDay, end: lastDay };
    };

    // --- Set default dates (last 7 days) ---
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    startTimeInput.value = formatDateForInput(sevenDaysAgo);
    endTimeInput.value = formatDateForInput(now);

    queryButton.addEventListener('click', fetchData);

    async function fetchData() {
        if (!startTimeInput.value || !endTimeInput.value) {
            showError("请选择开始和结束时间。");
            return;
        }

        const startTime = new Date(startTimeInput.value).getTime() / 1000;
        const endTime = new Date(endTimeInput.value).getTime() / 1000;

        showLoader(true);
        hideError();
        resultsContainer.classList.add('hidden');

        try {
            // 获取主要数据
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_time: Math.floor(startTime),
                    end_time: Math.floor(endTime)
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || `请求失败,状态码: ${response.status}`);
            }

            // 获取上周数据
            const weekRange = getLastWeekRange();
            const weekResponse = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_time: Math.floor(weekRange.start.getTime() / 1000),
                    end_time: Math.floor(weekRange.end.getTime() / 1000)
                }),
            });

            const weekData = await weekResponse.json();

            // 获取本月数据
            const monthRange = getCurrentMonthRange();
            const monthResponse = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_time: Math.floor(monthRange.start.getTime() / 1000),
                    end_time: Math.floor(monthRange.end.getTime() / 1000)
                }),
            });

            const monthData = await monthResponse.json();

            // 更新图表标题
            updateChartTitles(weekRange, monthRange);
            
            updateDashboard(data, weekData, monthData);
            resultsContainer.classList.remove('hidden');
        } catch (error) {
            showError(`查询失败: ${error.message}`);
        } finally {
            showLoader(false);
        }
    }

    function updateChartTitles(weekRange, monthRange) {
        const weekTitle = document.getElementById('weekly-chart-title');
        const monthTitle = document.getElementById('monthly-chart-title');
        
        const weekStartStr = formatDateForDisplay(weekRange.start);
        const weekEndStr = formatDateForDisplay(weekRange.end);
        const monthStartStr = formatDateForDisplay(monthRange.start);
        const monthEndStr = formatDateForDisplay(monthRange.end);
        
        weekTitle.textContent = `上周用户 Token 排行榜（${weekStartStr} - ${weekEndStr}）`;
        monthTitle.textContent = `本月用户 Token 排行榜（${monthStartStr} - ${monthEndStr}）`;
    }

    function updateDashboard(data, weekData, monthData) {
        document.getElementById('total-tokens').textContent = data.total_tokens.toLocaleString();
        document.getElementById('total-credit').textContent = parseFloat(data.total_credit).toFixed(6);

        renderPieChart('model-cost-chart', data.model_cost_pie);
        renderPieChart('model-token-chart', data.model_token_pie);
        renderBarChart('user-cost-chart', '积分花费', data.user_cost_pie);
        renderBarChart('user-token-chart', 'Token 消耗', data.user_token_pie);
        
        // 渲染新增的图表
        renderBarChart('weekly-user-token-chart', 'Token 消耗', weekData.user_token_pie || []);
        renderBarChart('monthly-user-token-chart', 'Token 消耗', monthData.user_token_pie || []);
    }

    function destroyChart(canvasId) {
        if (chartInstances[canvasId]) {
            chartInstances[canvasId].destroy();
        }
    }
    
    const CHART_COLORS = [
        '#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', 
        '#ef4444', '#6b7280', '#14b8a6', '#f97316', '#84cc16', '#a855f7',
        '#06b6d4', '#64748b', '#dc2626', '#059669', '#7c3aed', '#db2777',
        '#0284c7', '#65a30d', '#c2410c', '#be123c', '#7c2d12', '#365314'
    ];

    function renderPieChart(canvasId, chartData) {
        destroyChart(canvasId);
        const ctx = document.getElementById(canvasId).getContext('2d');
        chartInstances[canvasId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.map(d => d.name),
                datasets: [{
                    data: chartData.map(d => d.value),
                    backgroundColor: CHART_COLORS,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            padding: 15, 
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    function renderBarChart(canvasId, label, chartData) {
        destroyChart(canvasId);
        const ctx = document.getElementById(canvasId).getContext('2d');

        // 如果没有数据，显示空状态
        if (!chartData || chartData.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#6b7280';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        // Sort data for better visualization in bar chart
        const sortedData = [...chartData].sort((a, b) => b.value - a.value);

        // Generate different colors for each user
        const backgroundColors = sortedData.map((_, index) => CHART_COLORS[index % CHART_COLORS.length]);
        const borderColors = backgroundColors;

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedData.map(d => d.name),
                datasets: [{
                    label: label,
                    data: sortedData.map(d => d.value),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { 
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 11
                            },
                            maxRotation: 0,
                            minRotation: 0,
                            callback: function(value, index, values) {
                                const label = this.getLabelForValue(value);
                                return label.length > 15 ? label.substring(0, 15) + '...' : label;
                            }
                        }
                    }
                },
                plugins: {
                    legend: { 
                        display: false 
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return sortedData[context[0].dataIndex].name;
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        right: 10,
                        left: 10
                    }
                }
            }
        });
    }

    // UI helper functions
    const showLoader = (show) => loader.classList.toggle('hidden', !show);
    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    };
    const hideError = () => errorMessage.classList.add('hidden');
});