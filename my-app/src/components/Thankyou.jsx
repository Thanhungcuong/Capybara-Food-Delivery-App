import img from '../img/Capybara-Thankyou.jpg'
import { Link, useNavigate } from "react-router-dom";
const Thankyou = () => {
    return (
        <main className='h-screen'>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto ">
        <h1 className="text-3xl font-bold text-center mb-6">Cảm ơn bạn đã mua hàng!</h1>
        <div className="flex justify-center mb-6">
            <img src={img} alt="Capybara" className=""/>
        </div>
        <p className="text-lg text-center">Chúng tôi rất vui vì bạn đã chọn sản phẩm của chúng tôi. Hãy tiếp tục ủng hộ chúng tôi!</p>
        <div className="flex justify-center mt-8">
            <a href="/" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600">Quay lại trang chủ</a>
        </div>
    </div>
        </main>
    );
};

export default Thankyou;