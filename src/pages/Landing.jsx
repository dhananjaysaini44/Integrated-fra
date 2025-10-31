import { Link } from 'react-router-dom';
import { MapPin, BarChart3, AlertTriangle, FileText, Users, Shield, ArrowRight, Play } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: "Interactive WebGIS Map",
      description: "Advanced mapping with layers for claims, encroachment, and land cover analysis"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Real-time Analytics",
      description: "Comprehensive dashboards with KPIs, trends, and predictive insights"
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
      title: "Smart Alerts System",
      description: "AI-powered notifications for encroachment detection and compliance monitoring"
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      title: "Claim Management",
      description: "Streamlined workflow for claim submission, tracking, and approval processes"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Multi-stakeholder Access",
      description: "Role-based access for Gram Sabha, District Officers, and Administrators"
    },
    {
      icon: <Shield className="h-8 w-8 text-teal-600" />,
      title: "Secure & Compliant",
      description: "End-to-end encryption with FRA compliance and audit trails"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              FRA Atlas & WebGIS
              <span className="block text-green-600">Decision Support System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered platform for integrated monitoring of Forest Rights Act implementation
              across Madhya Pradesh, Tripura, Odisha, and Telangana. Empowering communities
              with geospatial intelligence and data-driven decision making.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                Login to Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <svg className="absolute left-1/2 transform -translate-x-1/2 top-0" width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-green-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#pattern)" />
          </svg>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About FRA DSS</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Forest Rights Act (FRA) 2006 recognizes the rights of forest-dwelling communities
              over forest resources. Our DSS provides comprehensive monitoring, analysis, and
              decision support tools to ensure effective implementation and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Screenshots Carousel */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Preview</h2>
            <p className="text-lg text-gray-600">Explore the intuitive interface and powerful features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Maps</h3>
              <p className="text-gray-600">Navigate through detailed geospatial data with multiple layers and analysis tools.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Monitor key performance indicators and trends with comprehensive visualizations.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <FileText className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Claim Management</h3>
              <p className="text-gray-600">Streamlined workflows for claim submission, review, and approval processes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of users already benefiting from our FRA DSS platform
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FRA Atlas DSS</h3>
              <p className="text-gray-400">
                Empowering forest communities with technology for sustainable development.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Focus States</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Madhya Pradesh</li>
                <li>Tripura</li>
                <li>Odisha</li>
                <li>Telangana</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>WebGIS Mapping</li>
                <li>AI Analytics</li>
                <li>Claim Management</li>
                <li>Real-time Alerts</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FRA Atlas DSS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
