#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test kết nối MySQL Database cho ShoeMart ChatBot
Kiểm tra tất cả tính năng database
"""

import sys
import traceback
from database_manager import get_database_service
from shoe_store_mysql_chatbot import ShoeMartMySQLChatBot

def test_database_connection():
    """Test kết nối cơ bản"""
    print("🔍 Test 1: Kết nối Database")
    print("-" * 50)
    
    try:
        db_service = get_database_service()
        health = db_service.health_check()
        
        if health['connected']:
            print("✅ Kết nối database thành công!")
            print(f"📊 Status: {health['status']}")
            print(f"⏰ Time: {health['timestamp']}")
            return True
        else:
            print("❌ Không thể kết nối database")
            return False
            
    except Exception as e:
        print(f"❌ Lỗi kết nối: {e}")
        return False

def test_product_queries():
    """Test các query sản phẩm"""
    print("\n🛍️ Test 2: Truy vấn sản phẩm")
    print("-" * 50)
    
    try:
        db_service = get_database_service()
        
        # Test lấy tất cả sản phẩm
        products = db_service.products.get_all_products()
        print(f"📦 Tổng số sản phẩm: {len(products)}")
        
        if products:
            sample = db_service.format_product(products[0])
            print(f"📝 Sản phẩm mẫu: {sample['name']} - {sample['formatted_price']}")
        
        # Test tìm kiếm theo tên
        search_results = db_service.products.search_products_by_name('Nike')
        print(f"🔍 Kết quả tìm 'Nike': {len(search_results)} sản phẩm")
        
        # Test lấy theo category
        category_results = db_service.products.get_products_by_category('sneaker')
        print(f"👟 Sản phẩm sneaker: {len(category_results)} sản phẩm")
        
        # Test sản phẩm bán chạy
        popular = db_service.products.get_popular_products(5)
        print(f"🔥 Sản phẩm bán chạy: {len(popular)} sản phẩm")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi truy vấn sản phẩm: {e}")
        traceback.print_exc()
        return False

def test_price_range_queries():
    """Test truy vấn theo khoảng giá"""
    print("\n💰 Test 3: Truy vấn theo giá")
    print("-" * 50)
    
    try:
        db_service = get_database_service()
        
        # Test các khoảng giá khác nhau
        ranges = [
            (0, 1000000, "Dưới 1M"),
            (1000000, 3000000, "1M-3M"),
            (3000000, 5000000, "3M-5M"),
            (5000000, float('inf'), "Trên 5M")
        ]
        
        for min_price, max_price, description in ranges:
            products = db_service.products.get_products_by_price_range(min_price, max_price)
            print(f"💸 {description}: {len(products)} sản phẩm")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi truy vấn giá: {e}")
        return False

def test_order_queries():
    """Test truy vấn đơn hàng"""
    print("\n📊 Test 4: Truy vấn đơn hàng")
    print("-" * 50)
    
    try:
        db_service = get_database_service()
        
        # Test thống kê bán hàng
        stats = db_service.orders.get_sales_statistics()
        print(f"📈 Thống kê bán hàng: {len(stats)} danh mục")
        
        if stats:
            for stat in stats:
                category = stat.get('Category', 'Unknown')
                sold = stat.get('TotalSold', 0)
                revenue = stat.get('Revenue', 0)
                print(f"   🏷️ {category}: {sold} đôi - {db_service.format_price(revenue)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi truy vấn đơn hàng: {e}")
        return False

def test_chatbot_responses():
    """Test phản hồi chatbot"""
    print("\n🤖 Test 5: ChatBot responses")
    print("-" * 50)
    
    try:
        chatbot = ShoeMartMySQLChatBot()
        
        test_queries = [
            "xin chào",
            "có giày gì",
            "giày Nike",
            "sản phẩm bán chạy",
            "giày dưới 2 triệu",
            "thống kê bán hàng"
        ]
        
        for query in test_queries:
            print(f"\n👤 Test: '{query}'")
            response = chatbot.get_response(query)
            print(f"🤖 Response: {response[:100]}..." if len(response) > 100 else f"🤖 Response: {response}")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi test chatbot: {e}")
        traceback.print_exc()
        return False

def test_database_schema():
    """Test schema database"""
    print("\n🗄️ Test 6: Database Schema")
    print("-" * 50)
    
    try:
        db_service = get_database_service()
        
        # Query để kiểm tra tables
        tables_query = "SHOW TABLES"
        with db_service.db_manager.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(tables_query)
            tables = cursor.fetchall()
            cursor.close()
        
        print("📋 Tables trong database:")
        for table in tables:
            table_name = table[0] if isinstance(table, tuple) else table
            print(f"   📄 {table_name}")
            
            # Đếm số record trong mỗi table
            count_query = f"SELECT COUNT(*) FROM {table_name}"
            with db_service.db_manager.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(count_query)
                count = cursor.fetchone()[0]
                cursor.close()
                print(f"      📊 {count} records")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi kiểm tra schema: {e}")
        return False

def run_all_tests():
    """Chạy tất cả tests"""
    print("🧪 ShoeMart MySQL ChatBot - Database Tests")
    print("=" * 70)
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Product Queries", test_product_queries),
        ("Price Range Queries", test_price_range_queries),
        ("Order Queries", test_order_queries),
        ("ChatBot Responses", test_chatbot_responses),
        ("Database Schema", test_database_schema)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Test '{test_name}' failed with exception: {e}")
            results.append((test_name, False))
    
    # Tổng kết
    print("\n" + "=" * 70)
    print("📊 KẾT QUẢ TESTS:")
    print("-" * 70)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Tổng kết: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 Tất cả tests đều thành công! ChatBot sẵn sàng hoạt động!")
    else:
        print("⚠️ Một số tests thất bại. Vui lòng kiểm tra lại cấu hình.")
        print("💡 Gợi ý kiểm tra:")
        print("   - MySQL server đã chạy chưa?")
        print("   - Database 'shoe_store_db' đã tồn tại chưa?")
        print("   - User/password trong config.py đúng chưa?")
        print("   - Đã chạy migrations từ C# project chưa?")

def main():
    """Main function"""
    if len(sys.argv) > 1:
        test_name = sys.argv[1].lower()
        
        if test_name == 'connection':
            test_database_connection()
        elif test_name == 'products':
            test_product_queries()
        elif test_name == 'prices':
            test_price_range_queries()
        elif test_name == 'orders':
            test_order_queries()
        elif test_name == 'chatbot':
            test_chatbot_responses()
        elif test_name == 'schema':
            test_database_schema()
        else:
            print("❌ Unknown test. Available: connection, products, prices, orders, chatbot, schema")
    else:
        run_all_tests()

if __name__ == "__main__":
    main()

