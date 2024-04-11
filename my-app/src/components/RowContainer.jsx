import React, { useEffect, useRef, useState } from "react";
import { MdShoppingBasket } from "react-icons/md";
import { motion } from "framer-motion";
import NotFound from "../img/NotFound.svg";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase.config";

const RowContainer = ({ flag, data, scrollValue }) => {
  const rowContainer = useRef();
  const [restaurants, setRestaurants] = useState({});
  const [{ cartItems }, dispatch] = useStateValue();

  const addtocart = (item) => {
    // Kiểm tra xem món mới có thuộc cùng một nhà hàng với các món khác trong giỏ hàng không
    if (cartItems.some(cartItem => cartItem.uid !== item.uid)) {
      alert("Bạn chỉ có thể đưa các món của 1 nhà hàng vào giỏ hàng");
      return;
    }

    // Thêm món vào giỏ hàng
    dispatch({
      type: actionType.SET_CARTITEMS,
      cartItems: [...cartItems, item],
    });
    localStorage.setItem("cartItems", JSON.stringify([...cartItems, item]));
  };

  useEffect(() => {
    const fetchRestaurantNames = async () => {
      const restaurantIds = data.map((item) => item.uid);
      const restaurantNames = {};
      for (const id of restaurantIds) {
        const q = query(collection(firestore, "restaurantRequests"), where("uid", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          restaurantNames[id] = doc.data().restaurantName;
        });
      }
      setRestaurants(restaurantNames);
    };

    if (data) {
      fetchRestaurantNames();
    }
  }, [data]);

  return (
    <div
      ref={rowContainer}
      className={`w-full flex items-center gap-3  my-12 scroll-smooth  ${
        flag
          ? "overflow-x-scroll scrollbar-none"
          : "overflow-x-hidden flex-wrap justify-center"
      }`}
    >
      {data && data.length > 0 ? (
        data.map((item) => (
          <div
            key={item?.id}
            className="w-275 h-[220px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-cardOverlay rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src={item?.imageURL}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md -mt-8"
                onClick={() => addtocart(item)}
              >
                <MdShoppingBasket className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8">
              <p className="text-textColor font-semibold text-base md:text-lg">
                {item?.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {item?.calories} Calo
              </p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-orange-500">VND</span> {item?.price}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500">Nhà hàng: {restaurants[item.uid]}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <img src={NotFound} className="h-340" />
          <p className="text-xl text-headingColor font-semibold my-2">
            Đang tải món ăn, xin chờ chút!!!
          </p>
        </div>
      )}
    </div>
  );
};

export default RowContainer;
