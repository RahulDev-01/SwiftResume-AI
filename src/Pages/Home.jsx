
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Header from '../components/custom/Header'
import {
  FileText,
  Zap,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Shield,
  Download,
  TrendingUp,
  Award,
  Briefcase,
  Play
} from 'lucide-react'

export function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              AI-Powered Resume Builder
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">NEW</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-8 leading-tight">
              Create Your Perfect
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Resume with AI
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-10 max-w-4xl mx-auto font-light leading-relaxed">
              Build professional, <span className="font-semibold text-blue-600">ATS-optimized resumes</span> in minutes.
              Let AI help you craft the perfect resume that gets you <span className="font-semibold text-purple-600">noticed by employers</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-8">
              <Link to="/auth/sign-in">
                <Button size="lg" className="group text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="group text-lg px-10 py-7 border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-300 hover:scale-105">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>50,000+ resumes created</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-lg opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-float animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-200 rounded-lg opacity-20 animate-float animation-delay-4000"></div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 uppercase tracking-wider text-sm font-semibold mb-8">Trusted by professionals at</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
            <div className="h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm font-medium hover:shadow-md transition-shadow">Google</div>
            <div className="h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm font-medium hover:shadow-md transition-shadow">Microsoft</div>
            <div className="h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm font-medium hover:shadow-md transition-shadow">Amazon</div>
            <div className="h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm font-medium hover:shadow-md transition-shadow">Meta</div>
            <div className="h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm font-medium hover:shadow-md transition-shadow">Apple</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <Award className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SwiftResume AI?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes resume building effortless and effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 hover:-translate-y-2 border border-blue-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">AI-Powered Content</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate compelling resume content tailored to your industry and experience level using advanced AI technology.
              </p>
              <div className="mt-6 flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-500 hover:-translate-y-2 border border-green-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">ATS Optimized</h3>
              <p className="text-gray-600 leading-relaxed">
                Ensure your resume passes through Applicant Tracking Systems with our ATS-friendly templates and formatting.
              </p>
              <div className="mt-6 flex items-center text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-purple-50 via-purple-50 to-pink-100 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 hover:-translate-y-2 border border-purple-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">Save Time</h3>
              <p className="text-gray-600 leading-relaxed">
                Create a professional resume in minutes instead of hours. Focus on what matters most - landing your dream job.
              </p>
              <div className="mt-6 flex items-center text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-orange-50 via-orange-50 to-red-100 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 hover:-translate-y-2 border border-orange-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">Multiple Formats</h3>
              <p className="text-gray-600 leading-relaxed">
                Export your resume in PDF, Word, and other formats. Choose from various professional templates.
              </p>
              <div className="mt-6 flex items-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 hover:shadow-2xl hover:shadow-teal-200/50 transition-all duration-500 hover:-translate-y-2 border border-teal-100">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is encrypted and secure. We never share your personal information with third parties.
              </p>
              <div className="mt-6 flex items-center text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature Card 6 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-indigo-50 to-blue-100 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-500 hover:-translate-y-2 border border-indigo-100">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">Expert Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                Get tips and suggestions from career experts to make your resume stand out from the competition.
              </p>
              <div className="mt-6 flex items-center text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 animate-fade-in-up">50k+</div>
              <p className="text-blue-100 text-lg">Resumes Created</p>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 animate-fade-in-up">98%</div>
              <p className="text-blue-100 text-lg">User Satisfaction</p>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 animate-fade-in-up">3x</div>
              <p className="text-blue-100 text-lg">Interview Callbacks</p>
            </div>
            <div className="p-6">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 animate-fade-in-up">10min</div>
              <p className="text-blue-100 text-lg">Avg. Time to Build</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Create your perfect resume in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 -z-10"></div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up & Choose Template</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your account and select from our collection of professional resume templates designed for different industries.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Content Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Let our AI analyze your experience and generate compelling content for each section of your resume.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download & Apply</h3>
              <p className="text-gray-600 leading-relaxed">
                Review, customize, and download your professional resume. Start applying to jobs with confidence!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who've landed their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed italic">
                "SwiftResume AI helped me create a professional resume that got me 3 interview calls in just one week! The AI suggestions were spot-on."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  S
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sarah Johnson</p>
                  <p className="text-gray-600 text-sm">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed italic">
                "The ATS optimization feature is incredible. My resume now passes through every system and I'm getting more responses than ever."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  M
                </div>
                <div>
                  <p className="font-bold text-gray-900">Michael Chen</p>
                  <p className="text-gray-600 text-sm">Marketing Manager</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed italic">
                "I was skeptical about AI resume builders, but this one actually understands my industry and creates relevant content. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  E
                </div>
                <div>
                  <p className="font-bold text-gray-900">Emily Rodriguez</p>
                  <p className="text-gray-600 text-sm">Data Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SwiftResume AI</h3>
              <p className="text-gray-400 leading-relaxed">
                AI-powered resume builder that helps you create professional resumes in minutes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SwiftResume AI. All rights reserved. Created By <span className='text-blue-400 font-semibold'>Savvana Rahul</span>⚡</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
