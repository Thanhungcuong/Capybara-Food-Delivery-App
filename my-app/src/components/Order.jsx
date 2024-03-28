import React from "react";

const Order = ({ formData, cartItems }) => {
  return (
    <div>
      <h2>Thông tin đơn hàng</h2>
      <h3>Thông tin khách hàng:</h3>
      {formData && (
        <div>
          <p>Họ và tên: {formData.name}</p>
          <p>Số điện thoại: {formData.phone}</p>
          <p>Email: {formData.email}</p>
          <p>Địa chỉ: {formData.address}</p>
          <p>Ghi chú: {formData.message}</p>
        </div>
      )}

      <h3>Chi tiết đơn hàng:</h3>
      <ul>
        {cartItems && cartItems.map((item, index) => (
          <li key={index}>
            <p>Tên sản phẩm: {item.title}</p>
            <p>Số lượng: {item.qty}</p>
            <p>Giá tiền: {item.price} VND</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Order;
