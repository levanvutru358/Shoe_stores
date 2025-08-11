#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Demo Interactive ShoeMart MySQL ChatBot
Script demo tương tác với chatbot và hiển thị các tính năng
"""

from shoe_store_mysql_chatbot import ShoeMartMySQLChatBot
import time

def demo_conversation():
    """Demo cuộc hội thoại tự động"""
    print("🎬 DEMO TỰ ĐỘNG - ShoeMart MySQL ChatBot")
    print("=" * 60)
    
    chatbot = ShoeMartMySQLChatBot()
    
    # Danh sách câu hỏi demo
    demo_queries = [
        ("Xin chào", "Lời chào"),
        ("Xem tất cả sản phẩm", "Hiển thị toàn bộ database"),
        ("Nike", "Tìm kiếm thương hiệu"),
        ("giày thể thao", "Tìm theo danh mục"),
        ("sản phẩm bán chạy", "Top sản phẩm hot"),
        ("giày dưới 100", "Lọc theo giá"),
        ("thống kê bán hàng", "Báo cáo doanh thu"),
        ("help", "Xem tất cả tính năng"),
        ("cảm ơn", "Kết thúc")
    ]
    
    for i, (query, description) in enumerate(demo_queries, 1):
        print(f"\n📝 Demo {i}: {description}")
        print(f"👤 User: {query}")
        print("-" * 50)
        
        response = chatbot.get_response(query)
        print(f"🤖 {chatbot.name}:")
        print(response)
        
        print("\n" + "="*60)
        time.sleep(2)  # Pause để dễ đọc
    
    print("✅ Demo hoàn thành!")

def interactive_mode():
    """Chế độ tương tác thực tế"""
    print("💬 CHẾ độ TƯƠNG TÁC - ShoeMart MySQL ChatBot")
    print("=" * 60)
    
    chatbot = ShoeMartMySQLChatBot()
    
    # Hiển thị trạng thái kết nối
    if chatbot.is_db_connected:
        print("✅ Database: Đã kết nối - Dữ liệu real-time")
    else:
        print("⚠️ Database: Chế độ offline - Dữ liệu mẫu")
    
    print("\n💡 Gợi ý câu hỏi:")
    print("• 'xem tất cả sản phẩm'")
    print("• 'Nike' hoặc 'Adidas'")
    print("• 'giày dưới 2 triệu'")
    print("• 'sản phẩm bán chạy'")
    print("• 'help' - xem tất cả tính năng")
    print("\nGõ 'quit' để thoát")
    print("=" * 60)
    
    # Lời chào
    welcome = chatbot.get_response("xin chào")
    print(f"\n🤖 {chatbot.name}:")
    print(welcome)
    
    while True:
        try:
            user_input = input(f"\n👤 Bạn: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'thoát', 'bye']:
                farewell = chatbot.get_response("cảm ơn")
                print(f"\n🤖 {chatbot.name}:")
                print(farewell)
                print("\n👋 Cảm ơn bạn đã sử dụng ShoeMart ChatBot!")
                break
            
            if user_input:
                response = chatbot.get_response(user_input)
                print(f"\n🤖 {chatbot.name}:")
                print(response)
            else:
                print("🤖 Bạn có muốn hỏi gì không? 😊")
                
        except KeyboardInterrupt:
            print(f"\n\n🤖 {chatbot.name}: Cảm ơn bạn đã sử dụng dịch vụ! 👋")
            break
        except Exception as e:
            print(f"\n❌ Lỗi: {e}")
            print("Vui lòng thử lại!")

def test_features():
    """Test các tính năng chính"""
    print("🧪 TEST CÁC TÍNH NĂNG CHÍNH")
    print("=" * 60)
    
    chatbot = ShoeMartMySQLChatBot()
    
    test_cases = [
        ("Database Connection", chatbot.is_db_connected),
        ("Search Products", "Nike" in chatbot.get_response("Nike")),
        ("Price Filtering", "giá" in chatbot.get_response("giày dưới 100")),
        ("Category Search", len(chatbot.get_response("giày thể thao")) > 50),
        ("Fallback Mode", len(chatbot.fallback_products) > 0),
        ("Help Function", "help" in chatbot.get_response("help").lower()),
    ]
    
    passed = 0
    for test_name, result in test_cases:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Kết quả: {passed}/{len(test_cases)} tests passed")
    
    if passed == len(test_cases):
        print("🎉 Tất cả tính năng hoạt động tốt!")
    else:
        print("⚠️ Một số tính năng cần kiểm tra lại.")

def show_database_status():
    """Hiển thị trạng thái database"""
    print("📊 TRẠNG THÁI DATABASE & CHATBOT")
    print("=" * 60)
    
    try:
        chatbot = ShoeMartMySQLChatBot()
        
        print(f"🤖 ChatBot: {chatbot.name} v{chatbot.version}")
        print(f"💾 Database: {'✅ Connected' if chatbot.is_db_connected else '❌ Disconnected'}")
        
        if chatbot.is_db_connected:
            # Thống kê database
            products = chatbot.db_service.products.get_all_products()
            print(f"📦 Tổng sản phẩm: {len(products)}")
            
            if products:
                categories = set(p.get('Category', 'Unknown') for p in products)
                print(f"🏷️ Danh mục: {', '.join(categories)}")
                
                prices = [float(p.get('Price', 0)) for p in products]
                if prices:
                    print(f"💰 Giá từ {min(prices):,.0f} đến {max(prices):,.0f} VNĐ")
        else:
            print(f"📦 Fallback products: {len(chatbot.fallback_products)}")
            print("⚠️ Chạy ở chế độ offline với dữ liệu mẫu")
        
        print(f"📚 Lịch sử tối đa: {chatbot.max_history} tin nhắn")
        
    except Exception as e:
        print(f"❌ Lỗi kiểm tra trạng thái: {e}")

def main():
    """Menu chính"""
    print("🏪 ShoeMart MySQL ChatBot - Demo & Test Suite")
    print("🤖 AI Assistant cho Cửa hàng Giày")
    print("=" * 60)
    
    while True:
        print("\n📋 MENU:")
        print("1. 🎬 Demo tự động")
        print("2. 💬 Chế độ tương tác")
        print("3. 🧪 Test tính năng")
        print("4. 📊 Trạng thái hệ thống")
        print("5. 🚪 Thoát")
        
        try:
            choice = input("\n👉 Chọn (1-5): ").strip()
            
            if choice == '1':
                demo_conversation()
            elif choice == '2':
                interactive_mode()
            elif choice == '3':
                test_features()
            elif choice == '4':
                show_database_status()
            elif choice == '5':
                print("👋 Cảm ơn bạn đã sử dụng ShoeMart ChatBot!")
                break
            else:
                print("❌ Lựa chọn không hợp lệ! Vui lòng chọn 1-5.")
                
        except KeyboardInterrupt:
            print("\n\n👋 Tạm biệt!")
            break
        except Exception as e:
            print(f"❌ Lỗi: {e}")

if __name__ == "__main__":
    main()

