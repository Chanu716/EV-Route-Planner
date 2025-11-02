import sys
import json
from train_model import ChargingStationPredictor

def predict_availability(features):
    predictor = ChargingStationPredictor()
    predictor.load_model()
    return predictor.predict(features)

if __name__ == "__main__":
    # Get features from command line argument
    features = json.loads(sys.argv[1])
    
    # Make prediction
    result = predict_availability(features)
    
    # Print result as JSON
    print(json.dumps(result))
