import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, setDoc, doc } from 'firebase/firestore';
import { useStateValue } from '../context/StateProvider';

const AdminRole = () => {
    const db = getFirestore();
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

    return (
        <div className='h-screen'> 
            <h1 className='w-fit mx-auto text-4xl font-bold text-orange-600 mb-6'>Danh sách tài khoản và phân quyền danh cho quản trị viên</h1>
            <table className='table-fixed w-full border-spacing-2 border-black border text-center'>
                <thead>
                    <tr>
                        <th className=' border-black border text-orange-600 text-xl font-bold'>STT</th>
                        <th className=' border-black border text-orange-600 text-xl font-bold'>Email</th>
                        <th className=' border-black border text-orange-600 text-xl font-bold'>UID</th>
                        <th className=' border-black border text-orange-600 text-xl font-bold'>Vai trò</th>
                        <th className=' border-black border text-orange-600 text-xl font-bold'>Thay đổi vai trò</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user, index) => (
                        <tr className='odd:bg-orange-400 even:bg-white' key={user.id}>
                            <td className='border-black border'>{index + 1}</td>
                            <td className='border-black border'>{user.gmail}</td>
                            <td className='border-black border'>{user.uid}</td>
                            <td className='border-black border'>{user.role}</td>
                            <td className='border-black border'>
                                <select className='bg-transparent' onChange={(e) => handleRoleChange(user.id, e.target.value)} value={user.role}>
                                    <option value="customer">Customer</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminRole;
