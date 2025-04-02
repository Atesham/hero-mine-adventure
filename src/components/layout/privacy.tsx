import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "./Navbar";
import { ChevronDown, ChevronUp, Shield, Lock, EyeOff, Mail, CreditCard } from "lucide-react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<string | null>("data-collection");

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Shield className="w-5 h-5 mr-2" />,
      content: (
        <>
          <p className="mb-4">Welcome to HeroCoin's Privacy Policy. Your privacy is critically important to us, and we are committed to protecting your personal information.</p>
          <p>This policy explains how HeroCoin ("we", "us", or "our") collects, uses, discloses, and safeguards your information when you use our mining platform, website, and mobile application.</p>
        </>
      )
    },
    {
      id: "data-collection",
      title: "Information We Collect",
      icon: <Lock className="w-5 h-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2" /> Personal Information
            </h3>
            <p>When you register, we collect your email address, username, and wallet address to create and manage your account.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <EyeOff className="w-4 h-4 mr-2" /> Mining Data
            </h3>
            <p>We record your mining activity including timestamps, mined amounts, and device information to prevent fraud and ensure fair distribution.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" /> Transaction Data
            </h3>
            <p>All coin transfers between wallets are recorded on the blockchain, including sender, receiver, amount, and timestamp.</p>
          </div>
        </div>
      )
    },
    {
      id: "data-use",
      title: "How We Use Your Information",
      icon: <EyeOff className="w-5 h-5 mr-2" />,
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide and maintain our mining service</li>
          <li>To process transactions and manage rewards</li>
          <li>To detect and prevent fraudulent activities</li>
          <li>To improve user experience and develop new features</li>
          <li>To communicate with you about service updates</li>
          <li>To enforce our Terms of Service</li>
        </ul>
      )
    },
    {
      id: "data-sharing",
      title: "Data Sharing & Disclosure",
      icon: <Shield className="w-5 h-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <p>We do not sell your personal information. We may share data with:</p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Service Providers</h3>
            <p>Trusted third parties who assist in operating our platform (e.g., cloud hosting, analytics, customer support).</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Legal Requirements</h3>
            <p>When required by law or to protect our rights, we may disclose information to authorities.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Business Transfers</h3>
            <p>In case of merger, acquisition, or asset sale, user information may be transferred.</p>
          </div>
        </div>
      )
    },
    {
      id: "security",
      title: "Security Measures",
      icon: <Lock className="w-5 h-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <p>We implement industry-standard security measures including:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Encryption of sensitive data in transit and at rest</li>
            <li>Regular security audits and penetration testing</li>
            <li>Two-factor authentication for sensitive operations</li>
            <li>Limited access to personal information on a need-to-know basis</li>
            <li>Blockchain technology for secure transaction recording</li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Despite our efforts, no security measures are 100% secure. We cannot guarantee absolute security of your information.
          </p>
        </div>
      )
    },
    {
      id: "ads",
      title: "Advertising & Analytics",
      icon: <EyeOff className="w-5 h-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <p>To support our free mining service, we show ads and collect analytics:</p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Ad Networks</h3>
            <p>We partner with third-party ad networks that may collect device identifiers and usage data to serve relevant ads.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Minimum Ad Viewing</h3>
            <p>To receive mining rewards, users must watch ads for at least 20 seconds as part of our fair usage policy.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Opting Out</h3>
            <p>You can limit ad tracking in your device settings, but this may affect your ability to mine coins.</p>
          </div>
        </div>
      )
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <Shield className="w-5 h-5 mr-2" />,
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Access & Correction</h3>
            <p>You can review and update your account information through your profile settings.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Data Deletion</h3>
            <p>You may request deletion of your personal data, subject to legal retention requirements.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Opt-Out</h3>
            <p>You can opt out of marketing communications while maintaining essential service messages.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Complaints</h3>
            <p>You have the right to lodge complaints with data protection authorities.</p>
          </div>
        </div>
      )
    },
    {
      id: "changes",
      title: "Policy Changes",
      icon: <Lock className="w-5 h-5 mr-2" />,
      content: (
        <div className="space-y-2">
          <p>We may update this policy periodically. We will notify users of significant changes through:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>In-app notifications</li>
            <li>Email alerts (for major changes)</li>
            <li>Updated "Last Modified" date on this page</li>
          </ul>
          <p className="mt-4">Your continued use of HeroCoin after changes constitutes acceptance of the updated policy.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 pt-20 md:pt-24 py-10 max-w-7xl mx-auto px-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            HeroCoin Privacy Policy
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between p-6 text-left ${activeSection === section.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <div className="flex items-center">
                  {section.icon}
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                {activeSection === section.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {activeSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  <div className="pt-4 text-gray-700 dark:text-gray-300">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-gray-600 dark:text-gray-400"
        >
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p className="mt-2 font-medium">privacy@herocoin.com</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;