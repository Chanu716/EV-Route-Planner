import mongoose from 'mongoose';

const stationUsageSchema = new mongoose.Schema({
    station_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChargingStation',
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    traffic_level: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    battery_level: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    availability: {
        type: Boolean,
        required: true
    },
    hour_of_day: {
        type: Number,
        min: 0,
        max: 23
    },
    day_of_week: {
        type: Number,
        min: 0,
        max: 6
    }
}, {
    timestamps: true
});

// Pre-save middleware to extract hour and day
stationUsageSchema.pre('save', function(next) {
    const date = new Date(this.timestamp);
    this.hour_of_day = date.getHours();
    this.day_of_week = date.getDay();
    next();
});

export default mongoose.model('StationUsage', stationUsageSchema);
