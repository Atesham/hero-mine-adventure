import BackButton from "@/components/BackButton";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <BackButton /> {/* Back button at top-left */}

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Terms and Conditions
        </h1>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">1. Introduction</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Welcome to Hero Coin! These terms and conditions outline the rules and regulations for the use of our platform. By accessing this platform, we assume you accept these terms and conditions in full. Do not continue to use Hero Coin if you do not accept all of the terms and conditions stated on this page.
          </p>
        </section>

        {/* User Responsibilities */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">2. User Responsibilities</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            As a user of Hero Coin, you agree to:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300">
            <li>Provide accurate and complete information during registration.</li>
            <li>Maintain the security of your account and password.</li>
            <li>Use the platform only for lawful purposes.</li>
          </ul>
        </section>

        {/* Prohibited Activities */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">3. Prohibited Activities</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            You are prohibited from:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300">
            <li>Engaging in any illegal or fraudulent activities.</li>
            <li>Attempting to disrupt or interfere with the platform's functionality.</li>
            <li>Using the platform to harass or harm others.</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">4. Intellectual Property</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Unless otherwise stated, Hero Coin and/or its licensors own the intellectual property rights for all material on the platform. All intellectual property rights are reserved.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5. Limitation of Liability</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            In no event shall Hero Coin, nor any of its officers, directors, and employees, be liable for anything arising out of or in any way connected with your use of this platform.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">6. Governing Law</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            These terms and conditions are governed by and construed in accordance with the laws of [Your Country/Region], and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">7. Contact Us</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            If you have any questions about these terms and conditions, please contact us at <a href="mailto:support@herocoin.com" className="text-primary hover:underline">support@herocoin.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;