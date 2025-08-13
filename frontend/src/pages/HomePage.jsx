import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { fetchCategories } from '../services/api'; // Import service để lấy danh mục

// --- Các Component con giúp code gọn gàng hơn ---

// Card cho danh mục sản phẩm
const CategoryCard = ({ category, icon, color, variants }) => (
	<motion.div
		className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
		variants={variants}
		whileHover={{ y: -10, transition: { duration: 0.3 } }}
	>
		<div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
			{icon}
		</div>
		<h3 className="text-xl font-bold text-gray-800 mb-4">
			{category.name}
		</h3>
		<p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
			{category.description || `Khám phá các mẫu ${category.name} với thiết kế đa dạng và chất lượng hàng đầu.`}
		</p>
		<div className="mt-auto">
			{/* CHÚ THÍCH: Link đã được cập nhật để trỏ đến trang danh mục */}
			<Link to={`/category/${category.id}`}>
				<motion.button
					className={`w-full py-3 px-4 bg-gradient-to-r ${color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300`}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					Xem chi tiết
				</motion.button>
			</Link>
		</div>
	</motion.div>
);

// --- Component chính của Trang chủ ---

const HomePage = () => {
    const [categories, setCategories] = useState([]);

    // --- CHÚ THÍCH: Lấy danh sách danh mục từ API khi trang được tải ---
	useEffect(() => {
		const loadCategories = async () => {
			try {
				const response = await fetchCategories();
				setCategories(response.data);
			} catch (error) {
				console.error("Failed to fetch categories:", error);
			}
		};
		loadCategories();
	}, []);

    // --- CHÚ THÍCH: Các biến và mảng dữ liệu mẫu cho giao diện ---
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
	};
	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
	};
    // Dữ liệu mẫu cho icon và màu sắc của các danh mục
	const categoryStyles = [
		{ icon: "🪑", color: "from-orange-400 to-amber-500" }, // Ghế
		{ icon: "🛋️", color: "from-teal-400 to-cyan-500" },      // Sofa
		{ icon: "🛏️", color: "from-indigo-400 to-purple-500" },  // Giường
		{ icon: "🍽️", color: "from-rose-400 to-pink-500" },    // Bàn
	];

	return (
		<div className="bg-gray-50 text-gray-800">
			{/* --- Hero Section --- */}
			<motion.section
				className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 overflow-hidden text-center p-6"
				initial="hidden"
				animate="visible"
				variants={containerVariants}
			>
				<div className="container mx-auto relative z-10">
					<motion.h1
						className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight"
						variants={itemVariants}
					>
						Không Gian Sống <br/>
						<span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
							Đẳng Cấp & Tinh Tế
						</span>
					</motion.h1>

					<motion.p
						className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
						variants={itemVariants}
					>
						Khám phá những bộ sưu tập nội thất độc đáo, mang đến vẻ đẹp bền vững và phong cách cho ngôi nhà của bạn.
					</motion.p>

					<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
						variants={itemVariants}
					>
                        {/* CHÚ THÍCH: Link đã được cập nhật */}
						<Link to="/products">
                            <motion.button
                                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            >
                                Khám phá ngay →
                            </motion.button>
                        </Link>
					</motion.div>
				</div>
			</motion.section>

			{/* --- Danh Mục Sản Phẩm Section --- */}
			<motion.section
				className="py-20"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={containerVariants}
			>
				<div className="container mx-auto px-6">
					<motion.div className="text-center mb-16" variants={itemVariants}>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
							Danh Mục Nổi Bật
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Duyệt qua các danh mục sản phẩm chính của chúng tôi để tìm kiếm nguồn cảm hứng.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{/* CHÚ THÍCH: Tự động lấy 4 danh mục đầu tiên từ API để hiển thị */}
						{categories.slice(0, 4).map((category, index) => (
							<CategoryCard
								key={category.id}
								category={category}
								icon={categoryStyles[index % categoryStyles.length].icon}
								color={categoryStyles[index % categoryStyles.length].color}
								variants={itemVariants}
							/>
						))}
					</div>
				</div>
			</motion.section>

            {/* --- CTA (Call to Action) Section --- */}
			<motion.section
				className="py-20 bg-green-800"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
			>
				<div className="container mx-auto px-6 text-center">
					<motion.h2
						className="text-4xl md:text-5xl font-bold text-white mb-6"
						variants={itemVariants}
					>
						Tìm Kiếm Nguồn Cảm Hứng?
					</motion.h2>
					<motion.p
						className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
						variants={itemVariants}
					>
						Hãy để đội ngũ của chúng tôi giúp bạn kiến tạo không gian sống trong mơ.
					</motion.p>
					<motion.div
						className="flex flex-col sm:flex-row gap-4 justify-center"
						variants={itemVariants}
					>
                        {/* CHÚ THÍCH: Link đã được cập nhật */}
						<Link to="/products">
                            <motion.button
                                className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            >
                                Xem tất cả sản phẩm
                            </motion.button>
                        </Link>
						<Link to="/contact">
                            <motion.button
                                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Liên hệ tư vấn
                            </motion.button>
                        </Link>
					</motion.div>
				</div>
			</motion.section>
		</div>
	);
};

export default HomePage;