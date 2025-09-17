export function ContactHero() {
  return (
    <section
      className="relative h-96 flex items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/istockphoto-1256339158-612x612.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">CONTACT US</h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          We are a second-generation family business established in 1972
        </p>
      </div>
    </section>
  )
}
