import PageMeta from '../../components/common/PageMeta';
import Navbar from '../../components/header/Navbar';

export default function ContactUs() {
  return (
    <>
      <PageMeta
        title="SoilSnap"
        description="SoilSnap is a platform for soil data management and analysis."
      />
      <Navbar />
      <section className="contact-us py-16 px-6 font-[Inter] bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-[Merriweather] font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 mb-8 dark:text-gray-300">
            Have questions about soils, crops, or our project? We’d love to hear from you. 
            Fill out the form below and we’ll get back to you shortly.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto shadow-lg rounded-2xl p-8 bg-white dark:bg-gray-800 dark:border dark:border-gray-700">
          <h2 className="text-2xl font-[Merriweather] font-semibold mb-6 text-gray-800 dark:text-white text-center">
            Send Us a Message
          </h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-500 dark:text-gray-300 font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-500 dark:text-gray-300 font-medium mb-2 ">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-500 dark:text-gray-300 font-medium mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows="5"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}