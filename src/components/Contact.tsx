import { useState } from 'react';
import {
  Phone,
  Mail,
  Car,
  Send
} from 'lucide-react';

const carManufacturers = [
  {
    name: 'Tesla',
    phone: '1-888-518-3752',
    email: 'support@tesla.com'
  },
  {
    name: 'BMW',
    phone: '1-800-831-1117',
    email: 'customerservice@bmw.com'
  },
  {
    name: 'Chevrolet',
    phone: '1-800-222-1020',
    email: 'support@chevrolet.com'
  },
  {
    name: 'Nissan',
    phone: '1-800-647-7261',
    email: 'contact@nissan.com'
  },
  {
    name: 'Ford',
    phone: '1-800-392-3673',
    email: 'support@ford.com'
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen gradient-bg py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-white/60">
            We're here to help with your EV charging needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glassmorphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">ChargeFlow Contact</h2>
              <div className="space-y-4">
                <div className="flex items-center text-white">
                  <Phone className="h-5 w-5 mr-3 text-teal-500" />
                  <span>+91 9182789929</span>
                </div>
                <div className="flex items-center text-white">
                  <Mail className="h-5 w-5 mr-3 text-teal-500" />
                  <span>chargeflow@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Manufacturer Support</h2>
              <div className="space-y-6">
                {carManufacturers.map((manufacturer, index) => (
                  <div key={index} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center text-white mb-2">
                      <Car className="h-5 w-5 mr-3 text-teal-500" />
                      <span className="font-semibold">{manufacturer.name}</span>
                    </div>
                    <div className="ml-8 space-y-1 text-white/80">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{manufacturer.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{manufacturer.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="glassmorphism rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Send us Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors"
              >
                <Send className="h-5 w-5" />
                Send Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
