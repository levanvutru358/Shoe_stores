# -*- coding: utf-8 -*-
"""
Database Manager cho ShoeMart ChatBot
Quản lý kết nối và truy vấn MySQL database
"""

import mysql.connector
from mysql.connector import Error, pooling
from typing import List, Dict, Any, Optional, Tuple
import logging
from contextlib import contextmanager
from config import DATABASE_CONFIG, SQL_QUERIES, ERROR_MESSAGES, SUCCESS_MESSAGES

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """Quản lý kết nối và operations với MySQL database"""
    
    def __init__(self):
        self.pool = None
        self.is_connected = False
        self._initialize_connection_pool()
    
    def _initialize_connection_pool(self):
        """Khởi tạo connection pool"""
        try:
            # Tạo config cho connection pool
            pool_config = {
                'host': DATABASE_CONFIG['host'],
                'port': DATABASE_CONFIG['port'],
                'database': DATABASE_CONFIG['database'],
                'user': DATABASE_CONFIG['user'],
                'password': DATABASE_CONFIG['password'],
                'charset': DATABASE_CONFIG.get('charset', 'utf8mb4'),
                'autocommit': DATABASE_CONFIG.get('autocommit', True),
                'pool_name': 'shoemart_pool',
                'pool_size': DATABASE_CONFIG.get('pool_size', 5),
                'pool_reset_session': DATABASE_CONFIG.get('pool_reset_session', True)
            }
            
            self.pool = pooling.MySQLConnectionPool(**pool_config)
            self.is_connected = True
            logger.info(SUCCESS_MESSAGES['db_connected'])
            
        except Error as e:
            logger.error(f"Database connection failed: {e}")
            self.is_connected = False
            raise Exception(ERROR_MESSAGES['db_connection_failed'])
    
    @contextmanager
    def get_connection(self):
        """Context manager để lấy connection từ pool"""
        connection = None
        try:
            if not self.pool:
                raise Exception(ERROR_MESSAGES['db_connection_failed'])
                
            connection = self.pool.get_connection()
            yield connection
            
        except Error as e:
            logger.error(f"Database error: {e}")
            if connection:
                connection.rollback()
            raise Exception(ERROR_MESSAGES['query_failed'])
            
        finally:
            if connection and connection.is_connected():
                connection.close()
    
    def execute_query(self, query: str, params: Tuple = None) -> List[Dict[str, Any]]:
        """Thực thi SELECT query và trả về kết quả"""
        try:
            with self.get_connection() as connection:
                cursor = connection.cursor(dictionary=True)
                cursor.execute(query, params or ())
                results = cursor.fetchall()
                cursor.close()
                return results
                
        except Exception as e:
            logger.error(f"Query execution failed: {e}")
            return []
    
    def execute_update(self, query: str, params: Tuple = None) -> int:
        """Thực thi INSERT/UPDATE/DELETE query"""
        try:
            with self.get_connection() as connection:
                cursor = connection.cursor()
                cursor.execute(query, params or ())
                connection.commit()
                affected_rows = cursor.rowcount
                cursor.close()
                return affected_rows
                
        except Exception as e:
            logger.error(f"Update execution failed: {e}")
            return 0
    
    def test_connection(self) -> bool:
        """Test kết nối database"""
        try:
            with self.get_connection() as connection:
                cursor = connection.cursor()
                cursor.execute("SELECT 1")
                cursor.fetchone()
                cursor.close()
                return True
        except:
            return False

class ProductDataAccess:
    """Data Access Layer cho Products"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
    
    def get_all_products(self) -> List[Dict[str, Any]]:
        """Lấy tất cả sản phẩm"""
        return self.db.execute_query(SQL_QUERIES['get_all_products'])
    
    def get_products_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Lấy sản phẩm theo danh mục"""
        search_term = f"%{category}%"
        return self.db.execute_query(
            SQL_QUERIES['get_products_by_category'], 
            (search_term,)
        )
    
    def search_products_by_name(self, search_term: str) -> List[Dict[str, Any]]:
        """Tìm kiếm sản phẩm theo tên"""
        pattern = f"%{search_term}%"
        return self.db.execute_query(
            SQL_QUERIES['search_products_by_name'], 
            (pattern, pattern)
        )
    
    def get_product_by_id(self, product_id: int) -> Optional[Dict[str, Any]]:
        """Lấy sản phẩm theo ID"""
        results = self.db.execute_query(
            SQL_QUERIES['get_product_by_id'], 
            (product_id,)
        )
        return results[0] if results else None
    
    def get_products_by_price_range(self, min_price: float, max_price: float) -> List[Dict[str, Any]]:
        """Lấy sản phẩm theo khoảng giá"""
        return self.db.execute_query(
            SQL_QUERIES['get_products_by_price_range'], 
            (min_price, max_price)
        )
    
    def get_popular_products(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Lấy sản phẩm bán chạy"""
        return self.db.execute_query(
            SQL_QUERIES['get_popular_products'], 
            (limit,)
        )

class OrderDataAccess:
    """Data Access Layer cho Orders"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
    
    def get_user_orders(self, user_id: int) -> List[Dict[str, Any]]:
        """Lấy đơn hàng của user"""
        return self.db.execute_query(
            SQL_QUERIES['get_user_orders'], 
            (user_id,)
        )
    
    def get_sales_statistics(self) -> List[Dict[str, Any]]:
        """Lấy thống kê bán hàng"""
        return self.db.execute_query(SQL_QUERIES['get_sales_stats'])

class CartDataAccess:
    """Data Access Layer cho Cart"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
    
    def get_user_cart(self, user_id: int) -> List[Dict[str, Any]]:
        """Lấy giỏ hàng của user"""
        return self.db.execute_query(
            SQL_QUERIES['get_user_cart'], 
            (user_id,)
        )
    
    def add_to_cart(self, user_id: int, product_id: int, quantity: int) -> bool:
        """Thêm sản phẩm vào giỏ hàng"""
        query = """
            INSERT INTO CartItems (UserId, ProductId, Quantity)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity)
        """
        affected = self.db.execute_update(query, (user_id, product_id, quantity))
        return affected > 0
    
    def remove_from_cart(self, user_id: int, product_id: int) -> bool:
        """Xóa sản phẩm khỏi giỏ hàng"""
        query = "DELETE FROM CartItems WHERE UserId = %s AND ProductId = %s"
        affected = self.db.execute_update(query, (user_id, product_id))
        return affected > 0
    
    def clear_cart(self, user_id: int) -> bool:
        """Xóa toàn bộ giỏ hàng"""
        query = "DELETE FROM CartItems WHERE UserId = %s"
        affected = self.db.execute_update(query, (user_id,))
        return affected >= 0

class DatabaseService:
    """Service tổng hợp tất cả data access layers"""
    
    def __init__(self):
        self.db_manager = DatabaseManager()
        self.products = ProductDataAccess(self.db_manager)
        self.orders = OrderDataAccess(self.db_manager)
        self.cart = CartDataAccess(self.db_manager)
    
    def health_check(self) -> Dict[str, Any]:
        """Kiểm tra sức khỏe database"""
        is_healthy = self.db_manager.test_connection()
        return {
            'status': 'healthy' if is_healthy else 'unhealthy',
            'connected': is_healthy,
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }
    
    def format_price(self, price) -> str:
        """Format giá tiền VNĐ"""
        # Xử lý Decimal từ MySQL
        if hasattr(price, '__float__'):
            price = float(price)
        
        price = int(price)
        
        if price < 1000:
            return f"{price} VNĐ"
        else:
            return f"{price:,}".replace(',', '.') + " VNĐ"
    
    def format_product(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Format thông tin sản phẩm để hiển thị"""
        if not product:
            return {}
            
        return {
            'id': product.get('Id'),
            'name': product.get('Name', ''),
            'description': product.get('Description', ''),
            'price': product.get('Price', 0),
            'formatted_price': self.format_price(product.get('Price', 0)),
            'category': product.get('Category', ''),
            'image_url': product.get('ImageUrl', '')
        }
    
    def close_connections(self):
        """Đóng tất cả kết nối"""
        if self.db_manager.pool:
            try:
                # MySQL Connector không có close pool method
                # Pool sẽ tự động đóng khi object bị garbage collected
                self.db_manager.is_connected = False
                logger.info("Database connections closed")
            except Exception as e:
                logger.error(f"Error closing connections: {e}")

# Singleton pattern để sử dụng trong toàn bộ ứng dụng
_db_service_instance = None

def get_database_service() -> DatabaseService:
    """Lấy singleton instance của DatabaseService"""
    global _db_service_instance
    if _db_service_instance is None:
        _db_service_instance = DatabaseService()
    return _db_service_instance

# Test functions
def test_database_connection():
    """Test kết nối database"""
    try:
        db_service = get_database_service()
        health = db_service.health_check()
        print(f"🔍 Database Health Check: {health}")
        
        # Test lấy sản phẩm
        products = db_service.products.get_all_products()
        print(f"📦 Found {len(products)} products in database")
        
        if products:
            sample_product = db_service.format_product(products[0])
            print(f"📝 Sample product: {sample_product}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

if __name__ == "__main__":
    test_database_connection()
