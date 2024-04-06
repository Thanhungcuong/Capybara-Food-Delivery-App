import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { firestore } from "../firebase.config";

const ListTobeRestaurant = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsRef = collection(firestore, 'restaurantRequests');
        const data = await getDocs(requestsRef);
        const requestsList = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(requestsList);
      } catch (error) {
        console.error('Error fetching restaurant requests: ', error);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus, uid) => {
    try {
      // Update the document on Firestore
      const requestRef = doc(firestore, 'restaurantRequests', id);
      await updateDoc(requestRef, { status: newStatus });
      console.log('Document successfully updated!');

      // Update the user role in userRoles collection only when status is "Chấp nhận"
      if (newStatus === 'Chấp nhận') {
        const userRolesRef = collection(firestore, 'userRoles');
        const userQuery = query(userRolesRef, where("uid", "==", uid));
        const userQuerySnapshot = await getDocs(userQuery);
        userQuerySnapshot.forEach(async (userDoc) => {
          const userDocRef = doc(userRolesRef, userDoc.id);
          await updateDoc(userDocRef, { role: 'manager' });
          console.log('User role successfully updated!');
        });
      }

      // Update the status directly in the state
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-2xl p-8">
      <h1 className="text-4xl font-bold py-8 w-fit mx-auto">Danh sách đơn đăng ký làm chủ nhà hàng</h1>
      <table className='table-fixed w-full border-spacing-2 rounded-2xl overflow-hidden border'>
        <thead>
          <tr>
            <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Họ và tên</th>
            <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Số điện thoại</th>
            <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Email</th>
            <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Tên nhà hàng</th>
            <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Địa chỉ</th>
            <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Ghi chú</th>
            <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Trạng thái</th> {/* Thêm cột Trạng thái */}
            <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Hành động</th> {/* Thêm cột Hành động */}
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id} className='bg-white text-orange-700 border'>
              <td className='px-4 py-2 border'>{request.name}</td>
              <td className='px-4 py-2 border'>{request.phone}</td>
              <td className='px-4 py-2 border'>{request.email}</td>
              <td className='px-4 py-2 border'>{request.restaurantName}</td>
              <td className='px-4 py-2 border'>{request.address}</td>
              <td className='px-4 py-2 border'>{request.message}</td>
              <td className='px-4 py-2 border'>{request.status}</td> {/* Hiển thị trạng thái từ Firestore */}
              <td className='px-4 py-2 border'>
                <button className="bg-orange-400 mr-2 hover:bg-orange-500 py-1 px-3 rounded" onClick={() => handleStatusChange(request.id, 'Chấp nhận', request.uid)}>
                  Chấp nhận
                </button>
                <button className="bg-orange-400 hover:bg-orange-500 py-1 px-3 rounded" onClick={() => handleStatusChange(request.id, 'Từ chối', request.uid)}>
                  Từ chối
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListTobeRestaurant;
