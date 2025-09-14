-- BƯỚC 1: TẠO CƠ SỞ DỮ LIỆU (SCHEMA) NẾU CHƯA TỒN TẠI
-- Sử dụng collation utf8mb4_unicode_ci để hỗ trợ tiếng Việt và các ký tự đặc biệt tốt nhất.
-- DROP DATABASE IF EXISTS furniture_db;
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
('Quản Trị Viên', 'admin@email.com', '$2a$12$78cga50NK6qxk35cpjwlKetU9VJvTUpI0UhfinwAQdSUH/QyO3itO', '0987654321', '123 Đường Admin, Quận 1, TP.HCM', 'admin'),
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
INSERT INTO `Categories` (`id`, `name`, `description`) VALUES
(1, 'Giường', 'Những mẫu giường ngủ êm ái, mang lại giấc ngủ ngon và tô điểm cho phòng ngủ.'),
(2, 'Tủ quần áo', 'Giải pháp lưu trữ thông minh với tủ quần áo, kệ sách, kệ trang trí.'),
(3, 'Bàn trang điểm', 'Các loại bàn trang điểm với thiết kế đa dạng.'),
(4, 'Sofa', 'Sofa băng, sofa góc cho phòng khách thêm sang trọng và ấm cúng.');

-- BƯỚC 3: THÊM DỮ LIỆU CHO BẢNG `Products`
-- Tạo ra 16 sản phẩm, chia đều cho 4 danh mục.
INSERT INTO `Products` (`name`, `description`, `price`, `stockQuantity`, `imageUrl`, `sku`, `dimensions`, `material`, `categoryId`) VALUES
('Giường Diệp Mộc', 'Giường Diệp Mộc mang lại thiết kế dịu mắt với màu xanh nhẹ nhàng, tạo nên không gian êm ái và dễ chịu cho phòng ngủ của bạn.', 10000.00, 8, '/upload/giuong-diep-moc.jpg', 'GIUONG-MDF-001', '180cm x 200cm', 'Gỗ MDF', 1),
('Giường Vải Nhung', 'Giường Vải Nhung được thiết kế để mang đến sự kết hợp hoàn hảo giữa phong cách hiện đại tối giản và sự thoải mái tối đa.', 10000.00, 10, '/upload/giuong-nhung.jpg', 'GIUONG-KHUNG-GO-TU-NHIEN-002', '140cm x 200cm', 'Vải nhung, khung gỗ tự nhiên', 1),
('Giường Da', 'Giường da được thiết kế để mang đến sự kết hợp hoàn hảo giữa chất liệu da PU cao cấp và phong cách hiện đại, mang lại sự thoải mái và đẳng cấp cho không gian sống của bạn.', 10000.00, 5, '/upload/giuong-da.jpg', 'GIUONG-KHUNG-GO-TU-NHIEN-003', '180cm x 200cm', 'Vải da, khung gỗ tự nhiên', 1),
('Giường Gỗ MDF', 'Thiết kế giường hộp tối giản không chỉ tạo ra vẻ đẹp thanh lịch mà còn giải quyết vấn đề của việc rơi đồ cá nhân dưới giường, nhờ việc loại bỏ chân giường.', 10000.00, 12, '/upload/giuong-mdf.jpg', 'GIUONG-MDF-002', '180cm x 200cm', 'Gỗ MDF', 1),
('Tủ Áo Diệp Mộc', 'Khung tủ được thiết kế với nhiều ngăn đa dạng, bao gồm hộc tủ, kệ, sào treo và hộc tủ có khóa, cung cấp giải pháp lưu trữ tối ưu cho quần áo và phụ kiện.', 1200000.00, 25, '/upload/tu-ao-diep-moc.jpg', 'TU-AO-001', '160cm x 55cm x 200cm', 'Gỗ MDF phủ Melamine', 2),
('Tủ Áo Diệp Nhiên', 'Kích thước rộng rãi, cung cấp không gian lưu trữ rộng lớn, phù hợp với nhiều nhu cầu sử dụng. Màu sắc dịu nhẹ tạo nên sự hài hòa trong chính căn phòng của bạn.', 6500000.00, 12, '/upload/tu-ao-diep-nhien.jpg', 'TU-AO-002', '160cm x 55cm x 200cm', 'Gỗ MDF lõi xanh chống ẩm', 2),
('Tủ Áo Cửa Lùa', 'Kích thước rộng rãi, cung cấp không gian lưu trữ rộng lớn, phù hợp với nhiều nhu cầu sử dụng.', 2100000.00, 20, '/upload/tu-ao-mdf.jpg', 'TU-AO-003', '220cm x 55cm x 240cm', 'Gỗ MDF phủ Melamine', 2),
('Tủ Áo Gỗ MDF Phủ Sơn', 'Kích thước rộng rãi, cung cấp không gian lưu trữ rộng lớn, phù hợp với nhiều nhu cầu sử dụng.', 3800000.00, 15, '/upload/tu-ao-son.jpg', 'TU-AO-004', '160cm x 55cm x 200cm', 'Gỗ MDF phủ sơn', 2),
('Bàn Trang Điểm Q1', 'Được làm từ vật liệu MDF chất lượng cao, với bề mặt phủ lớp melamine, chống trầy, ước, chống thấm nước, giúp dễ dàng vệ sinh và đảm bảo độ bền trong thời gian sử dụng.', 4500000.00, 15, '/upload/ban-trang-diem-q1.jpg', 'BAN-TRANG-DIEM-001', '140cm x 40cm x 160cm', 'Gỗ MDF', 3),
('Bàn Trang Điểm Q2', 'Được làm từ vật liệu MDF chất lượng cao, với bề mặt phủ lớp melamine, chống trầy, ước, chống thấm nước, giúp dễ dàng vệ sinh và đảm bảo độ bền trong thời gian sử dụng.', 750000.00, 40, '/upload/ban-trang-diem-q2.jpg', 'BAN-TRANG-DIEM-002', '140cm x 40cm x 160cm', 'Gỗ MDF', 3),
('Bàn Trang Điểm Q3', 'Được làm từ vật liệu MDF chất lượng cao, với bề mặt phủ lớp melamine, chống trầy, ước, chống thấm nước, giúp dễ dàng vệ sinh và đảm bảo độ bền trong thời gian sử dụng.', 3200000.00, 18, '/upload/ban-trang-diem-q3.jpg', 'BAN-TRANG-DIEM-003', '140cm x 40cm x 160cm', 'Gỗ MDF phủ sơn', 3),
('Bàn Trang Điểm Q4', 'Được làm từ vật liệu MDF chất lượng cao, với bề mặt phủ lớp melamine, chống trầy, ước, chống thấm nước, giúp dễ dàng vệ sinh và đảm bảo độ bền trong thời gian sử dụng.', 2800000.00, 15, '/upload/ban-trang-diem-q4.jpg', 'BAN-TRANG-DIEM-004', '140cm x 40cm x 160cm', 'Gỗ MDF phủ Melamine', 3),
('Sofa Ngọc Ngà', 'Vải thiết kế hiện đại, các đường nét mềm mại và tỉ mỉ, Sofa Ngọc Ngà mang đến sự hài hòa giữa tính thẩm mỹ và sự thoải mái', 7800000.00, 10, '/upload/sofa-ngoc-nga.jpg', 'SOFA-NI-001', '220cm x 85cm x 80cm', 'Vải nỉ, Gỗ dầu, Mút D40', 4),
('Sofa Kết Nối', 'Vải kiểu dáng mô-đun, sofa có thể được sắp xếp theo nhiều cách khác nhau, phù hợp với mọi không gian sống, từ phong cách rộng rãi đến những căn hộ nhỏ,', 1850000.00, 20, '/upload/sofa-ket-noi.jpg', 'SOFA-NI-002', '240cm x 85cm x 70cm', 'Khung gỗ tần bì, Nệm mousse', 4),
('Sofa Ôm Dịu', 'Vải thiết kế hiện đại pha chút nét mềm mại, sản phẩm này được tạo ra để trở thành trung tâm của mọi không gian sống.', 2500000.00, 18, '/upload/sofa-om-diu.jpg', 'SOFA-OM-DIU-001', '200cm x 60cm x 60cm', 'Khung gỗ tần bì, Lò xo dạng ống', 4),
('Sofa Bed', 'Sở hữu thiết kế thời thượng với các đường nét tinh gọn và màu sắc trung tính, dễ dàng kết hợp với nhiều cách nội thất khác nhau.', 12500000.00, 7, '/upload/sofa-bed.jpg', 'SOFA-DA-001', '220cm x 85cm x 80cm', 'Da công nghiệp, Khung gỗ', 4);
-- BƯỚC 4: TẠO PROCEDURE ĐỂ THÊM DỮ LIỆU ĐƠN HÀNG TỰ ĐỘNG
DELIMITER $$

CREATE PROCEDURE GenerateRandomOrders()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE j INT;
    DECLARE randomUserId INT;
    DECLARE randomProductId INT;
    DECLARE randomQuantity INT;
    DECLARE productPrice DECIMAL(10, 2);
    DECLARE totalOrderAmount DECIMAL(10, 2);
    DECLARE newOrderId INT;
    DECLARE itemsPerOrder INT;
    DECLARE userAddress TEXT;
    DECLARE orderStatus ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');
    DECLARE randomDate DATETIME;

    -- Lặp 100 lần để tạo 100 đơn hàng
    WHILE i < 100 DO
        SET i = i + 1;
        SET totalOrderAmount = 0;
        
        -- 1. Chọn ngẫu nhiên một userId (chỉ chọn khách hàng, id từ 2 đến 10)
        SET randomUserId = FLOOR(2 + (RAND() * 9));
        
        -- Lấy địa chỉ của user để làm địa chỉ giao hàng
        SELECT address INTO userAddress FROM Users WHERE id = randomUserId;
        
        -- 2. Tạo một đơn hàng mới trong bảng `Orders` để lấy `orderId`
        -- Chọn ngẫu nhiên một trạng thái đơn hàng
        SET orderStatus = ELT(FLOOR(1 + RAND() * 5), 'pending', 'processing', 'shipped', 'delivered', 'cancelled');
        
        -- Tạo một ngày đặt hàng ngẫu nhiên trong vòng 1 năm trở lại đây
        SET randomDate = NOW() - INTERVAL FLOOR(RAND() * 365) DAY;

        INSERT INTO Orders (userId, totalAmount, status, shippingAddress, customerNotes, createdAt)
        VALUES (randomUserId, 0, orderStatus, userAddress, CONCAT('Ghi chú tự động cho đơn hàng ', i), randomDate);
        
        -- Lấy ID của đơn hàng vừa tạo
        SET newOrderId = LAST_INSERT_ID();
        
        -- 3. Mỗi đơn hàng sẽ có từ 1 đến 5 sản phẩm khác nhau
        SET itemsPerOrder = FLOOR(1 + (RAND() * 5));
        SET j = 0;
        
        WHILE j < itemsPerOrder DO
            SET j = j + 1;
            
            -- Chọn ngẫu nhiên một sản phẩm (id từ 1 đến 16)
            SET randomProductId = FLOOR(1 + (RAND() * 16));
            
            -- Lấy giá sản phẩm
            SELECT price INTO productPrice FROM Products WHERE id = randomProductId;
            
            -- Số lượng mỗi sản phẩm từ 1 đến 3
            SET randomQuantity = FLOOR(1 + (RAND() * 3));
            
            -- Thêm sản phẩm vào bảng `OrderItems`
            INSERT INTO OrderItems (orderId, productId, quantity, price)
            VALUES (newOrderId, randomProductId, randomQuantity, productPrice);
            
            -- Cập nhật tổng tiền của đơn hàng
            SET totalOrderAmount = totalOrderAmount + (productPrice * randomQuantity);
        END WHILE;
        
        -- 4. Cập nhật lại tổng tiền cho đơn hàng trong bảng `Orders`
        UPDATE Orders SET totalAmount = totalOrderAmount WHERE id = newOrderId;
        
    END WHILE;
END$$

DELIMITER ;

-- BƯỚC 5: GỌI PROCEDURE ĐỂ TẠO DỮ LIỆU
CALL GenerateRandomOrders();
-- Xóa procedure sau khi đã dùng xong
-- DROP PROCEDURE CreateRandomOrders;
