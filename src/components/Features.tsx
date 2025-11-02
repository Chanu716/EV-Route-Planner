import {
  Navigation,
  Brain,
  UserCheck,
  Bot,
  AlertTriangle,
  Shield,
  Clock,
  Cloud,
  Umbrella,
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Navigation className="w-12 h-12 text-teal-500" />,
      title: "Smart Route Optimization",
      description: "AI-powered route planning considering traffic, battery status, and charger availability. Includes dynamic rerouting and EV-aware navigation for optimal charging stops."
    },
    {
      icon: <Brain className="w-12 h-12 text-purple-500" />,
      title: "Predictive Analysis",
      description: "Real-time predictions for charger occupancy, wait times, and demand based on historical data, weather, and events. Helps you plan your charging stops efficiently."
    },
    {
      icon: <UserCheck className="w-12 h-12 text-blue-500" />,
      title: "Personalized Recommendations",
      description: "Tailored suggestions for stations and routes based on your preferences, including favorite amenities like coffee shops, restaurants, and Wi-Fi availability."
    },
    {
      icon: <Bot className="w-12 h-12 text-green-500" />,
      title: "Autonomous Decision Making",
      description: "Smart suggestions for rerouting, charging stops, and emergency actions based on real-time conditions and your vehicle's status."
    },
    {
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      title: "Emergency Services",
      description: "Quick access to nearby hospitals, police stations, fire stations, and EV support centers with integrated emergency calling."
    },
    {
      icon: <Shield className="w-12 h-12 text-indigo-500" />,
      title: "Safe Route Planning",
      description: "Route suggestions prioritizing well-lit, secure areas and well-maintained roads, especially during night travel."
    },
    {
      icon: <Clock className="w-12 h-12 text-amber-500" />,
      title: "Time Zone Intelligence",
      description: "Automatic time zone adjustments for long-distance trips, showing local times for charging stations and availability."
    },
    {
      icon: <Cloud className="w-12 h-12 text-cyan-500" />,
      title: "Weather Alerts",
      description: "Proactive notifications about weather conditions affecting your route, including storms, ice, strong winds, and heavy rain."
    },
    {
      icon: <Umbrella className="w-12 h-12 text-pink-500" />,
      title: "Rain-Safe Navigation",
      description: "Find charging stations with covered ports and indoor parking, avoiding flood-prone areas during wet weather."
    }
  ];

  return (
    <div className="min-h-screen gradient-bg py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Powerful Features for Your EV Journey
          </h1>
          <p className="text-xl text-white/60">
            Discover how ChargeFlow makes your electric vehicle experience smarter and more convenient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glassmorphism rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-full bg-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
