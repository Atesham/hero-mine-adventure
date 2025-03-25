import Navbar from "./Navbar";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
<Navbar></Navbar>
<div className="flex-1 pt-20 md:pt-24 py-10 max-w-7xl mx-auto px-4">

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Cookies Policy
        </h1>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Introduction</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            This Cookies Policy explains how Hero Coin uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are, why we use them, and your rights to control our use of them.
          </p>
        </section>

        {/* What Are Cookies? */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. What Are Cookies?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.
          </p>
        </section>

        {/* How We Use Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. How We Use Cookies</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            We use cookies for several purposes, including:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300">
            <li>To enable certain functions of the platform.</li>
            <li>To provide analytics and improve user experience.</li>
            <li>To store your preferences and personalize content.</li>
          </ul>
        </section>

        {/* Types of Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Types of Cookies</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            The following types of cookies may be used on our platform:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300">
            <li><strong>Essential Cookies:</strong> Required for the platform to function properly.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform.</li>
            <li><strong>Preference Cookies:</strong> Remember your preferences and settings.</li>
            <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads to you.</li>
          </ul>
        </section>

        {/* Managing Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Managing Cookies</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer, and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit the platform, and some features may not work as intended.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Contact Us</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            If you have any questions about our use of cookies, please contact us at <a href="mailto:support@herocoin.com" className="text-primary hover:underline">support@herocoin.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;