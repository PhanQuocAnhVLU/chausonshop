// ================================================================
// data.js — Mock Data cho Châu Sơn Shop
// ================================================================

const SHOP_INFO = {
  name: "Châu Sơn Shop",
  tagline: "Chuyên Hàng Nhập",
  hotline: "0987.153.876",
  hotlineKS: "0987.153.876",
  address1: "Da Nang: 194 Le Am, Hoa Xuan",
  address2: "TP.HCM: 126A Tay Son, Phuong Phu Tho Hoa, Quan Tan Phu",
  email: "nhutu5556@gmail.com",
  zalo: "https://zalo.me/0987153876",
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
    cat: 'lam-dep', catLabel: 'Làm Đẹp', catColor: '#fce4ec', catTextColor: '#c62828',
    title: "Bí quyết chọn mua Collagen Nhật Bản chính hãng, an toàn và hiệu quả",
    image: "images/exact-2.jpg",
    time: "2 ngày trước, lúc 15:59",
    date: '2 ngày trước, 15:59', readTime: '5 phút',
    slug: "bi-quyet-chon-mua-collagen-nhat-ban",
    excerpt: "Thị trường collagen hiện nay rất đa dạng khiến người tiêu dùng khó lựa chọn. Bài viết hướng dẫn chi tiết cách phân biệt Collagen Shiseido thật giả và cách uống hiệu quả nhất.",
    content: `
      <p>Collagen là một trong những thực phẩm chức năng được phái đẹp tin dùng nhất hiện nay. Tuy nhiên, trên thị trường có rất nhiều loại sản phẩm khác nhau. Để chọn mua đúng loại Collagen Nhật Bản chất lượng, bạn cần lưu ý những điểm sau:</p>
      <h3>1. Nguồn gốc xuất xứ rõ ràng</h3>
      <p>Luôn yêu cầu người bán cung cấp hóa đơn chứng từ, mã vạch hoặc tem phụ tiếng Việt (nếu là hàng nhập khẩu chính ngạch). Đối với hàng xách tay, hãy chọn những cửa hàng uy tín có lịch sử bán hàng lâu năm.</p>
      <img src="images/exact-2.jpg" alt="Collagen Shiseido Nhật Bản" style="width:100%; border-radius:12px; margin: 20px 0;">
      <h3>2. Hàm lượng và thành phần</h3>
      <p>Mỗi loại cơ địa sẽ phù hợp với một hàm lượng nhất định. Đối với phụ nữ dưới 30 tuổi, hàm lượng 1000mg - 3000mg/ngày là phù hợp. Trên 30 tuổi có thể cần từ 5000mg/ngày trở lên.</p>
      <h3>3. Cách sử dụng hiệu quả</h3>
      <p>Nên uống vào buổi sáng trước khi ăn 30 phút hoặc buổi tối trước khi đi ngủ. Lúc này cơ thể hấp thu collagen tốt nhất.</p>
      <p><strong>Kết luận:</strong> Chọn mua collagen không khó nếu bạn biết cách kiểm tra. Hãy luôn đặt sức khỏe lên hàng đầu và đừng ham rẻ mà mua phải hàng kém chất lượng nhé!</p>
    `
  },
  {
    id: 2,
    cat: 'suc-khoe', catLabel: 'Sức Khỏe', catColor: '#e8f5e9', catTextColor: '#2e7d32',
    title: "Omega-3: Công dụng thần kỳ cho tim mạch và cách dùng chuẩn chuyên gia",
    image: "images/exact-3.jpg",
    time: "4 ngày trước, lúc 20:02",
    date: '4 ngày trước, 20:02', readTime: '4 phút',
    slug: "omega-3-cong-dung-than-ky",
    excerpt: "Omega-3 là axit béo thiết yếu cơ thể không tự tổng hợp được. Cùng tìm hiểu cách chọn viên uống Dầu cá Nature Made Fish Oil tốt nhất cho tim mạch.",
    content: `
      <p>Omega-3 mang lại vô vàn lợi ích tuyệt vời cho sức khỏe, đặc biệt là hệ tim mạch và trí não. Vậy uống như thế nào để phát huy tối đa công dụng?</p>
      <h3>Tác dụng của Omega-3</h3>
      <ul>
        <li>Giảm mỡ máu (Triglyceride) và nguy cơ mắc bệnh tim mạch.</li>
        <li>Phát triển trí não, cải thiện thị lực.</li>
        <li>Hỗ trợ giảm viêm, rất tốt cho người bị đau khớp.</li>
      </ul>
      <img src="images/exact-3.jpg" alt="Omega 3" style="width:100%; border-radius:12px; margin: 20px 0;">
      <h3>Uống Omega-3 lúc nào tốt nhất?</h3>
      <p>Omega-3 tan trong dầu (chất béo). Do đó, thời điểm lý tưởng nhất để uống là <strong>ngay sau bữa ăn</strong> chứa nhiều chất béo để cơ thể hấp thu tối đa.</p>
      <p>Chúc bạn luôn có một trái tim khỏe mạnh cùng bí quyết này!</p>
    `
  },
  {
    id: 3,
    cat: 'dinh-duong', catLabel: 'Dinh Dưỡng', catColor: '#fff3e0', catTextColor: '#e65100',
    title: "Cao hồng sâm Hàn Quốc: Món quà sức khỏe vô giá cho người lớn tuổi",
    image: "images/bing2-prod-26.jpg",
    time: "1 tuần trước, lúc 14:58",
    date: '1 tuần trước, 14:58', readTime: '6 phút',
    slug: "cao-hong-sam-han-quoc-qua-suc-khoe",
    excerpt: "Cao hồng sâm 365 chứa hàm lượng Saponin cao, giúp bồi bổ cơ thể, tăng cường sức đề kháng và cải thiện trí nhớ. Phù hợp làm quà tặng ý nghĩa cho ông bà, cha mẹ.",
    content: `
      <p>Khi tuổi tác ngày càng cao, hệ miễn dịch suy giảm dẫn đến nhiều vấn đề sức khỏe. Cao hồng sâm Hàn Quốc từ lâu đã được xem là "thần dược" bồi bổ sức khỏe cho người lớn tuổi.</p>
      <h3>Tại sao nên chọn cao hồng sâm?</h3>
      <p>Hồng sâm qua quá trình hấp sấy có chứa hàm lượng Saponin cao gấp nhiều lần nhân sâm tươi. Dạng cao đặc giúp cơ thể dễ dàng hấp thu và tiện lợi khi sử dụng.</p>
      <img src="images/bing2-prod-26.jpg" alt="Cao Hồng Sâm" style="width:100%; border-radius:12px; margin: 20px 0;">
      <h3>Công dụng chính</h3>
      <ul>
        <li>Tăng cường trí nhớ, giảm mệt mỏi.</li>
        <li>Ổn định huyết áp, tốt cho hệ tuần hoàn.</li>
        <li>Cải thiện chất lượng giấc ngủ.</li>
      </ul>
    `
  },
  {
    id: 4,
    cat: 'suc-khoe', catLabel: 'Sức Khỏe', catColor: '#e8f5e9', catTextColor: '#2e7d32',
    title: "Phục hồi sụn khớp hiệu quả với viên uống Schiff Move Free Advanced",
    image: "images/bing2-prod-18.jpg",
    time: "2 tuần trước, lúc 09:19",
    date: '2 tuần trước, 09:19', readTime: '4 phút',
    slug: "phuc-hoi-sun-khop-schiff-move-free",
    excerpt: "Đau nhức xương khớp ở người già có thể được cải thiện đáng kể với Glucosamine và Chondroitin. Tìm hiểu cơ chế tác động của Schiff Move Free.",
    content: `
      <p>Đau nhức xương khớp không chỉ ảnh hưởng đến khả năng vận động mà còn làm giảm chất lượng cuộc sống đáng kể. Sản phẩm Schiff Move Free Advanced ra đời như một giải pháp tuyệt vời.</p>
      <h3>Thành phần vượt trội</h3>
      <p>Với sự kết hợp của Glucosamine, Chondroitin và Hyaluronic Acid, sản phẩm không chỉ giảm đau mà còn hỗ trợ tái tạo lớp sụn khớp bị bào mòn.</p>
      <img src="images/bing2-prod-18.jpg" alt="Schiff Move Free" style="width:100%; border-radius:12px; margin: 20px 0;">
    `
  },
  {
    id: 5,
    cat: 'lam-dep', catLabel: 'Làm Đẹp', catColor: '#fce4ec', catTextColor: '#c62828',
    title: "Review chi tiết kem dưỡng vùng cổ Medi-Peel: Có thực sự tốt như lời đồn?",
    image: "images/bing2-prod-20.jpg",
    time: "1 tháng trước, lúc 11:30",
    date: '1 tháng trước, 11:30', readTime: '5 phút',
    slug: "review-kem-duong-co-medi-peel",
    excerpt: "Vùng cổ rất dễ tố cáo tuổi tác thật của bạn nếu không được chăm sóc đúng cách. Cùng review hiệu quả nâng cơ, chống nhăn của kem cổ Medi-Peel Naite Thread.",
    content: `
      <p>Phụ nữ thường tập trung chăm sóc da mặt mà quên đi vùng cổ. Thực tế, cổ là nơi có lớp da mỏng manh và dễ lão hóa nhất. Hãy cùng Châu Sơn Shop review kem dưỡng cổ Medi-Peel đang rất hot nhé.</p>
      <h3>Trải nghiệm kết cấu</h3>
      <p>Chất kem khá đặc và có độ kéo sợi giống như chất nhầy ốc sên, giúp bám chặt vào da và cung cấp độ ẩm sâu.</p>
      <img src="images/bing2-prod-20.jpg" alt="Kem cổ Medi-Peel" style="width:100%; border-radius:12px; margin: 20px 0;">
      <h3>Hiệu quả sau 4 tuần</h3>
      <p>Sự săn chắc thấy rõ, các nếp nhăn li ti mờ đi đáng kể. Đây thực sự là sản phẩm "must-have" cho chị em ngoài 25 tuổi.</p>
    `
  },
  {
    id: 6,
    cat: 'meo-vat', catLabel: 'Mẹo vặt', catColor: '#fff8e1', catTextColor: '#f57f17',
    title: "Top 10 thực phẩm chức năng ngoại nhập bán chạy nhất đáng để thử",
    image: "images/exact-1.jpg",
    time: "2 tháng trước, lúc 10:00",
    date: '2 tháng trước, 10:00', readTime: '7 phút',
    slug: "top-10-tpcn-ngoai-nhap",
    excerpt: "Với hàng trăm sản phẩm trên thị trường, đâu là những sản phẩm được tin tưởng nhất? Danh sách top 10 được tổng hợp từ đánh giá của chuyên gia và khách hàng.",
    content: `
      <p>Bạn đang tìm kiếm thực phẩm chức năng bảo vệ sức khỏe cho cả gia đình nhưng lại hoa mắt với hàng loạt lựa chọn? Dưới đây là những sản phẩm "quốc dân" được nhiều người ưa chuộng.</p>
      <h3>Sản phẩm hàng đầu</h3>
      <ul>
        <li>Viên uống sữa ong chúa Úc - đẹp da, tăng cường đề kháng</li>
        <li>Vitamin tổng hợp Centrum - phù hợp mọi lứa tuổi</li>
        <li>Sâm tươi Hàn Quốc - món quà biếu thượng hạng</li>
      </ul>
      <p>Ghé ngay Châu Sơn Shop để chọn mua hàng chính hãng với mức giá ưu đãi nhất nhé!</p>
    `
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

const PRODUCTS_FALLBACK = [
  // ===== THỰC PHẨM CHỨC NĂNG =====
  { id: 1, categoryId: "thuc-pham-chuc-nang", name: "Viên uống hỗ trợ tiêu hóa dạ dày Tinh Chất Hàu Tươi Tỏi Nghệ Orihiro Nhật 180 Viên", price: 405000, originalPrice: 1186000, image: "images/bing3-prod-1.jpg", badge: null, rating: 4.7, reviews: 204, sold: 466, tag: "Hỗ trợ tiêu hóa, dạ dày", isNew: false, isSale: true, isBestSeller: true },
  { id: 2, categoryId: "thuc-pham-chuc-nang", name: "Viên uống Nattokinase 2000FU Orihiro của Nhật Bản hỗ trợ tim mạch", price: 621000, originalPrice: 1327000, image: "images/bing3-prod-2.jpg", badge: "HOT", rating: 4.7, reviews: 92, sold: 1180, tag: "Hỗ trợ tim mạch", isNew: false, isSale: false, isBestSeller: true },
  { id: 3, categoryId: "thuc-pham-chuc-nang", name: "Centrum Silver Ultra Mens 50+ 275 Viên Của Mỹ", price: 750000, originalPrice: 890000, image: "images/bing3-prod-3.jpg", badge: "HOT", rating: 4.9, reviews: 215, sold: 1200, tag: "Vitamin tổng hợp", isNew: false, isSale: true, isBestSeller: true },
  { id: 4, categoryId: "thuc-pham-chuc-nang", name: "Dầu cá SR Triple Strength Omega-3 Fish Oil 150 viên của Mỹ", price: 1060000, originalPrice: 1200000, image: "images/bing3-prod-4.jpg", badge: "CHÍNH HÃNG", rating: 4.7, reviews: 98, sold: 445, tag: "Hỗ trợ tim mạch", isNew: false, isSale: false, isBestSeller: false },
  { id: 5, categoryId: "thuc-pham-chuc-nang", name: "Nature Made Fish Oil 1200mg 200 viên Mỹ Omega 3", price: 620000, originalPrice: 790000, image: "images/bing3-prod-5.jpg", badge: null, rating: 4.7, reviews: 134, sold: 670, tag: "Hỗ trợ tim mạch", isNew: false, isSale: true, isBestSeller: false },
  { id: 6, categoryId: "thuc-pham-chuc-nang", name: "NOW Foods CoQ10 600mg 60 viên Mỹ tăng cường sức khỏe tim mạch", price: 870000, originalPrice: 1100000, image: "images/bing3-prod-6.jpg", badge: "HOT", rating: 4.7, reviews: 112, sold: 560, tag: "Hỗ trợ tim mạch", isNew: false, isSale: true, isBestSeller: false },
  { id: 7, categoryId: "thuc-pham-chuc-nang", name: "Culturelle Pro Strength Daily Probiotic 30 viên Mỹ hỗ trợ tiêu hóa", price: 680000, originalPrice: 850000, image: "images/bing3-prod-7.jpg", badge: "BÁN CHẠY", rating: 4.8, reviews: 187, sold: 840, tag: "Hỗ trợ tiêu hóa, dạ dày", isNew: false, isSale: true, isBestSeller: true },

  { id: 10, categoryId: "thuc-pham-chuc-nang", name: "Melatonin 10mg Nature Made 90 viên Mỹ hỗ trợ giấc ngủ", price: 320000, originalPrice: 420000, image: "images/bing3-prod-10.jpg", badge: null, rating: 4.8, reviews: 241, sold: 930, tag: "Hỗ trợ giấc ngủ", isNew: false, isSale: true, isBestSeller: true },
  { id: 11, categoryId: "thuc-pham-chuc-nang", name: "Spring Valley Zinc 50mg 200 viên Mỹ tăng đề kháng miễn dịch", price: 280000, originalPrice: 360000, image: "images/bing3-prod-11.jpg", badge: null, rating: 4.7, reviews: 158, sold: 720, tag: "Tăng đề kháng", isNew: false, isSale: true, isBestSeller: false },
  { id: 12, categoryId: "thuc-pham-chuc-nang", name: "Garden of Life Vitamin Code Raw Iron 30 viên Mỹ bổ máu", price: 490000, originalPrice: 620000, image: "images/bing3-prod-12.jpg", badge: "MỚI", rating: 4.5, reviews: 67, sold: 210, tag: "Hỗ Trợ Sinh Lý", isNew: true, isSale: true, isBestSeller: false },
  { id: 13, categoryId: "thuc-pham-chuc-nang", name: "Kirkland Signature Vitamin D3 2000 IU 600 viên của Mỹ", price: 430000, originalPrice: 560000, image: "images/bing3-prod-13.jpg", badge: "BÁN CHẠY", rating: 4.9, reviews: 302, sold: 1500, tag: "Vitamin tổng hợp", isNew: false, isSale: true, isBestSeller: true },

  // ===== CHỐNG LÃO HÓA =====
  { id: 14, categoryId: "chong-lao-hoa", name: "Viên uống vitamin E 180mg 400IU Kirkland 500 softgels của Mỹ", price: 779000, originalPrice: 1346000, image: "images/bing2-prod-14.jpg", badge: "BEST", rating: 5.0, reviews: 320, sold: 1016, tag: "Vitamin E", isNew: false, isSale: false, isBestSeller: true },
  { id: 15, categoryId: "chong-lao-hoa", name: "The Collagen Shiseido dạng nước Nhật Bản 10 chai x 50ml", price: 432000, originalPrice: 800000, image: "images/bing2-prod-15.jpg", badge: "HOT", rating: 4.6, reviews: 199, sold: 432, tag: "Collagen", isNew: false, isSale: true, isBestSeller: false },
  { id: 16, categoryId: "chong-lao-hoa", name: "Chai xịt keo ong Vitatree Super Propolis Spray Complex 30ml Úc", price: 406000, originalPrice: 1129000, image: "images/bing2-prod-16.jpg", badge: null, rating: 4.7, reviews: 96, sold: 737, tag: "Sữa ong chúa", isNew: false, isSale: false, isBestSeller: false },
  { id: 17, categoryId: "chong-lao-hoa", name: "Nature's Bounty Biotin 10000mcg 120 viên của Mỹ làm đẹp da, tóc", price: 360000, originalPrice: 480000, image: "images/bing2-prod-17.jpg", badge: null, rating: 4.6, reviews: 89, sold: 520, tag: "Vitamin", isNew: false, isSale: true, isBestSeller: false },

  // ===== HỖ TRỢ XƯƠNG KHỚP =====
  { id: 18, categoryId: "ho-tro-xuong-khop", name: "Schiff Move Free Joint Health Advanced 200 viên Mỹ", price: 980000, originalPrice: 1250000, image: "images/bing2-prod-18.jpg", badge: "HOT", rating: 4.8, reviews: 176, sold: 880, tag: "Trị đau khớp", isNew: false, isSale: true, isBestSeller: true },
  { id: 19, categoryId: "ho-tro-xuong-khop", name: "Nature Made Magnesium Glycinate 200mg 60 viên Mỹ", price: 560000, originalPrice: 720000, image: "images/bing2-prod-19.jpg", badge: "MỚI", rating: 4.8, reviews: 93, sold: 410, tag: "Trị đau khớp", isNew: true, isSale: true, isBestSeller: false },

  // ===== MỸ PHẨM =====
  { id: 20, categoryId: "my-pham", name: "Kem dưỡng da vùng cổ Medi-Peel Naite Thread Neck Cream 100ml", price: 534000, originalPrice: 1351000, image: "images/bing2-prod-20.jpg", badge: "HOT", rating: 4.8, reviews: 233, sold: 359, tag: "Kem dưỡng da", isNew: false, isSale: false, isBestSeller: false },
  { id: 21, categoryId: "my-pham", name: "Kem hồng nhũ hoa Nuwhite N1 Mibiti Prudente Professional Mỹ", price: 729000, originalPrice: 939000, image: "images/bing2-prod-21.jpg", badge: null, rating: 4.7, reviews: 118, sold: 739, tag: "Kem dưỡng da", isNew: false, isSale: true, isBestSeller: true },
  { id: 22, categoryId: "my-pham", name: "Kem đánh trắng răng Nuskin AP24 Whitening Fluoride Toothpaste Mỹ", price: 327000, originalPrice: 1046000, image: "images/bing2-prod-22.jpg", badge: null, rating: 4.6, reviews: 99, sold: 478, tag: "Chăm sóc răng miệng", isNew: true, isSale: false, isBestSeller: false },
  { id: 23, categoryId: "my-pham", name: "Viên uống trắng da chống nắng Fresa Whitening & Sunblock", price: 392000, originalPrice: 647000, image: "images/bing2-prod-23.jpg", badge: null, rating: 4.9, reviews: 218, sold: 532, tag: "Kem chống nắng", isNew: false, isSale: true, isBestSeller: true },
  { id: 24, categoryId: "my-pham", name: "Dịch vệ sinh phụ nữ Inner Gel Wettrust 30 ống hồng Hàn Quốc", price: 456000, originalPrice: 1229000, image: "images/bing2-prod-24.jpg", badge: null, rating: 4.7, reviews: 99, sold: 311, tag: "Chăm sóc phụ nữ", isNew: false, isSale: true, isBestSeller: false },
  { id: 25, categoryId: "my-pham", name: "Xịt kéo dài thời gian quan hệ Stud 100 Spray Delay For Men", price: 723000, originalPrice: 1049000, image: "images/bing2-prod-25.jpg", badge: null, rating: 4.6, reviews: 141, sold: 441, tag: "Sức khỏe nữ giới", isNew: false, isSale: true, isBestSeller: false },

  // ===== SÂM, NẤM, CAO =====
  { id: 26, categoryId: "sam-nam-cao", name: "Cao hồng sâm 365 Hàn Quốc 6 năm tuổi Hộp 250g chính hãng", price: 1350000, originalPrice: 1800000, image: "images/bing2-prod-26.jpg", badge: "HOT", rating: 4.9, reviews: 178, sold: 890, tag: "Hồng sâm Hàn Quốc", isNew: false, isSale: true, isBestSeller: true },
  { id: 27, categoryId: "sam-nam-cao", name: "Nước nhung hươu hồng sâm núi 365 Hansusam Hàn Quốc hộp 30 gói", price: 980000, originalPrice: 1250000, image: "images/bing2-prod-27.jpg", badge: null, rating: 4.8, reviews: 134, sold: 560, tag: "Nhung hươu", isNew: false, isSale: true, isBestSeller: false },
  { id: 28, categoryId: "sam-nam-cao", name: "An Cung Ngưu Hoàng Hoàn Kwang Dong Hàn Quốc hộp 10 viên", price: 2800000, originalPrice: 3500000, image: "images/bing2-prod-28.jpg", badge: "CHÍNH HÃNG", rating: 5.0, reviews: 89, sold: 312, tag: "An cung ngưu hoàng", isNew: false, isSale: true, isBestSeller: true },

  // ===== BÁNH KẸO =====
  { id: 29, categoryId: "banh-keo", name: "Socola rượu Anthon Berg Since 1884 Chocolate 64 chai của Mỹ", price: 494000, originalPrice: 787000, image: "images/bing2-prod-29.jpg", badge: null, rating: 5.0, reviews: 207, sold: 1076, tag: "Socola", isNew: false, isSale: true, isBestSeller: true },
  { id: 30, categoryId: "banh-keo", name: "Kẹo socola Hershey's Nuggets Assortment 1.47kg 145 viên Mỹ", price: 386000, originalPrice: 811000, image: "images/bing2-prod-30.jpg", badge: "HOT", rating: 4.9, reviews: 91, sold: 1133, tag: "Socola", isNew: false, isSale: false, isBestSeller: true },
  { id: 31, categoryId: "banh-keo", name: "Kẹo dẻo gấu Haribo Goldbears 1kg Đức chính hãng", price: 320000, originalPrice: 420000, image: "images/bing2-prod-31.jpg", badge: null, rating: 4.8, reviews: 165, sold: 780, tag: "Kẹo dẻo", isNew: false, isSale: true, isBestSeller: false },
  { id: 32, categoryId: "banh-keo", name: "Bánh quy Oreo Mega Stuf Double 482g Mỹ", price: 185000, originalPrice: 250000, image: "images/bing2-prod-32.jpg", badge: null, rating: 4.7, reviews: 230, sold: 1450, tag: "Bánh quy", isNew: false, isSale: true, isBestSeller: true },

  // ===== HÀNG GIA DỤNG =====
  { id: 33, categoryId: "hang-gia-dung", name: "Viên giặt xả Gel Ball 3D nội địa Nhật Bản (46 viên)", price: 299000, originalPrice: 400000, image: "images/bing-prod-33.jpg", badge: "HOT", rating: 4.8, reviews: 210, sold: 980, tag: "Vệ sinh", isNew: false, isSale: true, isBestSeller: true },
  { id: 34, categoryId: "hang-gia-dung", name: "Bình giữ nhiệt Thermos JNL-504 500ml cao cấp Nhật Bản", price: 590000, originalPrice: 850000, image: "images/bing-prod-34.jpg", badge: null, rating: 4.9, reviews: 154, sold: 420, tag: "Phòng ngủ", isNew: true, isSale: true, isBestSeller: false },
  { id: 35, categoryId: "hang-gia-dung", name: "Nồi chiên không dầu Philips HD9252/90 4.1L Đức", price: 2150000, originalPrice: 2890000, image: "images/bing-prod-35.jpg", badge: "SALE", rating: 4.8, reviews: 325, sold: 1100, tag: "Nhà bếp", isNew: false, isSale: true, isBestSeller: true },
  { id: 36, categoryId: "hang-gia-dung", name: "Nước tẩy lồng giặt Rocket Nhật Bản chai 550g", price: 65000, originalPrice: 95000, image: "images/bing-prod-36.jpg", badge: null, rating: 4.6, reviews: 88, sold: 340, tag: "Vệ sinh", isNew: false, isSale: false, isBestSeller: false }
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

