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
    """初始化数据库"""
    print("开始初始化数据库...")
    
    with app.app_context():
        # 创建所有表
        db.create_all()
        print("数据库表创建完成")
        
        # 初始化数据
        try:
            init_database()
            print("数据初始化完成")
        except Exception as e:
            print(f"数据初始化失败: {e}")
            # 如果数据初始化失败，至少确保表结构存在
            pass
        
        print("数据库初始化完成！")

if __name__ == '__main__':
    main() 