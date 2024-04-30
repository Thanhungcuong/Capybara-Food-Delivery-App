import React, { useEffect, useState } from "react";
import { collection, query, getDocs, where, getFirestore, updateDoc, doc } from 'firebase/firestore';
import { firestore } from "../firebase.config";

const Order = ({ userUid }) => {
  const db = getFirestore();
  const [orders, setOrders] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      if (userRoleData.length === 0) return;
      let ordersQuery;
      const ordersCollection = collection(db, 'orders');

      if (userRoleData[0].role === 'manager') {
        ordersQuery = query(ordersCollection, where("uidRes", "==", userUid));
      } else if (userRoleData[0].role === 'customer') {
        ordersQuery = query(ordersCollection, where("userId", "==", userUid));
      } else if (userRoleData[0].role === 'admin') {
        ordersQuery = query(ordersCollection);
      }

      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => doc.data());
      setOrders(ordersData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders: ', error);
    }
  };

  useEffect(() => {
    const fetchUserRoleData = async () => {
      try {
        const userRoleRef = collection(db, 'userRoles');
        const userRoleQuery = query(userRoleRef, where("uid", "==", userUid));
        const userRoleSnapshot = await getDocs(userRoleQuery);
        const userData = userRoleSnapshot.docs.map(doc => doc.data());
        setUserRoleData(userData);
      } catch (error) {
        console.error('Error fetching user role data: ', error);
      }
    };

    fetchUserRoleData();
  }, [db, userUid]);

  useEffect(() => {
    fetchOrders();
  }, [db, userRoleData, userUid]);
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status: ', error);
    }
  };

  return (
    <div className="h-fit bg-gradient-to-r from-orange-400 to-orange-600 text-white p-8 rounded-2xl">
      <h1 className="w-fit mx-auto text-4xl font-bold mb-6">Danh sách đơn hàng</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        <table className="w-full border-spacing-2 rounded-2xl overflow-hidden border">
          <thead>
            <tr>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">STT</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">ID Đơn hàng</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Tên</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Số điện thoại</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Email</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Địa chỉ</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Ghi chú</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Sản phẩm</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Tổng giá tiền</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Trạng thái</th>
              {userRoleData[0].role === 'manager' && (
                <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-orange-100'} text-orange-700 border`}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{order.idOrder}</td>
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
                <td className="px-4 py-2 border">{order.status}</td>
                {userRoleData[0].role === 'manager' && (
                  <td className="px-4 py-2 border">
                    <select value={order.status} onChange={(e) => handleStatusChange(order.idOrder, e.target.value)}>
                    <option value="Đang vận chuyển">Đã vận chuyển</option>
                      <option value="Đã thanh toán, đang chuẩn bị món ăn">Đã thanh toán, đang chuẩn bị món ăn</option>
                      <option value="Đang vận chuyển">Đang vận chuyển</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                  </td>
                )}
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
