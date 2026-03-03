import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const ERAS = [
  { id: "khoi-nguyen", name: "Khởi Nguyên", hantu: "起元", period: "Khai Thiên", year: "Thái Sơ", color: "#C41E3A", accent: "#FF6B6B", desc: "Thiên Địa sơ khai. Đơn lục địa. Linh khí cực thịnh." },
  { id: "thai-co", name: "Thái Cổ", hantu: "太古", period: "Thần Hoàng", year: "~1M năm", color: "#6B3FA0", accent: "#9D4EDD", desc: "Thần thú thống trị. Chủng tộc hình thành." },
  { id: "thuong-co", name: "Thượng Cổ", hantu: "上古", period: "Đại Chiến", year: "~100K năm", color: "#1565C0", accent: "#42A5F5", desc: "Đại chiến Thần Ma. Lục địa phân liệt." },
  { id: "trung-co", name: "Trung Cổ", hantu: "中古", period: "Bách Phái", year: "~10K năm", color: "#2E7D32", accent: "#66BB6A", desc: "Tông môn trăm hoa. Vương quốc lâm lập." },
  { id: "can-dai", name: "Cận Đại", hantu: "近代", period: "Suy Tàn", year: "~1K năm", color: "#E65100", accent: "#FF9800", desc: "Linh khí suy giảm. Tông phái sụp đổ." },
  { id: "hien-dai", name: "Hiện Đại", hantu: "现代", period: "Mạt Pháp", year: "Hiện tại", color: "#37474F", accent: "#78909C", desc: "Mạt pháp thời đại. Phàm nhân thống trị." },
];

const ERA_YEARS = [1, 20000, 80000, 140000, 185000, 200000];

// Define paths for 6 eras
const CONTINENT_PATHS = [
  // Era 0: Khởi Nguyên - Supercontinent
  [
    { name: "Cố Nguyên Lục Địa", hantu: "固元陸地", path: "M 150 50 Q 500 20 850 60 T 920 300 Q 900 600 500 600 T 120 400 Z" }
  ],
  // Era 1: Thái Cổ - Small island breaks off, rift appears
  [
    { name: "Cố Nguyên Lục Địa", hantu: "固元陸地", path: "M 150 50 Q 500 25 845 65 T 915 295 Q 895 595 500 600 T 120 400 Z" },
    { name: "Tiểu Đảo", hantu: "小島", path: "M 760 580 Q 770 575 780 585 T 770 600 Z" }
  ],
  // Era 2: Thượng Cổ - The Great Split
  [
    { name: "Thiên Trụ Đại Lục", hantu: "天柱大陸", path: "M 150 50 Q 400 30 500 60 Q 480 300 520 600 T 120 400 Z" },
    { name: "Đông Lưu Đại Lục", hantu: "東流大陸", path: "M 560 60 Q 845 65 915 295 Q 895 500 600 550 Q 580 300 560 60 Z" },
    { name: "Xích Viêm Bán Đảo", hantu: "赤炎半島", path: "M 520 600 Q 600 650 650 620 Q 630 580 600 550 Z" },
    { name: "Tiểu Đảo", hantu: "小島", path: "M 760 580 Q 770 575 780 585 T 770 600 Z" }
  ],
  // Era 3: Trung Cổ - Wide Ocean, Archipelagos (70px ocean)
  [
    { name: "Thiên Trụ Đại Lục", hantu: "天柱大陸", path: "M 145 50 Q 390 30 480 60 Q 460 300 490 590 T 115 400 Z" },
    { name: "Đông Lưu Đại Lục", hantu: "東流大陸", path: "M 600 60 Q 860 65 930 295 Q 910 500 640 550 Q 620 300 600 60 Z" },
    { name: "Liệt Hải Quần Đảo", hantu: "裂海群島", path: "M 520 200 Q 540 220 530 250 Q 510 230 520 200 Z" },
    { name: "Trung Liệt Đảo", hantu: "中裂島", path: "M 530 350 Q 550 360 540 380 Q 520 370 530 350 Z" },
    { name: "Hỏa Nguyên Đảo", hantu: "火原島", path: "M 510 610 Q 580 640 620 620 Q 600 580 580 560 Z" },
    { name: "Nam Cương Tàn Đảo", hantu: "南疆殘島", path: "M 480 620 Q 500 630 490 650 Q 470 640 480 620 Z" }
  ],
  // Era 4: Cận Đại - Max separation (95px)
  [
    { name: "Thiên Trụ Đại Lục", hantu: "天柱大陸", path: "M 140 50 Q 380 30 460 60 Q 440 300 460 580 T 110 400 Z" },
    { name: "Đông Lưu Đại Lục", hantu: "東流大陸", path: "M 630 60 Q 880 65 950 295 Q 930 500 670 550 Q 650 300 630 60 Z" },
    { name: "Liệt Hải Quần Đảo", hantu: "裂海群島", path: "M 530 200 Q 550 220 540 250 Q 520 230 530 200 Z" },
    { name: "Trung Liệt Đảo", hantu: "中裂島", path: "M 550 350 Q 570 360 560 380 Q 540 370 550 350 Z" },
    { name: "Hỏa Nguyên Đảo", hantu: "火原島", path: "M 520 620 Q 590 650 630 630 Q 610 590 590 570 Z" },
    { name: "Nam Cương Tàn Đảo", hantu: "南疆殘島", path: "M 460 630 Q 480 640 470 660 Q 450 650 460 630 Z" },
    { name: "Bắc Liệt Đảo", hantu: "北裂島", path: "M 500 100 Q 520 110 510 130 Q 490 120 500 100 Z" },
    { name: "Nam Liệt Đảo", hantu: "南裂島", path: "M 560 450 Q 580 460 570 480 Q 550 470 560 450 Z" },
    { name: "Bắc Hàn Đảo", hantu: "北寒島", path: "M 350 30 Q 370 20 380 40 Q 360 50 350 30 Z" }
  ],
  // Era 5: Hiện Đại - 120px separation
  [
    { name: "Thiên Trụ Đại Lục", hantu: "天柱大陸", path: "M 135 50 Q 370 30 440 60 Q 420 300 440 570 T 105 400 Z" },
    { name: "Đông Lưu Đại Lục", hantu: "東流大陸", path: "M 660 60 Q 900 65 970 295 Q 950 500 700 550 Q 680 300 660 60 Z" },
    { name: "Liệt Hải Quần Đảo", hantu: "裂海群島", path: "M 550 200 Q 570 220 560 250 Q 540 230 550 200 Z" },
    { name: "Trung Liệt Đảo", hantu: "中裂島", path: "M 570 350 Q 590 360 580 380 Q 560 370 570 350 Z" },
    { name: "Hỏa Nguyên Đảo", hantu: "火原島", path: "M 530 630 Q 600 660 640 640 Q 620 600 600 580 Z" },
    { name: "Nam Cương Tàn Đảo", hantu: "南疆殘島", path: "M 440 640 Q 460 650 450 670 Q 430 660 440 640 Z" },
    { name: "Bắc Liệt Đảo", hantu: "北裂島", path: "M 510 100 Q 530 110 520 130 Q 500 120 510 100 Z" },
    { name: "Nam Liệt Đảo", hantu: "南裂島", path: "M 580 450 Q 600 460 590 480 Q 570 470 580 450 Z" },
    { name: "Bắc Hàn Đảo", hantu: "北寒島", path: "M 340 20 Q 360 10 370 30 Q 350 40 340 20 Z" },
    { name: "Tây Trầm Tàn Đảo", hantu: "西沉殘島", path: "M 80 450 Q 100 440 110 460 Q 90 470 80 450 Z" }
  ]
];

// Tectonic Plates
const TECTONIC_PLATES = [
  { id: "bac-han", name: "Bắc Hàn Plate", hantu: "北寒", color: "rgba(150,200,255,0.25)", stroke: "#7BB8E0", driftX: 0, driftY: -10, basePath: "M 50 10 Q 500 0 950 10 L 950 100 Q 500 120 50 100 Z", minEra: 0 },
  { id: "thien-tru", name: "Thiên Trụ Plate", hantu: "天柱", color: "rgba(180,160,100,0.18)", stroke: "#B0A070", driftX: -10, driftY: 0, basePath: "M 50 100 Q 500 120 500 600 L 50 600 Z", minEra: 0 },
  { id: "dong-luu", name: "Đông Lưu Plate", hantu: "東流", color: "rgba(80,180,100,0.18)", stroke: "#50B464", driftX: 26, driftY: 0, basePath: "M 500 120 Q 950 100 950 600 L 500 600 Z", minEra: 0 },
  { id: "xich-viem", name: "Xích Viêm Plate", hantu: "赤炎", color: "rgba(255,80,30,0.2)", stroke: "#FF5020", driftX: 0, driftY: 7, basePath: "M 50 600 Q 500 580 950 600 L 950 650 L 50 650 Z", minEra: 0 },
  { id: "liet-hai", name: "Liệt Hải Plate", hantu: "裂海", color: "rgba(60,180,160,0.18)", stroke: "#3CB4A0", driftX: 5, driftY: 0, basePath: "M 480 150 Q 550 300 480 550 Q 420 300 480 150 Z", minEra: 2 }
];

const RACES = [
  { name: "Nhân Tộc", hantu: "人族", color: "#6495ED", territories: [
    { name: "Trung Nguyên", isPrimary: true, x: 420, y: 320, minEra: 0 },
    { name: "Nhân Tộc Điểm 1", isPrimary: false, x: 472, y: 260, minEra: 2 },
    { name: "Nhân Tộc Điểm 2", isPrimary: false, x: 454, y: 203, minEra: 2 },
    { name: "Nhân Tộc Điểm 3", isPrimary: false, x: 336, y: 360, minEra: 0 },
    { name: "Nhân Tộc Điểm 4", isPrimary: false, x: 424, y: 276, minEra: 2 },
    { name: "Nhân Tộc Điểm 5", isPrimary: false, x: 323, y: 395, minEra: 2 },
    { name: "Nhân Tộc Điểm 6", isPrimary: false, x: 391, y: 311, minEra: 1 },
  ]},
  { name: "Long Tộc", hantu: "龍族", color: "#FFD700", territories: [
    { name: "Thiên Trụ Sơn", isPrimary: true, x: 470, y: 200, minEra: 0 },
    { name: "Long Tộc Điểm 1", isPrimary: false, x: 385, y: 232, minEra: 0 },
    { name: "Long Tộc Điểm 2", isPrimary: false, x: 577, y: 126, minEra: 0 },
    { name: "Long Tộc Điểm 3", isPrimary: false, x: 462, y: 238, minEra: 2 },
    { name: "Long Tộc Điểm 4", isPrimary: false, x: 533, y: 186, minEra: 1 },
    { name: "Long Tộc Điểm 5", isPrimary: false, x: 432, y: 174, minEra: 2 },
    { name: "Long Tộc Điểm 6", isPrimary: false, x: 572, y: 208, minEra: 1 },
  ]},
  { name: "Yêu Tộc", hantu: "妖族", color: "#228B22", territories: [
    { name: "Đông Hoang", isPrimary: true, x: 660, y: 220, minEra: 0 },
    { name: "Yêu Tộc Điểm 1", isPrimary: false, x: 717, y: 230, minEra: 0 },
    { name: "Yêu Tộc Điểm 2", isPrimary: false, x: 574, y: 339, minEra: 3 },
    { name: "Yêu Tộc Điểm 3", isPrimary: false, x: 612, y: 361, minEra: 1 },
    { name: "Yêu Tộc Điểm 4", isPrimary: false, x: 652, y: 98, minEra: 2 },
    { name: "Yêu Tộc Điểm 5", isPrimary: false, x: 556, y: 114, minEra: 0 },
    { name: "Yêu Tộc Điểm 6", isPrimary: false, x: 516, y: 167, minEra: 1 },
  ]},
  { name: "Trùng Tộc", hantu: "蟲族", color: "#9B30FF", territories: [
    { name: "Nam Cương", isPrimary: true, x: 420, y: 480, minEra: 0 },
    { name: "Trùng Tộc Điểm 1", isPrimary: false, x: 378, y: 444, minEra: 0 },
    { name: "Trùng Tộc Điểm 2", isPrimary: false, x: 279, y: 430, minEra: 2 },
    { name: "Trùng Tộc Điểm 3", isPrimary: false, x: 446, y: 387, minEra: 2 },
    { name: "Trùng Tộc Điểm 4", isPrimary: false, x: 320, y: 569, minEra: 2 },
    { name: "Trùng Tộc Điểm 5", isPrimary: false, x: 502, y: 344, minEra: 1 },
    { name: "Trùng Tộc Điểm 6", isPrimary: false, x: 502, y: 415, minEra: 1 },
  ]},
  { name: "Hải Tộc", hantu: "海族", color: "#0099CC", territories: [
    { name: "Vô Nhai Hải", isPrimary: true, x: 900, y: 350, minEra: 0 },
    { name: "Hải Tộc Điểm 1", isPrimary: false, x: 970, y: 320, minEra: 2 },
    { name: "Hải Tộc Điểm 2", isPrimary: false, x: 1020, y: 362, minEra: 1 },
    { name: "Hải Tộc Điểm 3", isPrimary: false, x: 1001, y: 258, minEra: 3 },
    { name: "Hải Tộc Điểm 4", isPrimary: false, x: 803, y: 377, minEra: 0 },
    { name: "Hải Tộc Điểm 5", isPrimary: false, x: 895, y: 235, minEra: 1 },
    { name: "Hải Tộc Điểm 6", isPrimary: false, x: 767, y: 330, minEra: 0 },
  ]},
  { name: "Cự Tộc", hantu: "巨族", color: "#CD853F", territories: [
    { name: "Bắc Băng", isPrimary: true, x: 350, y: 85, minEra: 0 },
    { name: "Cự Tộc Điểm 1", isPrimary: false, x: 442, y: 207, minEra: 3 },
    { name: "Cự Tộc Điểm 2", isPrimary: false, x: 210, y: 216, minEra: 0 },
    { name: "Cự Tộc Điểm 3", isPrimary: false, x: 264, y: 222, minEra: 0 },
    { name: "Cự Tộc Điểm 4", isPrimary: false, x: 331, y: 100, minEra: 1 },
    { name: "Cự Tộc Điểm 5", isPrimary: false, x: 489, y: 227, minEra: 0 },
    { name: "Cự Tộc Điểm 6", isPrimary: false, x: 253, y: -46, minEra: 2 },
  ]},
  { name: "Vi Tộc", hantu: "微族", color: "#BA55D3", territories: [
    { name: "Ẩn Vi Chính Thành", isPrimary: true, x: 560, y: 300, minEra: 0 },
    { name: "Vi Tộc Điểm 1", isPrimary: false, x: 678, y: 365, minEra: 2 },
    { name: "Vi Tộc Điểm 2", isPrimary: false, x: 471, y: 309, minEra: 3 },
    { name: "Vi Tộc Điểm 3", isPrimary: false, x: 549, y: 166, minEra: 1 },
    { name: "Vi Tộc Điểm 4", isPrimary: false, x: 436, y: 170, minEra: 2 },
    { name: "Vi Tộc Điểm 5", isPrimary: false, x: 661, y: 250, minEra: 0 },
    { name: "Vi Tộc Điểm 6", isPrimary: false, x: 572, y: 200, minEra: 1 },
  ]},
  { name: "Vũ Tộc", hantu: "羽族", color: "#87CEFA", territories: [
    { name: "Thiên Không Đô", isPrimary: true, x: 430, y: 120, minEra: 0 },
    { name: "Vũ Tộc Điểm 1", isPrimary: false, x: 479, y: 270, minEra: 3 },
    { name: "Vũ Tộc Điểm 2", isPrimary: false, x: 431, y: 213, minEra: 1 },
    { name: "Vũ Tộc Điểm 3", isPrimary: false, x: 306, y: -21, minEra: 2 },
    { name: "Vũ Tộc Điểm 4", isPrimary: false, x: 552, y: 263, minEra: 3 },
    { name: "Vũ Tộc Điểm 5", isPrimary: false, x: 280, y: -9, minEra: 3 },
    { name: "Vũ Tộc Điểm 6", isPrimary: false, x: 297, y: 54, minEra: 1 },
  ]},
  { name: "Thạch Tộc", hantu: "石族", color: "#A9A9A9", territories: [
    { name: "Tây Mạc", isPrimary: true, x: 210, y: 250, minEra: 0 },
    { name: "Thạch Tộc Điểm 1", isPrimary: false, x: 109, y: 298, minEra: 0 },
    { name: "Thạch Tộc Điểm 2", isPrimary: false, x: 95, y: 303, minEra: 2 },
    { name: "Thạch Tộc Điểm 3", isPrimary: false, x: 182, y: 159, minEra: 3 },
    { name: "Thạch Tộc Điểm 4", isPrimary: false, x: 354, y: 390, minEra: 2 },
    { name: "Thạch Tộc Điểm 5", isPrimary: false, x: 352, y: 375, minEra: 3 },
    { name: "Thạch Tộc Điểm 6", isPrimary: false, x: 203, y: 121, minEra: 0 },
  ]},
  { name: "Tinh Linh Tộc", hantu: "精靈族", color: "#32CD32", territories: [
    { name: "Thần Mộc Thánh Lâm", isPrimary: true, x: 720, y: 320, minEra: 0 },
    { name: "Tinh Linh Tộc Điểm 1", isPrimary: false, x: 794, y: 330, minEra: 0 },
    { name: "Tinh Linh Tộc Điểm 2", isPrimary: false, x: 803, y: 464, minEra: 2 },
    { name: "Tinh Linh Tộc Điểm 3", isPrimary: false, x: 771, y: 265, minEra: 2 },
    { name: "Tinh Linh Tộc Điểm 4", isPrimary: false, x: 737, y: 272, minEra: 3 },
    { name: "Tinh Linh Tộc Điểm 5", isPrimary: false, x: 637, y: 409, minEra: 0 },
    { name: "Tinh Linh Tộc Điểm 6", isPrimary: false, x: 714, y: 311, minEra: 3 },
  ]},
];

const CITIES = [
  { name: "Trung Nguyên Thành", hantu: "中原城", type: "capital", minEra: 0, maxEra: 5, ruinEra: 99, x: 420, y: 320 },
  { name: "Long Đình", hantu: "龍庭", type: "divine-city", minEra: 0, maxEra: 5, ruinEra: 99, x: 470, y: 200 },
  { name: "Yêu Đô", hantu: "妖都", type: "capital", minEra: 0, maxEra: 5, ruinEra: 99, x: 660, y: 220 },
  { name: "Thanh Long Tự", hantu: "青龍寺", type: "sect-hq", minEra: 0, maxEra: 2, ruinEra: 3, x: 450, y: 250 },
  { name: "Vân Long Cung", hantu: "雲龍宮", type: "sect-hq", minEra: 0, maxEra: 1, ruinEra: 2, x: 460, y: 180 },
  { name: "Hồ Ly Cung", hantu: "狐狸宮", type: "sect-hq", minEra: 0, maxEra: 1, ruinEra: 2, x: 670, y: 240 },
  { name: "Vạn Thú Thành", hantu: "萬獸城", type: "city", minEra: 0, maxEra: 3, ruinEra: 4, x: 640, y: 300 },
  { name: "Bách Nghệ Các", hantu: "百藝閣", type: "city", minEra: 0, maxEra: 3, ruinEra: 4, x: 400, y: 350 },
  { name: "Linh Dược Phường", hantu: "靈藥坊", type: "market", minEra: 0, maxEra: 4, ruinEra: 5, x: 380, y: 340 },
  { name: "Đông Lưu Tân Thành", hantu: "東流新城", type: "capital", minEra: 2, maxEra: 5, ruinEra: 99, x: 700, y: 300 },
  { name: "Liệt Đảo Trấn", hantu: "裂島鎮", type: "city", minEra: 3, maxEra: 5, ruinEra: 99, x: 530, y: 220 },
  { name: "Hỏa Nguyên Trấn", hantu: "火原鎮", type: "settlement", minEra: 3, maxEra: 5, ruinEra: 99, x: 580, y: 560 },
  { name: "Lôi Thành", hantu: "無名", type: "landmark", minEra: 3, maxEra: 3, ruinEra: 4, x: 439, y: 252 },
  { name: "Thiên Phủ", hantu: "無名", type: "landmark", minEra: 4, maxEra: 4, ruinEra: 5, x: 296, y: 448 },
  { name: "Thủy Lĩnh", hantu: "無名", type: "landmark", minEra: 4, maxEra: 5, ruinEra: 99, x: 508, y: 407 },
  { name: "Huyền Tự", hantu: "無名", type: "landmark", minEra: 3, maxEra: 3, ruinEra: 4, x: 568, y: 183 },
  { name: "Huyền Lĩnh", hantu: "無名", type: "fortress", minEra: 1, maxEra: 5, ruinEra: 99, x: 788, y: 480 },
  { name: "Lâm Phủ", hantu: "無名", type: "market", minEra: 0, maxEra: 0, ruinEra: 1, x: 229, y: 408 },
  { name: "Sơn Tự", hantu: "無名", type: "market", minEra: 4, maxEra: 5, ruinEra: 99, x: 352, y: 220 },
  { name: "Điện Tự", hantu: "無名", type: "landmark", minEra: 2, maxEra: 4, ruinEra: 5, x: 371, y: 100 },
  { name: "Thiên Cung", hantu: "無名", type: "city", minEra: 0, maxEra: 3, ruinEra: 4, x: 259, y: 488 },
  { name: "Điện Cung", hantu: "無名", type: "fortress", minEra: 4, maxEra: 5, ruinEra: 99, x: 386, y: 487 },
  { name: "Sơn Trấn", hantu: "無名", type: "settlement", minEra: 0, maxEra: 5, ruinEra: 99, x: 224, y: 515 },
  { name: "Sơn Trấn", hantu: "無名", type: "landmark", minEra: 4, maxEra: 5, ruinEra: 99, x: 276, y: 315 },
  { name: "Phong Động", hantu: "無名", type: "landmark", minEra: 4, maxEra: 4, ruinEra: 5, x: 783, y: 119 },
  { name: "Vân Các", hantu: "無名", type: "landmark", minEra: 0, maxEra: 3, ruinEra: 4, x: 654, y: 317 },
  { name: "Phong Lĩnh", hantu: "無名", type: "sect-hq", minEra: 0, maxEra: 0, ruinEra: 1, x: 542, y: 487 },
  { name: "Địa Cung", hantu: "無名", type: "landmark", minEra: 0, maxEra: 0, ruinEra: 1, x: 481, y: 534 },
  { name: "Sơn Lĩnh", hantu: "無名", type: "city", minEra: 1, maxEra: 2, ruinEra: 3, x: 718, y: 447 },
  { name: "Phong Lĩnh", hantu: "無名", type: "settlement", minEra: 1, maxEra: 2, ruinEra: 3, x: 314, y: 130 },
  { name: "Thiên Các", hantu: "無名", type: "fortress", minEra: 2, maxEra: 5, ruinEra: 99, x: 823, y: 536 },
  { name: "Lôi Trấn", hantu: "無名", type: "fortress", minEra: 2, maxEra: 4, ruinEra: 5, x: 486, y: 127 },
  { name: "Hỏa Cung", hantu: "無名", type: "city", minEra: 0, maxEra: 2, ruinEra: 3, x: 800, y: 436 },
  { name: "Lôi Trấn", hantu: "無名", type: "landmark", minEra: 3, maxEra: 5, ruinEra: 99, x: 306, y: 310 },
  { name: "Điện Thành", hantu: "無名", type: "fortress", minEra: 4, maxEra: 5, ruinEra: 99, x: 637, y: 446 },
  { name: "Lôi Trấn", hantu: "無名", type: "fortress", minEra: 3, maxEra: 4, ruinEra: 5, x: 318, y: 335 },
  { name: "Thiên Động", hantu: "無名", type: "city", minEra: 4, maxEra: 4, ruinEra: 5, x: 622, y: 179 },
  { name: "Lâm Các", hantu: "無名", type: "landmark", minEra: 4, maxEra: 4, ruinEra: 5, x: 757, y: 502 },
  { name: "Vân Động", hantu: "無名", type: "city", minEra: 0, maxEra: 4, ruinEra: 5, x: 433, y: 432 },
  { name: "Huyền Phủ", hantu: "無名", type: "fortress", minEra: 4, maxEra: 4, ruinEra: 5, x: 224, y: 478 },
];


const TERRAIN_FEATURES = {
  mountains: [
    { name: "Thiên Trụ Sơn", hantu: "天柱山", x: 470, y: 240, tier: "divine", minEra: 0, desc: "Đỉnh chạm Cửu Thiên, chân đâm Cửu U" },
    { name: "Thiên Tích Sơn", hantu: "天脊山", x: 500, y: 150, tier: "major", minEra: 2 },
    { name: "Đông Cực Phong", hantu: "東極峰", x: 800, y: 280, tier: "major", minEra: 0 },
    { name: "Tây Hoàng Sơn", hantu: "西荒山", x: 250, y: 260, tier: "major", minEra: 0 },
    { name: "Nam Diệm Phong", hantu: "南焰峰", x: 450, y: 550, tier: "major", minEra: 0 },
    { name: "Bắc Hàn Lĩnh", hantu: "北寒嶺", x: 380, y: 100, tier: "major", minEra: 0 },
    { name: "Vạn Thú Sơn", hantu: "萬獸山", x: 650, y: 350, tier: "minor", minEra: 0 },
    { name: "Linh Ẩn Sơn", hantu: "靈隱山", x: 550, y: 400, tier: "minor", minEra: 0 },
    { name: "Hỏa Diệm Sơn", hantu: "火焰山", x: 620, y: 600, tier: "minor", minEra: 2 },
    { name: "Băng Tiêm Phong", hantu: "冰尖峰", x: 320, y: 60, tier: "minor", minEra: 0 },
  ],
  rivers: [
    { name: "Thiên Hà", hantu: "天河", path: "M 470 240 Q 460 350 480 450 T 500 600", width: 3, color: "#42A5F5" },
    { name: "Long Giang", hantu: "龍江", path: "M 470 240 Q 550 300 650 320 T 800 350", width: 2.5, color: "#29B6F6" },
    { name: "Kim Sa Hà", hantu: "金沙河", path: "M 470 240 Q 350 250 250 280 T 150 300", width: 2, color: "#FFCA28" },
    { name: "Băng Hà", hantu: "冰河", path: "M 470 240 Q 420 180 380 120 T 350 50", width: 2, color: "#81D4FA" },
  ],
  regions: [
    { name: "Thần Mộc Đại Lâm", type: "forest", cx: 720, cy: 320, rx: 80, ry: 50, color: "rgba(34,139,34,0.3)", minZoom: 1.8 },
    { name: "Vạn Thú Lâm", type: "forest", cx: 640, cy: 380, rx: 60, ry: 40, color: "rgba(34,139,34,0.3)", minZoom: 1.8 },
    { name: "Thanh Trúc Lâm", type: "forest", cx: 550, cy: 450, rx: 50, ry: 30, color: "rgba(34,139,34,0.3)", minZoom: 1.8 },
    { name: "Chướng Khí Lâm", type: "forest", cx: 400, cy: 500, rx: 70, ry: 45, color: "rgba(34,139,34,0.3)", minZoom: 1.8 },
    { name: "Tây Mạc Khô Nguyên", type: "desert", cx: 250, cy: 280, rx: 90, ry: 60, color: "rgba(210,180,140,0.3)", minZoom: 1.8 },
    { name: "Độc Chướng Đầm Trạch", type: "swamp", cx: 450, cy: 520, rx: 80, ry: 50, color: "rgba(128,0,128,0.2)", minZoom: 1.8 },
    { name: "Vĩnh Đông Tuyết Nguyên", type: "ice", cx: 350, cy: 80, rx: 100, ry: 40, color: "rgba(173,216,230,0.3)", minZoom: 1.8 },
  ]
};

const BORDERS = [
  { name: "Trung Tâm Thần Vực", hantu: "中心神域", cx: 470, cy: 260, r: 150, color: "rgba(255,215,0,0.15)" },
  { name: "Đông Hoang", hantu: "東荒", cx: 700, cy: 300, r: 180, color: "rgba(34,139,34,0.15)" },
  { name: "Tây Mạc", hantu: "西漠", cx: 250, cy: 300, r: 160, color: "rgba(210,180,140,0.15)" },
  { name: "Nam Cương", hantu: "南疆", cx: 450, cy: 500, r: 140, color: "rgba(128,0,128,0.15)" },
  { name: "Bắc Băng", hantu: "北冰", cx: 380, cy: 100, r: 130, color: "rgba(173,216,230,0.15)" }
];

const RESOURCES = [
  { name: "Tiên Thạch", hantu: "仙石", color: "#FFD700", type: "tiên thạch", x: 450, y: 220, minEra: 0 },
  { name: "Thần Dược", hantu: "神藥", color: "#32CD32", type: "thần dược", x: 680, y: 310, minEra: 0 },
  { name: "Hoả Tinh Thạch", hantu: "火星石", color: "#FF4500", type: "hoả tinh", x: 610, y: 580, minEra: 2 },
  { name: "Vạn Niên Linh Mộc", hantu: "靈木", color: "#228B22", type: "linh mộc", x: 740, y: 340, minEra: 0 },
  { name: "Hàn Băng Tinh Phách", hantu: "寒冰精魄", color: "#00FFFF", type: "hàn băng", x: 360, y: 70, minEra: 0 },
  { name: "Kịch Độc Thảo Dược", hantu: "毒草藥", color: "#800080", type: "kịch độc", x: 430, y: 530, minEra: 0 }
];

const DANGERS = [
  { name: "Thiên Đạo Áp Lực Vùng", x: 470, y: 240, r: 60, minEra: 0, maxEra: 5, color: "rgba(255,215,0,0.3)" },
  { name: "Hỗn Độn Hư Không", x: 950, y: 50, r: 80, minEra: 0, maxEra: 5, color: "rgba(100,0,100,0.3)" },
  { name: "Chướng Khí Vùng", x: 450, y: 540, r: 50, minEra: 0, maxEra: 5, color: "rgba(128,0,128,0.3)" },
  { name: "Tách Giãn Tử Địa", x: 530, y: 300, r: 70, minEra: 2, maxEra: 5, color: "rgba(255,0,0,0.3)" }
];

const INFLUENCES = [
  { name: "Long Tộc", color: "rgba(255,215,0,0.15)", cx: 470, cy: 200, r: 120 },
  { name: "Yêu Hoàng", color: "rgba(34,139,34,0.15)", cx: 660, cy: 220, r: 140 },
  { name: "Trùng Tộc", color: "rgba(155,48,255,0.15)", cx: 420, cy: 480, r: 110 },
  { name: "Hải Tộc", color: "rgba(0,153,204,0.15)", cx: 800, cy: 400, r: 160 },
  { name: "Thạch Tộc", color: "rgba(169,169,169,0.15)", cx: 210, cy: 250, r: 130 },
  { name: "Nhân Tộc", color: "rgba(100,149,237,0.15)", cx: 420, cy: 320, r: 150 }
];

// ... We will add component code after this
export default function CoNguyenMap() {
  const [currentYear, setCurrentYear] = useState(1);
  const [eraIndex, setEraIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [layers, setLayers] = useState({
    tectonic: false,
    borders: true,
    races: false,
    influence: false,
    lingmai: true,
    cities: true,
    resources: false,
    dangers: false,
    weather: false
  });

  const svgRef = useRef(null);

  // Synchronize year to era
  useEffect(() => {
    let newEra = 0;
    for (let i = ERA_YEARS.length - 1; i >= 0; i--) {
      if (currentYear >= ERA_YEARS[i]) {
        newEra = i;
        break;
      }
    }
    if (newEra !== eraIndex) setEraIndex(newEra);
  }, [currentYear, eraIndex]);

  // Autoplay
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= 200000) {
            setIsPlaying(false);
            return 200000;
          }
          return Math.min(200000, prev + 1000); // 1000 years per tick
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSliderChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setZoom(prev => Math.min(Math.max(0.3, prev + delta), 8));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for wheel (to make it non-passive for preventDefault)
  useEffect(() => {
    const el = svgRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
    }
  }, [pan, isDragging]);

  const currentEra = ERAS[eraIndex];
  const continents = CONTINENT_PATHS[eraIndex];
  const lingmaiIntensity = Math.max(0.1, 1.0 - eraIndex * 0.17);

  const renderCities = () => {
    if (!layers.cities) return null;
    return CITIES.filter(c => eraIndex >= c.minEra && eraIndex <= c.maxEra).map((c, i) => {
      const isRuin = eraIndex >= c.ruinEra;
      let icon = null;
      switch (c.type) {
        case "divine-city": icon = <path d="M 0 -8 L 8 0 L 0 8 L -8 0 Z" fill={isRuin ? "transparent" : "#FFD700"} stroke="#FFD700" strokeWidth={isRuin ? "1" : "0"} strokeDasharray={isRuin ? "2,2" : "none"} />; break;
        case "capital": icon = <circle cx={0} cy={0} r={7} fill={isRuin ? "transparent" : "#d32f2f"} stroke="#d32f2f" strokeWidth={isRuin ? "1" : "2"} strokeDasharray={isRuin ? "2,2" : "none"} />; break;
        case "sect-hq": icon = <rect x={-7} y={-7} width={14} height={14} fill={isRuin ? "transparent" : "#7b1fa2"} stroke="#7b1fa2" strokeWidth={isRuin ? "1" : "0"} strokeDasharray={isRuin ? "2,2" : "none"} />; break;
        case "city": icon = <circle cx={0} cy={0} r={5} fill={isRuin ? "transparent" : "#fff"} stroke="#fff" strokeWidth={isRuin ? "1" : "0"} strokeDasharray={isRuin ? "2,2" : "none"} />; break;
        case "fortress": icon = <rect x={-6} y={-6} width={12} height={12} fill={isRuin ? "transparent" : "#795548"} stroke="#795548" strokeWidth={isRuin ? "1" : "0"} strokeDasharray={isRuin ? "2,2" : "none"} />; break;
        case "market": icon = <path d="M 0 -5 L 5 0 L 0 5 L -5 0 Z" fill={isRuin ? "transparent" : "#009688"} stroke="#009688" strokeWidth={isRuin ? "1" : "0"} strokeDasharray={isRuin ? "2,2" : "none"} />; break;
        case "settlement": icon = <circle cx={0} cy={0} r={4} fill={isRuin ? "transparent" : "#9e9e9e"} stroke="#9e9e9e" strokeWidth={isRuin ? "1" : "0"} strokeDasharray={isRuin ? "2,2" : "none"} />; break;
        case "landmark": icon = <polygon points="0,-5 1.5,-1.5 5,-1.5 2.5,0.5 3.5,4 0,2 -3.5,4 -2.5,0.5 -5,-1.5 -1.5,-1.5" fill={isRuin ? "transparent" : "#e91e63"} stroke="#e91e63" strokeWidth={isRuin ? "1" : "0"} strokeDasharray={isRuin ? "2,2" : "none"} />; break;
        default: icon = <circle cx={0} cy={0} r={4} fill="#fff" />;
      }
      return (
        <g key={`city-${i}`} transform={`translate(${c.x}, ${c.y})`}
           opacity={isRuin ? 0.5 : 1}
           onMouseEnter={(e) => { setHoveredItem({...c, mouseX: e.clientX, mouseY: e.clientY, isRuin}); }}
           onMouseLeave={() => setHoveredItem(null)}
           onClick={() => setSelectedItem({...c, isRuin})}
           style={{cursor: 'pointer'}}>
          {icon}
          {c.type === "divine-city" && !isRuin && <circle cx={0} cy={0} r={12} fill="none" stroke="#FFD700" strokeDasharray="4,4"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite"/></circle>}
          <text x={10} y={4} fill={isRuin ? "#777" : "#d4c5a9"} fontSize="10" fontFamily="'Noto Serif', 'Songti SC', serif" textDecoration={isRuin ? "line-through" : "none"} fontStyle={isRuin ? "italic" : "normal"}>
            {c.name}{isRuin ? " (Phế Tích)" : ""}
          </text>
          {zoom > 2 && <text x={10} y={16} fill="#888" fontSize="8" fontFamily="'Songti SC', serif">{c.hantu}</text>}
        </g>
      );
    });
  };

  const renderRaces = () => {
    if (!layers.races) return null;
    return RACES.map((race, rIdx) => {
      return race.territories.filter(t => eraIndex >= t.minEra).map((t, tIdx) => (
        <g key={`race-${rIdx}-${tIdx}`} transform={`translate(${t.x}, ${t.y})`}
           onMouseEnter={(e) => { setHoveredItem({...t, raceName: race.name, raceHantu: race.hantu, mouseX: e.clientX, mouseY: e.clientY}); }}
           onMouseLeave={() => setHoveredItem(null)}
           onClick={() => setSelectedItem({...t, raceName: race.name, raceHantu: race.hantu, isRace: true})}
           style={{cursor: 'pointer'}}>
          {t.isPrimary && race.territories.filter(st => eraIndex >= st.minEra && !st.isPrimary).map((st, i) => (
            <line key={`conn-${i}`} x1={0} y1={0} x2={st.x - t.x} y2={st.y - t.y} stroke={race.color} strokeWidth="1" strokeDasharray="4,4" opacity="0.25" />
          ))}
          <ellipse cx={0} cy={0} rx={t.isPrimary ? 8 : 4} ry={t.isPrimary ? 6 : 3} fill="none" stroke={race.color} strokeWidth={t.isPrimary ? 1.8 : 1} />
          <text x={0} y={t.isPrimary ? 2 : 1} fontSize={t.isPrimary ? "10" : "6"} textAnchor="middle" dominantBaseline="middle">{t.isPrimary ? "🏛" : "📍"}</text>
          {(t.isPrimary || zoom > 1.2) && <text x={10} y={3} fill={race.color} fontSize="8" fontFamily="'Noto Serif', serif">{t.name}</text>}
        </g>
      ));
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0a0e14', color: '#d4c5a9', fontFamily: "'Noto Serif', serif", overflow: 'hidden', position: 'relative' }}>
      <style>
        {`
          input[type=range] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
          }
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px; height: 18px; border-radius: 50%;
            background: ${currentEra.accent}; border: 2px solid #0a0e14;
            cursor: grab; box-shadow: 0 0 8px ${currentEra.accent}80;
            margin-top: -6px;
          }
          input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 6px;
            cursor: pointer;
            background: linear-gradient(90deg, #C41E3A, #6B3FA0, #1565C0, #2E7D32, #E65100, #37474F);
            border-radius: 3px;
          }
        `}
      </style>

      {/* Title Bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: 'rgba(10,14,20,0.85)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px', color: currentEra.color, textShadow: `0 0 10px ${currentEra.accent}80` }}>CỐ NGUYÊN GIỚI <span style={{ fontSize: '16px', color: '#888' }}>固元界</span></h1>
            <div style={{ fontSize: '12px', color: '#aaa' }}>{currentEra.name} ({currentEra.hantu}) • {currentEra.period}</div>
          </div>
          <div style={{ borderLeft: '1px solid #333', paddingLeft: '20px', fontSize: '12px' }}>
            <div>LINH KHÍ NỒNG ĐỘ</div>
            <div style={{ width: '150px', height: '8px', background: '#333', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(5, 100 - eraIndex * 18)}%`, height: '100%', background: 'linear-gradient(90deg, #00C853, #64DD17)', transition: 'width 0.5s' }} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: '14px' }}>Zoom: {Math.round(zoom * 100)}%</div>
      </div>

      {/* Layer Controls */}
      <div style={{ position: 'absolute', top: '80px', left: '20px', background: 'rgba(10,14,20,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
        {[
          { id: 'tectonic', name: 'Kiến Tạo', icon: '🌋' },
          { id: 'borders', name: 'Biên Giới', icon: '🏛' },
          { id: 'races', name: 'Chủng Tộc', icon: '👥' },
          { id: 'influence', name: 'Thế Lực', icon: '🔮' },
          { id: 'lingmai', name: 'Linh Mạch', icon: '✨' },
          { id: 'cities', name: 'Thành Trì', icon: '🏰' },
          { id: 'resources', name: 'Tài Nguyên', icon: '💎' },
          { id: 'dangers', name: 'Nguy Hiểm', icon: '☠' },
          { id: 'weather', name: 'Thời Tiết', icon: '🌤' }
        ].map(l => (
          <button key={l.id} onClick={() => toggleLayer(l.id)} style={{
            background: layers[l.id] ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: `1px solid ${layers[l.id] ? currentEra.accent : 'transparent'}`,
            color: '#d4c5a9', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left',
            fontFamily: "'Noto Serif', serif"
          }}>
            <span>{l.icon}</span> {l.name}
          </button>
        ))}
      </div>

      {/* Timeline Controls */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20%', right: '20%', background: 'rgba(10,14,20,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '15px 20px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: '#333', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <div style={{ flex: 1, fontSize: '18px', fontWeight: 'bold' }}>Năm {currentYear.toLocaleString()} TL</div>
          <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#aaa', flex: 2 }}>{currentEra.desc}</div>
        </div>
        <div style={{ position: 'relative', height: '30px' }}>
          <input type="range" min="0" max="200000" step="100" value={currentYear} onChange={handleSliderChange} style={{ position: 'absolute', top: '10px' }} />
          {ERAS.map((era, i) => (
            <div key={era.id} style={{ position: 'absolute', left: `${(ERA_YEARS[i] / 200000) * 100}%`, top: '20px', transform: 'translateX(-50%)', fontSize: '10px', color: i === eraIndex ? era.accent : '#666', fontWeight: i === eraIndex ? 'bold' : 'normal' }}>
              |<br/>{era.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Map Area */}
      <div
        ref={svgRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg width="100%" height="100%" style={{ background: 'linear-gradient(135deg, #0a0e14 0%, #111822 50%, #0d1117 100%)' }}>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0a2040" />
              <stop offset="100%" stopColor="#0a1628" />
            </radialGradient>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Base Ocean Background within viewport boundary */}
            <rect x="0" y="0" width="1000" height="650" fill="url(#oceanGrad)" />

            {/* Internal Seas / Rifts (rendered before land to act as underlay) */}
            {eraIndex === 1 && <path d="M 600 50 L 620 300 L 580 500" stroke="#8B2500" strokeWidth="4" fill="none"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" /></path>}
            {eraIndex === 2 && <path d="M 550 50 L 580 300 L 540 500" stroke="#0a2545" strokeWidth="30" fill="none" />}
            {eraIndex === 3 && <path d="M 520 50 L 550 300 L 520 500" stroke="#0a2040" strokeWidth="70" fill="none" strokeDasharray="10 5"><animate attributeName="stroke-dashoffset" from="0" to="30" dur="5s" repeatCount="indefinite" /></path>}
            {eraIndex >= 3 && <ellipse cx={540} cy={580} rx={120} ry={60} fill="#0a2545" opacity="0.8" />}
            {eraIndex === 4 && <path d="M 500 50 L 530 300 L 510 500" stroke="#0a2040" strokeWidth="95" fill="none" />}
            {eraIndex === 5 && <path d="M 480 50 L 510 300 L 490 500" stroke="#0a2040" strokeWidth="120" fill="none" />}
            {eraIndex === 5 && <ellipse cx={150} cy={350} rx={100} ry={150} fill="#0a2040" opacity="0.8" />}

            {/* 1. Terrain Layer (Base Land) */}
            <g id="terrain">
              {continents.map((cont, i) => (
                <path
                  key={i}
                  d={cont.path}
                  fill="#3d3025"
                  stroke="#5c4a3d"
                  strokeWidth="2"
                  style={{ transition: 'd 1s ease-in-out' }}
                  onMouseEnter={(e) => { setHoveredItem({...cont, mouseX: e.clientX, mouseY: e.clientY}); }}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setSelectedItem(cont)}
                />
              ))}

              {/* Regions (Forests, Deserts) */}
              {TERRAIN_FEATURES.regions.map((reg, i) => (
                <ellipse key={`reg-${i}`} cx={reg.cx} cy={reg.cy} rx={reg.rx} ry={reg.ry} fill={reg.color}
                  onMouseEnter={(e) => { setHoveredItem({...reg, mouseX: e.clientX, mouseY: e.clientY}); }}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              ))}

              {/* Rivers */}
              {TERRAIN_FEATURES.rivers.map((riv, i) => (
                <g key={`riv-${i}`}>
                  <path d={riv.path} fill="none" stroke={riv.color} strokeWidth={riv.width} opacity="0.7" strokeDasharray="10 5">
                    <animate attributeName="stroke-dashoffset" from="0" to="30" dur="2s" repeatCount="indefinite" />
                  </path>
                  {zoom > 1.5 && <text x={0} y={0} fill={riv.color} fontSize="8" style={{ offsetPath: `path('${riv.path}')`, offsetDistance: "50%" }}>{riv.name}</text>}
                </g>
              ))}

              {/* Mountains */}
              {TERRAIN_FEATURES.mountains.filter(m => eraIndex >= m.minEra).map((m, i) => (
                <g key={`mnt-${i}`} transform={`translate(${m.x}, ${m.y})`}
                   onMouseEnter={(e) => { setHoveredItem({...m, mouseX: e.clientX, mouseY: e.clientY}); }}
                   onMouseLeave={() => setHoveredItem(null)}>
                  {m.tier === 'divine' ? (
                    <polygon points="0,-15 10,10 -10,10" fill="#FFD700" stroke="#B8860B" strokeWidth="1" filter="url(#glow)" />
                  ) : m.tier === 'major' ? (
                    <polygon points="0,-12 8,8 -8,8" fill="#555" stroke="#333" strokeWidth="1" />
                  ) : (
                    <polygon points="0,-8 5,5 -5,5" fill="#777" stroke="#444" strokeWidth="0.5" />
                  )}
                  {zoom > 1.2 && <text x={0} y={18} fontSize={m.tier === 'divine' ? "10" : "8"} fill={m.tier === 'divine' ? "#FFD700" : "#d4c5a9"} textAnchor="middle">{m.name}</text>}
                </g>
              ))}
            </g>

            {/* 2. Tectonic Layer */}
            {layers.tectonic && (
              <g id="tectonic">
                {TECTONIC_PLATES.filter(p => eraIndex >= p.minEra).map((p, i) => {
                  const dx = p.driftX * eraIndex;
                  const dy = p.driftY * eraIndex;
                  return (
                    <g key={`plate-${i}`} transform={`translate(${dx}, ${dy})`} style={{ transition: 'transform 1s ease-in-out' }}>
                      <path d={p.basePath} fill={p.color} stroke={p.stroke} strokeWidth="2" strokeDasharray="10 5" opacity="0.8">
                        <animate attributeName="stroke-dashoffset" from="0" to="30" dur="4s" repeatCount="indefinite" />
                      </path>
                      <polygon points="0,-4 4,4 -4,4" fill={p.stroke} transform={`translate(100, 100)`} />
                      <text x="150" y="150" fill={p.stroke} fontSize="12" fontWeight="bold">{p.name}</text>
                    </g>
                  );
                })}
                <circle cx={620} cy={600} r={20} fill="none" stroke="#FF5020" strokeWidth="2">
                  <animate attributeName="r" values="10;30;10" dur="3s" repeatCount="indefinite" />
                </circle>
                <text x={640} y={600} fill="#FF5020" fontSize="10">Điểm Nóng Manti 🔥</text>
              </g>
            )}

            {/* 3. Borders Layer */}
            {layers.borders && eraIndex < 2 && (
              <g id="borders">
                {BORDERS.map((b, i) => (
                  <g key={`bord-${i}`}>
                    <circle cx={b.cx} cy={b.cy} r={b.r} fill={b.color} stroke={b.color.replace('0.15', '0.5')} strokeWidth="1" strokeDasharray="5 5" />
                    <text x={b.cx} y={b.cy - b.r + 20} fill={b.color.replace('0.15', '1')} fontSize="14" textAnchor="middle" fontFamily="'Noto Serif', serif">{b.name}</text>
                  </g>
                ))}
              </g>
            )}

            {/* 4. Races Layer */}
            {renderRaces()}

            {/* 5. Influence Layer */}
            {layers.influence && (
              <g id="influence">
                {INFLUENCES.map((inf, i) => (
                  <g key={`inf-${i}`}>
                    <circle cx={inf.cx} cy={inf.cy} r={inf.r} fill={inf.color} />
                    <text x={inf.cx} y={inf.cy} fill={inf.color.replace('0.15', '0.8')} fontSize="12" textAnchor="middle" fontWeight="bold">{inf.name}</text>
                  </g>
                ))}
              </g>
            )}

            {/* 6. Lingmai (Spirit Veins) Layer */}
            {layers.lingmai && (
              <g id="lingmai" opacity={lingmaiIntensity}>
                <path d="M 470 240 Q 600 100 800 150" fill="none" stroke="#00FFFF" strokeWidth="4" filter="url(#glow)"><animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" /></path>
                <path d="M 470 240 Q 700 300 850 400" fill="none" stroke="#32CD32" strokeWidth="4" filter="url(#glow)"><animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" /></path>
                <path d="M 470 240 Q 400 400 450 600" fill="none" stroke="#FF4500" strokeWidth="4" filter="url(#glow)"><animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" /></path>
                <path d="M 470 240 Q 300 350 150 400" fill="none" stroke="#FFD700" strokeWidth="4" filter="url(#glow)"><animate attributeName="opacity" values="0.5;1;0.5" dur="4.5s" repeatCount="indefinite" /></path>
                <path d="M 470 240 Q 350 150 200 100" fill="none" stroke="#A9A9A9" strokeWidth="4" filter="url(#glow)"><animate attributeName="opacity" values="0.5;1;0.5" dur="5s" repeatCount="indefinite" /></path>
              </g>
            )}

            {/* 7. Cities Layer */}
            <g id="cities">
              {renderCities()}
            </g>

            {/* 8. Resources Layer */}
            {layers.resources && (
              <g id="resources">
                {RESOURCES.filter(r => eraIndex >= r.minEra).map((r, i) => (
                  <g key={`res-${i}`} transform={`translate(${r.x}, ${r.y})`}>
                    <polygon points="0,-6 6,0 0,6 -6,0" fill={r.color} />
                    <text x={8} y={3} fill={r.color} fontSize="8">{r.name}</text>
                  </g>
                ))}
              </g>
            )}

            {/* 9. Dangers Layer */}
            {layers.dangers && (
              <g id="dangers">
                {DANGERS.filter(d => eraIndex >= d.minEra && eraIndex <= d.maxEra).map((d, i) => (
                  <g key={`dang-${i}`}>
                    <circle cx={d.x} cy={d.y} r={d.r} fill="none" stroke={d.color.replace('0.3', '1')} strokeWidth="2" strokeDasharray="4 4">
                      <animate attributeName="r" values={`${d.r - 5};${d.r + 5};${d.r - 5}`} dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={d.x} cy={d.y} r={d.r} fill={d.color} />
                    <text x={d.x} y={d.y} fill={d.color.replace('0.3', '1')} fontSize="10" textAnchor="middle" fontWeight="bold">☠ {d.name}</text>
                  </g>
                ))}
              </g>
            )}

            {/* 10. Weather Layer (Top) */}
            {layers.weather && (
              <g id="weather" style={{ pointerEvents: 'none' }}>
                <rect x="0" y="0" width="1000" height="200" fill="rgba(173,216,230,0.1)" />
                <rect x="0" y="200" width="1000" height="300" fill="rgba(34,139,34,0.1)" />
                <rect x="0" y="500" width="1000" height="150" fill="rgba(255,69,0,0.1)" />

                {/* Wind Arrows */}
                <path d="M 800 150 Q 600 200 400 150" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="10 5">
                  <animate attributeName="stroke-dashoffset" from="30" to="0" dur="2s" repeatCount="indefinite" />
                </path>
                <path d="M 200 400 Q 500 450 800 400" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="10 5">
                  <animate attributeName="stroke-dashoffset" from="0" to="30" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Ocean Currents */}
                <path d="M 100 100 Q 500 50 900 100 Q 950 300 900 500 Q 500 600 100 500 Q 50 300 100 100" fill="none" stroke="rgba(255,0,0,0.5)" strokeWidth="3" strokeDasharray="15 10">
                  <animate attributeName="stroke-dashoffset" from="0" to="50" dur="10s" repeatCount="indefinite" />
                </path>
              </g>
            )}

            {/* Compass Rose */}
            <g transform="translate(900, 580) scale(0.6)">
              <circle cx="0" cy="0" r="40" fill="rgba(10,14,20,0.5)" stroke="#B8860B" strokeWidth="2" />
              <circle cx="0" cy="0" r="35" fill="none" stroke="#B8860B" strokeWidth="1" strokeDasharray="2 2" />
              <polygon points="0,-45 10,-10 0,0 -10,-10" fill="#B8860B" />
              <polygon points="0,45 10,10 0,0 -10,10" fill="#555" />
              <polygon points="45,0 10,-10 0,0 10,10" fill="#777" />
              <polygon points="-45,0 -10,-10 0,0 -10,10" fill="#999" />
              <text x="0" y="-50" fill="#d4c5a9" fontSize="14" textAnchor="middle">Bắc</text>
              <text x="0" y="60" fill="#d4c5a9" fontSize="14" textAnchor="middle">Nam</text>
              <text x="55" y="5" fill="#d4c5a9" fontSize="14" textAnchor="middle">Đông</text>
              <text x="-55" y="5" fill="#d4c5a9" fontSize="14" textAnchor="middle">Tây</text>
              <circle cx="0" cy="0" r="5" fill="#B8860B" />
            </g>
          </g>
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredItem && (
        <div style={{
          position: 'absolute',
          left: (hoveredItem.mouseX || 0) + 15,
          top: (hoveredItem.mouseY || 0) + 15,
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid #555',
          padding: '5px 10px',
          borderRadius: '4px',
          pointerEvents: 'none',
          zIndex: 100
        }}>
          <div style={{ fontWeight: 'bold' }}>{hoveredItem.name}</div>
          {hoveredItem.hantu && <div style={{ fontSize: '12px', color: '#aaa' }}>{hoveredItem.hantu}</div>}
          {hoveredItem.raceName && <div style={{ fontSize: '10px', color: '#888' }}>{hoveredItem.raceName}</div>}
        </div>
      )}

      {/* Detail Panel */}
      {selectedItem && (
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '80px',
          width: '300px',
          background: 'rgba(10,14,20,0.95)',
          border: `1px solid ${currentEra.accent}`,
          borderRadius: '8px',
          padding: '20px',
          zIndex: 50,
          boxShadow: `0 0 15px rgba(0,0,0,0.8)`
        }}>
          <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '16px' }}>✕</button>

          <h2 style={{ margin: '0 0 5px 0', color: selectedItem.isRuin ? '#777' : '#d4c5a9', textDecoration: selectedItem.isRuin ? 'line-through' : 'none' }}>
            {selectedItem.name}
          </h2>
          <div style={{ fontSize: '18px', color: '#888', marginBottom: '15px' }}>{selectedItem.hantu || selectedItem.raceHantu || '無名'}</div>

          {selectedItem.isRuin && <div style={{ color: '#d32f2f', marginBottom: '10px', fontStyle: 'italic' }}>🏚 Di Tích - Đã sụp đổ từ Kỷ {ERAS[selectedItem.ruinEra]?.name || "Trái đất"}</div>}

          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            {selectedItem.desc && <p>{selectedItem.desc}</p>}
            {selectedItem.type && <p><strong>Loại:</strong> {selectedItem.type}</p>}
            {selectedItem.tier && <p><strong>Cấp bậc:</strong> {selectedItem.tier}</p>}
            {selectedItem.isRace && <p><strong>Thuộc chủng tộc:</strong> {selectedItem.raceName}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
