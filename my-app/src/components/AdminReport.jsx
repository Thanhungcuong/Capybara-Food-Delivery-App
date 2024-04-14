import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import Chart from 'chart.js/auto';

const AdminReport = () => {
  const db = getFirestore();
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);
  const [restaurantNames, setRestaurantNames] = useState({});
  const [restaurantStats, setRestaurantStats] = useState({});
  const revenueChartRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        const ordersData = ordersSnapshot.docs.map(doc => doc.data());
        setOrders(ordersData);

        // Tính tổng doanh thu và lợi nhuận
        let revenue = 0;
        let profit = 0;
        const stats = {};
        ordersData.forEach(order => {
          revenue += order.totalPrice;
          order.cartItems.forEach(item => {
            profit += (item.price - item.cost) * item.qty;
            if (!stats[order.uidRes]) {
              stats[order.uidRes] = {
                revenue: 0,
                profit: 0
              };
            }
            stats[order.uidRes].revenue += item.price * item.qty;
            stats[order.uidRes].profit += (item.price - item.cost) * item.qty;
          });
        });
        setTotalRevenue(revenue);
        setTotalProfit(profit);

        // Tính phần trăm lợi nhuận so với doanh thu
        if (revenue !== 0) {
          const percentage = (profit / revenue) * 100;
          setProfitPercentage(percentage.toFixed(2));
        } else {
          setProfitPercentage(0);
        }

        // Cập nhật thống kê doanh thu và lợi nhuận của từng nhà hàng
        setRestaurantStats(stats);

        // Vẽ biểu đồ
        drawChart(revenue, profit);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const usersRef = collection(db, 'userRoles');
        const querySnapshot = await getDocs(usersRef);
        setUserCount(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching user count: ', error);
      }
    };

    const fetchUserRoles = async () => {
      try {
        const userRolesRef = collection(db, 'userRoles');
        const querySnapshot = await getDocs(userRolesRef);
        let customerCount = 0;
        let managerCount = 0;
        querySnapshot.forEach(doc => {
          const role = doc.data().role;
          if (role === 'customer') {
            customerCount++;
          } else if (role === 'manager') {
            managerCount++;
          }
        });
        setCustomerCount(customerCount);
        setManagerCount(managerCount);
      } catch (error) {
        console.error('Error fetching user roles: ', error);
      }
    };

    const fetchRestaurantNames = async () => {
      try {
        const restaurantRequestsRef = collection(db, 'restaurantRequests');
        const querySnapshot = await getDocs(restaurantRequestsRef);
        const names = {};
        querySnapshot.forEach(doc => {
          const data = doc.data();
          names[data.uid] = { name: data.restaurantName, uid: data.uid }; 
        });
        setRestaurantNames(names);
      } catch (error) {
        console.error('Error fetching restaurant names: ', error);
      }
    };

    fetchOrders();
    fetchUserCount();
    fetchUserRoles();
    fetchRestaurantNames();
  }, [db]);

  const drawChart = (revenue, profit) => {
    const ctx = revenueChartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Tổng doanh thu", "Tổng lợi nhuận"],
        datasets: [{
          label: 'VND',
          data: [revenue, profit],
          backgroundColor: ['blue', 'orange']
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        barPercentage: 0.3 // Điều chỉnh kích thước của cột
      }
    });
  };

  return (
    <div className="h-fit rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 text-white p-8">
      <h1 className="w-fit mx-auto text-4xl font-bold text-white mb-6">Báo cáo số người dùng, doanh thu và lợi nhuận của ứng dụng <span className="text-blue-300">CAPYBARA</span> </h1>
      <div className="flex justify-around">
        <div className="flex flex-col my-auto h-fit">
            <p className="text-white font-bold text-xl mb-2">Số người dùng: {userCount}</p>
            <p className="text-white font-bold text-xl mb-2">Số khách hàng: {customerCount}</p>
            <p className="text-white font-bold text-xl mb-2">Số nhà hàng: {managerCount}</p>
            <p className="text-white font-bold text-xl mb-2">Tổng doanh thu: {totalRevenue.toLocaleString()} VND</p>
            <p className="text-white font-bold text-xl mb-2">Tổng lợi nhuận: {totalProfit.toLocaleString()} VND</p>
            <p className="text-white font-bold text-xl mb-2">Phần trăm lợi nhuận: {profitPercentage}%</p>
        </div>
        <div className="w-2/3 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl text-white">
          <canvas ref={revenueChartRef}></canvas>
        </div>
      </div>
      <h2 className="text-white text-xl font-semibold mt-4 mb-2">Danh sách đơn hàng</h2>
      <table className="w-full border-spacing-2 rounded-2xl overflow-hidden border">
        <thead>
          <tr>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">STT</th>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">ID Đơn hàng</th>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Nhà hàng</th>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Doanh thu</th>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-orange-100'} text-orange-700 border`}>
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{order.idOrder}</td>
              <td className="px-4 py-2 border">{restaurantNames[order.uidRes]?.name}</td>
              <td className="px-4 py-2 border">{order.totalPrice - 25000} VND</td>
              <td className="px-4 py-2 border">
                {order.cartItems.reduce((acc, item) => acc + ((item.price - item.cost) * item.qty), 0)} VND
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Thêm bảng thống kê mới */}
      <div className="mt-8">
        <h2 className="text-white text-xl font-semibold mb-2">Thống kê doanh thu, lợi nhuận của từng nhà hàng</h2>
        <table className="w-full border-spacing-2 rounded-2xl overflow-hidden border">
          <thead>
            <tr>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">STT</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">UID Nhà hàng</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Nhà hàng</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Tổng doanh thu</th>
              <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Tổng lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(restaurantStats).map(([restaurantId, stats], index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-orange-100'} text-orange-700 border`}>
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{restaurantNames[restaurantId]?.uid}</td>
                <td className="px-4 py-2 border">{restaurantNames[restaurantId]?.name}</td>
                <td className="px-4 py-2 border">{stats.revenue.toLocaleString()} VND</td>
                <td className="px-4 py-2 border">{stats.profit.toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReport;
