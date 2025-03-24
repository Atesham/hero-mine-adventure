import BackButton from "../BackButton";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <BackButton /> {/* Back button at top-left */}

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          About Hero Coin
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Hero Coin is a revolutionary cryptocurrency that empowers users to mine coins with just a few taps. Our mission is to make cryptocurrency mining accessible to everyone, without the need for expensive hardware or complicated setups.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Join us in building a decentralized future where everyone can participate in the digital economy.
        </p>
      </div>
    </div>
  );
};

export default About;