# my_all_in_one_dashboard/backend/api_server.py (Final Corrected Version)

import os
import datetime
import logging
from collections import defaultdict
from decimal import Decimal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import DictCursor

# --- 配置 ---
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
     postgres://postgres:密码@IP: 端口/数据库名"
)

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="数据统计API (后端)",
    description="一个独立的后端服务，为统计面板提供数据。"
)

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except psycopg2.OperationalError as e:
        log.error(f"数据库连接失败: {e}")
        raise HTTPException(status_code=503, detail=f"数据库服务不可用: {e}")

class StatisticRequest(BaseModel):
    start_time: int
    end_time: int
        
@app.post("/statistics", summary="获取统计数据")
async def get_statistics(form_data: StatisticRequest):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=DictCursor)
        
        # --- 更正后的表名 ---
        # 使用全小写的 user 表
        cursor.execute('SELECT id, name FROM "user"') # 也可以写成 SELECT id, name FROM user
        users = cursor.fetchall()
        user_map = {user['id']: user['name'] for user in users}

        # --- 更正后的表名 ---
        # 使用全小写的 credit_log 表
        cursor.execute(
            'SELECT * FROM credit_log WHERE created_at >= %s AND created_at <= %s',
            (form_data.start_time, form_data.end_time)
        )
        credit_logs = cursor.fetchall()
        
        # --- 数据处理逻辑 (保持不变) ---
        total_tokens = 0
        total_credit = Decimal('0.0')
        model_cost_pie = defaultdict(Decimal)
        model_token_pie = defaultdict(int)
        user_cost_pie = defaultdict(Decimal)
        user_token_pie = defaultdict(int)

        for log_entry in credit_logs:
            detail = log_entry.get('detail', {})
            if not detail: continue

            usage = detail.get('usage', {})
            model_info = detail.get('api_params', {}).get('model', {})

            if usage and usage.get('total_price') is not None and model_info:
                model_id = model_info.get('id', 'unknown_model')
                total_tokens += usage.get('total_tokens', 0)
                total_credit += Decimal(str(usage.get('total_price', 0)))
                model_cost_pie[model_id] += Decimal(str(usage.get('total_price', 0)))
                model_token_pie[model_id] += usage.get('total_tokens', 0)
                
                user_id = log_entry.get('user_id')
                username = user_map.get(user_id, str(user_id))
                user_cost_pie[username] += Decimal(str(usage.get('total_price', 0)))
                user_token_pie[username] += usage.get('total_tokens', 0)

        return {
            "total_tokens": total_tokens,
            "total_credit": float(total_credit),
            "model_cost_pie": [{"name": k, "value": float(v)} for k, v in model_cost_pie.items()],
            "model_token_pie": [{"name": k, "value": v} for k, v in model_token_pie.items()],
            "user_cost_pie": [{"name": k, "value": float(v)} for k, v in user_cost_pie.items()],
            "user_token_pie": [{"name": k, "value": v} for k, v in user_token_pie.items()],
        }
    except psycopg2.Error as e:
        log.error(f"数据库查询失败: {e}")
        raise HTTPException(status_code=500, detail=f"数据库查询错误: {e}")
    except Exception as e:
        log.error(f"处理请求时发生未知错误: {e}")
        raise HTTPException(status_code=500, detail=f"内部服务器错误: {e}")
    finally:
        if conn:
            conn.close()

@app.get("/", summary="API健康检查")
def read_root():
    return {"status": "ok", "message": "后端API服务正在运行"}