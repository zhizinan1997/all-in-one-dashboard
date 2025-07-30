# All-In-One Dashboard

一个现代化的数据查询与可视化工具，用于展示 AI 模型使用统计数据。

<img width="2031" height="2197" alt="d23f18a2ba8f61e544c81202e4fec260" src="https://github.com/user-attachments/assets/6273736f-9608-459d-999f-d1ed63bea3f9" />


## 📊 功能特性

- **实时数据查询**：支持自定义时间范围查询统计数据
- **多维度数据展示**：
  - 总 Token 消耗和积分花费汇总
  - 模型成本与 Token 分布（饼图）
  - 用户成本与 Token 排行榜（柱状图）
  - 上周与本月用户 Token 排行榜（柱状图）
- **动态图表标题**：自动在图表标题中显示上周和本月的具体日期范围。
- **响应式设计**：支持桌面端和移动端自适应。
- **现代化 UI**：采用现代化的设计风格，界面简洁美观。

## 🚀 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript, Chart.js
- **后端**: Python, FastAPI
- **数据库**: PostgreSQL
- **部署**: Docker

## 📦 Docker 部署指南

本项目推荐使用 Docker 进行部署，以简化环境配置。

### 1. 前提条件

- **Git**: 用于克隆项目。
- **Docker**: 用于构建和运行镜像。
- **PostgreSQL 数据库**: 需要一个正在运行的 PostgreSQL 实例。

### 2. 克隆项目

```bash
git clone https://github.com/zhizinan1997/all-in-one-dashboard.git
cd all-in-one-dashboard
```

### 3. 配置数据库连接

⚠️ **重要提醒：**

在构建 Docker 镜像之前，您**必须**在 `api_server.py` 文件中配置您的 PostgreSQL 数据库连接字符串。

打开 `backend/api_server.py` 文件，找到以下行并替换为您的数据库信息：

```python
# 找到这一行
DATABASE_URL = "postgresql://user:password@host:port/dbname"

# 替换为您的实际数据库连接信息，例如：
# DATABASE_URL = "postgresql://myuser:mypassword@db_host:5432/mydatabase"
```

### 4. 构建 Docker 镜像

在项目根目录下，执行以下命令构建 Docker 镜像：

```bash
# 构建镜像并标记为 all-in-one-dashboard:latest
docker build -t all-in-one-dashboard:latest .
```

### 5. 运行 Docker 容器

使用以下命令运行容器。此命令将在后台启动一个名为 `my-dashboard-app` 的容器，并将主机的 8000 端口映射到容器的 80 端口。

```bash
docker run -d --name my-dashboard-app --restart always -p 8000:80 all-in-one-dashboard:latest
```

**命令解析：**
- `-d`: 在后台（detached mode）运行容器。
- `--name my-dashboard-app`: 为容器指定一个名称。
- `--restart always`: 设置容器在退出时总是自动重启。
- `-p 8000:80`: 将主机的 `8000` 端口映射到容器的 `80` 端口。

### 6. 访问应用

部署成功后，在浏览器中访问 `http://IP:8000` 即可看到数据统计面板。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

本项目采用 MIT 许可证。
