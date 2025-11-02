import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib
import json
from datetime import datetime
import os

class ChargingStationPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = ['hour_of_day', 'day_of_week', 'traffic_level', 
                              'temperature', 'humidity', 'battery_level']
        
    def preprocess_data(self, df):
        # Convert timestamp to hour and day
        df['hour_of_day'] = pd.to_datetime(df['timestamp']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['timestamp']).dt.dayofweek
        
        # Select features
        X = df[self.feature_columns]
        y = df['availability']
        
        return X, y
    
    def train(self, data_path):
        # Load data
        df = pd.read_csv(data_path)
        
        # Preprocess
        X, y = self.preprocess_data(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred)
        }
        
        # Generate confusion matrix
        conf_matrix = confusion_matrix(y_test, y_pred).tolist()
        
        # Get feature importance
        feature_importance = dict(zip(self.feature_columns, 
                                    self.model.feature_importances_))
        
        # Save results
        results = {
            'metrics': metrics,
            'confusion_matrix': conf_matrix,
            'feature_importance': feature_importance,
            'training_date': datetime.now().isoformat()
        }
        
        return results
    
    def save_model(self, model_dir='models'):
        os.makedirs(model_dir, exist_ok=True)
        joblib.dump(self.model, f'{model_dir}/model.joblib')
        joblib.dump(self.scaler, f'{model_dir}/scaler.joblib')
    
    def load_model(self, model_dir='models'):
        self.model = joblib.load(f'{model_dir}/model.joblib')
        self.scaler = joblib.load(f'{model_dir}/scaler.joblib')
    
    def predict(self, features):
        if not all(col in features for col in self.feature_columns):
            raise ValueError(f"Missing required features. Required: {self.feature_columns}")
        
        X = pd.DataFrame([features])[self.feature_columns]
        X_scaled = self.scaler.transform(X)
        
        probability = self.model.predict_proba(X_scaled)[0][1]
        prediction = self.model.predict(X_scaled)[0]
        
        return {
            'prediction': bool(prediction),
            'probability': float(probability)
        }

if __name__ == "__main__":
    predictor = ChargingStationPredictor()
    results = predictor.train('data/charging_station_data.csv')
    predictor.save_model()
    
    # Save training results
    with open('models/training_results.json', 'w') as f:
        json.dump(results, f, indent=2)
