# Quick Start Guide

## Setup in 5 Minutes

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 2. Backend Setup
```bash
cd composite-dashboard/backend
npm install
npm run seed-experimental
npm run dev
```

Backend will start on `http://localhost:5000`

### 3. Frontend Setup (New Terminal)
```bash
cd composite-dashboard/frontend
npm install
npm start
```

Frontend will open automatically at `http://localhost:3000`

## What You'll See

The dashboard loads with experimental data mode by default, showing:
- 150+ real experimental data points from research papers (2013-2025)
- Dropdown filters for Fiber Type, Matrix Type, and Orientation
- Data table with all matching experimental results
- Interactive charts showing property trends
- Statistical summaries

## Try These Combinations

### High-Performance Carbon Composites
- Fiber: Carbon
- Matrix: Epoxy
- Orientation: 0 (or Unidirectional)
- Result: Tensile strength up to 980 MPa, Modulus up to 118 GPa

### Glass-Epoxy Standard
- Fiber: Glass
- Matrix: Epoxy
- Orientation: 0
- Result: Wide range of data points showing property variation with fiber content

### Natural Fiber Composites
- Fiber: Sisal (or Jute, Natural Fiber)
- Matrix: Epoxy
- Orientation: Random
- Result: Lower strength but eco-friendly alternatives

### Hybrid Composites
- Fiber: Hybrid (Basalt+Glass) or Hybrid (Glass+Carbon)
- Matrix: Epoxy
- Orientation: UD or Unidirectional
- Result: Balanced properties between constituent fibers

## Switch to Theoretical Mode

Edit `frontend/src/index.js`:
```javascript
const USE_EXPERIMENTAL_DATA = false;  // Change to false
```

Then refresh the browser. You'll see:
- Material property database (Carbon, Glass, Kevlar, etc.)
- Real-time Rule of Mixtures calculations
- Interactive sliders for volume/weight fractions
- Theoretical property curves

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in backend folder
- Check port 5000 is not in use

### Frontend shows error
- Ensure backend is running first
- Check console for CORS errors
- Verify `http://localhost:5000` is accessible

### No data showing
- Run `npm run seed-experimental` again
- Check MongoDB connection
- Look at browser console for API errors

## Next Steps

- Explore different material combinations
- Analyze how fiber content affects properties
- Compare different orientations (0° vs Random vs UD)
- Review the data table for specific research years
- Export data for further analysis (feature to be added)

## Data Highlights

- **Most data points**: Glass-Epoxy combinations
- **Highest strength**: Carbon-Epoxy at 60% fiber content, 0° orientation (980 MPa)
- **Natural fibers**: Sisal, Jute, and various treated natural fibers
- **Hybrid systems**: Glass+Carbon, Basalt+Glass, and natural fiber hybrids
- **Year range**: 2013-2025 (latest research included)
