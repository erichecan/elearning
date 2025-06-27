import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.learning import learning_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# 启用 CORS 支持 - 生产环境配置
if os.environ.get('FLASK_ENV') == 'production':
    # 生产环境只允许特定域名
    CORS(app, origins=[
        'https://your-netlify-app.netlify.app',
        'https://*.netlify.app'
    ])
else:
    # 开发环境允许所有域名
    CORS(app, origins=['*'])

# 注册蓝图
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(learning_bp, url_prefix='/api/learning')

# 数据库配置 - 支持环境变量
database_url = os.environ.get('DATABASE_URL', f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}")
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化数据库
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# 健康检查端点
@app.route('/health')
def health_check():
    return {'status': 'healthy', 'service': 'english-learning-backend'}

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=5000)
    args = parser.parse_args()
    
    print(f"Starting Flask app on port {args.port}")
    # 生产环境不启用debug模式
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0', port=args.port)

