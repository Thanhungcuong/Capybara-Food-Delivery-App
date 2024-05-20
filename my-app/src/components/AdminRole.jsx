import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';
import { useStateValue } from '../context/StateProvider';

const AdminRole = () => {
    const db = getFirestore();
    const auth = getAuth(); // Thêm Firebase Auth
    const [{ user }] = useStateValue();
    const [userList, setUserList] = useState([]);
    
    const fetchUserList = async () => {
        const usersRef = collection(db, 'userRoles');
        const querySnapshot = await getDocs(usersRef);
        const users = [];
        querySnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        setUserList(users);
    };

    useEffect(() => {
        fetchUserList(); 
    }, [db]);

    const handleRoleChange = async (userId, newRole) => {
        const userRef = doc(db, 'userRoles', userId);
        await setDoc(userRef, { role: newRole }, { merge: true });
        fetchUserList(); 
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Quản trị viên chắc chắn muốn xóa tài khoản này khỏi ứng dụng không?");
        if (confirmDelete) {
            try {
                // Xóa người dùng khỏi Firestore
                await deleteDoc(doc(db, 'userRoles', userId));
                fetchUserList();
                // Lấy người dùng từ Firebase Authentication
                const userRef = await auth.getUser(userId);
                
                // Xóa người dùng khỏi Firebase Authentication
                await deleteUser(userRef);
                
                
            } catch (error) {
                console.error("Error removing user: ", error);
            }
        }
    };

    return (
        <div className='h-screen rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 text-white p-8'>
            <h1 className='w-fit mx-auto text-4xl font-bold text-white mb-6'>Danh sách tài khoản và phân quyền dành cho quản trị viên</h1>
            <table className='table-fixed w-full border-spacing-2 rounded-2xl overflow-hidden border'>
                <thead>
                    <tr>
                        <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>STT</th>
                        <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Email</th>
                        <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>UID</th>
                        <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Vai trò</th>
                        <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Thay đổi vai trò</th>
                        <th className='bg-orange-700 text-white text-xl font-bold px-4 py-2 border'>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user, index) => (
                        <tr key={user.id} className={`
                            ${index % 2 === 0 ? 'bg-white' : 'bg-orange-100'}
                            text-orange-700 border
                        `}>
                            <td className='px-4 py-2 border'>{index + 1}</td>
                            <td className='px-4 py-2 border'>{user.gmail}</td>
                            <td className='px-4 py-2 border'>{user.uid}</td>
                            <td className='px-4 py-2 border'>{user.role}</td>
                            <td className='px-4 py-2 border'>
                                <select
                                    className='bg-transparent'
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    value={user.role}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td className='px-4 py-2 border flex justify-center'>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded'
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminRole;
