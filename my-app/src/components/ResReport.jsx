import React, { useEffect, useState, useRef } from "react";
import { collection, query, getDocs, where, getFirestore } from 'firebase/firestore';
import Chart from 'chart.js/auto';

const ResReport = ({ userUid }) => {
  const db = getFirestore();
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const revenueChartRef = useRef(null);
  const profitChartRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const ordersQuery = query(ordersRef, where("uidRes", "==", userUid), where("status", "==", "Hoàn thành"));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => doc.data());
        setOrders(ordersData);

        // Tính tổng doanh thu và lợi nhuận
        let revenue = 0;
        let profit = 0;
        ordersData.forEach(order => {
          revenue += order.totalPrice - 25000;
          order.cartItems.forEach(item => {
            profit += (item.price - item.cost) * item.qty;
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

        // Vẽ biểu đồ
        drawChart(revenue, profit);
      } catch (error) {
        
      }
    };

    fetchOrders();
  }, [db, userUid]);

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
      <h1 className="w-fit mx-auto text-4xl font-bold text-white mb-6">Báo cáo doanh thu và lợi nhuận</h1>
      <div className="flex justify-around">
        <div className=" flex flex-col my-auto h-fit">
        <p className="text-white font-bold text-xl mb-2">Tổng doanh thu: {totalRevenue.toLocaleString()} VND</p>
<p className="text-white font-bold text-xl mb-2">Tổng lợi nhuận: {totalProfit.toLocaleString()} VND</p>

        <p className="text-white font-bold text-xl mb-2">Phần trăm lợi nhuận: {profitPercentage}%</p>
            
      </div>
      <div className="w-2/3 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl text-white">
        <canvas ref={revenueChartRef} ></canvas>
      </div>
      
      </div>
      
      
      <h2 className="text-white text-xl font-semibold mt-4 mb-2">Danh sách đơn hàng</h2>
      <table className="w-full border-spacing-2 rounded-2xl overflow-hidden border">
        <thead>
          <tr>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">STT</th>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">ID Đơn hàng</th>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Doanh thu</th>
            <th className="bg-orange-700 text-white text-xl font-bold px-4 py-2 border">Lợi nhuận</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-orange-100'} text-orange-700 border`}>
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{order.idOrder}</td>
              <td className="px-4 py-2 border">{order.totalPrice - 25000} VND</td>
              <td className="px-4 py-2 border">
                {/* Tính lợi nhuận cho đơn hàng */}
                {order.cartItems.reduce((acc, item) => acc + ((item.price - item.cost) * item.qty), 0)} VND
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResReport;
