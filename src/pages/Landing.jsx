import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { ChevronRight, Check, X, Video, BarChart2, Zap, Users, MessageSquare, Sparkles, ChevronDown, Facebook, Instagram, Twitter, Github, Youtube, Play } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import { Tab } from '@headlessui/react';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { PricingSection } from '../components/landing/PricingSection';
import { ContactSection } from '../components/landing/ContactSection'; 
import { Footer } from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection /> 
      <Footer />
    </div>
  );
}