import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, FileText, Linkedin, Github, Globe, Loader2, CheckCircle, Send } from "lucide-react";
import Navbar from "./Navbar";

const Careers = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    experience: "",
    skills: "",
    message: ""
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resume: ""
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      experience: "",
      resume: ""
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      valid = false;
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience level is required";
      valid = false;
    }

    if (!resume) {
      newErrors.resume = "Resume is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or Word document (PDF, DOC, or DOCX)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setResume(file);
      setErrors(prev => ({ ...prev, resume: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      console.log("Application submitted:", {
        ...formData,
        resume: resume?.name,
        timestamp: new Date().toISOString()
      });

      // Create FormData for file upload
      const formPayload = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      // Append the resume file
      if (resume) {
        formPayload.append("attachment", resume); // Using 'attachment' for FormSubmit
      }

      // FormSubmit specific parameters
      formPayload.append("_subject", `New Job Application: ${formData.name} for Blockchain Developer`);
      formPayload.append("_replyto", formData.email);
      formPayload.append("_template", "box");
      formPayload.append("_captcha", "false");

      // Send email using FormSubmit
      const response = await fetch("https://formsubmit.co/ajax/ateshamali0@gmail.com", {
        method: "POST",
        body: formPayload
      });

      const data = await response.json();
      console.log("Application submission response:", data);

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          linkedin: "",
          github: "",
          portfolio: "",
          experience: "",
          skills: "",
          message: ""
        });
        setResume(null);
      } else {
        throw new Error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Careers at Hero Coin
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Join our team and help us revolutionize the cryptocurrency industry.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Blockchain Developer
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Job Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We're looking for an experienced Blockchain Developer to join our team and help build the future of Hero Coin. You'll be responsible for developing and maintaining our blockchain infrastructure, smart contracts, and decentralized applications.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Develop and maintain blockchain protocols and architecture</li>
                  <li>Design, implement, and audit smart contracts</li>
                  <li>Optimize blockchain infrastructure for performance and security</li>
                  <li>Collaborate with team on new features and improvements</li>
                  <li>Ensure security and efficiency of blockchain operations</li>
                  <li>Research and implement new blockchain technologies</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                  <li>3+ years experience with blockchain development</li>
                  <li>Proficiency in Solidity and smart contract development</li>
                  <li>Experience with Ethereum, Binance Smart Chain, or similar blockchains</li>
                  <li>Strong understanding of cryptographic principles</li>
                  <li>Knowledge of decentralized finance (DeFi) concepts</li>
                  <li>Experience with Web3.js, Ethers.js, or similar libraries</li>
                  <li>Familiarity with Truffle, Hardhat, or other development frameworks</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Benefits</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Competitive salary + Hero Coin bonuses</li>
                  <li>Flexible remote work options</li>
                  <li>Opportunity to work on cutting-edge blockchain technology</li>
                  <li>Professional development budget</li>
                  <li>Health and wellness benefits</li>
                  <li>Token allocation in Hero Coin</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Thank you for applying to Hero Coin. We've received your application and will review it carefully. 
                  Our team will get back to you within 5-7 business days.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  Apply for Another Position
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Apply Now
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                      placeholder="+1 (123) 456-7890"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 border-gray-300"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 border-gray-300"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 border-gray-300"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Years of Blockchain Experience *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ${errors.experience ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Select your experience level</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                    {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Relevant Skills (Blockchain Technologies, Languages, etc.)
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 border-gray-300"
                      placeholder="Solidity, Ethereum, Smart Contracts, Rust, Go, JavaScript, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Upload Resume/CV * (PDF or Word, max 5MB)
                    </label>
                    <input
                      type="file"
                      placeholder="Upload your resume"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 ${errors.resume ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
                    {resume && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Selected file: {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Cover Letter or Additional Information
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 border-gray-300"
                      placeholder="Tell us why you'd be a great fit for this position, your blockchain experience, and any relevant projects..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className={`w-full mt-6 flex items-center justify-center py-3 px-6 rounded-full font-medium transition-colors ${
                      isSubmitting
                        ? "bg-primary/80 text-white"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Careers;