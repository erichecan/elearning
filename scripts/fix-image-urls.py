#!/usr/bin/env python3
"""
修复图片URL脚本
将数据库中错误的图片URL格式替换为正确的格式
"""

import sqlite3
import os
import sys

def fix_image_urls():
    """修复数据库中的图片URL"""
    print("🔧 开始修复图片URL...")
    
    # 连接数据库
    db_path = 'database/app.db'
    if not os.path.exists(db_path):
        print("❌ 数据库文件不存在")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 获取所有有问题的图片URL
        cursor.execute("SELECT id, text, image_url FROM word WHERE image_url LIKE 'https://images.unsplash.com/400x300/%'")
        words_to_fix = cursor.fetchall()
        
        print(f"📊 找到 {len(words_to_fix)} 个需要修复的图片URL")
        
        fixed_count = 0
        for word_id, word_text, old_url in words_to_fix:
            # 生成正确的URL格式
            new_url = f"https://source.unsplash.com/400x300/?{word_text}"
            
            # 更新数据库
            cursor.execute("UPDATE word SET image_url = ? WHERE id = ?", (new_url, word_id))
            
            print(f"✅ 修复: {word_text} -> {new_url}")
            fixed_count += 1
        
        # 提交更改
        conn.commit()
        print(f"🎉 修复完成！共修复了 {fixed_count} 个图片URL")
        
    except Exception as e:
        print(f"❌ 修复过程中出错: {e}")
        conn.rollback()
    finally:
        conn.close()

def validate_image_urls():
    """验证修复后的图片URL格式"""
    print("\n🔍 验证图片URL格式...")
    
    db_path = 'database/app.db'
    if not os.path.exists(db_path):
        print("❌ 数据库文件不存在")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 检查所有图片URL
        cursor.execute("SELECT text, image_url FROM word ORDER BY text")
        all_words = cursor.fetchall()
        
        correct_count = 0
        wrong_count = 0
        
        for word_text, image_url in all_words:
            if image_url and image_url.startswith('https://source.unsplash.com/400x300/?'):
                correct_count += 1
            else:
                wrong_count += 1
                print(f"⚠️  错误格式: {word_text} -> {image_url}")
        
        print(f"📊 验证结果:")
        print(f"  ✅ 正确格式: {correct_count} 个")
        print(f"  ❌ 错误格式: {wrong_count} 个")
        
    except Exception as e:
        print(f"❌ 验证过程中出错: {e}")
    finally:
        conn.close()

def main():
    """主函数"""
    print("🚀 图片URL修复工具")
    print("=" * 40)
    
    # 修复图片URL
    fix_image_urls()
    
    # 验证修复结果
    validate_image_urls()
    
    print("\n✨ 完成！现在图片应该可以正常加载了。")

if __name__ == "__main__":
    main() 