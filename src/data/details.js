/* ============================================================
   NỘI DUNG CÁC TRANG CHI TIẾT (/tong-quan, /gia-ban, /chinh-sach-ban-hang, /chu-dau-tu, /tien-do, /hoi-dap)
   Tổng hợp từ thông tin dự án đã công bố (11/2026). Giá, chính sách, tiến độ, pháp lý có thể được chủ đầu tư
   điều chỉnh — đối chiếu bảng giá / thông báo chính thức trước khi cập nhật.
   Mỗi khoá có bản vi và en (bản tiếng Anh hiển thị ở /en/…).
   ============================================================ */

export const details = {
  vi: {
    /* ---------- /tong-quan ---------- */
    overview: {
      title: 'Thông tin tổng quan',
      rows: [
        ['Tên dự án', 'Norton Park — A Gamuda Land Community'],
        ['Chủ đầu tư', 'Gamuda Land (thuộc Tập đoàn Gamuda Berhad, Malaysia)'],
        ['Vị trí', 'Số 5 Đại lộ Bình Dương (Quốc lộ 13), Phường Thuận Giao, TP.HCM (trước đây thuộc TP. Thuận An, Bình Dương)'],
        ['Tổng diện tích', '7,9 ha'],
        ['Mật độ xây dựng', '20% toàn dự án (27% trên khu đất hai phân khu B và C)'],
        ['Cảnh quan, công viên', '2,5 ha, trồng rừng theo phương pháp Miyawaki'],
        ['Quy mô', '2 phân khu, 6 toà tháp cao 19 tầng, 1 tầng hầm'],
        ['Số sản phẩm', '1.286 sản phẩm: 1.256 căn hộ và 30 căn thương mại'],
        ['Loại hình', 'Studio, 1PN+, 2PN, 2PN+, 3PN, căn hộ sân vườn, Duplex, Duplex sân vườn, Podium Shop, Standalone Shop'],
        ['Hình thức sở hữu', 'Sở hữu lâu dài (người nước ngoài: 50 năm theo quy định)'],
        ['Tiêu chuẩn bàn giao', 'Hoàn thiện cơ bản'],
        ['Bàn giao dự kiến', 'Quý 3/2029'],
      ],
      zonesTitle: 'Hai phân khu căn hộ',
      zones: [
        {
          name: 'Phân khu B — Pulse Forest',
          body: 'Ba toà B1, B2, B3 với 654 căn hộ (B1: 201 căn, B2: 250 căn, B3: 203 căn), sát AEON Mall Thuận Giao và gần cổng KCN VSIP 1. Đây là phân khu mở bán đầu tiên.',
        },
        {
          name: 'Phân khu C — Cloud Forest',
          body: 'Phân khu thứ hai của dự án, thông tin sản phẩm sẽ được chủ đầu tư công bố ở giai đoạn sau.',
        },
      ],
      designTitle: 'Điểm nhấn quy hoạch',
      design: [
        { title: 'Quy hoạch “The Cluster”', body: 'Các toà tháp xen kẽ khối thấp tầng và cửa hàng độc lập, khoảng cách giữa các toà từ khoảng 16 m đến 35 m để đón gió và ánh sáng.' },
        { title: 'Hơn 95% căn hộ hai mặt thoáng', body: 'Mặt bằng tầng được thiết kế để phần lớn căn hộ có ít nhất hai mặt tiếp xúc thiên nhiên; toàn bộ căn 3 phòng ngủ Phân khu B là căn góc.' },
        { title: 'Cảnh quan Forestscape', body: 'Rừng nhiều tầng tán, vườn mưa, vườn chữa lành và lối dạo trong rừng, do Belt Collins tư vấn thiết kế cảnh quan.' },
        { title: 'Khối đế thương mại', body: 'Trục thương mại với dãy Podium Shop hai tầng, cửa hàng độc lập và lối dạo cà phê phục vụ cư dân và khu vực xung quanh.' },
      ],
    },

    /* ---------- /gia-ban ---------- */
    price: {
      title: 'Bảng giá tham khảo theo loại căn',
      note: 'Đơn giá tham khảo từ 66 triệu/m² (bảng giá 11/2026). “Giá từ” tính trên căn có diện tích tim tường (GFA) nhỏ nhất của mỗi loại, chưa gồm chiết khấu theo phương thức thanh toán. Giá thực tế thay đổi theo tầng, hướng, view và phương thức thanh toán.',
      cols: ['Loại căn', 'Diện tích GFA (m²)', 'Diện tích NSA (m²)', 'Giá từ'],
      contact: 'Liên hệ',
      factorsTitle: 'Giá căn hộ phụ thuộc vào',
      factors: [
        'Vị trí tầng: tầng 3–9 và tầng 10–19 có mã căn và đơn giá khác nhau.',
        'Hướng và tầm nhìn: công viên nội khu, sân golf Sông Bé, trục thương mại hoặc nội khu.',
        'Phương thức thanh toán: chiết khấu từ 1% đến 10% tuỳ phương thức (xem Chính sách bán hàng).',
        'Loại hình đặc tuyển: căn sân vườn, Duplex và Podium Shop có bảng giá riêng.',
      ],
    },

    /* ---------- /chinh-sach-ban-hang ---------- */
    policy: {
      milestonesTitle: 'Các mốc thanh toán chính',
      milestones: [
        { when: '12/2026', what: 'Ký hợp đồng mua bán (dự kiến)' },
        { when: '2027 – 2029', what: 'Thanh toán theo tiến độ của phương thức đã chọn' },
        { when: '09/2029', what: 'Bàn giao căn hộ (dự kiến)' },
        { when: 'Khi nhận sổ', what: 'Thanh toán 5% cuối cùng' },
      ],
      plansTitle: '5 phương thức thanh toán',
      plansNote: 'Khách hàng chọn một trong năm phương thức. Đặt chỗ sớm trong thời hạn chủ đầu tư công bố được chiết khấu thêm 1%.',
      discountLabel: 'Chiết khấu',
      plans: [
        {
          name: 'PTTT 1 — Chuẩn', discount: '5%',
          steps: ['Ký HĐMB (12/2026): 15%', '10 đợt, mỗi đợt cách 3 tháng (03/2027 – 06/2029): 5 đợt 2%, 3 đợt 5%, 2 đợt 10%', 'Bàn giao (09/2029): 35%', 'Nhận sổ: 5%'],
        },
        {
          name: 'PTTT 2 — 10 điểm thanh toán', discount: '1%',
          steps: ['Ký HĐMB: 10%', '3 đợt 5%, mỗi đợt cách 6 tháng', 'Tiếp theo 1 đợt 5% và 3 đợt 10%, mỗi đợt cách 3 tháng', 'Bàn giao (09/2029): 35%', 'Nhận sổ: 5%'],
        },
        {
          name: 'PTTT 3 — Nửa năm một đợt', discount: '2%',
          steps: ['Ký HĐMB: 10%', '5 đợt mỗi 6 tháng (06/2027 – 06/2029): 5%, 5%, 15%, 15%, 15%', 'Bàn giao (09/2029): 30%', 'Nhận sổ: 5%'],
        },
        {
          name: 'PTTT 4 — Thanh toán nhanh', discount: '10%',
          steps: ['Ký HĐMB: 15%', '3 đợt mỗi 3 tháng (03/2027 – 09/2027): 20%, 20%, 15%', 'Bàn giao (09/2029): 25%', 'Nhận sổ: 5%'],
        },
        {
          name: 'PTTT 5 — Vay ngân hàng', discount: 'Hỗ trợ lãi suất',
          steps: ['Ký HĐMB: 10%', 'Ngân hàng giải ngân 3 đợt 20% (09/2027, 12/2027, 03/2028)', 'Bàn giao (09/2029): 25% (15% ngân hàng, 10% khách hàng)', 'Nhận sổ: 5%'],
        },
      ],
      noteTitle: 'Lưu ý',
      notes: [
        'Chính sách và tiến độ thanh toán áp dụng theo bảng giá 11/2026, có thể thay đổi theo từng đợt mở bán.',
        'Ngân hàng hỗ trợ, tỷ lệ cho vay và thời gian hỗ trợ lãi suất theo chương trình tại thời điểm ký hợp đồng.',
        'Bảng dòng tiền chi tiết theo từng mã căn được gửi kèm báo giá khi đăng ký tư vấn.',
      ],
    },

    /* ---------- /chu-dau-tu ---------- */
    developer: {
      title: 'Về Gamuda Land',
      paras: [
        'Gamuda Land là đơn vị phát triển bất động sản của Tập đoàn Gamuda Berhad (Malaysia, thành lập năm 1976) — tập đoàn hạ tầng và phát triển đô thị niêm yết tại Malaysia.',
        'Gamuda Land được thành lập năm 1995, có mặt tại Việt Nam từ năm 2007 và đã phát triển 11 dự án tại Hà Nội, TP.HCM, Hải Phòng và Đồng Nai.',
      ],
      projectsTitle: 'Dự án tiêu biểu tại Việt Nam',
      projects: [
        { name: 'Gamuda City', place: 'Hà Nội', body: 'Khu đô thị 274 ha với công viên Yên Sở.' },
        { name: 'Celadon City', place: 'TP.HCM', body: 'Khu đô thị 82 ha tại Tân Phú.' },
        { name: 'Eaton Park', place: 'TP.HCM', body: 'Dự án căn hộ trên đường Mai Chí Thọ, Thủ Đức.' },
        { name: 'Elysian', place: 'TP.HCM', body: 'Dự án căn hộ tại Thủ Đức.' },
        { name: 'Artisan Park', place: 'Bình Dương', body: 'Khu phức hợp thương mại, văn phòng và căn hộ.' },
      ],
      gquasTitle: 'Kiểm soát chất lượng GQUAS',
      gquas: 'Các dự án của Gamuda Land áp dụng hệ thống đánh giá chất lượng công trình GQUAS (xây dựng trên nền CONQUAS của Singapore). Từng toà tháp được kiểm tra theo GQUAS trước khi bàn giao.',
    },

    /* ---------- /tien-do ---------- */
    progress: {
      timelineTitle: 'Mốc thời gian dự án',
      timeline: [
        { when: '10/2026', what: 'Lễ ra mắt The Sync Show với khoảng 2.000 chuyên viên kinh doanh.' },
        { when: '11/2026', what: 'Công bố bảng giá và chính sách bán hàng Phân khu B.' },
        { when: '12/2026', what: 'Dự kiến ký hợp đồng mua bán.' },
        { when: 'Cuối 2026', what: 'Dự kiến hoàn tất thi công cọc, ba toà Phân khu B đào đất tầng hầm.' },
        { when: 'Quý 3/2029', what: 'Dự kiến bàn giao căn hộ.' },
      ],
      updateTitle: 'Cập nhật công trường tháng 11/2026',
      update: [
        'Toàn bộ khu đất đã được rào tôn, công trường có ít nhất hai cẩu tháp cùng máy đào, xe tải và máy khoan cọc nhồi.',
        'Khu phía phải: thi công cọc và tường vây cơ bản hoàn tất; đang đào hố móng, thi công đài cọc, giằng móng và đổ bê tông một phần sàn móng tầng hầm.',
        'Khu phía trái: san lấp mặt bằng, xử lý nền đất yếu và ép cọc.',
      ],
      legalTitle: 'Hồ sơ pháp lý đã công bố',
      legal: [
        'Chấp thuận chủ trương đầu tư.',
        'Giấy chứng nhận quyền sử dụng đất toàn khu 7,9 ha.',
        'Quy hoạch chi tiết tỷ lệ 1/500 được phê duyệt.',
        'Miễn giấy phép xây dựng do đã thẩm định thiết kế cơ sở và thiết kế kỹ thuật.',
      ],
      legalNote: 'Số và ngày của từng văn bản được cung cấp khi ký hợp đồng. Thông tin chính thức căn cứ theo hồ sơ của chủ đầu tư.',
    },

    /* ---------- /hoi-dap (bổ sung cho FAQ trang chủ) ---------- */
    faqExtra: [
      { q: 'Giá bán căn hộ Norton Park bao nhiêu?', a: 'Theo bảng giá 11/2026, đơn giá tham khảo từ 66 triệu/m². Căn Studio (42,12 m²) từ khoảng 2,78 tỷ đồng, 2 phòng ngủ từ khoảng 4,38 tỷ, 3 phòng ngủ từ khoảng 6,29 tỷ, chưa gồm chiết khấu. Giá thay đổi theo tầng, hướng và phương thức thanh toán.' },
      { q: 'Norton Park có những phương thức thanh toán nào?', a: 'Có 5 phương thức: Chuẩn (chiết khấu 5%), 10 điểm thanh toán (1%), nửa năm một đợt (2%), thanh toán nhanh (10%) và vay ngân hàng có hỗ trợ lãi suất. Ký hợp đồng mua bán thanh toán 10–15%, khi bàn giao 25–35% và 5% khi nhận sổ.' },
      { q: 'Khi nào ký hợp đồng mua bán?', a: 'Hợp đồng mua bán dự kiến ký vào tháng 12/2026, theo thông báo của chủ đầu tư.' },
      { q: 'Căn hộ Norton Park sở hữu bao lâu?', a: 'Căn hộ được sở hữu lâu dài với người mua Việt Nam. Người nước ngoài được sở hữu 50 năm theo quy định của Luật Nhà ở.' },
      { q: 'Căn hộ bàn giao theo tiêu chuẩn nào?', a: 'Căn hộ bàn giao hoàn thiện cơ bản, dự kiến vào Quý 3/2029. Danh mục vật liệu chi tiết quy định trong hợp đồng mua bán.' },
      { q: 'Phân khu B có bao nhiêu căn hộ?', a: 'Phân khu B (Pulse Forest) gồm ba toà B1, B2, B3 với 654 căn: B1 có 201 căn, B2 có 250 căn và B3 có 203 căn.' },
      { q: 'Có thể vay ngân hàng khi mua Norton Park không?', a: 'Có. Phương thức thanh toán số 5 cho phép ngân hàng giải ngân theo tiến độ từ năm 2027, kèm hỗ trợ lãi suất theo chương trình tại thời điểm ký hợp đồng.' },
      { q: 'Nhà mẫu Norton Park ở đâu?', a: 'Nhà mẫu và khu trưng bày (Sales Gallery) nằm trong khuôn viên dự án tại Số 5 Đại lộ Bình Dương, Phường Thuận Giao. Đăng ký trước để được sắp xếp lịch tham quan.' },
    ],
  },

  en: {
    overview: {
      title: 'Project overview',
      rows: [
        ['Project', 'Norton Park — A Gamuda Land Community'],
        ['Developer', 'Gamuda Land (part of Gamuda Berhad, Malaysia)'],
        ['Location', '5 Binh Duong Boulevard (National Road 13), Thuan Giao Ward, Ho Chi Minh City (formerly Thuan An, Binh Duong)'],
        ['Site area', '7.9 ha'],
        ['Building density', '20% overall (27% on the plots of Zones B and C)'],
        ['Landscape and parks', '2.5 ha, planted with the Miyawaki forest method'],
        ['Scale', '2 zones, 6 towers of 19 floors, 1 basement'],
        ['Units', '1,286 units: 1,256 apartments and 30 commercial units'],
        ['Home types', 'Studio, 1BR+, 2BR, 2BR+, 3BR, garden homes, Duplex, garden Duplex, Podium Shop, Standalone Shop'],
        ['Ownership', 'Long-term ownership (foreigners: 50 years as regulated)'],
        ['Handover standard', 'Basic finishing'],
        ['Expected handover', 'Q3/2029'],
      ],
      zonesTitle: 'Two residential zones',
      zones: [
        { name: 'Zone B — Pulse Forest', body: 'Towers B1, B2 and B3 with 654 homes (B1: 201, B2: 250, B3: 203), next to AEON Mall Thuan Giao and near the VSIP 1 gate. This is the first zone on sale.' },
        { name: 'Zone C — Cloud Forest', body: 'The second zone of the project; product details will be announced by the developer in a later phase.' },
      ],
      designTitle: 'Planning highlights',
      design: [
        { title: '“The Cluster” plan', body: 'Towers mixed with low-rise blocks and standalone shops, with about 16 m to 35 m between towers to let in wind and daylight.' },
        { title: 'Over 95% dual-aspect homes', body: 'Typical floors are planned so most homes have at least two open sides; every 3BR home in Zone B is a corner unit.' },
        { title: 'Forestscape landscape', body: 'A multi-layer forest, rain gardens, healing gardens and forest walks, with landscape design by Belt Collins.' },
        { title: 'Commercial podium', body: 'A retail spine with two-storey Podium Shops, standalone shops and a café walk serving residents and the neighbourhood.' },
      ],
    },
    price: {
      title: 'Reference prices by home type',
      note: 'Reference price from VND 66 million/m² (price list 11/2026). “From” prices use the smallest gross floor area (GFA) of each type, before payment-plan discounts. Actual prices vary by floor, orientation, view and payment plan.',
      cols: ['Home type', 'GFA (m²)', 'NSA (m²)', 'From'],
      contact: 'On request',
      factorsTitle: 'What sets the price',
      factors: [
        'Floor: floors 3–9 and floors 10–19 have different unit codes and prices.',
        'Orientation and view: central park, Song Be golf course, retail spine or inner courtyard.',
        'Payment plan: 1% to 10% discount depending on the plan (see Sales policy).',
        'Signature homes: garden homes, Duplexes and Podium Shops have their own price list.',
      ],
    },
    policy: {
      milestonesTitle: 'Key payment milestones',
      milestones: [
        { when: '12/2026', what: 'Sale and purchase agreement signing (expected)' },
        { when: '2027 – 2029', what: 'Instalments according to the chosen plan' },
        { when: '09/2029', what: 'Handover (expected)' },
        { when: 'On title deed', what: 'Final 5% payment' },
      ],
      plansTitle: '5 payment plans',
      plansNote: 'Buyers choose one of five plans. Booking early within the developer’s deadline earns an extra 1% discount.',
      discountLabel: 'Discount',
      plans: [
        { name: 'Plan 1 — Standard', discount: '5%', steps: ['SPA signing (12/2026): 15%', '10 instalments every 3 months (03/2027 – 06/2029): five of 2%, three of 5%, two of 10%', 'Handover (09/2029): 35%', 'Title deed: 5%'] },
        { name: 'Plan 2 — 10 payment points', discount: '1%', steps: ['SPA signing: 10%', 'Three 5% instalments every 6 months', 'Then one 5% and three 10% instalments every 3 months', 'Handover (09/2029): 35%', 'Title deed: 5%'] },
        { name: 'Plan 3 — Every six months', discount: '2%', steps: ['SPA signing: 10%', 'Five instalments every 6 months (06/2027 – 06/2029): 5%, 5%, 15%, 15%, 15%', 'Handover (09/2029): 30%', 'Title deed: 5%'] },
        { name: 'Plan 4 — Fast payment', discount: '10%', steps: ['SPA signing: 15%', 'Three instalments every 3 months (03/2027 – 09/2027): 20%, 20%, 15%', 'Handover (09/2029): 25%', 'Title deed: 5%'] },
        { name: 'Plan 5 — Bank loan', discount: 'Interest support', steps: ['SPA signing: 10%', 'Bank disburses three 20% instalments (09/2027, 12/2027, 03/2028)', 'Handover (09/2029): 25% (15% bank, 10% buyer)', 'Title deed: 5%'] },
      ],
      noteTitle: 'Notes',
      notes: [
        'Policies and schedules follow the 11/2026 price list and may change with each sales phase.',
        'Partner banks, loan ratio and interest-support period follow the programme at the time of signing.',
        'A detailed cash-flow table for each unit code comes with your quote when you register.',
      ],
    },
    developer: {
      title: 'About Gamuda Land',
      paras: [
        'Gamuda Land is the property arm of Gamuda Berhad (Malaysia, founded 1976), a listed infrastructure and township developer.',
        'Gamuda Land was founded in 1995, entered Vietnam in 2007 and has developed 11 projects in Hanoi, Ho Chi Minh City, Hai Phong and Dong Nai.',
      ],
      projectsTitle: 'Signature projects in Vietnam',
      projects: [
        { name: 'Gamuda City', place: 'Hanoi', body: 'A 274 ha township with Yen So Park.' },
        { name: 'Celadon City', place: 'Ho Chi Minh City', body: 'An 82 ha township in Tan Phu.' },
        { name: 'Eaton Park', place: 'Ho Chi Minh City', body: 'Apartments on Mai Chi Tho Boulevard, Thu Duc.' },
        { name: 'Elysian', place: 'Ho Chi Minh City', body: 'Apartments in Thu Duc.' },
        { name: 'Artisan Park', place: 'Binh Duong', body: 'A mixed retail, office and residential complex.' },
      ],
      gquasTitle: 'GQUAS quality control',
      gquas: 'Gamuda Land projects follow the GQUAS construction quality assessment system (built on Singapore’s CONQUAS). Each tower is assessed under GQUAS before handover.',
    },
    progress: {
      timelineTitle: 'Project timeline',
      timeline: [
        { when: '10/2026', what: 'Launch at The Sync Show with about 2,000 sales professionals.' },
        { when: '11/2026', what: 'Zone B price list and sales policy announced.' },
        { when: '12/2026', what: 'Sale and purchase agreements expected to be signed.' },
        { when: 'End of 2026', what: 'Piling expected to be complete, with the three Zone B towers excavating the basement.' },
        { when: 'Q3/2029', what: 'Expected handover.' },
      ],
      updateTitle: 'Site update, November 2026',
      update: [
        'The whole site is fenced, with at least two tower cranes plus excavators, trucks and bored-pile rigs on site.',
        'Right-hand area: piling and the diaphragm wall are largely complete; foundation pits, pile caps and tie beams are under way, with part of the basement slab poured.',
        'Left-hand area: site levelling, soft-soil treatment and pile driving.',
      ],
      legalTitle: 'Published legal documents',
      legal: [
        'Investment policy approval.',
        'Land-use right certificate for the whole 7.9 ha site.',
        'Approved 1/500 detailed plan.',
        'Building permit exemption after appraisal of the basic and technical designs.',
      ],
      legalNote: 'Document numbers and dates are provided at contract signing. The developer’s records are the official reference.',
    },
    faqExtra: [
      { q: 'How much do Norton Park apartments cost?', a: 'Under the 11/2026 price list, reference prices start from VND 66 million/m². A Studio (42.12 m²) starts at about VND 2.78 billion, 2BR from about VND 4.38 billion and 3BR from about VND 6.29 billion, before discounts. Prices vary by floor, orientation and payment plan.' },
      { q: 'What payment plans are available?', a: 'Five plans: Standard (5% discount), 10 payment points (1%), every six months (2%), fast payment (10%) and a bank loan with interest support. You pay 10–15% at SPA signing, 25–35% at handover and 5% on receiving the title deed.' },
      { q: 'When are sale and purchase agreements signed?', a: 'SPA signing is expected in December 2026, as announced by the developer.' },
      { q: 'How long is ownership?', a: 'Vietnamese buyers own their apartment long-term. Foreign buyers may own for 50 years under the Housing Law.' },
      { q: 'What is the handover standard?', a: 'Homes are handed over with basic finishing, expected in Q3/2029. The full materials list is set out in the sale and purchase agreement.' },
      { q: 'How many homes are in Zone B?', a: 'Zone B (Pulse Forest) has 654 homes in three towers: 201 in B1, 250 in B2 and 203 in B3.' },
      { q: 'Can I buy with a bank loan?', a: 'Yes. Payment plan 5 lets the bank disburse by construction progress from 2027, with interest support under the programme at the time of signing.' },
      { q: 'Where is the show apartment?', a: 'The show apartment and Sales Gallery are on the project site at 5 Binh Duong Boulevard, Thuan Giao Ward. Register in advance to book a visit.' },
    ],
  },
};

/** FAQ đầy đủ của /hoi-dap = FAQ trang chủ (site.faq, đã qua CMS / bản dịch) + câu hỏi bổ sung ở trên */
export function fullFaq(site, lang = 'vi') {
  return [...site.faq, ...(details[lang] || details.vi).faqExtra];
}
