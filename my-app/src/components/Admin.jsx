import React from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
    return (
        <div className="h-screen rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 w-fit mx-auto">Trang chủ dành cho quản trị viên ứng dụng Capypara</h1>
            <p className='text-base font-semibold mb-4'>Nhấn vào nút "Quản lý người dùng" để hiển thị danh sách tài khoản và thay đổi phân quyền</p>
            <Link to="/AdminRole">
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                    Quản lý người dùng
                </button>
            </Link>
            <p className='text-base font-semibold my-4'>Nhấn vào nút "Đơn hàng" để hiển thị danh sách đơn hàng</p>
            <Link to="/Order">
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                    Đơn hàng
                </button>
            </Link>
            <p className='text-base font-semibold my-4'>Nhấn vào nút "Đăng ký chủ nhà hàng" để hiển thị danh sách người dùng điền đơn đăng ký trở thành chủ nhà hàng</p>
            <Link to="/ListTobeRestaurant">
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                    Đăng ký chủ nhà hàng
                </button>
            </Link>
            <p className='text-base font-semibold my-4'>Nhấn vào nút "Thống kê" để hiển thị số liệu về tổng doanh thu, lợi nhuận toàn bộ ứng dụng và chi tiết tất đơn hàng</p>
            <Link to="/AdminReport">
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                    Thống kê
                </button>
            </Link>
        </div>
    );
};

export default Admin;
