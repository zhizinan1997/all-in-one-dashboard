# 数据统计面板

一个现代化的数据查询与可视化工具，用于展示 AI 模型使用统计数据。

<img width="2031" height="2197" alt="65d5d414d606dc5e568cb831e8260a61" src="https://github.com/user-attachments/assets/d202a4af-d6da-4dc4-97f0-38358090072d" />


## 📊 功能特性

- **实时数据查询**：支持自定义时间范围查询统计数据
- **多维度数据展示**：
  - 总 Token 消耗和积分花费汇总
  - 模型成本分布（饼图）
  - 模型 Token 分布（饼图）
  - 用户成本排行榜（柱状图）
  - 用户 Token 排行榜（柱状图）
  - 上周用户 Token 排行榜（柱状图）
  - 本月用户 Token 排行榜（柱状图）
- **响应式设计**：支持桌面端和移动端自适应
- **现代化 UI**：采用现代化的设计风格，界面简洁美观
- **多彩图表**：每个用户使用不同颜色标识，便于区分

## 🚀 技术栈

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式和响应式布局 
- **Vanilla JavaScript** - 交互逻辑
- **Chart.js** - 图表渲染库

### 后端
- **Python** - 后端开发语言
- **FastAPI** - Web 框架
- **PostgreSQL** - 数据库

## 📁 项目结构

```
data-statistics-dashboard/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript 逻辑
├── backend.py          # Python 后端服务（需要配置数据库）
├── screenshot.png      # 项目截图
└── README.md          # 项目说明
```

## 🛠️ 安装和运行

### 前端部署

1. 克隆项目到本地：
```bash
git clone https://github.com/yourusername/data-statistics-dashboard.git
cd data-statistics-dashboard
```

2. 使用任何 Web 服务器启动前端：
```bash
# 使用 Python 简单服务器
python -m http.server 8000

# 或使用 Node.js serve
npx serve .

# 或直接用浏览器打开 index.html
```

### 后端部署

1. 安装 Python 依赖：
```bash
pip install fastapi uvicorn psycopg2-binary
```

2. **重要：配置数据库连接**
   
   ⚠️ **注意：项目中的 PostgreSQL 数据库地址已被隐藏，请在 `backend.py` 文件中添加您自己的数据库连接信息：**

   ```python
   # 在 backend.py 中找到数据库配置部分，替换为您的数据库信息
   DATABASE_URL = "postgresql://username:password@localhost:5432/your_database_name"
   ```

3. 确保数据库中有相应的数据表结构（根据您的业务需求创建表）

4. 启动后端服务：
```bash
python -m uvicorn backend:app --host 0.0.0.0 --port 8001
```

## 🔧 配置说明

### API 端点

后端提供以下 API 端点：

- `POST /api/statistics` - 获取统计数据
  - 请求参数：
    ```json
    {
      "start_time": 1627776000,  // Unix 时间戳
      "end_time": 1627862400     // Unix 时间戳  
    }
    ```
  - 响应格式：
    ```json
    {
      "total_tokens": 16691032,
      "total_credit": 10.802997,
      "model_cost_pie": [
        {"name": "模型名称", "value": 数值}
      ],
      "model_token_pie": [
        {"name": "模型名称", "value": 数值}
      ],
      "user_cost_pie": [
        {"name": "用户名", "value": 数值}
      ],
      "user_token_pie": [
        {"name": "用户名", "value": 数值}
      ]
    }
    ```

### 数据库表结构

请确保您的 PostgreSQL 数据库包含以下字段的统计数据（具体表结构请根据您的业务需求调整）：

- 用户信息
- 模型使用记录  
- Token 消耗量
- 积分花费
- 时间戳

## 🎨 界面展示

### 主要功能区域

1. **时间选择器**：可选择查询的开始和结束时间
2. **数据概览卡片**：显示总 Token 消耗和总积分花费
3. **图表展示区域**：
   - 模型维度的饼图展示
   - 用户维度的排行榜柱状图
   - 时间维度的统计图表

### 特色功能

- **自动时间范围**：
  - 上周数据：自动计算上个自然周（周一到周日）
  - 本月数据：自动计算当月1号到当前时间
- **多彩视觉**：每个用户使用不同颜色，便于快速识别
- **响应式布局**：桌面端2列布局，移动端自动适配为单列

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [项目 Issues 页面]
- Email: your.email@example.com

---

⭐ 如果这个项目对您有帮助，请给个 Star 支持一下！
```

**重要提醒：**

1. **数据库配置**：请务必在 `backend.py` 文件中配置您自己的 PostgreSQL 数据库连接信息
2. **项目截图**：建议添加项目的实际运行截图到 `screenshot.png` 
3. **个人信息**：请将 README 中的占位符信息（如邮箱、GitHub 用户名等）替换为您的实际信息
4. **许可证**：如需要，请添加相应的 LICENSE 文件


