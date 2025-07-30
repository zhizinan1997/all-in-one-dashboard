# my_all_in_one_dashboard/Dockerfile (Final Corrected Version)

# --- Stage 1: Build Python dependencies ---
FROM python:3.10-slim as builder
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_CREATE=false
RUN pip install poetry
WORKDIR /app
COPY pyproject.toml poetry.lock* ./
# --- THIS IS THE FINAL CORRECTED LINE ---
RUN poetry install --no-root


# --- Stage 2: Final production image ---
FROM python:3.10-slim

# 安装 Nginx 和 Supervisor
RUN apt-get update && \
    apt-get install -y nginx supervisor && \
    rm -rf /var/lib/apt/lists/* && \
    # 创建 Gunicorn socket 和日志所需的目录
    mkdir -p /run/

# 设置工作目录
WORKDIR /app

# 从 builder 阶段复制已安装的Python依赖
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 复制后端代码到容器的 /app/backend 目录
COPY backend/ /app/backend/

# 复制前端文件到容器的 /app/static 目录 (Nginx将从此提供文件)
COPY frontend/ /app/static/

# 复制 Nginx 配置文件
COPY nginx/default.conf /etc/nginx/sites-available/default

# 复制 Supervisor 配置文件
COPY supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 暴露容器的 80 端口 (Nginx正在监听的端口)
EXPOSE 80

# 容器启动时运行 Supervisor，它会负责启动 Nginx 和 Gunicorn
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]