-- BƯỚC 1: TẠO CƠ SỞ DỮ LIỆU (SCHEMA) NẾU CHƯA TỒN TẠI
-- Sử dụng collation utf8mb4_unicode_ci để hỗ trợ tiếng Việt và các ký tự đặc biệt tốt nhất.
DROP DATABASE IF EXISTS furniture_db;
CREATE DATABASE IF NOT EXISTS furniture_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- BƯỚC 2: CHỌN CƠ SỞ DỮ LIỆU VỪA TẠO ĐỂ LÀM VIỆC
USE furniture_db;

-- BƯỚC 3: TẠO CÁC BẢNG

-- Bảng `Users`: Lưu trữ thông tin người dùng và phân quyền
-- `role` ENUM('customer', 'admin') giúp phân biệt khách hàng và quản trị viên.
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Sẽ lưu mật khẩu đã được mã hóa (hashed)
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- Bảng `Categories`: Lưu trữ danh mục sản phẩm (ví dụ: Bàn, Ghế, Tủ, Giường...)
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    imageUrl VARCHAR(255) NULL, -- URL hình ảnh đại diện cho danh mục
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- Bảng `Products`: Lưu trữ thông tin chi tiết của từng sản phẩm nội thất
-- `price` sử dụng DECIMAL để đảm bảo tính chính xác cho tiền tệ.
-- `sku` (Stock Keeping Unit) là mã định danh sản phẩm trong kho.
-- `categoryId` là khóa ngoại, liên kết sản phẩm với một danh mục.
-- ON DELETE SET NULL: Nếu một danh mục bị xóa, sản phẩm vẫn tồn tại nhưng không thuộc danh mục nào.
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stockQuantity INT NOT NULL DEFAULT 0,
    imageUrl VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NULL, -- Mã sản phẩm (ví dụ: BAN-GO-001)
    dimensions VARCHAR(255) NULL, -- Kích thước (ví dụ: "120cm x 60cm x 75cm")
    material VARCHAR(255) NULL, -- Chất liệu (ví dụ: "Gỗ sồi, Kim loại")
    categoryId INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- Bảng `Orders`: Lưu trữ thông tin về mỗi đơn hàng của khách
-- `userId` liên kết đơn hàng với người dùng đã đặt. ON DELETE CASCADE: Nếu user bị xóa, các đơn hàng của họ cũng sẽ bị xóa.
-- `shippingAddress` lưu lại địa chỉ tại thời điểm đặt hàng để đảm bảo thông tin không bị thay đổi nếu user cập nhật địa chỉ sau này.
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    totalAmount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    shippingAddress TEXT NOT NULL,
    customerNotes TEXT NULL, -- Ghi chú của khách hàng khi đặt hàng
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- Bảng `OrderItems`: Bảng trung gian, lưu thông tin chi tiết các sản phẩm trong một đơn hàng
-- `orderId` và `productId` là các khóa ngoại.
-- `price` lưu lại giá sản phẩm tại thời điểm mua hàng, tránh ảnh hưởng bởi việc thay đổi giá trong tương lai.
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Giá của sản phẩm tại thời điểm đặt hàng
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- BƯỚC 1: THÊM DỮ LIỆU CHO BẢNG `Users`
-- Tạo 1 tài khoản Admin và 9 tài khoản khách hàng.
-- Mật khẩu đã được mã hóa bằng bcrypt, tương ứng với 'admin123' và 'user123'.
INSERT INTO `Users` (`fullName`, `email`, `password`, `phone`, `address`, `role`) VALUES
-- 1. TÀI KHOẢN ADMIN
('Quản Trị Viên', 'admin@noithat.com', '$2a$12$78cga50NK6qxk35cpjwlKetU9VJvTUpI0UhfinwAQdSUH/QyO3itO', '0987654321', '123 Đường Admin, Quận 1, TP.HCM', 'admin'),
('Nguyễn Văn An', 'nguyen.an@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0912345678', '111 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội', 'customer'),
('Trần Thị Bích', 'tran.bich@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0923456789', '222 Lê Lợi, Quận Hải Châu, Đà Nẵng', 'customer'),
('Lê Minh Cường', 'le.cuong@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0934567890', '333 Trần Hưng Đạo, Quận 5, TP.HCM', 'customer'),
('Phạm Thị Dung', 'pham.dung@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0945678901', '444 Võ Văn Tần, Quận 3, TP.HCM', 'customer'),
('Hoàng Văn Em', 'hoang.em@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0956789012', '555 Cầu Giấy, Quận Cầu Giấy, Hà Nội', 'customer'),
('Võ Thị Giang', 'vo.giang@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0967890123', '666 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', 'customer'),
('Đỗ Minh Hải', 'do.hai@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0978901234', '777 Lý Thường Kiệt, Quận Tân Bình, TP.HCM', 'customer'),
('Bùi Thị Hạnh', 'bui.hanh@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0989012345', '888 Hùng Vương, Quận 6, TP.HCM', 'customer'),
('Phan Văn Kiên', 'phan.kien@email.com', '$2a$12$9NpdokzqzT5hBOCKYsfUNeCraPB.qJAM/SnC1iUhNb5WU.1tyX2Aq', '0901234567', '999 Quang Trung, Quận Gò Vấp, TP.HCM', 'customer');
-- BƯỚC 2: THÊM DỮ LIỆU CHO BẢNG `Categories`
-- Tạo ra 4 danh mục chính cho cửa hàng nội thất.
INSERT INTO `Categories` (`id`, `name`, `description`, `imageUrl`) VALUES
(1, 'Bàn', 'Các loại bàn ăn, bàn làm việc, bàn cà phê với thiết kế đa dạng.', 'https://placehold.co/600x400/E2D5C9/403227?text=Bàn'),
(2, 'Ghế', 'Ghế ăn, ghế văn phòng, ghế thư giãn, ghế bar tiện nghi và phong cách.', 'https://placehold.co/600x400/E2D5C9/403227?text=Ghế'),
(3, 'Tủ và Kệ', 'Giải pháp lưu trữ thông minh với tủ quần áo, kệ sách, kệ trang trí.', 'https://placehold.co/600x400/E2D5C9/403227?text=Tủ+Kệ'),
(4, 'Giường', 'Những mẫu giường ngủ êm ái, mang lại giấc ngủ ngon và tô điểm cho phòng ngủ.', 'https://placehold.co/600x400/E2D5C9/403227?text=Giường'),
(5, 'Sofa', 'Sofa băng, sofa góc cho phòng khách thêm sang trọng và ấm cúng.', 'https://placehold.co/600x400/E2D5C9/403227?text=Sofa');


-- BƯỚC 3: THÊM DỮ LIỆU CHO BẢNG `Products`
-- Tạo ra các sản phẩm mẫu thuộc các danh mục đã có.
-- `categoryId` sẽ tương ứng với `id` của các danh mục ở trên.
INSERT INTO `Products` (`name`, `description`, `price`, `stockQuantity`, `imageUrl`, `sku`, `dimensions`, `material`, `categoryId`) VALUES
('Bàn Ăn Gỗ Sồi 4 Chỗ Hiện Đại', 'Bàn ăn làm từ gỗ sồi tự nhiên, thiết kế tối giản theo phong cách Bắc Âu. Bề mặt được xử lý chống thấm, chống trầy xước, dễ dàng vệ sinh. Chân bàn chắc chắn, chịu lực tốt.', 4500000.00, 15, 'https://placehold.co/600x400/A89F91/FFFFFF?text=Bàn+Sồi', 'BAN-SOI-001', '120cm x 75cm x 75cm', 'Gỗ sồi tự nhiên', 1),
('Ghế Ăn Bọc Nệm Da PU Chân Sắt', 'Ghế ăn có thiết kế thanh lịch, lưng ghế bo cong tạo cảm giác thoải mái. Nệm bọc da PU cao cấp, không bong tróc. Khung chân sắt sơn tĩnh điện, bền bỉ và vững chãi.', 750000.00, 40, 'https://placehold.co/600x400/A89F91/FFFFFF?text=Ghế+Da', 'GHE-DA-001', '45cm x 50cm x 85cm', 'Da PU, Sắt sơn tĩnh điện', 2),
('Kệ Sách 5 Tầng Gỗ Công Nghiệp', 'Kệ sách đứng với 5 tầng lưu trữ rộng rãi, phù hợp cho phòng khách hoặc phòng làm việc. Chất liệu gỗ công nghiệp MDF phủ melamine chống ẩm, màu sắc vân gỗ tự nhiên.', 1200000.00, 25, 'https://placehold.co/600x400/A89F91/FFFFFF?text=Kệ+Sách', 'KE-MDF-001', '80cm x 30cm x 180cm', 'Gỗ MDF phủ Melamine', 3),
('Sofa Băng 3 Chỗ Vải Nỉ Cao Cấp', 'Mẫu sofa băng hiện đại, bọc vải nỉ mềm mại, thoáng khí. Khung gỗ dầu đã qua xử lý chống mối mọt. Nệm mút D40 êm ái, có độ đàn hồi cao, không bị xẹp lún.', 7800000.00, 10, 'https://placehold.co/600x400/A89F91/FFFFFF?text=Sofa+Nỉ', 'SOFA-NI-001', '220cm x 85cm x 80cm', 'Vải nỉ, Gỗ dầu, Mút D40', 5),
('Giường Ngủ Gỗ Tràm Tự Nhiên 1m6', 'Giường ngủ đôi làm từ gỗ tràm bền chắc, vân gỗ đẹp. Thiết kế đầu giường đơn giản, tinh tế. Sản phẩm đã được xử lý để chống cong vênh, mối mọt.', 5900000.00, 8, 'https://placehold.co/600x400/A89F91/FFFFFF?text=Giường+Tràm', 'GIUONG-TRAM-001', '160cm x 200cm', 'Gỗ tràm', 4),
('Bàn Trà Tròn Mặt Kính Cường Lực', 'Bàn trà (bàn sofa) mặt kính cường lực dày 10mm, chống va đập và an toàn. Chân bàn bằng gỗ sồi tạo hình 3 chân độc đáo, mang lại vẻ đẹp hiện đại cho phòng khách.', 1850000.00, 20, 'https://placehold.co/600x400/A89F91/FFFFFF?text=Bàn+Trà', 'BAN-TRA-001', 'Đường kính 80cm, Cao 45cm', 'Kính cường lực, Gỗ sồi', 1),
('Tủ Quần Áo 3 Cánh Cửa Lùa', 'Tủ quần áo tiết kiệm không gian với thiết kế cửa lùa tiện lợi. Bên trong được chia thành các khoang treo và ngăn xếp đồ khoa học. Chất liệu gỗ công nghiệp cao cấp.', 6500000.00, 12, 'https://placehold.co/600x400/A89F91/FFFFFF?text=Tủ+Áo', 'TU-AO-001', '160cm x 60cm x 200cm', 'Gỗ MDF lõi xanh chống ẩm', 3),
('Ghế Thư Giãn Papasan Mây Tự Nhiên', 'Ghế thư giãn Papasan hình tròn, làm từ song mây tự nhiên 100%, đi kèm nệm bông gòn dày dặn, êm ái. Thích hợp để đọc sách, nghe nhạc trong góc phòng hoặc ban công.', 2500000.00, 18, 'https://placehold.co/600x400/A89F91/FFFFFF?text=Ghế+Mây', 'GHE-MAY-001', 'Đường kính 100cm', 'Mây tự nhiên, Vải canvas, Bông gòn', 2);