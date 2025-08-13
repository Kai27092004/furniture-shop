import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
    return (
        // <-- CHÚ THÍCH: ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT
        // 3 class này phối hợp để tạo ra layout "sticky footer".
        <div className="flex flex-col min-h-screen"> 
            <Navbar />
            
            {/* <-- CHÚ THÍCH: Thẻ <main> được thêm class 'flex-grow' */}
            {/* Class này sẽ "bảo" phần nội dung chính hãy lớn lên và chiếm hết không gian thừa ở giữa Navbar và Footer. */}
            <main >
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
};

export default MainLayout;