#!/usr/bin/env python3
"""
数据库初始化脚本
用于在Render环境中初始化数据库和导入数据
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from main import app
from src.models.user import db
from src.models.word import Word, Category
from src.routes.learning import init_database

def main():
    print("=== 开始数据库初始化 ===")
    try:
        with app.app_context():
            db.create_all()
            print("数据库表创建完成")
            try:
                init_database()
                print("数据初始化完成")
            except Exception as e:
                print(f"数据初始化失败: {e}")
            print("=== 数据库初始化脚本执行完毕 ===")
    except Exception as e:
        print(f"数据库初始化脚本异常: {e}")

if __name__ == '__main__':
    main() 