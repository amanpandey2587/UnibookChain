import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">UniBookChain</h3>
              <p className="text-gray-400">Your AI-powered study companion for PDF documents.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-teal-300 transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 UniBookChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
