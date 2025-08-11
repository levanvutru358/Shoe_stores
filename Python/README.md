# 👟 ShoeMart ChatBot - Hệ thống AI cho Cửa hàng Giày

Chatbot thông minh chuyên biệt cho cửa hàng giày, được phát triển bằng Python với khả năng kết nối trực tiếp với MySQL database của hệ thống Shoe_stores backend.

## 🚀 Tính năng chính

### 🤖 ChatBot Console với dữ liệu mẫu (`shoe_store_chatbot.py`)
- Tư vấn sản phẩm giày theo danh mục (Sneakers, Formal, Boots, Sandals)
- Tìm kiếm theo thương hiệu (Nike, Adidas, Converse, Timberland, Birkenstock)
- Hỗ trợ chọn size và màu sắc
- Thông tin giá cả và khuyến mãi
- Hướng dẫn đặt hàng và giao hàng
- Tư vấn cách bảo quản giày

### 💾 ChatBot MySQL Real-time (`shoe_store_mysql_chatbot.py`) ⭐ **MỚI**
- **Kết nối trực tiếp với MySQL database Shoe_stores**
- Dữ liệu sản phẩm real-time từ hệ thống thực tế
- Tìm kiếm sản phẩm từ database theo tên, thương hiệu, danh mục
- Lọc sản phẩm theo khoảng giá (VD: "giày dưới 2 triệu")
- Hiển thị sản phẩm bán chạy từ dữ liệu đơn hàng thực
- Thống kê bán hàng theo danh mục
- Connection pooling và error handling

### 🌐 ChatBot Web (`shoe_store_web_chatbot.py`)
- Giao diện web thân thiện
- Hiển thị sản phẩm với hình ảnh
- API REST để tích hợp với frontend
- Quản lý lịch sử hội thoại
- Responsive design

## 📦 Cài đặt

### 1. Cài đặt Python packages
```bash
pip install -r requirements.txt
```

### 2. Cấu hình Database MySQL
Đảm bảo MySQL server đang chạy và database `shoe_store_db` đã tồn tại.

Kiểm tra thông tin kết nối trong `config.py`:
```python
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'database': 'shoe_store_db',
    'user': 'tru123',
    'password': 'tru12345'
}
```

### 3. Test kết nối Database
```bash
python test_mysql_connection.py
```

### 4. Chạy ChatBot MySQL (Khuyên dùng)
```bash
python shoe_store_mysql_chatbot.py
```

### 5. Chạy ChatBot Console (dữ liệu mẫu)
```bash
python shoe_store_chatbot.py
```

### 6. Chạy ChatBot Web
```bash
python shoe_store_web_chatbot.py
```
Sau đó truy cập: http://localhost:5000

## 💾 Cấu trúc dữ liệu

### Sản phẩm
```python
{
    'id': 1,
    'name': 'Nike Air Max 270',
    'price': 3200000,
    'sizes': [38, 39, 40, 41, 42, 43],
    'colors': ['Trắng', 'Đen', 'Xanh navy'],
    'description': 'Giày thể thao cao cấp với đệm khí tối ưu',
    'category': 'Sneakers'
}
```

### Khuyến mãi
```python
{
    'id': 1,
    'title': 'Giảm 15% đơn từ 2M',
    'description': '🎉 Giảm 15% cho đơn hàng từ 2 triệu',
    'code': 'SAVE15'
}
```

## 🛠️ API Endpoints (Web version)

### Chat
- `POST /chat` - Gửi tin nhắn và nhận phản hồi
- `GET /history` - Lịch sử hội thoại
- `POST /clear` - Xóa lịch sử

### Sản phẩm
- `GET /products` - Tất cả sản phẩm
- `GET /products/<category>` - Sản phẩm theo danh mục
- `GET /promotions` - Khuyến mãi hiện tại

## 💬 Cách sử dụng ChatBot

### Các câu hỏi mẫu cho MySQL ChatBot:
- "Xin chào" - Lời chào
- "Xem tất cả sản phẩm" - Hiển thị toàn bộ database
- "Giày Nike" - Tìm theo thương hiệu từ database
- "Có giày thể thao nào?" - Tìm theo danh mục
- "Giày dưới 2 triệu" - Lọc theo khoảng giá
- "Sản phẩm bán chạy" - Top sản phẩm hot từ dữ liệu orders
- "Thống kê bán hàng" - Báo cáo doanh thu theo danh mục
- "Cách chọn size?" - Tư vấn size
- "help" - Xem đầy đủ tính năng

### Danh mục sản phẩm:
- **Sneakers**: Giày thể thao, chạy bộ
- **Formal**: Giày tây, công sở
- **Boots**: Giày cao cổ, boots
- **Sandals**: Dép, sandals

### Thương hiệu:
- Nike
- Adidas  
- Converse
- Timberland
- Birkenstock

## 🔧 Tùy chỉnh

### Thêm sản phẩm mới
Chỉnh sửa dictionary `products` trong file chatbot:
```python
self.products['category'].append({
    'id': 10,
    'name': 'Tên sản phẩm',
    'price': 1000000,
    'sizes': [38, 39, 40],
    'colors': ['Màu'],
    'description': 'Mô tả',
    'category': 'Category'
})
```

### Thêm khuyến mãi
Chỉnh sửa list `promotions`:
```python
self.promotions.append({
    'id': 5,
    'title': 'Tiêu đề',
    'description': 'Mô tả khuyến mãi',
    'code': 'VOUCHER_CODE'
})
```

### Thêm phản hồi mới
Chỉnh sửa dictionary `responses` và `patterns` để thêm intent mới.

## 📱 Kết nối với Backend

ChatBot MySQL version kết nối trực tiếp với database của hệ thống Shoe_stores backend C#:
- **Shared Database**: Cùng sử dụng database `shoe_store_db`
- **Real-time Data**: Dữ liệu được đồng bộ theo thời gian thực
- **Compatible Schema**: Tương thích với Models của C# backend
- **API Ready**: Có thể mở rộng thành API service

### Kiến trúc hệ thống:
```
Frontend Web App (React/Angular)
         ↕️
C# Backend API (Controllers)
         ↕️
MySQL Database (shoe_store_db)
         ↕️
Python ChatBot AI Assistant
```

## 🔧 Files chính

### Core ChatBot Files:
- `shoe_store_mysql_chatbot.py` - ChatBot chính với MySQL
- `database_manager.py` - Quản lý kết nối và truy vấn DB
- `config.py` - Cấu hình database và chatbot

### Utility Files:
- `test_mysql_connection.py` - Test database connection
- `shoe_store_chatbot.py` - ChatBot với dữ liệu mẫu
- `demo_chatbot.py` - Demo các tính năng

### Configuration:
- `requirements.txt` - Python dependencies
- `env_example.txt` - Mẫu cấu hình environment

## 🚨 Troubleshooting

### Lỗi kết nối database:
```bash
# Kiểm tra MySQL service
mysql -u tru123 -p shoe_store_db

# Test connection
python test_mysql_connection.py connection
```

### Lỗi thiếu dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Database chưa có dữ liệu:
1. Chạy C# backend project trước để tạo migrations
2. Thêm dữ liệu mẫu vào bảng Products
3. Test lại với: `python test_mysql_connection.py products`

## 🤝 Đóng góp

Để đóng góp vào dự án:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**ShoeMart ChatBot** - Trải nghiệm mua sắm giày thông minh với AI! 👟🤖 