# -*- coding: utf-8 -*-
"""
Configuration file cho ShoeMart ChatBot MySQL
Cấu hình kết nối database và các settings
"""

import os
from typing import Dict, Any

# Database Configuration
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'database': 'shoe_store_db',
    'user': 'tru123',
    'password': 'tru12345',
    'charset': 'utf8mb4',
    'autocommit': True,
    'pool_size': 5,
    'pool_reset_session': True,
    'raise_on_warnings': True
}

# Environment variables override (nếu có)
DATABASE_CONFIG.update({
    'host': os.getenv('DB_HOST', DATABASE_CONFIG['host']),
    'port': int(os.getenv('DB_PORT', DATABASE_CONFIG['port'])),
    'database': os.getenv('DB_NAME', DATABASE_CONFIG['database']),
    'user': os.getenv('DB_USER', DATABASE_CONFIG['user']),
    'password': os.getenv('DB_PASSWORD', DATABASE_CONFIG['password']),
})

# ChatBot Configuration
CHATBOT_CONFIG = {
    'name': 'ShoeMart AI Assistant',
    'version': '2.0.0',
    'max_history': 100,
    'response_delay': 0.5,
    'debug_mode': True
}

# Database Tables
TABLES = {
    'users': 'Users',
    'products': 'Products', 
    'orders': 'Orders',
    'order_items': 'OrderItems',
    'cart_items': 'CartItems'
}

# SQL Queries Templates
SQL_QUERIES = {
    'get_all_products': """
        SELECT Id, Name, Description, Price, ImageUrl, Category 
        FROM Products 
        ORDER BY Category, Name
    """,
    
    'get_products_by_category': """
        SELECT Id, Name, Description, Price, ImageUrl, Category 
        FROM Products 
        WHERE Category LIKE %s 
        ORDER BY Name
    """,
    
    'search_products_by_name': """
        SELECT Id, Name, Description, Price, ImageUrl, Category 
        FROM Products 
        WHERE Name LIKE %s OR Description LIKE %s 
        ORDER BY Name
    """,
    
    'get_product_by_id': """
        SELECT Id, Name, Description, Price, ImageUrl, Category 
        FROM Products 
        WHERE Id = %s
    """,
    
    'get_products_by_price_range': """
        SELECT Id, Name, Description, Price, ImageUrl, Category 
        FROM Products 
        WHERE Price BETWEEN %s AND %s 
        ORDER BY Price
    """,
    
    'get_user_orders': """
        SELECT o.Id, o.OrderDate, o.TotalAmount, o.PaymentMethod, o.Status,
               oi.ProductId, oi.Quantity, oi.Price, p.Name as ProductName
        FROM Orders o
        LEFT JOIN OrderItems oi ON o.Id = oi.OrderId
        LEFT JOIN Products p ON oi.ProductId = p.Id
        WHERE o.UserId = %s
        ORDER BY o.OrderDate DESC
    """,
    
    'get_user_cart': """
        SELECT ci.Id, ci.ProductId, ci.Quantity, 
               p.Name, p.Price, p.Description, p.ImageUrl
        FROM CartItems ci
        JOIN Products p ON ci.ProductId = p.Id
        WHERE ci.UserId = %s
    """,
    
    'get_sales_stats': """
        SELECT p.Category, COUNT(*) as TotalSold, SUM(oi.Price * oi.Quantity) as Revenue
        FROM OrderItems oi
        JOIN Products p ON oi.ProductId = p.Id
        JOIN Orders o ON oi.OrderId = o.Id
        WHERE o.Status = 'Completed'
        GROUP BY p.Category
        ORDER BY Revenue DESC
    """,
    
    'get_popular_products': """
        SELECT p.Id, p.Name, p.Category, p.Price, COUNT(oi.ProductId) as SoldCount
        FROM Products p
        JOIN OrderItems oi ON p.Id = oi.ProductId
        JOIN Orders o ON oi.OrderId = o.Id
        WHERE o.Status = 'Completed'
        GROUP BY p.Id, p.Name, p.Category, p.Price
        ORDER BY SoldCount DESC
        LIMIT %s
    """
}

# Error Messages
ERROR_MESSAGES = {
    'db_connection_failed': '❌ Không thể kết nối database. Vui lòng thử lại sau.',
    'product_not_found': '🔍 Không tìm thấy sản phẩm nào phù hợp.',
    'invalid_input': '⚠️ Dữ liệu không hợp lệ.',
    'query_failed': '💥 Có lỗi xảy ra khi truy vấn dữ liệu.',
    'user_not_found': '👤 Không tìm thấy thông tin người dùng.'
}

# Success Messages  
SUCCESS_MESSAGES = {
    'products_found': '✅ Tìm thấy {count} sản phẩm phù hợp.',
    'db_connected': '🔗 Kết nối database thành công.',
    'query_success': '✅ Truy vấn thành công.'
}

# Product Categories Mapping
CATEGORY_MAPPING = {
    'sneakers': ['sneaker', 'thể thao', 'sport', 'running', 'casual'],
    'formal': ['tây', 'công sở', 'formal', 'dress', 'oxford', 'derby'],
    'boots': ['boot', 'cao cổ', 'ankle', 'martin'],
    'sandals': ['sandal', 'dép', 'slides', 'flip-flop'],
    'heels': ['cao gót', 'high heel', 'pump'],
    'flats': ['bệt', 'flat', 'ballerina']
}

# Price Ranges (VNĐ)
PRICE_RANGES = {
    'budget': (0, 1000000),          # Dưới 1M
    'mid_range': (1000000, 3000000), # 1M - 3M  
    'premium': (3000000, 5000000),   # 3M - 5M
    'luxury': (5000000, float('inf')) # Trên 5M
}

def get_database_url() -> str:
    """Tạo database URL từ config"""
    config = DATABASE_CONFIG
    return f"mysql+pymysql://{config['user']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}?charset={config['charset']}"

def get_config() -> Dict[str, Any]:
    """Lấy toàn bộ configuration"""
    return {
        'database': DATABASE_CONFIG,
        'chatbot': CHATBOT_CONFIG,
        'tables': TABLES,
        'queries': SQL_QUERIES,
        'errors': ERROR_MESSAGES,
        'success': SUCCESS_MESSAGES,
        'categories': CATEGORY_MAPPING,
        'price_ranges': PRICE_RANGES
    }
