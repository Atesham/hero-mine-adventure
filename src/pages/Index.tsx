
// import React from 'react';
// import Hero from '@/components/home/Hero';
// import Features from '@/components/home/Features';
// import Navbar from '@/components/layout/Navbar';
// import Footer from '@/components/layout/Footer';
// import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom';
// import { ArrowRight, PlayCircle, ShieldCheck, Users } from 'lucide-react';
// import Container from '@/components/ui/Container';

// const Index = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
      
//       <main className="flex-1">
//         <Hero />
//         <Features />
        
//         {/* How it works section */}
//         <section className="py-20">
//           <Container>
//             <div className="text-center max-w-3xl mx-auto mb-16">
//               <h2 className="text-3xl md:text-4xl font-bold mb-4">
//                 How Hero Coin Mining Works
//               </h2>
//               <p className="text-xl text-muted-foreground">
//                 A simplified mining process made accessible for everyone
//               </p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="text-center p-6">
//                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <PlayCircle className="w-8 h-8 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3">Watch Ads</h3>
//                 <p className="text-muted-foreground">
//                   Simply watch two short ads every 12 hours to start mining Hero Coins.
//                 </p>
//               </div>
              
//               <div className="text-center p-6">
//                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Users className="w-8 h-8 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3">Invite Friends</h3>
//                 <p className="text-muted-foreground">
//                   Refer friends and earn bonus coins whenever they complete mining.
//                 </p>
//               </div>
              
//               <div className="text-center p-6">
//                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <ShieldCheck className="w-8 h-8 text-primary" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3">Secure Transactions</h3>
//                 <p className="text-muted-foreground">
//                   Send and receive Hero Coins with ease through our secure platform.
//                 </p>
//               </div>
//             </div>
            
//             <div className="text-center mt-12">
//               <Button asChild size="lg" className="rounded-full">
//                 <Link to="/mining">
//                   Start Mining Now
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>
//           </Container>
//         </section>
        
//         {/* CTA section */}
//         <section className="py-16 bg-primary/5">
//           <Container>
//             <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto">
//               <h2 className="text-2xl md:text-3xl font-bold mb-6">
//                 Join Thousands of Hero Coin Miners Today
//               </h2>
//               <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//                 Start your mining journey and earn your first coins in just minutes. No technical knowledge required.
//               </p>
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <Button asChild size="lg" className="rounded-full">
//                   <Link to="/mining">
//                     Start Mining
//                   </Link>
//                 </Button>
//                 <Button asChild variant="outline" size="lg" className="rounded-full">
//                   <Link to="/wallet">
//                     Explore Wallet
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </Container>
//         </section>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default Index;


// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowRight, PlayCircle, ShieldCheck, Users, Zap, TrendingUp, DollarSign } from "lucide-react";
// import HeroImage from "../assets/logo.png"; // Example image for the Hero section
// import MiningImage from "../assets/invite.png"; // Example image for mining steps
// import SecureImage from "../assets/secure.png"; // Example image for security
// import InviteImage from "../assets/invite.png";
//   // Example image for mining steps
// import Container from "@/components/ui/Container";
// import { Button } from "@/components/ui/button";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";

// const Index = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />

//       <main className="flex-1">
//         {/* Hero Section - Storytelling Start */}
//         <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-24">
//           <Container className="flex flex-col md:flex-row items-center gap-12">
//             <div className="flex-1 text-center md:text-left">
//               <h1 className="text-4xl md:text-5xl font-bold mb-6">
//                 Mine Hero Coins & Build Your Digital Wealth
//               </h1>
//               <p className="text-lg text-gray-300 mb-6">
//                 Hero Coin is a **revolutionary cryptocurrency** that lets you mine coins with just a few taps—no expensive hardware, no complicated setups. Simply **watch ads and earn**!
//               </p>
//               <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
//                 <Link to="/mining">
//                   Start Mining Now
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Link>
//               </Button>
//             </div>
//             <div className="flex-1">
//               <img src={HeroImage} alt="Hero Mining" className="w-full max-w-md mx-auto" />
//             </div>
//           </Container>
//         </section>

//         {/* How it Works - Step-by-Step Guide */}
//         <section className="py-20 bg-gray-100">
//           <Container>
//             <div className="text-center max-w-3xl mx-auto mb-16">
//               <h2 className="text-3xl md:text-4xl font-bold mb-4">How Hero Coin Mining Works</h2>
//               <p className="text-lg text-gray-600">
//                 Mining Hero Coins is as simple as **watching two short ads** every 12 hours. Here's how you can start:
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="text-center p-6 bg-white shadow-md rounded-lg">
//                 <img src={MiningImage} alt="Watch Ads" className="w-24 h-24 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Watch Ads</h3>
//                 <p className="text-gray-600">Tap 'Mine Now' and watch two short ads to start earning.</p>
//               </div>

//               <div className="text-center p-6 bg-white shadow-md rounded-lg">
//                 <img src={InviteImage} alt="Invite Friends" className="w-24 h-24 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Invite Friends</h3>
//                 <p className="text-gray-600">Refer your friends and earn extra Hero Coins whenever they mine.</p>
//               </div>

//               <div className="text-center p-6 bg-white shadow-md rounded-lg">
//                 <img src={SecureImage} alt="Secure Transactions" className="w-24 h-24 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
//                 <p className="text-gray-600">Use your Hero Coins to send and receive payments with **blockchain security**.</p>
//               </div>
//             </div>

//             <div className="text-center mt-12">
//               <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
//                 <Link to="/mining">
//                   Start Mining Now
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>
//           </Container>
//         </section>

//         {/* Why Choose Hero Coin? */}
//         <section className="py-16 bg-primary text-white">
//           <Container>
//             <div className="text-center max-w-3xl mx-auto mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Hero Coin?</h2>
//               <p className="text-lg text-gray-200">
//                 Unlike traditional mining that requires **costly hardware**, Hero Coin makes mining **accessible to everyone**.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="text-center p-6">
//                 <Zap className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
//                 <h3 className="text-xl font-semibold mb-2">Zero Energy Waste</h3>
//                 <p className="text-gray-200">No power-hungry mining rigs—just your smartphone!</p>
//               </div>

//               <div className="text-center p-6">
//                 <TrendingUp className="w-10 h-10 mx-auto mb-4 text-green-400" />
//                 <h3 className="text-xl font-semibold mb-2">Growing Value</h3>
//                 <p className="text-gray-200">As adoption increases, the value of Hero Coin rises.</p>
//               </div>

//               <div className="text-center p-6">
//                 <DollarSign className="w-10 h-10 mx-auto mb-4 text-blue-400" />
//                 <h3 className="text-xl font-semibold mb-2">Earn Without Investment</h3>
//                 <p className="text-gray-200">No initial deposits—just **start mining for free**!</p>
//               </div>
//             </div>
//           </Container>
//         </section>

//         {/* CTA - Get Started */}
//         <section className="py-16 bg-gray-100">
//           <Container>
//             <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto bg-white shadow-lg">
//               <h2 className="text-2xl md:text-3xl font-bold mb-6">
//                 Join Thousands of Hero Coin Miners Today
//               </h2>
//               <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//                 **Be part of the future of crypto mining.** Start earning Hero Coins in minutes!
//               </p>
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
//                   <Link to="/mining">Start Mining</Link>
//                 </Button>
//                 <Button asChild variant="outline" size="lg" className="rounded-full">
//                   <Link to="/wallet">Explore Wallet</Link>
//                 </Button>
//               </div>
//             </div>
//           </Container>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Index;

// // import React from "react";
// // import { Link } from "react-router-dom";
// // import { motion } from "framer-motion";
// // import { ArrowRight } from "lucide-react";
// // import HeroImage from "../assets/logo.png";
// // import MiningImage from "../assets/invite.png";
// // import SecureImage from "../assets/secure.png";
// // import InviteImage from "../assets/invite.png";
// // import Container from "@/components/ui/Container";
// // import { Button } from "@/components/ui/button";
// // import Navbar from "@/components/layout/Navbar";
// // import Footer from "@/components/layout/Footer";

// // const Index = () => {
// //   return (
// //     <div className="min-h-screen flex flex-col bg-gray-900 text-white dark:bg-gray-900 dark:text-white light:bg-white light:text-black">
// //       <Navbar />
// //       <main className="flex-1">
// //         {/* Hero Section - Storytelling Start */}
// //         <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 light:from-white light:to-gray-200">
// //           <Container className="flex flex-col md:flex-row items-center gap-12">
// //             <motion.div
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 1 }}
// //               className="flex-1 text-center md:text-left"
// //             >
// //               <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white light:text-black">
// //                 Mine Hero Coins & Build Your Digital Wealth
// //               </h1>
// //               <p className="text-lg text-gray-300 light:text-gray-700 mb-6">
// //                 Hero Coin is a <strong>revolutionary cryptocurrency</strong> that lets you mine coins with just a few taps—no expensive hardware, no complicated setups. Simply <strong>watch ads and earn</strong>!
// //               </p>
// //               <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
// //                 <Link to="/mining">Start Mining Now<ArrowRight className="ml-2 h-5 w-5" /></Link>
// //               </Button>
// //             </motion.div>
// //             <motion.div
// //               initial={{ scale: 0.8, opacity: 0 }}
// //               animate={{ scale: 1, opacity: 1 }}
// //               transition={{ duration: 1 }}
// //               className="flex-1"
// //             >
// //               <img src={HeroImage} alt="Hero Mining" className="w-full max-w-md mx-auto" />
// //             </motion.div>
// //           </Container>
// //         </section>
// //       </main>

// //       {/* Footer Fix */}
// //       <div className="bg-gray-900 text-white dark:bg-gray-900 dark:text-white light:bg-gray-100 light:text-black">
// //         <Footer />
// //       </div>
// //     </div>
// //   );
// // };

// // export default Index;




import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Users, Clock, Globe, BarChart, Gift } from "lucide-react";
import HeroImage from "../assets/logo.png";
import MiningImage from "../assets/invite.png";
import SecureImage from "../assets/secure.png";
import InviteImage from "../assets/invite.png";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
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
              transition={{ duration: 1 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Mine Hero Coins & Build Your Digital Wealth
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Hero Coin is a <strong>revolutionary cryptocurrency</strong> that lets you mine coins with just a few taps—no expensive hardware, no complicated setups. Simply <strong>watch ads and earn</strong>!
              </p>
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
                <Link to="/mining">Start Mining Now<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex-1"
            >
              <img src={HeroImage} alt="Hero Mining" className="w-full max-w-md mx-auto" />
            </motion.div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-100 dark:bg-gray-800">
          <Container>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            >
              Why Choose Hero Coin?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Easy Mining */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Zap className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Easy Mining</h3>
                <p className="text-gray-700 dark:text-gray-300">Mine coins with just a few taps—no hardware required.</p>
              </motion.div>

              {/* Feature 2: Secure */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Shield className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Secure</h3>
                <p className="text-gray-700 dark:text-gray-300">Your coins are safe with our blockchain technology.</p>
              </motion.div>

              {/* Feature 3: Invite Friends */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <Users className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Invite Friends</h3>
                <p className="text-gray-700 dark:text-gray-300">Earn bonuses by inviting friends to join Hero Coin.</p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <Container>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            >
              How It Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1: Sign Up */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
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
                transition={{ duration: 1, delay: 0.4 }}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
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
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
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

        {/* Call to Action Section */}
        <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-24">
          <Container className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
            >
              Ready to Start Mining?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-lg text-gray-700 dark:text-gray-300 mb-6"
            >
              Join thousands of users already mining Hero Coins and building their digital wealth.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/80">
                <Link to="/mining">Get Started<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
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