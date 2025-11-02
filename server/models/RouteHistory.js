import mongoose from 'mongoose';

const routeHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: String
    },
    endLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: String
    },
    distance: {
        value: Number,
        unit: {
            type: String,
            default: 'km'
        }
    },
    duration: {
        value: Number,
        unit: {
            type: String,
            default: 'minutes'
        }
    },
    chargingStops: [{
        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChargingStation'
        },
        estimatedDuration: Number,
        chargeAmount: Number
    }],
    carModel: {
        make: String,
        model: String,
        year: Number,
        batteryCapacity: Number
    },
    weatherConditions: {
        temperature: Number,
        condition: String,
        windSpeed: Number
    },
    completed: {
        type: Boolean,
        default: false
    },
    startTime: Date,
    endTime: Date
}, {
    timestamps: true
});

routeHistorySchema.index({ startLocation: '2dsphere', endLocation: '2dsphere' });

export default mongoose.model('RouteHistory', routeHistorySchema);
