function HomePage() {
  return (
    <section className="px-10 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div>
          <p className="text-pink-500 font-semibold text-lg mb-4">
            Premium Shopping Experience
          </p>

          <h2 className="text-6xl font-bold text-gray-900 leading-tight mb-6">
            Discover Modern Shopping With Style ✨
          </h2>

          <p className="text-gray-600 text-xl mb-8 leading-relaxed">
            Explore premium products, smooth checkout,
            beautiful shopping experience, and a luxurious
            e-commerce platform built like a world-class brand.
          </p>

          <div className="flex gap-5">
            <button className="bg-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg">
              Shop Now
            </button>

            <button className="border-2 border-purple-700 text-purple-700 px-8 py-4 rounded-2xl font-semibold text-lg">
              Explore
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            alt="watch"
            className="rounded-3xl w-full h-[500px] object-cover"
          />

          <div className="mt-6">
            <h3 className="text-2xl font-bold">
              Premium Smart Watch
            </h3>

            <p className="text-gray-500 mt-2">
              Elegant design meets smart technology.
            </p>

            <div className="flex justify-between items-center mt-6">
              <span className="text-3xl font-bold text-purple-700">
                $299
              </span>

              <button className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold">
                Buy Now
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HomePage;