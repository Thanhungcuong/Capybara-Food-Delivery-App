import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CheckOutSuccess, CreateContainer, Header, MainContainer, Thankyou, Order, AdminRole, Admin, Restaurant, TobeRestaurant, ListTobeRestaurant} from "./components";
import { useStateValue } from "./context/StateProvider";
import { getAllFoodItems } from "./utils/firebaseFunctions";
import { actionType } from "./context/reducer";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const App = () => {
  const [{ foodItems, user }, dispatch] = useStateValue();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const db = getFirestore();

  const fetchData = async () => {
    await getAllFoodItems().then((data) => {
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data,
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userUid = user.uid;
        const userRolesRef = collection(db, "userRoles"); // Sử dụng biến db ở đây
        const querySnapshot = await getDocs(query(userRolesRef, where("uid", "==", userUid)));
        if (!querySnapshot.empty) {
          let role = null;
          querySnapshot.forEach((doc) => {
            role = doc.data().role;
            console.log("User role:", role); // In ra vai trò của người dùng
          });
          setUserRole(role); // Cập nhật vai trò của người dùng
        }
      }
    };

    fetchUserRole();
  }, [user, db]); // Thêm biến db vào dependency array

  useEffect(() => {
    // Kiểm tra vai trò của người dùng và đặt isAdmin
    setIsAdmin(userRole === 'admin');
  }, [userRole]);

  return (
    <AnimatePresence exitBeforeEnter>
      <div className="w-screen h-auto flex flex-col bg-primary">
        <Header />

        <main className="mt-14 md:mt-20 px-4 md:px-16 py-4 w-full">
          <Routes>
            {isAdmin ? (
              <Route path="/" element={<Admin />} />
            ) : (
              <Route path="/*" element={<MainContainer />} />
            )}
             {userRole === 'manager' && <Route path="/createItem" element={<CreateContainer />} />}
             {userRole === 'customer' && (
              <>
                <Route path="/" element={<MainContainer />} />
                <Route path="/checkout-success" element={<CheckOutSuccess />} />
                <Route path="/ThankYou" element={<Thankyou />} />
                <Route path="/TobeRestaurant" element={<TobeRestaurant userUid={user ? user.uid : null} />} />
              </>
            )}
            <Route path="/Order" element={<Order />} />
            {isAdmin && <Route path="/AdminRole" element={<AdminRole />} />}
            {isAdmin && <Route path="/ListTobeRestaurant" element={<ListTobeRestaurant />} />}
            {userRole === 'manager' && <Route path="/" element={<Restaurant />} />}
          </Routes>
        </main>
      </div>
    </AnimatePresence>
  );
};

export default App;
