# EV Route & Charging Optimizer

A comprehensive web application for electric vehicle (EV) owners that optimizes route planning and charging station recommendations using machine learning and real-time data.

## 🚗 Overview

This application helps EV drivers plan their routes efficiently by:
- Finding optimal charging stations along their route
- Predicting charging station availability using machine learning
- Calculating range based on vehicle specifications and battery levels
- Providing real-time traffic and weather considerations
- Tracking route history and user preferences

## 🏗️ Architecture

### Frontend
- **Framework:** React 18.3 with TypeScript
- **Build Tool:** Vite 5.4
- **UI Styling:** Tailwind CSS
- **Maps Integration:** Google Maps API (@react-google-maps/api)
- **Icons:** Lucide React, React Icons
- **Routing:** React Router DOM v7

### Backend
- **Runtime:** Node.js with Express 5.1
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) with bcrypt password hashing
- **API:** RESTful architecture with CORS support

### Machine Learning
- **Language:** Python 3.x
- **ML Framework:** Scikit-learn (Random Forest Classifier)
- **Data Processing:** Pandas, NumPy
- **Model Persistence:** Joblib
- **Algorithms:** Dijkstra's algorithm for optimal pathfinding

## 📁 Project Structure

```
project/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── ChargingStations.tsx
│   │   ├── Contact.tsx
│   │   ├── Features.tsx
│   │   ├── RouteOptimizer.tsx
│   │   └── SignIn.tsx
│   ├── data/                    # Static data (car models)
│   ├── services/                # API service layer
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── server/                      # Backend Node.js server
│   ├── algorithms/              # Pathfinding algorithms
│   │   └── dijkstra.py         # Dijkstra's algorithm implementation
│   ├── config/                  # Configuration files
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/             # Request handlers
│   ├── middleware/              # Express middleware
│   ├── ml/                      # Machine learning components
│   │   ├── predict.py          # ML prediction script
│   │   ├── route_optimizer.py  # Route optimization logic
│   │   ├── train_model.py      # Model training script
│   │   ├── data/               # Training datasets
│   │   │   └── charging_station_data.csv
│   │   └── models/             # Trained ML models
│   │       ├── model.joblib
│   │       ├── scaler.joblib
│   │       └── training_results.json
│   ├── models/                  # MongoDB schemas
│   │   ├── ChargingStation.js
│   │   ├── RouteHistory.js
│   │   ├── StationUsage.js
│   │   ├── User.js
│   │   └── UserPreferences.js
│   ├── routes/                  # API route handlers
│   │   ├── auth.js
│   │   ├── chargingStations.js
│   │   ├── nearestStation.js
│   │   ├── optimizedRoutes.js
│   │   ├── predictions.js
│   │   ├── routeHistory.js
│   │   └── userPreferences.js
│   └── server.js               # Express server entry point
├── data/                        # MongoDB data directory
├── public/                      # Static assets
├── index.html                   # HTML entry point
├── start-mongodb.ps1           # MongoDB startup script
└── package.json                # Node.js dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **Python** (v3.8 or higher)
- **Google Maps API Key**

### Installation

1. **Clone the repository:**
   ```bash
   cd project
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Install Python dependencies:**
   ```bash
   cd server/ml
   pip install -r requirements.txt
   cd ../..
   ```

4. **Set up environment variables:**
   
   Copy the example environment file and update it with your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your actual values:
   ```env
   # Google Maps API Key (Frontend)
   # Get your key from: https://console.cloud.google.com/google/maps-apis
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   
   # Server Configuration
   PORT=5000
   
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/ev-optimizer
   
   # MongoDB Data Path
   MONGODB_DATA_PATH=./data
   
   # JWT Secret (Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   JWT_SECRET=your_secure_random_jwt_secret_here
   ```
   
   **⚠️ Security Note:** Never commit the `.env` file to version control. It contains sensitive credentials.

5. **Train the ML model (optional - pre-trained models included):**
   ```bash
   cd server/ml
   python train_model.py
   ```

### Running the Application

#### Option 1: Run all services concurrently (Recommended)
```bash
npm start
```

This command will start:
- MongoDB server (port 27017)
- Backend API server (port 5000)
- Frontend development server (port 5182)

#### Option 2: Run services individually

**Terminal 1 - MongoDB:**
```powershell
npm run mongodb
# or manually: mongod --dbpath ./data --port 27017
```

**Terminal 2 - Backend Server:**
```bash
npm run server:dev
# or: npm run server
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

## 🔑 Key Features

### 1. **Route Optimization**
- Real-time route calculation using Google Maps API
- Battery consumption estimation based on vehicle model
- Optimal charging stop recommendations
- Traffic and weather-aware routing

### 2. **Charging Station Intelligence**
- ML-powered availability predictions
- Station filtering by type (Fast Charge, Standard, Supercharger)
- Distance-based station search
- Historical usage tracking

### 3. **User Management**
- Secure authentication with JWT
- User preferences storage
- Route history tracking
- Personalized recommendations

### 4. **Machine Learning Models**
- Random Forest Classifier for availability prediction
- Features considered:
  - Hour of day
  - Day of week
  - Traffic level
  - Temperature
  - Humidity
  - Battery level

### 5. **Vehicle Support**
- Multiple EV models supported (Tesla, Nissan Leaf, Chevy Bolt, etc.)
- Battery capacity tracking
- Range calculation based on driving conditions

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Charging Stations
- `GET /api/stations` - Get all charging stations
- `GET /api/stations/:id` - Get specific station
- `POST /api/stations` - Add new station (admin)

### Route Planning
- `POST /api/optimized-routes` - Get optimized route with charging stops
- `POST /api/nearest-station` - Find nearest available station
- `GET /api/routes` - Get user's route history

### Predictions
- `POST /api/predictions` - Get station availability prediction

### User Preferences
- `GET /api/preferences/:userId` - Get user preferences
- `PUT /api/preferences/:userId` - Update user preferences

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build production frontend
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run server` - Start backend server
- `npm run server:dev` - Start backend with auto-reload (nodemon)
- `npm run mongodb` - Start MongoDB server
- `npm start` - Start all services concurrently

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** compatible configuration
- **Tailwind CSS** for consistent styling

## 🧪 Machine Learning Pipeline

### Training Data
The model is trained on historical charging station data including:
- Timestamp patterns
- Traffic conditions
- Weather data
- Station usage metrics

### Model Performance
Results are saved in `server/ml/models/training_results.json` with metrics:
- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

### Retraining
To retrain the model with new data:
```bash
cd server/ml
python train_model.py
```

## 🌐 Google Maps Integration

The application uses Google Maps JavaScript API with the following libraries:
- **places** - Location search and autocomplete
- **geometry** - Distance calculations
- **drawing** - Map interactions

## 🔒 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT-based authentication
- CORS enabled for cross-origin requests
- Environment variables for sensitive data
- Input validation and sanitization

## 📊 Database Schema

### Collections
- **Users** - User accounts and credentials
- **ChargingStations** - Station locations and details
- **RouteHistory** - User's past routes
- **StationUsage** - Historical usage data
- **UserPreferences** - User settings and preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Authors

- Development Team

## 🐛 Known Issues

None currently. All API keys have been moved to environment variables and sensitive data is properly secured.

## 🔮 Future Enhancements

- [ ] Add real-time charging station status updates
- [ ] Implement multi-stop route optimization
- [ ] Add mobile application support
- [ ] Integrate payment processing for charging
- [ ] Add social features (share routes, reviews)
- [ ] Implement advanced weather integration
- [ ] Add support for more EV models
- [ ] Create admin dashboard for station management

## 📞 Support

For issues and questions, please open an issue in the repository or contact the development team.

---

## 🔐 Security

- **Environment Variables**: All sensitive data (API keys, JWT secrets, database credentials) are stored in `.env` file
- **Git Security**: The `.env` file is excluded from version control via `.gitignore`
- **Setup**: Copy `.env.example` to `.env` and add your actual credentials
- **Never commit**: Do not commit `.env` or any files containing sensitive credentials

**⚠️ Important**: Before deploying to production, ensure all environment variables are properly configured and API keys are restricted with appropriate domain/IP restrictions.
