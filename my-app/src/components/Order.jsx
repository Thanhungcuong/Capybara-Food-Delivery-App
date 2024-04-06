import React, { useEffect, useState } from "react";
import { collection, query, getDocs } from 'firebase/firestore';
import { firestore } from "../firebase.config";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(firestore, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map(doc => doc.data());
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-r from-orange-400 to-orange-600 text-white p-8 rounded-2xl">
      <h1 className="w-fit mx-auto text-4xl font-bold mb-6">Danh sách đơn hàng</h1>
      {orders.length > 0 ? (
        <table className="w-full border-spacing-2 rounded-2xl overflow-hidden border">
          <thead>
            <tr>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">STT</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Tên</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Số điện thoại</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Email</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Địa chỉ</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Ghi chú</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Sản phẩm</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Tổng giá tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-orange-100'} text-orange-700 border`}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{order.name}</td>
                <td className="px-4 py-2 border">{order.phone}</td>
                <td className="px-4 py-2 border">{order.email}</td>
                <td className="px-4 py-2 border">{order.address}</td>
                <td className="px-4 py-2 border">{order.message}</td>
                <td className="px-4 py-2 border">
                  <ul>
                    {order.cartItems.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item.title} - Số lượng: {item.qty}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border">{order.totalPrice} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có đơn hàng nào để hiển thị</p>
      )}
    </div>
  );
};

export default Order;
