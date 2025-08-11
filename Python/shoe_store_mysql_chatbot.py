# -*- coding: utf-8 -*-
"""
ShoeMart ChatBot với kết nối MySQL Database
Chatbot thông minh lấy dữ liệu thực từ database Shoe_stores
"""

import random
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
import logging
from database_manager import get_database_service, DatabaseService
from config import CHATBOT_CONFIG, CATEGORY_MAPPING, PRICE_RANGES, ERROR_MESSAGES

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ShoeMartMySQLChatBot:
    """ChatBot ShoeMart kết nối MySQL Database"""
    
    def __init__(self):
        self.name = CHATBOT_CONFIG['name']
        self.version = CHATBOT_CONFIG['version']
        self.conversation_history = []
        self.max_history = CHATBOT_CONFIG['max_history']
        
        # Khởi tạo database service
        try:
            self.db_service = get_database_service()
            self.is_db_connected = self.db_service.health_check()['connected']
            if self.is_db_connected:
                logger.info("✅ ChatBot connected to MySQL database successfully")
            else:
                logger.error("❌ Failed to connect to MySQL database")
        except Exception as e:
            logger.error(f"Database initialization error: {e}")
            self.db_service = None
            self.is_db_connected = False
        
        # Fallback data khi không có database
        self.fallback_products = [
            {'name': 'Nike Air Max 270', 'price': 3200000, 'category': 'Sneakers', 'description': 'Giày thể thao cao cấp với đệm khí tối ưu'},
            {'name': 'Adidas Ultraboost 22', 'price': 4500000, 'category': 'Sneakers', 'description': 'Giày chạy bộ với công nghệ Boost energy return'},
            {'name': 'Converse Chuck Taylor', 'price': 1500000, 'category': 'Sneakers', 'description': 'Giày sneaker cổ điển, phong cách vintage'},
            {'name': 'Oxford Classic Leather', 'price': 2800000, 'category': 'Formal', 'description': 'Giày tây công sở cao cấp, da thật 100%'},
            {'name': 'Timberland Work Boots', 'price': 4200000, 'category': 'Boots', 'description': 'Giày boot cao cổ chống nước, bền bỉ'}
        ]
        
        # Current user context (có thể mở rộng để hỗ trợ nhiều users)
        self.current_user_id = None
        
        # Response templates
        self.responses = {
            'greetings': [
                f"Xin chào! Tôi là {self.name} 👟\nChào mừng bạn đến với cửa hàng giày ShoeMart!\nTôi kết nối trực tiếp với cơ sở dữ liệu để đưa ra thông tin chính xác nhất. Bạn đang tìm loại giày nào? 😊",
                "Chào bạn! 👋 Cảm ơn bạn đã ghé thăm ShoeMart!\nTôi có thể giúp bạn tìm kiếm sản phẩm từ kho dữ liệu thực tế của chúng tôi. Hôm nay bạn muốn xem gì? 👟👞🥾👡",
                "Hello! Rất vui được phục vụ bạn tại ShoeMart! 🛒\nDữ liệu tôi cung cấp đều được cập nhật real-time từ hệ thống. Hãy cho tôi biết bạn cần tư vấn gì nhé!"
            ],
            'database_error': [
                "❌ Xin lỗi, hiện tại tôi không thể kết nối với cơ sở dữ liệu. Vui lòng thử lại sau.",
                "🔧 Hệ thống đang bảo trì. Tôi sẽ sử dụng thông tin cơ bản để hỗ trợ bạn.",
                "⚠️ Có sự cố kỹ thuật. Vui lòng liên hệ hotline 1900-SHOE để được hỗ trợ trực tiếp."
            ],
            'no_results': [
                "🔍 Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.",
                "😔 Xin lỗi, hiện tại chúng tôi chưa có sản phẩm này. Bạn có thể thử tìm kiếm với từ khóa khác không?",
                "💡 Không có kết quả. Hãy thử: 'xem tất cả sản phẩm' hoặc tìm theo danh mục cụ thể."
            ],
            'size_help': [
                "📏 **Hướng dẫn chọn size giày:**\n• Đo chân vào buổi chiều (chân có thể to hơn một chút)\n• Để lại khoảng 0.5-1cm ở mũi giày\n• Thử cả 2 chân vì có thể khác nhau\n• Size châu Âu thường nhỏ hơn size Việt Nam 1 số\n\nBạn cần tư vấn size cụ thể cho sản phẩm nào?",
                "Để chọn size chính xác, bạn có thể:\n1. Đo chiều dài bàn chân (cm)\n2. Tham khảo bảng size của từng thương hiệu\n3. Đến cửa hàng thử trực tiếp\n\nTôi có thể tìm kiếm sản phẩm cụ thể để tư vấn size cho bạn!"
            ],
            'contact_info': [
                "📞 **LIÊN HỆ SHOEMART:**\n\n🏪 Địa chỉ: 123 Nguyễn Văn Linh, Q.7, TP.HCM\n📱 Hotline: 1900-SHOE (7463)\n📧 Email: info@shoemart.vn\n🌐 Website: www.shoemart.vn\n⏰ Giờ mở cửa: 8h-22h hàng ngày\n\n📱 Follow chúng tôi trên Facebook & Instagram để cập nhật ưu đãi mới nhất!"
            ],
            'help': [
                "🤖 **ShoeMart AI Assistant có thể giúp bạn:**\n\n🔍 Tìm kiếm sản phẩm từ database thực\n📊 Xem thống kê sản phẩm bán chạy\n💰 So sánh giá theo khoảng giá\n📝 Xem chi tiết sản phẩm\n🏷️ Tìm theo danh mục\n📈 Thống kê và báo cáo\n\n**Hãy thử:** 'xem sản phẩm', 'giày nike', 'sản phẩm bán chạy', 'giá dưới 2 triệu'"
            ],
            'default': [
                "Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn 🤔\n\n**Bạn có thể hỏi tôi về:**\n🔍 Tìm kiếm sản phẩm (\"giày Nike\", \"boots\")\n💰 Lọc theo giá (\"giày dưới 2 triệu\")\n📊 Sản phẩm bán chạy\n📝 Chi tiết sản phẩm cụ thể\n\nHãy thử một trong những ví dụ trên nhé!",
                "Tôi có thể giúp bạn tìm kiếm trong cơ sở dữ liệu ShoeMart! Hãy thử hỏi về sản phẩm cụ thể hoặc gõ **'help'** để xem hướng dẫn chi tiết. 😊"
            ]
        }
        
        # Intent patterns
        self.patterns = {
            'greetings': [r'xin chào', r'chào', r'hello', r'hi', r'hey'],
            'product_search': [r'tìm.*kiếm', r'xem.*sản.*phẩm', r'có.*gì', r'sản.*phẩm.*nào', r'giày.*gì'],
            'brand_search': [r'nike', r'adidas', r'converse', r'timberland', r'birkenstock', r'puma', r'vans'],
            'category_search': [r'sneaker', r'thể.*thao', r'tây', r'công.*sở', r'boot', r'sandal', r'dép'],
            'price_search': [r'giá', r'tiền', r'dưới', r'trên', r'từ.*đến', r'khoảng', r'budget'],
            'popular_products': [r'bán.*chạy', r'phổ.*biến', r'hot', r'trend', r'nổi.*tiếng'],
            'product_detail': [r'chi.*tiết', r'thông.*tin.*sản.*phẩm', r'mô.*tả'],
            'size_help': [r'size', r'cỡ', r'số', r'chọn.*size'],
            'contact': [r'liên.*hệ', r'địa.*chỉ', r'hotline', r'cửa.*hàng'],
            'help': [r'help', r'giúp.*đỡ', r'hướng.*dẫn', r'có.*thể.*làm.*gì'],
            'statistics': [r'thống.*kê', r'báo.*cáo', r'doanh.*số', r'stats'],
            'all_products': [r'tất.*cả.*sản.*phẩm', r'toàn.*bộ', r'xem.*hết']
        }

    def preprocess(self, text: str) -> str:
        """Tiền xử lý text đầu vào"""
        return text.lower().strip()

    def classify_intent(self, text: str) -> str:
        """Phân loại ý định người dùng"""
        text = self.preprocess(text)
        
        for intent, patterns in self.patterns.items():
            for pattern in patterns:
                if re.search(pattern, text):
                    return intent
        
        return 'default'

    def extract_price_range(self, text: str) -> Optional[tuple]:
        """Trích xuất khoảng giá từ text"""
        text = self.preprocess(text)
        
        # Tìm pattern "dưới X triệu/triệu"
        under_match = re.search(r'dưới\s*(\d+)\s*(?:triệu|tr)', text)
        if under_match:
            max_price = int(under_match.group(1)) * 1000000
            return (0, max_price)
        
        # Tìm pattern "trên X triệu"
        over_match = re.search(r'trên\s*(\d+)\s*(?:triệu|tr)', text)
        if over_match:
            min_price = int(over_match.group(1)) * 1000000
            return (min_price, float('inf'))
        
        # Tìm pattern "từ X đến Y triệu"
        range_match = re.search(r'từ\s*(\d+)\s*(?:đến|tới)\s*(\d+)\s*(?:triệu|tr)', text)
        if range_match:
            min_price = int(range_match.group(1)) * 1000000
            max_price = int(range_match.group(2)) * 1000000
            return (min_price, max_price)
        
        # Preset ranges
        if 'rẻ' in text or 'budget' in text:
            return PRICE_RANGES['budget']
        elif 'trung bình' in text or 'mid' in text:
            return PRICE_RANGES['mid_range'] 
        elif 'cao cấp' in text or 'premium' in text:
            return PRICE_RANGES['premium']
        elif 'luxury' in text or 'xa xỉ' in text:
            return PRICE_RANGES['luxury']
        
        return None

    def extract_category(self, text: str) -> Optional[str]:
        """Trích xuất category từ text"""
        text = self.preprocess(text)
        
        for category, keywords in CATEGORY_MAPPING.items():
            for keyword in keywords:
                if keyword in text:
                    return category
        
        return None

    def format_product_list(self, products: List[Dict], title: str = "", max_display: int = 10) -> str:
        """Format danh sách sản phẩm để hiển thị"""
        if not products:
            return random.choice(self.responses['no_results'])
        
        result = f"🛍️ **{title}**\n" if title else "🛍️ **Sản phẩm tìm thấy:**\n"
        result += f"📦 Có {len(products)} sản phẩm phù hợp\n\n"
        
        display_products = products[:max_display]
        
        for i, product in enumerate(display_products, 1):
            formatted = self.db_service.format_product(product)
            result += f"**{i}. {formatted['name']}**\n"
            result += f"   💰 Giá: {formatted['formatted_price']}\n"
            result += f"   🏷️ Loại: {formatted['category']}\n"
            if formatted['description']:
                result += f"   📝 {formatted['description'][:100]}...\n"
            result += "\n"
        
        if len(products) > max_display:
            result += f"... và {len(products) - max_display} sản phẩm khác.\n"
            result += "Hãy thử tìm kiếm cụ thể hơn để xem đầy đủ!\n"
        
        return result

    def search_products_fallback(self, search_term: str) -> List[Dict]:
        """Tìm kiếm sản phẩm từ fallback data"""
        results = []
        search_lower = search_term.lower()
        
        for product in self.fallback_products:
            if (search_lower in product['name'].lower() or 
                search_lower in product['category'].lower() or 
                search_lower in product['description'].lower()):
                results.append(product)
        
        return results

    def format_price_fallback(self, price: float) -> str:
        """Format giá cho fallback mode"""
        return f"{int(price):,}".replace(',', '.') + " VNĐ"

    def search_products(self, text: str) -> str:
        """Tìm kiếm sản phẩm từ database hoặc fallback"""
        # Cải thiện text processing
        search_term = text.replace('giày', '').replace('tìm', '').replace('xem', '').replace('mua', '').strip()
        # Loại bỏ các từ phổ biến
        common_words = ['có', 'gì', 'nào', 'của', 'tôi', 'bạn', 'được', 'cho']
        words = search_term.split()
        filtered_words = [word for word in words if word.lower() not in common_words]
        search_term = ' '.join(filtered_words).strip()
        
        if not search_term:
            return "🔍 Vui lòng nhập từ khóa tìm kiếm cụ thể hơn. Ví dụ: 'Nike', 'Adidas', 'boots'..."
        
        if not self.is_db_connected:
            # Sử dụng fallback data
            products = self.search_products_fallback(search_term)
            if products:
                result = f"🛍️ **Kết quả tìm kiếm '{search_term}' (chế độ offline):**\n📦 Có {len(products)} sản phẩm phù hợp\n\n"
                for i, product in enumerate(products, 1):
                    result += f"**{i}. {product['name']}**\n"
                    result += f"   💰 Giá: {self.format_price_fallback(product['price'])}\n"
                    result += f"   🏷️ Loại: {product['category']}\n"
                    result += f"   📝 {product['description']}\n\n"
                result += "⚠️ *Dữ liệu hiển thị ở chế độ offline. Kết nối database để có thông tin mới nhất.*"
                return result
            else:
                return f"🔍 Không tìm thấy sản phẩm nào với từ khóa '{search_term}' trong dữ liệu offline.\n\nGợi ý: Thử 'Nike', 'Adidas', 'sneakers', 'boots'"
        
        try:
            # Sử dụng database
            products = self.db_service.products.search_products_by_name(search_term)
            
            if products:
                return self.format_product_list(products, f"Kết quả tìm kiếm '{search_term}':")
            else:
                return f"🔍 Không tìm thấy sản phẩm nào với từ khóa '{search_term}'\n\nGợi ý: Thử tìm theo thương hiệu (Nike, Adidas) hoặc loại giày (sneakers, boots)"
                
        except Exception as e:
            logger.error(f"Product search error: {e}")
            return ERROR_MESSAGES['query_failed']

    def get_products_by_category(self, category: str) -> str:
        """Lấy sản phẩm theo danh mục"""
        if not self.is_db_connected:
            return random.choice(self.responses['database_error'])
        
        try:
            products = self.db_service.products.get_products_by_category(category)
            return self.format_product_list(products, f"Sản phẩm {category.upper()}:")
            
        except Exception as e:
            logger.error(f"Category search error: {e}")
            return ERROR_MESSAGES['query_failed']

    def get_products_by_price_range(self, text: str) -> str:
        """Lấy sản phẩm theo khoảng giá"""
        if not self.is_db_connected:
            return random.choice(self.responses['database_error'])
        
        price_range = self.extract_price_range(text)
        if not price_range:
            return "💰 Vui lòng cho biết khoảng giá cụ thể. Ví dụ: 'giày dưới 2 triệu', 'từ 1 đến 3 triệu'"
        
        try:
            min_price, max_price = price_range
            products = self.db_service.products.get_products_by_price_range(min_price, max_price)
            
            if max_price == float('inf'):
                title = f"Sản phẩm từ {self.db_service.format_price(min_price)} trở lên:"
            else:
                title = f"Sản phẩm từ {self.db_service.format_price(min_price)} đến {self.db_service.format_price(max_price)}:"
            
            return self.format_product_list(products, title)
            
        except Exception as e:
            logger.error(f"Price range search error: {e}")
            return ERROR_MESSAGES['query_failed']

    def get_popular_products(self) -> str:
        """Lấy sản phẩm bán chạy"""
        if not self.is_db_connected:
            return random.choice(self.responses['database_error'])
        
        try:
            products = self.db_service.products.get_popular_products(10)
            if products:
                result = "🔥 **TOP SẢN PHẨM BÁN CHẠY:**\n\n"
                for i, product in enumerate(products, 1):
                    formatted = self.db_service.format_product(product)
                    sold_count = product.get('SoldCount', 0)
                    result += f"**{i}. {formatted['name']}**\n"
                    result += f"   💰 {formatted['formatted_price']}\n"
                    result += f"   📊 Đã bán: {sold_count} đôi\n"
                    result += f"   🏷️ {formatted['category']}\n\n"
                return result
            else:
                return "📊 Chưa có dữ liệu bán hàng để thống kê sản phẩm hot."
                
        except Exception as e:
            logger.error(f"Popular products error: {e}")
            return ERROR_MESSAGES['query_failed']

    def get_all_products(self) -> str:
        """Lấy tất cả sản phẩm"""
        if not self.is_db_connected:
            return random.choice(self.responses['database_error'])
        
        try:
            products = self.db_service.products.get_all_products()
            return self.format_product_list(products, "TẤT CẢ SẢN PHẨM SHOEMART:", 15)
            
        except Exception as e:
            logger.error(f"Get all products error: {e}")
            return ERROR_MESSAGES['query_failed']

    def get_sales_statistics(self) -> str:
        """Lấy thống kê bán hàng"""
        if not self.is_db_connected:
            return random.choice(self.responses['database_error'])
        
        try:
            stats = self.db_service.orders.get_sales_statistics()
            if stats:
                result = "📊 **THỐNG KÊ BÁN HÀNG THEO DANH MỤC:**\n\n"
                total_revenue = 0
                for stat in stats:
                    category = stat.get('Category', 'Unknown')
                    sold = stat.get('TotalSold', 0)
                    revenue = stat.get('Revenue', 0)
                    total_revenue += revenue
                    
                    result += f"🏷️ **{category}:**\n"
                    result += f"   📦 Số lượng bán: {sold} đôi\n"
                    result += f"   💰 Doanh thu: {self.db_service.format_price(revenue)}\n\n"
                
                result += f"💎 **Tổng doanh thu: {self.db_service.format_price(total_revenue)}**"
                return result
            else:
                return "📊 Chưa có dữ liệu bán hàng."
                
        except Exception as e:
            logger.error(f"Sales statistics error: {e}")
            return ERROR_MESSAGES['query_failed']

    def get_response(self, user_input: str) -> str:
        """Lấy phản hồi chính"""
        if not user_input.strip():
            return "Bạn có thể hỏi tôi bất cứ điều gì về sản phẩm ShoeMart! 😊"
        
        intent = self.classify_intent(user_input)
        
        try:
            if intent == 'greetings':
                return random.choice(self.responses['greetings'])
            
            elif intent == 'all_products':
                return self.get_all_products()
            
            elif intent == 'product_search' or intent == 'brand_search':
                return self.search_products(user_input)
            
            elif intent == 'category_search':
                category = self.extract_category(user_input)
                if category:
                    return self.get_products_by_category(category)
                return self.search_products(user_input)
            
            elif intent == 'price_search':
                return self.get_products_by_price_range(user_input)
            
            elif intent == 'popular_products':
                return self.get_popular_products()
            
            elif intent == 'statistics':
                return self.get_sales_statistics()
            
            elif intent == 'size_help':
                return random.choice(self.responses['size_help'])
            
            elif intent == 'contact':
                return random.choice(self.responses['contact_info'])
            
            elif intent == 'help':
                return random.choice(self.responses['help'])
            
            else:
                return random.choice(self.responses['default'])
                
        except Exception as e:
            logger.error(f"Response generation error: {e}")
            return "😅 Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!"

    def add_to_history(self, user_message: str, bot_response: str):
        """Thêm vào lịch sử hội thoại"""
        self.conversation_history.append({
            'timestamp': datetime.now().strftime('%H:%M:%S'),
            'user': user_message,
            'bot': bot_response
        })
        
        # Giới hạn lịch sử
        if len(self.conversation_history) > self.max_history:
            self.conversation_history = self.conversation_history[-self.max_history:]

    def chat(self):
        """Bắt đầu chat session"""
        print("=" * 70)
        print(f"🤖 {self.name} v{self.version} - Kết nối MySQL Database")
        print("💾 Dữ liệu thực tế từ hệ thống Shoe_stores")
        
        if self.is_db_connected:
            print("✅ Database: Đã kết nối")
        else:
            print("❌ Database: Lỗi kết nối")
            
        print("\nGõ 'quit' hoặc 'exit' để thoát")
        print("=" * 70)
        
        # Lời chào đầu tiên
        welcome_msg = random.choice(self.responses['greetings'])
        print(f"\n🤖 {self.name}: {welcome_msg}")
        
        while True:
            try:
                user_input = input(f"\n👤 Bạn: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'thoát', 'bye']:
                    print(f"\n🤖 {self.name}: Cảm ơn bạn đã sử dụng dịch vụ! Hẹn gặp lại! 👋")
                    break
                
                if user_input:
                    response = self.get_response(user_input)
                    print(f"\n🤖 {self.name}: {response}")
                    self.add_to_history(user_input, response)
                
            except KeyboardInterrupt:
                print(f"\n\n🤖 {self.name}: Cảm ơn bạn đã sử dụng dịch vụ! 👋")
                break
            except Exception as e:
                logger.error(f"Chat error: {e}")
                print(f"\n🤖 {self.name}: Có lỗi xảy ra. Vui lòng thử lại!")

    def __del__(self):
        """Cleanup khi object bị destroy"""
        if hasattr(self, 'db_service') and self.db_service:
            self.db_service.close_connections()

def main():
    """Hàm chính"""
    print("🚀 Đang khởi động ShoeMart MySQL ChatBot...")
    
    try:
        chatbot = ShoeMartMySQLChatBot()
        chatbot.chat()
    except Exception as e:
        print(f"❌ Lỗi khởi động ChatBot: {e}")
        print("💡 Vui lòng kiểm tra:")
        print("   - MySQL server đã chạy chưa")
        print("   - Thông tin kết nối trong config.py")
        print("   - Đã cài đặt requirements.txt chưa")

if __name__ == "__main__":
    main()
