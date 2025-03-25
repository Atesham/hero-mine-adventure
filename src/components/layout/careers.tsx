import Navbar from "./Navbar";

const Careers = () => {
  return (
    
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
    <Navbar/>

    <div className="flex-1 pt-20 md:pt-24 py-10 max-w-7xl mx-auto px-4">
    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Careers at Hero Coin
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Join our team and help us revolutionize the cryptocurrency industry.
        </p>
      </div>
    </div>
  );
};

export default Careers;
