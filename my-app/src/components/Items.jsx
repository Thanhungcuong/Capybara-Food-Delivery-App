import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytesResumable, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../firebase.config";
import { useStateValue } from "../context/StateProvider";

const Items = ({ userUid }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [{ foodItems: allFoodItems }, dispatch] = useStateValue();
  const [editItem, setEditItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newImageURL, setNewImageURL] = useState("");

  useEffect(() => {
    setFoodItems(allFoodItems);
  }, [allFoodItems]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, "foodItems", id));
      const updatedFoodItems = foodItems.filter((item) => item.id !== id);
      setFoodItems(updatedFoodItems);
      dispatch({
        type: "SET_FOOD_ITEMS",
        foodItems: updatedFoodItems,
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const confirmDelete = (id, imageURL) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa món ăn này?");
    if (confirm) {
      handleDelete(id, imageURL);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setSelectedCategory(item.category);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const editedItem = { ...editItem, category: selectedCategory };
  
      const itemRef = doc(firestore, "foodItems", editedItem.id);
      await updateDoc(itemRef, editedItem);
  
      if (editedItem.imageURL.startsWith("data:image")) {
        const file = await fetch(editedItem.imageURL);
        const blob = await file.blob();
        const storageRef = ref(storage, `Images/${editedItem.id}`);
        await uploadBytes(storageRef, blob);
        const imageURL = await ref(storageRef).getDownloadURL();
        await updateDoc(itemRef, { imageURL });
      }
  
      setEditItem(null); 
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditItem({ ...editItem, imageURL: reader.result });
    };
    reader.readAsDataURL(file);
  };
  

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case "com":
        return "Cơm";
      case "hoa qua":
        return "Hoa quả";
      case "douong":
        return "Đồ uống";
      case "bun-pho":
        return "Bún/Phở";
      case "thit-ca":
        return "Thịt/Cá";
      case "kem":
        return "Kem";
      default:
        return "";
    }
  };

  return (
    <div className="h-max rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 text-white p-8">
      <h1 className="w-fit mx-auto text-4xl font-bold text-white mb-6">
        Danh sách món ăn
      </h1>
      {uploadSuccess && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full p-2 rounded-lg text-center text-lg font-semibold bg-emerald-400 text-emerald-800"
        >
          Hình ảnh đã được tải lên thành công 😊
        </motion.p>
      )}
      <table className="table-fixed w-full border-spacing-2 rounded-2xl overflow-hidden border">
        <thead>
          <tr>
            <th className="bg-orange-700 text-xl font-bold px-4 py-2 border">
              STT
            </th>
            <th className="bg-orange-700 text-xl font-bold px-4 py-2 border">
              Hình ảnh
            </th>
            <th className="bg-orange-700 text-xl font-bold px-4 py-2 border">
              Tiêu đề
            </th>
            <th className="bg-orange-700 text-xl font-bold px-4 py-2 border">
              Thể loại
            </th>
            <th className="bg-orange-700 text-xl font-bold px-4 py-2 border">
              Calories
            </th>
            <th className="bg-orange-700 text-xl font-bold px-4 py-2 border">
              Giá bán
            </th>
            <th className="bg-orange-700 text-xl font-bold px-4 py-2 border">
              Giá gốc
            </th>
            <th className="bg-orange-700 text-xl font-bold px-4 py-2 border">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {foodItems &&
            foodItems.map((item, index) => {
              if (item.uid === userUid) {
                const displayedIndex = foodItems
                  .slice(0, index + 1)
                  .filter((item) => item.uid === userUid).length;
                return (
                  <tr
                    key={item.id}
                    className={`
                    ${index % 2 === 0 ? "bg-white" : "bg-orange-100"}
                    text-orange-700 border
                `}
                  >
                    <td className="px-4 py-2 border">{displayedIndex}</td>
                    <td className="px-4 py-2 flex my-auto justify-center">
                      <img src={item.imageURL} alt={item.title} className="h-20 w-20" />
                    </td>
                    <td className="px-4 py-2 border">{item.title}</td>
                    <td className="px-4 py-2 border">{getCategoryDisplayName(item.category)}</td>
                    <td className="px-4 py-2 border">{item.calories}</td>
                    <td className="px-4 py-2 border">{item.price}</td>
                    <td className="px-4 py-2 border">{item.cost}</td>
                    <td className="px-4 py-2  ">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirmDelete(item.id, item.imageURL)}
                        className="text-white bg-orange-400 p-2 rounded-xl w-20 hover:bg-orange-600 mr-1 "
                      >
                        Xóa
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(item)}
                        className="text-white bg-orange-400 p-2 rounded-xl w-24 hover:bg-orange-600 text-nowrap"
                      >
                        Chỉnh sửa
                      </motion.button>
                    </td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
        </tbody>
      </table>
      {editItem && showEditDialog && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50" onClick={() => setShowEditDialog(false)}>
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white p-8 rounded-lg relative" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-2 right-2 text-white text-xl hover:text-gray-300 focus:outline-none"
              onClick={() => setShowEditDialog(false)}
            >
              Đóng
            </button>
            <h2 className="text-2xl font-bold mb-2">Chỉnh sửa món ăn</h2>
            <div className="mb-2">
              <label className="block text-white font-bold mb-1">Tiêu đề:</label>
              <input
                type="text"
                defaultValue={editItem.title}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-orange-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-white font-bold mb-1">Thể loại:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-orange-500"
              >
                <option value="">Chọn thể loại</option>
                <option value="com">Cơm</option>
                <option value="hoa qua">Hoa quả</option>
                <option value="douong">Đồ uống</option>
                <option value="bun-pho">Bún/Phở</option>
                <option value="thit-ca">Thịt/Cá</option>
                <option value="kem">Kem</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-white font-bold mb-1">Calories:</label>
              <input
                type="number"
                defaultValue={editItem.calories}
                onChange={(e) => setEditItem({ ...editItem, calories: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-orange-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-white font-bold mb-1">Giá bán:</label>
              <input
                type="number"
                defaultValue={editItem.price}
                onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-orange-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-white font-bold mb-1">Giá gốc:</label>
              <input
                type="number"
                defaultValue={editItem.cost}
                onChange={(e) => setEditItem({ ...editItem, cost: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded text-orange-500"
              />
            </div>
            <div className="mb-2">
              <label className="block text-white font-bold mb-1">Hình ảnh:</label>
              <div className="relative">
                <img src={editItem.imageURL} alt={editItem.title} className="h-20 w-20 mb-2" />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="fileInput"
                  className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 cursor-pointer"
                >
                  Thay đổi ảnh
                </label>
              </div>
            </div>
            <button
              onClick={handleSaveEdit}
              className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;
