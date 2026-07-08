// ================================================================
// data.js — Mock Data cho Châu Sơn Shop
// ================================================================

const SHOP_INFO = {
  name: "Châu Sơn Shop",
  tagline: "Chuyên Hàng Nhập",
  hotline: "0935.033.039",
  hotlineKS: "0843.323.550",
  address1: "Đà Nẵng: 01 Nguyễn Hữu Thọ, Hòa Thuận Nam, Hải Châu",
  address2: "TP.HCM: Sky Garden 1 - Đại Lộ Nguyễn Văn Linh, Q.7",
  email: "chausonshop@gmail.com",
  zalo: "https://zalo.me/0935033039",
  facebook: "https://facebook.com/chausonshop",
  workingHours: "8h00–21h30",
  deliveryTime: "2–4 ngày"
};

const CATEGORIES = [
  { id: "thuc-pham-chuc-nang", name: "Thực phẩm chức năng", icon: "fa-leaf", color: "#2e7d32",
    subTags: ["Vitamin C", "Hỗ trợ tim mạch", "Sức khỏe nữ giới", "Hỗ Trợ Sinh Lý", "Hỗ trợ tiêu hóa, dạ dày", "Tăng đề kháng", "Hỗ trợ giấc ngủ", "Vitamin tổng hợp"] },
  { id: "chong-lao-hoa", name: "Chống lão hóa", icon: "fa-spa", color: "#7b1fa2",
    subTags: ["Collagen", "Nhau thai cừu", "Sữa ong chúa", "Vitamin E", "NMN", "Nhau thai ngựa", "Tảo biển"] },
  { id: "ho-tro-xuong-khop", name: "Hỗ trợ xương khớp", icon: "fa-bone", color: "#e65100",
    subTags: ["Glucosamine", "Canxi", "Vitamin D", "Magie", "Omega-3"] },
  { id: "my-pham", name: "Mỹ phẩm", icon: "fa-magic", color: "#c2185b",
    subTags: ["Kem dưỡng da", "Sữa rửa mặt", "Serum", "Kem chống nắng", "Trị mụn", "Tẩy trang", "Dưỡng thể"] },
  { id: "sam-nam-cao", name: "Sâm, Nấm, Cao", icon: "fa-seedling", color: "#388e3c",
    subTags: ["Hồng sâm Hàn Quốc", "Đông trùng hạ thảo", "An cung ngưu hoàng", "Nhung hươu"] },
  { id: "banh-keo", name: "Bánh kẹo", icon: "fa-cookie-bite", color: "#f57c00",
    subTags: ["Socola", "Kẹo dẻo", "Bánh quy", "Snack"] },
  { id: "hang-gia-dung", name: "Hàng gia dụng", icon: "fa-home", color: "#455a64",
    subTags: ["Nhà bếp", "Phòng ngủ", "Vệ sinh"] },
  { id: "big-sale", name: "BIG SALE 🔥", icon: "fa-fire", color: "#d32f2f",
    subTags: [] }
];

const NEWS = [
  {
    id: 1,
    title: "Review thuốc diệt ký sinh trùng an toàn và được",
    image: "images/exact-1.jpg",
    time: "2 tháng trước, lúc 15:59",
    slug: "review-thuoc-diet-ky-sinh-trung"
  },
  {
    id: 2,
    title: "Táo vàng có tác dụng gì? Bí mật ít người biết",
    image: "images/exact-2.jpg",
    time: "4 tháng trước, lúc 20:02",
    slug: "tao-vang-co-tac-dung-gi"
  },
  {
    id: 3,
    title: "Bổ sung magie như thế nào cho đúng, tránh dư",
    image: "images/exact-3.jpg",
    time: "4 tháng trước, lúc 14:58",
    slug: "bo-sung-magie-nhu-the-nao"
  },
  {
    id: 4,
    title: "Bầu ăn đông trùng hạ thảo được không? Điều mẹ bầu cần biết",
    image: "images/exact-4.jpg",
    time: "5 tháng trước, lúc 09:19",
    slug: "bau-an-dong-trung-ha-thao"
  },
  {
    id: 5,
    title: "Omega-3 có tốt cho phụ nữ mang thai không?",
    image: "images/exact-5.jpg",
    time: "6 tháng trước, lúc 11:30",
    slug: "omega-3-cho-phu-nu-mang-thai"
  }
];

const BANNERS = [
  {
    id: 1,
    productName: "Sữa Ong Chúa Costar Royal Jelly 1450mg 365 Viên",
    discount: 29,
    originalPrice: 750000,
    salePrice: 529000,
    badge: "HÀNG CHÍNH HÃNG - GIÁ RẺ NHẤT THỊ TRƯỜNG",
    bgColor: "linear-gradient(135deg, #ffa726 0%, #fb8c00 50%, #e65100 100%)",
    image: "images/exact-1.jpg"
  },
  {
    id: 2,
    productName: "Viên Uống Collagen Shiseido Nhật Bản 250 Viên",
    discount: 35,
    originalPrice: 1200000,
    salePrice: 780000,
    badge: "NHẬP KHẨU CHÍNH HÃNG TỪ NHẬT BẢN",
    bgColor: "linear-gradient(135deg, #ce93d8 0%, #9c27b0 50%, #6a1b9a 100%)",
    image: "images/exact-2.jpg"
  },
  {
    id: 3,
    productName: "Vitamin C Blackmores 1000mg Úc 150 Viên",
    discount: 20,
    originalPrice: 450000,
    salePrice: 360000,
    badge: "FLASH SALE - SỐ LƯỢNG CÓ HẠN",
    bgColor: "linear-gradient(135deg, #a5d6a7 0%, #43a047 50%, #1b5e20 100%)",
    image: "images/exact-3.jpg"
  }
];

const PRODUCTS = [
  // ===== THỰC PHẨM CHỨC NĂNG =====
  { id: 1, categoryId: "thuc-pham-chuc-nang", name: "Viên uống hỗ trợ tiêu hóa dạ dày Tinh Chất Hàu Tươi Tỏi Nghệ Orihiro Nhật 180 Viên", price: 405000, originalPrice: 1186000, image: "images/prod-1.jpg", badge: null, rating: 4.7, reviews: 204, sold: 466, tag: "Hỗ trợ tiêu hóa, dạ dày", isNew: false, isSale: true, isBestSeller: true },
  { id: 2, categoryId: "thuc-pham-chuc-nang", name: "Viên uống Nattokinase 2000FU Orihiro của Nhật Bản hỗ trợ tim mạch", price: 621000, originalPrice: 1327000, image: "images/prod-2.jpg", badge: "HOT", rating: 4.7, reviews: 92, sold: 1180, tag: "Hỗ trợ tim mạch", isNew: false, isSale: false, isBestSeller: true },
  { id: 3, categoryId: "thuc-pham-chuc-nang", name: "Centrum Silver Ultra Mens 50+ 275 Viên Của Mỹ", price: 750000, originalPrice: 890000, image: "images/prod-3.jpg", badge: "HOT", rating: 4.9, reviews: 215, sold: 1200, tag: "Vitamin tổng hợp", isNew: false, isSale: true, isBestSeller: true },
  { id: 4, categoryId: "thuc-pham-chuc-nang", name: "Dầu cá SR Triple Strength Omega-3 Fish Oil 150 viên của Mỹ", price: 1060000, originalPrice: 1200000, image: "images/prod-4.jpg", badge: "CHÍNH HÃNG", rating: 4.7, reviews: 98, sold: 445, tag: "Hỗ trợ tim mạch", isNew: false, isSale: false, isBestSeller: false },
  { id: 5, categoryId: "thuc-pham-chuc-nang", name: "Nature Made Fish Oil 1200mg 200 viên Mỹ Omega 3", price: 620000, originalPrice: 790000, image: "images/prod-5.jpg", badge: null, rating: 4.7, reviews: 134, sold: 670, tag: "Hỗ trợ tim mạch", isNew: false, isSale: true, isBestSeller: false },
  { id: 6, categoryId: "thuc-pham-chuc-nang", name: "NOW Foods CoQ10 600mg 60 viên Mỹ tăng cường sức khỏe tim mạch", price: 870000, originalPrice: 1100000, image: "images/prod-6.jpg", badge: "HOT", rating: 4.7, reviews: 112, sold: 560, tag: "Hỗ trợ tim mạch", isNew: false, isSale: true, isBestSeller: false },
  { id: 7, categoryId: "thuc-pham-chuc-nang", name: "Culturelle Pro Strength Daily Probiotic 30 viên Mỹ hỗ trợ tiêu hóa", price: 680000, originalPrice: 850000, image: "images/exact-32.jpg", badge: "BÁN CHẠY", rating: 4.8, reviews: 187, sold: 840, tag: "Hỗ trợ tiêu hóa, dạ dày", isNew: false, isSale: true, isBestSeller: true },
  { id: 8, categoryId: "thuc-pham-chuc-nang", name: "GNC Mega Men Sport Multivitamin 180 viên Mỹ cho nam", price: 820000, originalPrice: 1050000, image: "images/prod-8.jpg", badge: "HOT", rating: 4.7, reviews: 124, sold: 580, tag: "Vitamin tổng hợp", isNew: false, isSale: true, isBestSeller: false },
  { id: 9, categoryId: "thuc-pham-chuc-nang", name: "One A Day Women's Petites Multivitamin 160 viên Mỹ", price: 590000, originalPrice: 760000, image: "images/prod-9.jpg", badge: null, rating: 4.6, reviews: 145, sold: 490, tag: "Sức khỏe nữ giới", isNew: false, isSale: true, isBestSeller: false },
  { id: 10, categoryId: "thuc-pham-chuc-nang", name: "Melatonin 10mg Nature Made 90 viên Mỹ hỗ trợ giấc ngủ", price: 320000, originalPrice: 420000, image: "images/prod-10.jpg", badge: null, rating: 4.8, reviews: 241, sold: 930, tag: "Hỗ trợ giấc ngủ", isNew: false, isSale: true, isBestSeller: true },
  { id: 11, categoryId: "thuc-pham-chuc-nang", name: "Spring Valley Zinc 50mg 200 viên Mỹ tăng đề kháng miễn dịch", price: 280000, originalPrice: 360000, image: "images/prod-11.jpg", badge: null, rating: 4.7, reviews: 158, sold: 720, tag: "Tăng đề kháng", isNew: false, isSale: true, isBestSeller: false },
  { id: 12, categoryId: "thuc-pham-chuc-nang", name: "Garden of Life Vitamin Code Raw Iron 30 viên Mỹ bổ máu", price: 490000, originalPrice: 620000, image: "images/exact-26.jpg", badge: "MỚI", rating: 4.5, reviews: 67, sold: 210, tag: "Hỗ Trợ Sinh Lý", isNew: true, isSale: true, isBestSeller: false },
  { id: 13, categoryId: "thuc-pham-chuc-nang", name: "Kirkland Signature Vitamin D3 2000 IU 600 viên của Mỹ", price: 430000, originalPrice: 560000, image: "images/prod-13.jpg", badge: "BÁN CHẠY", rating: 4.9, reviews: 302, sold: 1500, tag: "Vitamin tổng hợp", isNew: false, isSale: true, isBestSeller: true },

  // ===== CHỐNG LÃO HÓA =====
  { id: 14, categoryId: "chong-lao-hoa", name: "Viên uống vitamin E 180mg 400IU Kirkland 500 softgels của Mỹ", price: 779000, originalPrice: 1346000, image: "images/prod-14.jpg", badge: "BEST", rating: 5.0, reviews: 320, sold: 1016, tag: "Vitamin E", isNew: false, isSale: false, isBestSeller: true },
  { id: 15, categoryId: "chong-lao-hoa", name: "The Collagen Shiseido dạng nước Nhật Bản 10 chai x 50ml", price: 432000, originalPrice: 800000, image: "images/prod-15.jpg", badge: "HOT", rating: 4.6, reviews: 199, sold: 432, tag: "Collagen", isNew: false, isSale: true, isBestSeller: false },
  { id: 16, categoryId: "chong-lao-hoa", name: "Chai xịt keo ong Vitatree Super Propolis Spray Complex 30ml Úc", price: 406000, originalPrice: 1129000, image: "images/prod-16.jpg", badge: null, rating: 4.7, reviews: 96, sold: 737, tag: "Sữa ong chúa", isNew: false, isSale: false, isBestSeller: false },
  { id: 17, categoryId: "chong-lao-hoa", name: "Nature's Bounty Biotin 10000mcg 120 viên của Mỹ làm đẹp da, tóc", price: 360000, originalPrice: 480000, image: "images/exact-25.jpg", badge: null, rating: 4.6, reviews: 89, sold: 520, tag: "Vitamin", isNew: false, isSale: true, isBestSeller: false },

  // ===== HỖ TRỢ XƯƠNG KHỚP =====
  { id: 18, categoryId: "ho-tro-xuong-khop", name: "Schiff Move Free Joint Health Advanced 200 viên Mỹ", price: 980000, originalPrice: 1250000, image: "images/prod-18.jpg", badge: "HOT", rating: 4.8, reviews: 176, sold: 880, tag: "Trị đau khớp", isNew: false, isSale: true, isBestSeller: true },
  { id: 19, categoryId: "ho-tro-xuong-khop", name: "Nature Made Magnesium Glycinate 200mg 60 viên Mỹ", price: 560000, originalPrice: 720000, image: "images/exact-30.jpg", badge: "MỚI", rating: 4.8, reviews: 93, sold: 410, tag: "Trị đau khớp", isNew: true, isSale: true, isBestSeller: false },

  // ===== MỸ PHẨM =====
  { id: 20, categoryId: "my-pham", name: "Kem dưỡng da vùng cổ Medi-Peel Naite Thread Neck Cream 100ml", price: 534000, originalPrice: 1351000, image: "images/prod-20.jpg", badge: "HOT", rating: 4.8, reviews: 233, sold: 359, tag: "Kem dưỡng da", isNew: false, isSale: false, isBestSeller: false },
  { id: 21, categoryId: "my-pham", name: "Kem hồng nhũ hoa Nuwhite N1 Mibiti Prudente Professional Mỹ", price: 729000, originalPrice: 939000, image: "images/prod-21.jpg", badge: null, rating: 4.7, reviews: 118, sold: 739, tag: "Kem dưỡng da", isNew: false, isSale: true, isBestSeller: true },
  { id: 22, categoryId: "my-pham", name: "Kem đánh trắng răng Nuskin AP24 Whitening Fluoride Toothpaste Mỹ", price: 327000, originalPrice: 1046000, image: "images/exact-12.jpg", badge: null, rating: 4.6, reviews: 99, sold: 478, tag: "Chăm sóc răng miệng", isNew: true, isSale: false, isBestSeller: false },
  { id: 23, categoryId: "my-pham", name: "Viên uống trắng da chống nắng Fresa Whitening & Sunblock", price: 392000, originalPrice: 647000, image: "images/prod-23.jpg", badge: null, rating: 4.9, reviews: 218, sold: 532, tag: "Kem chống nắng", isNew: false, isSale: true, isBestSeller: true },
  { id: 24, categoryId: "my-pham", name: "Dịch vệ sinh phụ nữ Inner Gel Wettrust 30 ống hồng Hàn Quốc", price: 456000, originalPrice: 1229000, image: "images/prod-24.jpg", badge: null, rating: 4.7, reviews: 99, sold: 311, tag: "Chăm sóc phụ nữ", isNew: false, isSale: true, isBestSeller: false },
  { id: 25, categoryId: "my-pham", name: "Xịt kéo dài thời gian quan hệ Stud 100 Spray Delay For Men", price: 723000, originalPrice: 1049000, image: "images/prod-25.jpg", badge: null, rating: 4.6, reviews: 141, sold: 441, tag: "Sức khỏe nữ giới", isNew: false, isSale: true, isBestSeller: false },

  // ===== SÂM, NẤM, CAO =====
  { id: 26, categoryId: "sam-nam-cao", name: "Cao hồng sâm 365 Hàn Quốc 6 năm tuổi Hộp 250g chính hãng", price: 1350000, originalPrice: 1800000, image: "images/prod-26.jpg", badge: "HOT", rating: 4.9, reviews: 178, sold: 890, tag: "Hồng sâm Hàn Quốc", isNew: false, isSale: true, isBestSeller: true },
  { id: 27, categoryId: "sam-nam-cao", name: "Nước nhung hươu hồng sâm núi 365 Hansusam Hàn Quốc hộp 30 gói", price: 980000, originalPrice: 1250000, image: "images/prod-27.jpg", badge: null, rating: 4.8, reviews: 134, sold: 560, tag: "Nhung hươu", isNew: false, isSale: true, isBestSeller: false },
  { id: 28, categoryId: "sam-nam-cao", name: "An Cung Ngưu Hoàng Hoàn Kwang Dong Hàn Quốc hộp 10 viên", price: 2800000, originalPrice: 3500000, image: "images/prod-28.jpg", badge: "CHÍNH HÃNG", rating: 5.0, reviews: 89, sold: 312, tag: "An cung ngưu hoàng", isNew: false, isSale: true, isBestSeller: true },

  // ===== BÁNH KẸO =====
  { id: 29, categoryId: "banh-keo", name: "Socola rượu Anthon Berg Since 1884 Chocolate 64 chai của Mỹ", price: 494000, originalPrice: 787000, image: "images/prod-29.jpg", badge: null, rating: 5.0, reviews: 207, sold: 1076, tag: "Socola", isNew: false, isSale: true, isBestSeller: true },
  { id: 30, categoryId: "banh-keo", name: "Kẹo socola Hershey's Nuggets Assortment 1.47kg 145 viên Mỹ", price: 386000, originalPrice: 811000, image: "images/prod-30.jpg", badge: "HOT", rating: 4.9, reviews: 91, sold: 1133, tag: "Socola", isNew: false, isSale: false, isBestSeller: true },
  { id: 31, categoryId: "banh-keo", name: "Kẹo dẻo gấu Haribo Goldbears 1kg Đức chính hãng", price: 320000, originalPrice: 420000, image: "images/prod-31.jpg", badge: null, rating: 4.8, reviews: 165, sold: 780, tag: "Kẹo dẻo", isNew: false, isSale: true, isBestSeller: false },
  { id: 32, categoryId: "banh-keo", name: "Bánh quy Oreo Mega Stuf Double 482g Mỹ", price: 185000, originalPrice: 250000, image: "images/prod-32.jpg", badge: null, rating: 4.7, reviews: 230, sold: 1450, tag: "Bánh quy", isNew: false, isSale: true, isBestSeller: true }
];

// Helper functions
function getProductsByCategory(categoryId, limit = 5) {
  return PRODUCTS.filter(p => p.categoryId === categoryId).slice(0, limit);
}

function getBestSellers(limit = 6) {
  return PRODUCTS.filter(p => p.isBestSeller).slice(0, limit);
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + 'đ';
}

function getDiscountPercent(original, sale) {
  return Math.round((1 - sale / original) * 100);
}

function searchProducts(query) {
  const q = query.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.tag.toLowerCase().includes(q)
  );
}
