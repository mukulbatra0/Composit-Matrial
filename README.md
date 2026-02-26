# AI Integrated Composite Material Characterization System

A production-ready MERN stack application for analyzing composite materials using real experimental data from published research (2013-2025).

## Features

- **150+ Experimental Data Points** from peer-reviewed research papers
- **Integrated Load-Deflection Analysis** - Automatically shown when materials are selected
  - Calculate flexural properties (strength, modulus)
  - Visualize load-deflection curves with linear and nonlinear regions
  - Compare different fiber volume fractions
  - Generate summary tables
- **Multiple Material Types**: Glass, Carbon, Basalt, Natural fibers, and Hybrid composites
- **Various Matrix Systems**: Epoxy, Polyester, HDPE, PP, and more
- **Different Orientations**: 0°, 45°, 90°, Random, Unidirectional, 0/90
- **Interactive Visualizations**: Property trends and stress-strain curves
- **Real-time Filtering**: Select fiber, matrix, and orientation to view matching data
- **Statistical Analysis**: Automatic calculation of averages, min/max values
- **Two Modes**: Experimental Data + Load-Deflection (integrated) and Theoretical (Rule of Mixtures)

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)

### Installation

1. **Start MongoDB**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Backend Setup**
   ```bash
   cd composite-dashboard/backend
   npm install
   npm run seed-experimental
   npm run dev
   ```
   
   Backend runs on `http://localhost:5000`

3. **Frontend Setup** (new terminal)
   ```bash
   cd composite-dashboard/frontend
   npm install
   npm start
   ```
   
   Frontend opens at `http://localhost:3000`

## Usage

### Experimental Data & Load-Deflection Page (Integrated)
1. Select a **Fiber Type** (e.g., Glass, Carbon, Basalt)
2. Select a **Matrix Type** (e.g., Epoxy, Polyester)
3. Select **Fiber Orientation** (e.g., 0, Random, UD)
4. View experimental data in the table
5. Analyze property trends in interactive charts
6. **Adjust Fiber Volume Fraction slider** (10-60%) for load-deflection analysis
7. View load-deflection curves showing:
   - Linear region (elastic behavior)
   - Nonlinear region (progressive damage)
   - Maximum load and deflection
8. Compare curves for different FVFs
9. Review flexural properties table:
   - Flexural strength (MPa)
   - Flexural modulus (GPa)
   - Linear region end point

### Theoretical Mode
1. Select fiber and matrix materials
2. Adjust volume/weight fraction sliders
3. View calculated composite properties
4. Analyze property vs fraction curves

## Data Coverage

### Fiber Types (25)
Glass, E-Glass, Carbon, Basalt, Sisal, Jute, Natural Fiber, Kevlar, and various hybrids (Glass+Carbon, Basalt+Glass, etc.)

### Matrix Types (9)
Epoxy, Polyester, HDPE-8008, HDPE-100S, PP-C4220, PP-K8303, Ripoxy, Bisphenol, Polypropylene

### Orientations (7)
0°, 45°, 90°, Random, Unidirectional (UD), 0/90

### Properties Measured
- Tensile Strength (MPa)
- Young's Modulus (GPa)
- Fiber Content (2.8% - 75%)

## Example Combinations to Try

- **High Performance**: Carbon + Epoxy + 0° (up to 980 MPa)
- **Standard Glass**: Glass + Epoxy + 0° (21 data points)
- **Natural Fibers**: Sisal + Epoxy + Random
- **Hybrid Systems**: Hybrid (Glass+Carbon) + Epoxy + Unidirectional

## API Endpoints

### Experimental Data
- `GET /api/composites/fiber-types` - Get all fiber types
- `GET /api/composites/matrix-types` - Get all matrix types
- `GET /api/composites/orientations` - Get all orientations
- `GET /api/composites/data?fiber_type=X&matrix_type=Y&orientation=Z` - Get filtered data
- `GET /api/composites/stats?fiber_type=X&matrix_type=Y&orientation=Z` - Get statistics

### Load-Deflection Analysis
- `GET /api/load-deflection/curve?fiber_type=X&matrix_type=Y&fvf=Z` - Get single curve
- `GET /api/load-deflection/compare?fiber_type=X&matrix_type=Y&fvf_list=10,20,30` - Compare multiple FVFs
- `GET /api/load-deflection/summary?fiber_type=X&matrix_type=Y` - Get summary table

### Theoretical Materials
- `GET /api/materials/fibers` - Get all fiber materials
- `GET /api/materials/matrices` - Get all matrix materials

## Project Structure

```
composite-dashboard/
├── backend/
│   ├── models/
│   │   └── CompositeData.js
│   ├── routes/
│   │   └── composites.js
│   ├── server.js
│   ├── seed-experimental.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MaterialSelector.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyVsFractionChart.jsx
│   │   │   └── StressStrainChart.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── AppExperimental.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Troubleshooting

### Empty Dropdowns
- Ensure MongoDB is running
- Run `npm run seed-experimental` in backend folder
- Restart backend server

### No Data Showing
- Check that you've selected all three filters (Fiber, Matrix, Orientation)
- Try a known combination: Glass + Epoxy + 0
- Some combinations may not have data in the database

### Backend Connection Error
- Verify backend is running on port 5000
- Check `.env` file exists with correct MongoDB URI
- Test: http://localhost:5000/api/health

## Development

### Backend Commands
```bash
npm run dev              # Start with auto-reload
npm run seed-experimental # Seed database
npm run test-connection  # Test MongoDB connection
npm run show-combinations # Show available data combinations
```

### Frontend Commands
```bash
npm start  # Start development server
npm run build  # Production build
```

## Data Sources

Experimental data compiled from published research papers (2013-2025) covering:
- Traditional composites (Glass/Carbon-Epoxy)
- Natural fiber composites (Sisal, Jute, Banana, Flax)
- Hybrid composites
- Various manufacturing methods and fiber orientations

## License

MIT
