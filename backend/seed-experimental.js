const mongoose = require('mongoose');
require('dotenv').config();
const CompositeData = require('./models/CompositeData');

const experimentalData = [
  // 2013 Glass-Epoxy Data
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 25, content_type: 'volume', orientation: '0', tensile_strength: 433, youngs_modulus: 23.1 },
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 25, content_type: 'volume', orientation: '0', tensile_strength: 452, youngs_modulus: 24.5 },
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 25, content_type: 'volume', orientation: '0', tensile_strength: 470, youngs_modulus: 25.2 },
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: '0', tensile_strength: 472, youngs_modulus: 25.8 },
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: '0', tensile_strength: 498, youngs_modulus: 27.4 },
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: '0', tensile_strength: 520, youngs_modulus: 28.6 },
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: '0', tensile_strength: 510, youngs_modulus: 29.2 },
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: '0', tensile_strength: 540, youngs_modulus: 31 },
  { publish_year: 2013, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: '0', tensile_strength: 565, youngs_modulus: 32.8 },
  
  // 2024 Glass-Epoxy Random
  { publish_year: 2024, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 10, content_type: 'volume', orientation: 'Random', tensile_strength: 78, youngs_modulus: 3.1 },
  { publish_year: 2024, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 20, content_type: 'volume', orientation: 'Random', tensile_strength: 102, youngs_modulus: 3.8 },
  { publish_year: 2024, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 128, youngs_modulus: 4.6 },
  { publish_year: 2024, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Random', tensile_strength: 110, youngs_modulus: 4.2 },
  
  // 2024 Cross-ply
  { publish_year: 2024, fiber_type: 'Glass', matrix_type: 'Polyester', fiber_content: 40, content_type: 'volume', orientation: '0/90', tensile_strength: 154, youngs_modulus: 7.051 },
  { publish_year: 2024, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: '0/90', tensile_strength: 160, youngs_modulus: 6.65 },
  { publish_year: 2024, fiber_type: 'Glass', matrix_type: 'Ripoxy', fiber_content: 40, content_type: 'volume', orientation: '0/90', tensile_strength: 181.6, youngs_modulus: 6.325 },
  { publish_year: 2024, fiber_type: 'Glass', matrix_type: 'Bisphenol', fiber_content: 40, content_type: 'volume', orientation: '0/90', tensile_strength: 155, youngs_modulus: 7.781 },
  
  // 2022 Glass-Epoxy High Performance
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 35, content_type: 'volume', orientation: '0', tensile_strength: 620, youngs_modulus: 34.5 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 45, content_type: 'volume', orientation: '0', tensile_strength: 710, youngs_modulus: 38.2 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 55, content_type: 'volume', orientation: '0', tensile_strength: 820, youngs_modulus: 42.8 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 60, content_type: 'volume', orientation: '0', tensile_strength: 865, youngs_modulus: 45.6 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: '0', tensile_strength: 780, youngs_modulus: 39.5 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 45, content_type: 'volume', orientation: '0', tensile_strength: 845, youngs_modulus: 42.1 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: '0', tensile_strength: 910, youngs_modulus: 44.8 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 55, content_type: 'volume', orientation: '0', tensile_strength: 960, youngs_modulus: 47.2 },
  
  // 2022 Basalt and Hybrid
  { publish_year: 2022, fiber_type: 'Basalt', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'UD', tensile_strength: 340, youngs_modulus: 21.4 },
  { publish_year: 2022, fiber_type: 'Basalt', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'UD', tensile_strength: 385, youngs_modulus: 24.6 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'UD', tensile_strength: 310, youngs_modulus: 19.2 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'UD', tensile_strength: 360, youngs_modulus: 22.8 },
  { publish_year: 2022, fiber_type: 'Hybrid (Basalt+Glass)', matrix_type: 'Epoxy', fiber_content: 35, content_type: 'volume', orientation: 'UD', tensile_strength: 372, youngs_modulus: 23.5 },
  
  // 2024 Carbon-Epoxy
  { publish_year: 2024, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 55, content_type: 'volume', orientation: '0', tensile_strength: 920, youngs_modulus: 110 },
  { publish_year: 2024, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 55, content_type: 'volume', orientation: '45', tensile_strength: 680, youngs_modulus: 82 },
  { publish_year: 2024, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 60, content_type: 'volume', orientation: '0', tensile_strength: 980, youngs_modulus: 118 },
  { publish_year: 2024, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 60, content_type: 'volume', orientation: '90', tensile_strength: 110, youngs_modulus: 12 },
  { publish_year: 2024, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: '0', tensile_strength: 870, youngs_modulus: 105 },
  
  // 2022 Glass and Carbon Fiber Unidirectional
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Unidirectional', tensile_strength: 412, youngs_modulus: 21.5 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: 'Unidirectional', tensile_strength: 458, youngs_modulus: 24.8 },
  { publish_year: 2022, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Unidirectional', tensile_strength: 720, youngs_modulus: 58.2 },
  { publish_year: 2022, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: 'Unidirectional', tensile_strength: 785, youngs_modulus: 63.7 },
  { publish_year: 2022, fiber_type: 'Hybrid (Glass+Carbon)', matrix_type: 'Epoxy', fiber_content: 45, content_type: 'volume', orientation: 'Unidirectional', tensile_strength: 650, youngs_modulus: 44.3 },
  
  // 2024 Natural Fiber Treated
  { publish_year: 2024, fiber_type: 'Natural Fiber (Treated)', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 58.4, youngs_modulus: 3.12 },
  { publish_year: 2024, fiber_type: 'Natural Fiber (Treated)', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Random', tensile_strength: 72.6, youngs_modulus: 3.85 },
  { publish_year: 2024, fiber_type: 'Natural Fiber (Treated)', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 81.3, youngs_modulus: 4.21 },
  { publish_year: 2024, fiber_type: 'Hybrid Fiber Composite', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Random', tensile_strength: 96.8, youngs_modulus: 5.02 },
  
  // 2022 Glass-Epoxy Weight %
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 10, content_type: 'weight', orientation: '0', tensile_strength: 52, youngs_modulus: 2.1 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 20, content_type: 'weight', orientation: '0', tensile_strength: 68, youngs_modulus: 2.85 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'weight', orientation: '0', tensile_strength: 82, youngs_modulus: 3.4 },
  { publish_year: 2022, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'weight', orientation: '0', tensile_strength: 95, youngs_modulus: 4.1 },
  
  // 2023 E-Glass-Epoxy
  { publish_year: 2023, fiber_type: 'E-Glass', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: '0', tensile_strength: 215, youngs_modulus: 18.5 },
  { publish_year: 2023, fiber_type: 'E-Glass', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: '0', tensile_strength: 248, youngs_modulus: 21.2 },
  { publish_year: 2023, fiber_type: 'E-Glass', matrix_type: 'Epoxy', fiber_content: 60, content_type: 'volume', orientation: '0', tensile_strength: 276, youngs_modulus: 23.8 },
  
  // 2021 Glass-Polyester
  { publish_year: 2021, fiber_type: 'Glass-RT500', matrix_type: 'Polyester', fiber_content: 50, content_type: 'volume', orientation: '0/90', tensile_strength: 228, youngs_modulus: 21.34 },
  { publish_year: 2021, fiber_type: 'Glass-MAT450', matrix_type: 'Polyester', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 109, youngs_modulus: 10.24 },
  
  // 2023 Basalt-HDPE
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'HDPE-8008', fiber_content: 2.8, content_type: 'volume', orientation: 'Random', tensile_strength: 32, youngs_modulus: 1.45 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'HDPE-8008', fiber_content: 5.9, content_type: 'volume', orientation: 'Random', tensile_strength: 38, youngs_modulus: 1.75 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'HDPE-8008', fiber_content: 8.1, content_type: 'volume', orientation: 'Random', tensile_strength: 42, youngs_modulus: 2.05 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'HDPE-8008', fiber_content: 10.6, content_type: 'volume', orientation: 'Random', tensile_strength: 44, youngs_modulus: 2.3 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'HDPE-100S', fiber_content: 2.8, content_type: 'volume', orientation: 'Random', tensile_strength: 28, youngs_modulus: 1.3 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'HDPE-100S', fiber_content: 5.9, content_type: 'volume', orientation: 'Random', tensile_strength: 33, youngs_modulus: 1.6 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'HDPE-100S', fiber_content: 8.1, content_type: 'volume', orientation: 'Random', tensile_strength: 36, youngs_modulus: 1.85 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'HDPE-100S', fiber_content: 10.6, content_type: 'volume', orientation: 'Random', tensile_strength: 37, youngs_modulus: 2.05 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'PP-C4220', fiber_content: 2.8, content_type: 'volume', orientation: 'Random', tensile_strength: 30, youngs_modulus: 1.55 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'PP-C4220', fiber_content: 5.9, content_type: 'volume', orientation: 'Random', tensile_strength: 35, youngs_modulus: 1.8 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'PP-C4220', fiber_content: 8.1, content_type: 'volume', orientation: 'Random', tensile_strength: 39, youngs_modulus: 2.1 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'PP-C4220', fiber_content: 10.6, content_type: 'volume', orientation: 'Random', tensile_strength: 40, youngs_modulus: 2.25 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'PP-K8303', fiber_content: 2.8, content_type: 'volume', orientation: 'Random', tensile_strength: 34, youngs_modulus: 1.6 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'PP-K8303', fiber_content: 5.9, content_type: 'volume', orientation: 'Random', tensile_strength: 39, youngs_modulus: 1.95 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'PP-K8303', fiber_content: 8.1, content_type: 'volume', orientation: 'Random', tensile_strength: 43, youngs_modulus: 2.3 },
  { publish_year: 2023, fiber_type: 'Basalt', matrix_type: 'PP-K8303', fiber_content: 10.6, content_type: 'volume', orientation: 'Random', tensile_strength: 45, youngs_modulus: 2.55 },
  
  // 2024 Sisal-Epoxy
  { publish_year: 2024, fiber_type: 'Sisal', matrix_type: 'Epoxy', fiber_content: 10, content_type: 'volume', orientation: 'Random', tensile_strength: 32.4, youngs_modulus: 1.21 },
  { publish_year: 2024, fiber_type: 'Sisal', matrix_type: 'Epoxy', fiber_content: 20, content_type: 'volume', orientation: 'Random', tensile_strength: 41.8, youngs_modulus: 1.86 },
  { publish_year: 2024, fiber_type: 'Sisal', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 52.6, youngs_modulus: 2.34 },
  { publish_year: 2024, fiber_type: 'Sisal', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Random', tensile_strength: 48.9, youngs_modulus: 2.15 },
  
  // 2025 Jute
  { publish_year: 2025, fiber_type: 'Jute', matrix_type: 'Epoxy', fiber_content: 33, content_type: 'volume', orientation: 'Random', tensile_strength: 68.23, youngs_modulus: 2.919, ply_count: 2 },
  { publish_year: 2025, fiber_type: 'Jute', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 74.57, youngs_modulus: 2.299, ply_count: 4 },
  { publish_year: 2025, fiber_type: 'Jute', matrix_type: 'Epoxy', fiber_content: 60, content_type: 'volume', orientation: 'Random', tensile_strength: 76.85, youngs_modulus: 2.165, ply_count: 6 },
  { publish_year: 2025, fiber_type: 'Jute', matrix_type: 'Polyester', fiber_content: 33, content_type: 'volume', orientation: 'Random', tensile_strength: 39.05, youngs_modulus: 2.586, ply_count: 2 },
  { publish_year: 2025, fiber_type: 'Jute', matrix_type: 'Polyester', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 30.12, youngs_modulus: 2.199, ply_count: 4 },
  
  // 2020 Hybrid Natural Fibers
  { publish_year: 2020, fiber_type: 'Glass/Sisal/Banana', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 104, youngs_modulus: 2.35 },
  { publish_year: 2020, fiber_type: 'Glass/Sisal', matrix_type: 'Polyester', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 65.2, youngs_modulus: null },
  { publish_year: 2020, fiber_type: 'Carbon/Sisal', matrix_type: 'Polyester', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 38.3, youngs_modulus: 1.97 },
  { publish_year: 2020, fiber_type: 'Glass/Sisal/Jute', matrix_type: 'Polyester', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 200, youngs_modulus: null },
  { publish_year: 2020, fiber_type: 'Glass/Jute', matrix_type: 'Polyester', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 266.22, youngs_modulus: 27.5 },
  { publish_year: 2020, fiber_type: 'Carbon/Flax', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 126.3, youngs_modulus: 2.9 },
  { publish_year: 2020, fiber_type: 'Glass/Abaca', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 44.5, youngs_modulus: 0.27 },
  { publish_year: 2020, fiber_type: 'Glass/Flax', matrix_type: 'Polypropylene', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 38.5, youngs_modulus: 2.3 },
  { publish_year: 2020, fiber_type: 'Glass/Banana', matrix_type: 'Polypropylene', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 24.59, youngs_modulus: 0.322 },
  
  // 2025 Natural Fiber A
  { publish_year: 2025, fiber_type: 'Natural Fiber A', matrix_type: 'Epoxy', fiber_content: 10, content_type: 'volume', orientation: 'Random', tensile_strength: 42.6, youngs_modulus: 2.1 },
  { publish_year: 2025, fiber_type: 'Natural Fiber A', matrix_type: 'Epoxy', fiber_content: 20, content_type: 'volume', orientation: 'Random', tensile_strength: 58.4, youngs_modulus: 2.95 },
  { publish_year: 2025, fiber_type: 'Natural Fiber A', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 74.2, youngs_modulus: 3.88 },
  { publish_year: 2025, fiber_type: 'Natural Fiber A', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Random', tensile_strength: 83.7, youngs_modulus: 4.52 },
  { publish_year: 2025, fiber_type: 'Hybrid Fiber (A+B)', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 89.5, youngs_modulus: 4.9 },
  { publish_year: 2025, fiber_type: 'Hybrid Fiber (A+B)', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Random', tensile_strength: 96.3, youngs_modulus: 5.42 },
  
  // 2024 Natural Fiber Treated (Additional)
  { publish_year: 2024, fiber_type: 'Natural Fiber (Treated)', matrix_type: 'Epoxy', fiber_content: 10, content_type: 'volume', orientation: 'Random', tensile_strength: 36.4, youngs_modulus: 1.85 },
  { publish_year: 2024, fiber_type: 'Natural Fiber (Treated)', matrix_type: 'Epoxy', fiber_content: 20, content_type: 'volume', orientation: 'Random', tensile_strength: 52.8, youngs_modulus: 2.63 },
  { publish_year: 2024, fiber_type: 'Natural Fiber (Treated)', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 68.9, youngs_modulus: 3.45 },
  { publish_year: 2024, fiber_type: 'Natural Fiber (Treated)', matrix_type: 'Epoxy', fiber_content: 40, content_type: 'volume', orientation: 'Random', tensile_strength: 81.2, youngs_modulus: 4.02 },
  { publish_year: 2024, fiber_type: 'Natural Fiber (Treated)', matrix_type: 'Epoxy', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 88.7, youngs_modulus: 4.55 },
  
  // 2024 Natural Fiber-Polyester
  { publish_year: 2024, fiber_type: 'Natural Fiber', matrix_type: 'Polyester', fiber_content: 10, content_type: 'volume', orientation: 'Random', tensile_strength: 42.6, youngs_modulus: 2.1 },
  { publish_year: 2024, fiber_type: 'Natural Fiber', matrix_type: 'Polyester', fiber_content: 20, content_type: 'volume', orientation: 'Random', tensile_strength: 58.3, youngs_modulus: 2.8 },
  { publish_year: 2024, fiber_type: 'Natural Fiber', matrix_type: 'Polyester', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 74.9, youngs_modulus: 3.6 },
  { publish_year: 2024, fiber_type: 'Natural Fiber', matrix_type: 'Polyester', fiber_content: 40, content_type: 'volume', orientation: 'Random', tensile_strength: 88.5, youngs_modulus: 4.4 },
  { publish_year: 2024, fiber_type: 'Natural Fiber', matrix_type: 'Polyester', fiber_content: 50, content_type: 'volume', orientation: 'Random', tensile_strength: 95.7, youngs_modulus: 4.9 },
  
  // 2020 Hybrid (Sisal+Sorghum+Coir)
  { publish_year: 2020, fiber_type: 'Hybrid (Sisal+Sorghum+Coir)', matrix_type: 'Polyester', fiber_content: 15, content_type: 'volume', orientation: 'Random', tensile_strength: 52, youngs_modulus: null },
  { publish_year: 2020, fiber_type: 'Hybrid (Sisal+Sorghum+Coir)', matrix_type: 'Polyester', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 65, youngs_modulus: null },
  { publish_year: 2020, fiber_type: 'Hybrid (Sisal+Sorghum+Coir)', matrix_type: 'Polyester', fiber_content: 45, content_type: 'volume', orientation: 'Random', tensile_strength: 78, youngs_modulus: null },
  { publish_year: 2020, fiber_type: 'Hybrid (Sisal+Sorghum+Coir)', matrix_type: 'Polyester', fiber_content: 60, content_type: 'volume', orientation: 'Random', tensile_strength: 85, youngs_modulus: null },
  { publish_year: 2020, fiber_type: 'Hybrid (Sisal+Sorghum+Coir)', matrix_type: 'Polyester', fiber_content: 75, content_type: 'volume', orientation: 'Random', tensile_strength: 90.4, youngs_modulus: null },
  
  // 2025 Glass and Carbon Random
  { publish_year: 2025, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 10, content_type: 'volume', orientation: 'Random', tensile_strength: 52.3, youngs_modulus: 2.1 },
  { publish_year: 2025, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 20, content_type: 'volume', orientation: 'Random', tensile_strength: 68.5, youngs_modulus: 2.8 },
  { publish_year: 2025, fiber_type: 'Glass', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 81.7, youngs_modulus: 3.5 },
  { publish_year: 2025, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 10, content_type: 'volume', orientation: 'Random', tensile_strength: 72.4, youngs_modulus: 3.2 },
  { publish_year: 2025, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 20, content_type: 'volume', orientation: 'Random', tensile_strength: 95.6, youngs_modulus: 4.6 },
  { publish_year: 2025, fiber_type: 'Carbon', matrix_type: 'Epoxy', fiber_content: 30, content_type: 'volume', orientation: 'Random', tensile_strength: 120.8, youngs_modulus: 5.9 }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await CompositeData.deleteMany({});
    console.log('Cleared existing data');

    await CompositeData.insertMany(experimentalData);
    console.log(`Successfully seeded ${experimentalData.length} experimental data points`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
