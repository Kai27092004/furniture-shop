import React from 'react';

const NewsPage = () => {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                Tin Tức & Xu Hướng
            </h1>
            <p className="text-center text-gray-600">
                Cập nhật những tin tức mới nhất, mẹo trang trí và các xu hướng nội thất đang thịnh hành.
            </p>
            {/* Sau này, bạn có thể thêm danh sách các bài viết tin tức ở đây */}
        </div>
    );
};

export default NewsPage;