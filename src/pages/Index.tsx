import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Users, Clock, Globe, BarChart, Gift } from "lucide-react";
import HeroImage from "../assets/logo.png";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReferralSection from "@/components/referral/ReferralSection";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Storytelling Start */}
        <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-24">
          <Container className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Mine Hero Coins & Build Your Digital Wealth
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Hero Coin is a <strong>revolutionary cryptocurrency</strong> that lets you mine coins with just a few taps—no expensive hardware, no complicated setups. Simply <strong>Mine the coins and earn</strong>!
              </p>
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
                <Link to="/mining">Start Mining Now<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: [0, -10, 0], transition: { duration: 1, repeat: Infinity } }} // Floating effect
              className="flex-1"
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Glowing Animated Border */}
                <div className="absolute inset-0 animate-pulse rounded-full 
                                bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 
                                blur-xl opacity-80"></div>

                {/* Main Image */}
                <img
                  src={HeroImage}
                  alt="Hero Mining"
                  className="relative w-full rounded-full border-4 border-indigo-500 
                             shadow-2xl shadow-purple-800 p-2 bg-black/30"
                />
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-100 dark:bg-gray-800">
          <Container>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            >
              Why Choose Hero Coin?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Easy Mining */}
               <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }
              }
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" }} // Neon glow on hover
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Zap className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Easy Mining</h3>
                <p className="text-gray-700 dark:text-gray-300">Mine coins with just a few taps—no hardware required.</p>
              </motion.div>
<motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }
              }
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" }} // Neon glow on hover
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Shield className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Secure</h3>
                <p className="text-gray-700 dark:text-gray-300">Your coins are safe with our blockchain technology.</p>
              </motion.div>
                <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }
              }
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" }} // Neon glow on hover
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                
                  <Users className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Invite Friends</h3>
                <p className="text-gray-700 dark:text-gray-300">Earn bonuses by inviting friends to join Hero Coin.</p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Referral section (only shown for logged in users) */}
        {user && <ReferralSection />}

        {/* How It Works Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <Container>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            >
              How It Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1: Sign Up */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" }} // Neon glow on hover
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Clock className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">1. Sign Up</h3>
                <p className="text-gray-700 dark:text-gray-300">Create your account in seconds and start mining immediately.</p>
              </motion.div>

              {/* Step 2: Mine Coins */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" }} // Neon glow on hover
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Globe className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">2. Mine Coins</h3>
                <p className="text-gray-700 dark:text-gray-300">Watch ads and earn Hero Coins effortlessly.</p>
              </motion.div>

              {/* Step 3: Earn Rewards */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }
              }
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" }} // Neon glow on hover
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Gift className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">3. Earn Rewards</h3>
                <p className="text-gray-700 dark:text-gray-300">Redeem your coins for real-world rewards.</p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Call to Action Section with Referral Focus */}
        <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-24">
          <Container className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
            >
              Join the Movement & Invite Friends
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-700 dark:text-gray-300 mb-6"
            >
              Join thousands of users already mining Hero Coins and invite your friends to earn bonuses together!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.05, 1], transition: { duration: 1, repeat: Infinity } }} // Pulse effect
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              {user ? (
                <>
                  <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
                    <Link to="/mining">Start Mining<ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
                    <Link to="/signup">Sign Up Now<ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full">
                    <Link to="/login">Login</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </Container>
        </section>
      </main>

      {/* Footer Fix */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
        <Footer />
      </div>
    </div>
  );
};

export default Index;

