import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    defaultCar: {
        make: String,
        model: String,
        year: Number,
        batteryCapacity: Number,
        preferredConnectorType: String
    },
    routePreferences: {
        preferHighways: {
            type: Boolean,
            default: true
        },
        avoidTolls: {
            type: Boolean,
            default: false
        },
        maxChargingStops: {
            type: Number,
            default: 3
        },
        minBatteryLevel: {
            type: Number,
            default: 20
        },
        preferredChargingDuration: {
            type: Number,
            default: 30
        }
    },
    stationPreferences: {
        preferredAmenities: [String],
        maxPricePerKWH: Number,
        preferredNetworks: [String],
        minRating: {
            type: Number,
            default: 4.0
        }
    },
    notifications: {
        lowBatteryAlert: {
            type: Boolean,
            default: true
        },
        weatherAlerts: {
            type: Boolean,
            default: true
        },
        routeUpdates: {
            type: Boolean,
            default: true
        },
        stationAvailability: {
            type: Boolean,
            default: true
        }
    },
    displayPreferences: {
        darkMode: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            default: 'en'
        },
        distanceUnit: {
            type: String,
            enum: ['km', 'miles'],
            default: 'km'
        },
        temperatureUnit: {
            type: String,
            enum: ['celsius', 'fahrenheit'],
            default: 'celsius'
        }
    },
    favoriteStations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChargingStation'
    }],
    homeLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number],
        address: String
    },
    workLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number],
        address: String
    }
}, {
    timestamps: true
});

userPreferencesSchema.index({ homeLocation: '2dsphere', workLocation: '2dsphere' });

export default mongoose.model('UserPreferences', userPreferencesSchema);
