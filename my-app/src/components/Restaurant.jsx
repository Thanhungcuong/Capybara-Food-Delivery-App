import React from 'react';
import { Link } from 'react-router-dom';

const Restaurant = () => {
    return (
        <div className="h-96 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 w-fit mx-auto">Trang chủ dành cho chủ nhà hàng ứng dụng Capypara</h1>
            <p className='text-base font-semibold mb-4'>Nhấn vào nút "Tạo món ăn" để thêm món ăn vào trong ứng dụng của chúng tôi</p>
            <Link to="/createItem">
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                    Tạo món ăn
                </button>
            </Link>
        </div>
    );
};

export default Restaurant;
