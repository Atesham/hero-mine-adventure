import BackButton from "../BackButton";

const Contact = () => {
  return (
<div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
<BackButton /> {/* Back button at top-left */}

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Contact Us
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Have questions or need support? Reach out to us!
        </p>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder='Your Name' />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full p-2 border rounded-lg" placeholder='Your email please...'/>
              
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea className="w-full p-2 border rounded-lg" placeholder='How may we assist you?' rows={4} />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;