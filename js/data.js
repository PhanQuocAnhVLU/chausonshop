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
    subTags: ["Vitamin C", "Hỗ trợ tim mạch", "Sức khỏe nữ giới", "Trị nám, tàn nhang", "Hỗ Trợ Sinh Lý", "Hỗ trợ tiêu hóa, dạ dày"] },
  { id: "chong-lao-hoa", name: "Chống lão hóa", icon: "fa-spa", color: "#7b1fa2",
    subTags: ["Collagen", "Nhau thai cừu", "Sữa ong chúa", "Vitamin", "Hạt chia", "Nhau thai ngựa", "Trị sẹo", "Tảo biển"] },
  { id: "ho-tro-xuong-khop", name: "Hỗ trợ xương khớp", icon: "fa-bone", color: "#e65100",
    subTags: ["Trị đau khớp", "Sun vi cà"] },
  { id: "my-pham", name: "Mỹ phẩm", icon: "fa-magic", color: "#c2185b",
    subTags: ["Son phấn", "Kem dưỡng da", "Sữa rửa mặt", "Sữa tắm", "Kem chống nắng", "Trị mụn", "Nước hoa", "Mỹ phẩm Sk II"] },
  { id: "sam-nam-cao", name: "Sâm, Nấm, Cao", icon: "fa-seedling", color: "#388e3c",
    subTags: ["Nấm linh chi", "Đông trùng hạ thảo", "An cung hoàng ngưu", "Cao linh chi"] },
  { id: "me-va-be", name: "Mẹ và Bé", icon: "fa-baby", color: "#0288d1",
    subTags: ["Cho mẹ", "Cho bé", "Sữa bột"] },
  { id: "banh-keo", name: "Bánh kẹo", icon: "fa-cookie-bite", color: "#f57c00",
    subTags: ["Socola", "Kẹo dẻo", "Bánh quy", "Snack"] },
  { id: "thuc-an-cho-meo", name: "Thức ăn cho mèo", icon: "fa-cat", color: "#5d4037",
    subTags: ["Pate", "Hạt khô", "Bánh thưởng"] },
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
  { id: 1, categoryId: "thuc-pham-chuc-nang", name: "Review thuốc diệt ký sinh trùng an toàn và được đánh giá cao", price: 434000, originalPrice: 1340000, image: "images/exact-1.jpg", badge: "HOT", rating: 4.8, reviews: 140, sold: 1038, tag: "Hàng Ngoại Nhập", isNew: false, isSale: false, isBestSeller: false },
  { id: 2, categoryId: "chong-lao-hoa", name: "Tảo vàng có tác dụng gì? Bí mật ít người biết", price: 522000, originalPrice: 626000, image: "images/exact-2.jpg", badge: "HOT", rating: 4.8, reviews: 214, sold: 525, tag: "Hàng Ngoại Nhập", isNew: true, isSale: false, isBestSeller: true },
  { id: 3, categoryId: "ho-tro-xuong-khop", name: "Bổ sung magie như thế nào cho đúng, tránh dư thừa?", price: 791000, originalPrice: 870000, image: "images/exact-3.jpg", badge: null, rating: 4.9, reviews: 245, sold: 923, tag: "Hàng Ngoại Nhập", isNew: true, isSale: true, isBestSeller: false },
  { id: 4, categoryId: "me-va-be", name: "Bầu ăn đông trùng hạ thảo được không? Điều mẹ bầu cần biết", price: 404000, originalPrice: 761000, image: "images/exact-4.jpg", badge: null, rating: 4.8, reviews: 245, sold: 339, tag: "Hàng Ngoại Nhập", isNew: false, isSale: true, isBestSeller: false },
  { id: 5, categoryId: "thuc-pham-chuc-nang", name: "Viên uống vitamin E 180mg 400IU Kirkland 500 softgels của Mỹ", price: 779000, originalPrice: 1346000, image: "images/exact-5.jpg", badge: null, rating: 5.0, reviews: 105, sold: 1016, tag: "Hàng Ngoại Nhập", isNew: false, isSale: false, isBestSeller: false },
  { id: 6, categoryId: "chong-lao-hoa", name: "Xịt kéo dài thời gian quan hệ Stud 100 Spray Delay For Men", price: 723000, originalPrice: 1049000, image: "images/exact-6.jpg", badge: null, rating: 4.6, reviews: 141, sold: 441, tag: "Hàng Ngoại Nhập", isNew: false, isSale: true, isBestSeller: false },
  { id: 7, categoryId: "ho-tro-xuong-khop", name: "Dịch vệ sinh phụ nữ Inner Gel Wettrust 30 ống hồng Hàn Quốc", price: 456000, originalPrice: 1229000, image: "images/exact-7.jpg", badge: null, rating: 4.7, reviews: 99, sold: 311, tag: "Hàng Ngoại Nhập", isNew: false, isSale: true, isBestSeller: false },
  { id: 8, categoryId: "me-va-be", name: "Socola rượu Anthon Berg Since 1884 Chocolate 64 chai của Mỹ", price: 494000, originalPrice: 787000, image: "images/exact-8.jpg", badge: null, rating: 5.0, reviews: 207, sold: 1076, tag: "Hàng Ngoại Nhập", isNew: false, isSale: true, isBestSeller: false },
  { id: 9, categoryId: "thuc-pham-chuc-nang", name: "Kẹo socola Hershey&amp;#39;s Nuggets Assortment 1.47kg 145 viên Mỹ", price: 386000, originalPrice: 811000, image: "images/exact-9.jpg", badge: "HOT", rating: 4.9, reviews: 91, sold: 1133, tag: "Hàng Ngoại Nhập", isNew: false, isSale: false, isBestSeller: false },
  { id: 10, categoryId: "chong-lao-hoa", name: "Viên đặt se khít vùng kín Revirgin Gung Bqcell của Hàn Quốc", price: 712000, originalPrice: 1223000, image: "images/exact-10.jpg", badge: null, rating: 4.5, reviews: 71, sold: 691, tag: "Hàng Ngoại Nhập", isNew: false, isSale: false, isBestSeller: false },
  { id: 11, categoryId: "ho-tro-xuong-khop", name: "Rượu Sake vẩy vàng Kikuyasaka 1,8 lít chai xanh của Nhật Bản ", price: 327000, originalPrice: 1180000, image: "images/exact-11.jpg", badge: "HOT", rating: 4.9, reviews: 80, sold: 1179, tag: "Hàng Ngoại Nhập", isNew: false, isSale: false, isBestSeller: true },
  { id: 12, categoryId: "me-va-be", name: "Kem đánh trắng răng Nuskin AP24 - Whitening Fluoride Toothpaste", price: 327000, originalPrice: 1046000, image: "images/exact-12.jpg", badge: null, rating: 4.6, reviews: 99, sold: 478, tag: "Hàng Ngoại Nhập", isNew: true, isSale: false, isBestSeller: false },
  { id: 13, categoryId: "thuc-pham-chuc-nang", name: "Viên uống trắng da chống nắng Fresa Whitening &amp; Sunblock", price: 392000, originalPrice: 647000, image: "images/exact-13.jpg", badge: null, rating: 4.9, reviews: 218, sold: 532, tag: "Hàng Ngoại Nhập", isNew: false, isSale: true, isBestSeller: true },
  { id: 14, categoryId: "chong-lao-hoa", name: "Chai xịt keo ong Vitatree Super Propolis Spray Complex 30ml ", price: 406000, originalPrice: 1129000, image: "images/exact-14.jpg", badge: "HOT", rating: 4.7, reviews: 96, sold: 737, tag: "Hàng Ngoại Nhập", isNew: false, isSale: false, isBestSeller: false },
  { id: 15, categoryId: "ho-tro-xuong-khop", name: "Tinh Chất Hàu Tươi Tỏi Nghệ Orihiro Của Nhật Bản 180 Viên", price: 405000, originalPrice: 1186000, image: "images/exact-15.jpg", badge: null, rating: 4.7, reviews: 204, sold: 466, tag: "Hàng Ngoại Nhập", isNew: false, isSale: true, isBestSeller: true },
  { id: 16, categoryId: "me-va-be", name: "The Collagen Shiseido dạng nước Nhật Bản 10 chai x 50ml", price: 432000, originalPrice: 800000, image: "images/exact-16.jpg", badge: null, rating: 4.6, reviews: 199, sold: 432, tag: "Hàng Ngoại Nhập", isNew: false, isSale: true, isBestSeller: false },
  { id: 17, categoryId: "thuc-pham-chuc-nang", name: "Kem dưỡng da vùng cổ Medi-Peel Naite Thread Neck Cream 100ml", price: 534000, originalPrice: 1351000, image: "images/exact-17.jpg", badge: "HOT", rating: 4.8, reviews: 233, sold: 359, tag: "Hàng Ngoại Nhập", isNew: false, isSale: false, isBestSeller: false },
  { id: 18, categoryId: "chong-lao-hoa", name: "Viên uống đột quỵ Nattokinase 2000FU Orihiro của Nhật Bản", price: 621000, originalPrice: 1327000, image: "images/exact-18.jpg", badge: "HOT", rating: 4.7, reviews: 92, sold: 1180, tag: "Hàng Ngoại Nhập", isNew: false, isSale: false, isBestSeller: false },
  { id: 19, categoryId: "ho-tro-xuong-khop", name: "Kem hồng nhũ hoa Nuwhite N1 Mibiti Prudente Professional Mỹ", price: 729000, originalPrice: 939000, image: "images/exact-19.jpg", badge: null, rating: 4.7, reviews: 118, sold: 739, tag: "Hàng Ngoại Nhập", isNew: false, isSale: true, isBestSeller: true },
  { id: 20, categoryId: "thuc-pham-chuc-nang", name: "Centrum Silver Ultra Mens 50+ 275 Viên Của Mỹ", price: 750000, originalPrice: 890000, image: "images/exact-20.jpg", badge: "HOT", rating: 4.9, reviews: 215, sold: 1200, tag: "Vitamin tổng hợp", isNew: false, isSale: true, isBestSeller: true },
  { id: 21, categoryId: "thuc-pham-chuc-nang", name: "Dầu cá SR Triple Strength Omega-3 Fish Oil 150 viên của Mỹ", price: 1060000, originalPrice: 1200000, image: "images/exact-21.jpg", badge: "CHÍNH HÃNG", rating: 4.7, reviews: 98, sold: 445, tag: "Hỗ trợ tim mạch", isNew: false, isSale: false, isBestSeller: false },
  { id: 22, categoryId: "thuc-pham-chuc-nang", name: "Schiff Move Free Joint Health Advanced 200 viên Mỹ", price: 980000, originalPrice: 1250000, image: "images/exact-22.jpg", badge: "HOT", rating: 4.8, reviews: 176, sold: 880, tag: "Hỗ trợ xương khớp", isNew: false, isSale: true, isBestSeller: true },
  { id: 23, categoryId: "thuc-pham-chuc-nang", name: "Nature Made Fish Oil 1200mg 200 viên Mỹ Omega 3", price: 620000, originalPrice: 790000, image: "images/exact-23.jpg", badge: null, rating: 4.7, reviews: 134, sold: 670, tag: "Hỗ trợ tim mạch", isNew: false, isSale: true, isBestSeller: false },
  { id: 24, categoryId: "thuc-pham-chuc-nang", name: "Kirkland Signature Vitamin D3 2000 IU 600 viên của Mỹ", price: 430000, originalPrice: 560000, image: "images/exact-24.jpg", badge: "BÁN CHẠY", rating: 4.9, reviews: 302, sold: 1500, tag: "Vitamin D", isNew: false, isSale: true, isBestSeller: true },
  { id: 25, categoryId: "thuc-pham-chuc-nang", name: "Nature's Bounty Biotin 10000mcg 120 viên của Mỹ", price: 360000, originalPrice: 480000, image: "images/exact-25.jpg", badge: null, rating: 4.6, reviews: 89, sold: 520, tag: "Tóc - Móng - Da", isNew: false, isSale: true, isBestSeller: false },
  { id: 26, categoryId: "thuc-pham-chuc-nang", name: "Garden of Life Vitamin Code Raw Iron 30 viên Mỹ", price: 490000, originalPrice: 620000, image: "images/exact-26.jpg", badge: "MỚI", rating: 4.5, reviews: 67, sold: 210, tag: "Bổ máu", isNew: true, isSale: true, isBestSeller: false },
  { id: 27, categoryId: "thuc-pham-chuc-nang", name: "Melatonin 10mg Nature Made 90 viên Mỹ hỗ trợ giấc ngủ", price: 320000, originalPrice: 420000, image: "images/exact-27.jpg", badge: null, rating: 4.8, reviews: 241, sold: 930, tag: "Hỗ trợ giấc ngủ", isNew: false, isSale: true, isBestSeller: true },
  { id: 28, categoryId: "thuc-pham-chuc-nang", name: "NOW Foods CoQ10 600mg 60 viên Mỹ tăng cường sức khỏe tim", price: 870000, originalPrice: 1100000, image: "images/exact-28.jpg", badge: "HOT", rating: 4.7, reviews: 112, sold: 560, tag: "Hỗ trợ tim mạch", isNew: false, isSale: true, isBestSeller: false },
  { id: 29, categoryId: "thuc-pham-chuc-nang", name: "Vicks NyQuil Cold & Flu Relief 48 Liquicaps của Mỹ", price: 440000, originalPrice: 580000, image: "images/exact-29.jpg", badge: null, rating: 4.6, reviews: 78, sold: 340, tag: "Cảm cúm", isNew: false, isSale: true, isBestSeller: false },
  { id: 30, categoryId: "thuc-pham-chuc-nang", name: "Nature Made Magnesium Glycinate 200mg 60 viên Mỹ", price: 560000, originalPrice: 720000, image: "images/exact-30.jpg", badge: "MỚI", rating: 4.8, reviews: 93, sold: 410, tag: "Bổ sung Magie", isNew: true, isSale: true, isBestSeller: false },
  { id: 31, categoryId: "thuc-pham-chuc-nang", name: "Spring Valley Zinc 50mg 200 viên Mỹ tăng đề kháng", price: 280000, originalPrice: 360000, image: "images/exact-31.jpg", badge: null, rating: 4.7, reviews: 158, sold: 720, tag: "Tăng đề kháng", isNew: false, isSale: true, isBestSeller: false },
  { id: 32, categoryId: "thuc-pham-chuc-nang", name: "Culturelle Pro Strength Daily Probiotic 30 viên Mỹ", price: 680000, originalPrice: 850000, image: "images/exact-32.jpg", badge: "BÁN CHẠY", rating: 4.8, reviews: 187, sold: 840, tag: "Hỗ trợ tiêu hóa", isNew: false, isSale: true, isBestSeller: true },
  { id: 33, categoryId: "thuc-pham-chuc-nang", name: "GNC Mega Men Sport Multivitamin 180 viên Mỹ cho nam", price: 820000, originalPrice: 1050000, image: "images/exact-33.jpg", badge: "HOT", rating: 4.7, reviews: 124, sold: 580, tag: "Vitamin tổng hợp", isNew: false, isSale: true, isBestSeller: false },
  { id: 34, categoryId: "thuc-pham-chuc-nang", name: "One A Day Women's Petites Multivitamin 160 viên Mỹ", price: 590000, originalPrice: 760000, image: "images/exact-34.jpg", badge: null, rating: 4.6, reviews: 145, sold: 490, tag: "Sức khỏe nữ giới", isNew: false, isSale: true, isBestSeller: false }
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
