import Navbar from "./Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
<Navbar></Navbar>
<div className="flex-1 pt-20 md:pt-24 py-10 max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        {/* Add detailed privacy policy text here */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;