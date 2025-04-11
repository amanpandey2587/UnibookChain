"use client";
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Search, Upload, File, BookOpen, MessageSquare, Lightbulb, 
  Home, Book, User, Settings, ArrowRight, Check, Menu, X 
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const FadeInWhenVisible = ({ children, className = "", delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6,
            delay: delay
          } 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const page = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
    
      
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Unlock Knowledge from Your Documents</h1>
              <p className="text-lg md:text-xl mb-8 text-teal-100">Upload your PDFs and get instant answers to all your questions. Study smarter, not harder.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  className="px-6 py-3 bg-white text-teal-600 font-medium rounded-md hover:bg-gray-100 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload size={18} className="mr-2" />
                  Upload PDF
                </motion.button>
                <motion.button 
                  className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen size={18} className="mr-2" />
                  Browse Library
                </motion.button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-2/5"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg border border-white border-opacity-20 shadow-lg">
                <motion.div 
                  className="bg-teal-800 bg-opacity-60 rounded-md p-4 mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <File size={24} className="text-white mb-2" />
                  <div className="h-2 bg-white bg-opacity-30 rounded-full mb-2"></div>
                  <div className="h-2 bg-white bg-opacity-30 rounded-full mb-2 w-3/4"></div>
                  <div className="h-2 bg-white bg-opacity-30 rounded-full w-1/2"></div>
                </motion.div>
                <motion.div 
                  className="flex items-start mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <MessageSquare size={16} className="text-teal-300" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-teal-200">How does photosynthesis work?</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Lightbulb size={16} className="text-teal-300" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-white">Photosynthesis is the process by which plants convert light energy into chemical energy...</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">How It Works</h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">Get answers to all your questions from your educational materials in three simple steps.</p>
          </FadeInWhenVisible>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <FadeInWhenVisible delay={0.1}>
              <motion.div 
                className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-teal-200 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Upload size={28} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Upload Your PDF</h3>
                <p className="text-gray-600">Simply drag and drop your lecture notes, textbooks, or research papers.</p>
              </motion.div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.2}>
              <motion.div 
                className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-teal-200 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Search size={28} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Ask Questions</h3>
                <p className="text-gray-600">Type any question about your document and get instant, accurate answers.</p>
              </motion.div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.3}>
              <motion.div 
                className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-teal-200 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Lightbulb size={28} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Learn Effectively</h3>
                <p className="text-gray-600">Save time with AI-powered explanations that help you understand complex concepts.</p>
              </motion.div>
            </FadeInWhenVisible>
          </motion.div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Powerful Features</h2>
          </FadeInWhenVisible>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <FadeInWhenVisible delay={0.1}>
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-teal-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  >
                    <Check size={20} className="text-emerald-500 mr-2" />
                  </motion.div>
                  Smart Document Analysis
                </h3>
                <p className="text-gray-600">Our AI processes your PDFs to understand context, diagrams, and complex information for accurate answers.</p>
              </motion.div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.2}>
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-teal-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  >
                    <Check size={20} className="text-emerald-500 mr-2" />
                  </motion.div>
                  Citation & References
                </h3>
                <p className="text-gray-600">Every answer includes citations from your document, so you can verify information and learn more.</p>
              </motion.div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.3}>
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-teal-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  >
                    <Check size={20} className="text-emerald-500 mr-2" />
                  </motion.div>
                  Multi-Document Support
                </h3>
                <p className="text-gray-600">Upload multiple PDFs to cross-reference information and get comprehensive answers across all your materials.</p>
              </motion.div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.4}>
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-teal-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  >
                    <Check size={20} className="text-emerald-500 mr-2" />
                  </motion.div>
                  Study Cards & Summaries
                </h3>
                <p className="text-gray-600">Automatically generate study cards, chapter summaries, and key concept explanations from your documents.</p>
              </motion.div>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <motion.div 
              className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl shadow-xl overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to transform your learning experience?</h2>
                  <p className="text-teal-100">Join thousands of students who are studying smarter with our platform.</p>
                </div>
                <div className="mt-8 md:mt-0">
                  <motion.button 
                    className="px-6 py-3 bg-white text-teal-600 font-medium rounded-md hover:bg-gray-100 flex items-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Free
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight size={18} className="ml-2" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </FadeInWhenVisible>
        </div>
      </div>
      
      
    </div>
  );
};

export default page;