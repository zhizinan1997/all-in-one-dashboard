**All-In-One Dashboard** 是一个专为 `U8F69/open-webui` 实例打造的强大可视化数据统计面板。它并非一个独立的应用，而是作为 `U8F69/open-webui` 的一个重要扩展，旨在将其后台数据库中的使用日志和统计数据转化为直观、易于理解的交互式图表。

如果您正在管理一个 `U8F69/open-webui` 服务，尤其是多用户环境，这个仪表盘将为您提供前所未有的洞察力，帮助**您或者用户**全面了解平台的运行状况、资源消耗和用户活动。

#### 核心价值

本项目弥补了 U8F69/open-webui 自身缺乏除管理员以外的用户端详细统计视图的不足，为管理员/用户提供了一个集中化的数据监控中心。它直接连接到 `U8F69/open-webui` 的 PostgreSQL 数据库，实时解析数据并呈现以下关键指标：

-   **宏观数据监控**：一目了然地查看在特定时间范围内的总 Token 消耗量和总积分（成本）花费。
-   **模型性能分析**：通过饼图清晰展示不同 AI 模型的成本和 Token 消耗分布，帮助您了解哪些模型最受欢迎或成本最高。
-   **用户活动排行榜**：生成详细的用户排行榜，按 Token 消耗和积分花费对用户进行排名，便于识别核心用户和资源消耗大户。
-   **周期性报告**：自动生成**上个自然周**和**本月**的用户 Token 消耗排行榜，并动态显示具体日期范围，为周期性运营分析提供有力支持。

#### 重要前提

请注意，此项目 **完全依赖于一个正在运行的 `U8F69/open-webui` 实例及 PostgreSQL 数据库**。它的所有数据源均来自 `U8F69/open-webui` 的 PostgreSQL 数据库。在部署此仪表盘之前，您必须确保：

1.  您已经成功部署并运行了 `U8F69/open-webui`。
2.  您拥有访问其 PostgreSQL 数据库的权限和连接信息。
3.  您的 webui 数据库基于 PostgreSQL 而非 SQLite 。

简而言之，**All-In-One Dashboard** 是您管理和优化 `U8F69/open-webui` 社区或服务的必备分析工具。


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
