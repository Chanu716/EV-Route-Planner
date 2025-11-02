import mongoose from 'mongoose';

const chargingStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    connectorTypes: [{
        type: String,
        enum: ['CCS2', 'CHAdeMO', 'Type2', 'Tesla', 'GB/T', 'Bharat AC']
    }],
    availability: {
        totalSpots: Number,
        availableSpots: Number
    },
    pricing: {
        perKWH: Number,
        currency: {
            type: String,
            default: 'INR'
        }
    },
    amenities: [String],
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    operatingHours: {
        isOpen24x7: {
            type: Boolean,
            default: false
        },
        schedule: [{
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            openTime: String,
            closeTime: String
        }]
    }
}, {
    timestamps: true
});

// Index for geospatial queries
chargingStationSchema.index({ location: '2dsphere' });

export default mongoose.model('ChargingStation', chargingStationSchema);
