import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, query, where, getFirestore } from 'firebase/firestore'; // Thêm import này
import { useStateValue } from '../context/StateProvider';
import { useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const [{ cartItems, user }] = useStateValue();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: ''
  });

  const [restaurantInfo, setRestaurantInfo] = useState(null);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      const uniqueUid = cartItems.length > 0 ? cartItems[0].uid : null;
      if (!uniqueUid) return;

      const db = getFirestore();
      const restaurantQuery = query(collection(db, 'restaurantRequests'), where('uid', '==', uniqueUid));
      const snapshot = await getDocs(restaurantQuery);
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          setRestaurantInfo(doc.data());
        });
      }
    };

    if (user) {
      fetchRestaurantInfo();
    }
  }, [cartItems, user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const uniqueUid = cartItems.length > 0 ? cartItems[0].uid : null;
    if (formData.name && formData.phone && formData.email && formData.address && formData.message) {
      const db = getFirestore();
      const ordersRef = doc(collection(db, 'orders'), Date.now().toString());
      await setDoc(ordersRef, {
        idOrder: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        message: formData.message,
        cartItems: cartItems,
        totalPrice: getTotalPrice(cartItems),
        status: 'Đang đặt hàng',
        userId: user.uid,
        uidRes: uniqueUid,
      });

      navigate('/ThankYou');
    } else {
      alert('Vui lòng điền đầy đủ thông tin');
    }
  };

  const getTotalPrice = (cartItems) => {
    const ship = 25000;
    let totalPrice = 0;
    let preship = 0;
    cartItems.forEach(item => {
      preship += item.price * item.qty;
    });
    totalPrice = preship + ship;
    return totalPrice;
  };

  return (
    <main className="w-screen min-h-screen items-center justify-center">
       <h1 className="text-6xl text-orange-600 w-fit mx-auto">Thanh toán</h1>
       <h2 className="text-3xl text-orange-600 font-bold mb-4 ">Hướng dẫn thanh toán</h2>
          <p className="text-orange-600 text-base font-normal">Bạn hãy liên hệ với nhà hàng theo số điện thoại hoặc zalo dưới phần thông tin nhà hàng và chuyển khoản vào số tài khoản với tổng giá tiền ở trên </p>
          <p className="text-orange-600 text-base font-normal">Bạn có thể ấn vào "Đơn hàng" trên thanh menu để theo dõi trạng thái đơn hàng của mình</p>
      <div className="flex justify-center mx-auto w-[80%] rounded-2xl overflow-hidden divide-x divide-gray-400 mt-10">
        <div className="w-1/2 bg-gradient-to-r from-orange-300 to-orange-500">
          <h2 className="text-3xl font-bold mx-auto w-fit text-white p-3 border-b-2 border-black">Đơn hàng</h2>
          <ul className="flex flex-col gap-5 divide-y divide-gray-400">
            {cartItems.map((item, index) => (
              <li className="items-center pl-10 flex gap-3" key={index}>
                <span className="size-[10rem]">
                  <img src={item.imageURL} alt={item.title} />
                </span>
                <div className="my-auto">
                  <h3 className="font-bold text-2xl">{item.title}</h3>
                  <p>Số lượng: {item.qty}</p>
                  <p>Giá tiền: {item.price} <span className="text-lg ml-2 text-white">VND</span></p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t-2 border-black flex py-4 flex-col">
            <p className="w-fit mx-auto"> Tiền vận chuyển: 25000 <span className="text-lg ml-2 text-white">VND</span></p>
            <p className="w-fit mx-auto font-bold text-white ">Tổng giá tiền:  <span className="ml-2 text-2xl font-bold">{getTotalPrice(cartItems)} VND</span></p>
          </div>
        </div>
        <div className="w-1/2 bg-gradient-to-l from-orange-300 to-orange-500 flex flex-col ">
          
          <div>
            <h1 className="text-3xl text-white p-3 w-fit font-bold mx-auto border-b-2 border-black">Thông tin thanh toán</h1>
          </div>
          <div className="bg-white w-[80%] mx-auto my-8 rounded-2xl ">
            <form action="" className="flex flex-col gap-5 py-10" onSubmit={handleSubmit}>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="placeholder-black bg-orange-300 rounded-lg focus:shadow-none border-none mx-auto w-10/12 p-4"
                placeholder="   Họ và tên (*)"
                title="Vui lòng nhập họ và tên của bạn"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="placeholder-black bg-orange-300 rounded-lg focus:shadow-none border-none mx-auto w-10/12 p-4"
                placeholder="   Số điện thoại (*)"
                pattern="[0-9]{10,12}"
                title="Số điện thoại từ 10 đến 12 chữ số"
              />
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                name="email"
                className="placeholder-black bg-orange-300 rounded-lg focus:shadow-none border-none mx-auto w-10/12 p-4"
                placeholder="   E-mail của bạn..."
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                title="Vui lòng nhập một địa chỉ email hợp lệ dạng : user@example.com"
              />
              <input
                type="text"
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="placeholder-black bg-orange-300 rounded-lg focus:shadow-none border-none mx-auto w-10/12 p-4"
                placeholder="   Địa chỉ (*)"
                title="Vui lòng nhập địa chỉ của bạn"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="3"
                className="noidung placeholder-black bg-orange-300 rounded-lg focus:shadow-none border-none mx-auto w-10/12 p-4"
                placeholder="   Ghi chú..."
              ></textarea>
              <div className="h-[5rem]">
                <div className="flex justify-center items-center">
                  <button type="submit" className=" bg-gradient-to-br from-orange-400 to-orange-600 hover:bg-gradient-to-br hover:from-orange-600 hover:to-orange-400 rounded-full overflow-hidden max-xl:w-[13rem] flex justify-center items-center text-white xl:w-48 h-10 shadow-lg shadow-orange-500/40 hover:text-black">
                    <div className="pr-3 max-xl:ml-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="group-hover:stroke-orange-500"
                      >
                        <path
                          d="M12.25 2H11.15C10.82 0.85 9.76 0 8.5 0C7.24 0 6.18 0.85 5.85 2H4.75C4.34 2 4 2.34 4 2.75V4.25C4 5.21 4.79 6 5.75 6H11.25C12.21 6 13 5.21 13 4.25V2.75C13 2.34 12.66 2 12.25 2Z"
                          fill="white"
                        />
                        <path
                          d="M14.25 3H14V4.25C14 5.77 12.77 7 11.25 7H5.75C4.23 7 3 5.77 3 4.25V3H2.75C1.23 3 0 4.23 0 5.75V18.25C0 19.77 1.23 21 2.75 21H10.13L10.35 19.77C10.45 19.21 10.71 18.71 11.11 18.3L11.91 17.5H3.75C3.34 17.5 3 17.16 3 16.75C3 16.34 3.34 16 3.75 16H13.25C13.3 16 13.34 16 13.39 16.02H13.4L17 12.42V5.75C17 4.23 15.77 3 14.25 3ZM13.25 14.25H3.75C3.34 14.25 3 13.91 3 13.5C3 13.09 3.34 12.75 3.75 12.75H13.25C13.66 12.75 14 13.09 14 13.5C14 13.91 13.66 14.25 13.25 14.25ZM13.25 11H3.75C3.34 11 3 10.66 3 10.25C3 9.84 3.34 9.5 3.75 9.5H13.25C13.66 9.5 14 9.84 14 10.25C14 10.66 13.66 11 13.25 11Z"
                          fill="white"
                        />
                        <path
                          d="M12.527 24C12.33 24 12.138 23.922 11.997 23.78C11.824 23.607 11.746 23.361 11.789 23.119L12.319 20.114C12.345 19.963 12.419 19.823 12.527 19.714L19.952 12.29C20.864 11.376 21.76 11.623 22.25 12.113L23.487 13.35C24.17 14.032 24.17 15.142 23.487 15.825L16.062 23.25C15.954 23.359 15.814 23.432 15.662 23.458L12.657 23.988C12.614 23.996 12.57 24 12.527 24ZM15.532 22.72H15.542H15.532Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <span
                      className="font-Lato text-16 font-bold leading-19 transition-all duration-500 ease-linear"
                    >
                      Mua hàng
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {restaurantInfo && (
        <div className="bg-gradient-to-tl from-orange-300 to-orange-500 w-[80%] mx-auto my-auto rounded-2xl p-6 mt-6">
          <div className="">
          <h2 className="text-3xl font-bold mb-4 text-white">Thông tin nhà hàng</h2>
          <p className="text-white text-xl font-bold">Tên nhà hàng: {restaurantInfo.restaurantName}</p>
          <p className="text-white text-xl font-bold">Họ và tên: {restaurantInfo.name}</p>
          <p className="text-white text-xl font-bold">Số điện thoại: {restaurantInfo.phone}</p>
          <p className="text-white text-xl font-bold">Zalo: {restaurantInfo.zalo}</p>
          <p className="text-white text-xl font-bold">STK: {restaurantInfo.paymentMethod}</p>
        </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutSuccess;
