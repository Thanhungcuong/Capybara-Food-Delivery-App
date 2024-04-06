import React, { useState } from "react";
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from "../firebase.config";

const TobeRestaurant = ({ userUid }) => { // Thay đổi prop từ `user` sang `userUid`
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    restaurantName: '',
    address: '',
    message: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!userUid) {
        console.error('User UID not available.');
        return;
      }

      const restaurantRef = collection(firestore, 'restaurantRequests');
      await addDoc(restaurantRef, {
        uid: userUid,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        restaurantName: formData.restaurantName,
        address: formData.address,
        message: formData.message,
        status: 'Đang chờ phê duyệt' 
      });

      alert('Đăng ký của bạn đã được gửi đi. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.');
      
      // Chuyển hướng về trang chủ sau khi người dùng bấm OK trên thông báo alert
      window.location.href = '/';
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Có lỗi xảy ra khi gửi đăng ký. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-2xl p-8">
    <h1 className="text-4xl font-bold py-8 w-fit mx-auto">Đơn đăng ký làm chủ nhà hàng </h1>
    <p className='text-lg font-semibold mb-4 '>Trở thành chủ nhà hàng của ứng dụng giao đồ ăn Capybara, bạn sẽ có tệp khách hàng thường xuyên. Hãy điền đơn dưới đây và chờ phê duyệt, chúng tôi cần bạn!</p>
    <form className="bg-white shadow-md rounded-2xl w-[70%] mx-auto px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Họ và tên
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Họ và tên"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Số điện thoại
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="phone"
          type="tel"
          placeholder="Số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="restaurantName">
          Tên nhà hàng
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="restaurantName"
          type="text"
          placeholder="Tên nhà hàng"
          name="restaurantName"
          value={formData.restaurantName}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
          Địa chỉ nhà hàng
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="address"
          type="text"
          placeholder="Địa chỉ nhà hàng"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
          Ghi chú
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="message"
          placeholder="Thông điệp"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Gửi đăng ký
        </button>
      </div>
    </form>
  </div>
  );
};

export default TobeRestaurant;
