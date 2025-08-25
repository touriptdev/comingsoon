import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, Mail01Icon } from "@hugeicons/core-free-icons";

function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (message) setMessage(""); // Clear any previous messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Use proxy in development, direct path in production
      const apiUrl = "/api/emails";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Check if response has content
      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        // If not JSON, treat as text
        const text = await response.text();
        data = { message: text || "Unknown error occurred" };
      }

      if (response.ok) {
        setEmail(""); // Clear input
        setMessage("Thank you. You have successfully joined the waitlist!");
      } else {
        setMessage(
          data.message || `Error: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setMessage("Sorry for inconvenience. Technical Errors");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    {
      name: "New York",
      country: "USA",
      image:
        "https://images.unsplash.com/photo-1639775722393-6bd891bae010?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Paris",
      country: "France",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Tokyo",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1557409518-691ebcd96038?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Sydney",
      country: "Australia",
      image:
        "https://images.unsplash.com/photo-1734007929985-ced7bdd53843?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "London",
      country: "United Kingdom",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Dubai",
      country: "United Arab Emirates",
      image:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Rome",
      country: "Italy",
      image:
        "https://images.unsplash.com/photo-1575540668264-4485aacd78c3?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Barcelona",
      country: "Spain",
      image:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Singapore",
      country: "Singapore",
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2104&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Bangkok",
      country: "Thailand",
      image:
        "https://images.unsplash.com/photo-1668107710159-10fbbab2a9dd?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Cape Town",
      country: "South Africa",
      image:
        "https://images.unsplash.com/photo-1591742708307-ce49d19450d4?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
    {
      name: "Istanbul",
      country: "Turkey",
      image:
        "https://images.unsplash.com/photo-1466442929976-97f336a657be?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0",
    },
  ];

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: [0, "-50%"], // full width shift
      transition: {
        duration: 25, // adjust speed
        ease: "linear", // smooth constant speed
        repeat: Infinity,
      },
    });
  }, [controls]);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-16 bg-gray-200 w-full">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* Logo + text */}
      <div className="flex flex-col items-center gap-16 justify-center w-sm px-8 sm:w-2xl sm:px-0">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center">
            <img
              src={"/logo.svg"}
              alt="touript logo"
              className="w-18 h-18 object-contain rounded-full"
            />
            <span className="text-2xl font-medium text-gray-900">touript</span>
          </div>
          <p className="w-full text-base/8 leading-relaxed font-normal text-gray-900 opacity-50 text-center">
            Touript is a travel community that connects explorers and offers
            smart flight booking, combining shared insights with great deals for
            memorable trips.
          </p>
        </div>

        {/* Cities with mask */}
        <div className="relative w-full overflow-x-auto">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-200 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-200 to-transparent z-10" />

          <motion.div
            className="flex gap-8 w-max no-scrollbar"
            animate={controls}
          >
            {[...cities, ...cities].map((city, id) => (
              <div
                key={id}
                className="flex flex-col items-center justify-center gap-2 shrink-0 p-4 bg-white rounded-lg no-scrollbar"
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-36 h-36 shadow-2xl shadow-gray-900/30 rounded-2xl object-cover"
                />
                <span className="text-gray-900 opacity-50 font-medium whitespace-nowrap">
                  {city.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full items-center justify-center gap-4 sm:flex-row"
        >
          <div className="relative w-full flex-2">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>

            {/* Leading icon */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-900">
              <HugeiconsIcon icon={Mail01Icon} size={24} strokeWidth={2} />
            </div>

            {/* Input field */}
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleEmail}
              autoComplete="email"
              required
              disabled={loading}
              className="h-14 w-full border rounded-lg border-gray-300 px-14 transition-all duration-300 focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Trailing icon (Clear button) */}
            {email && !loading && (
              <div
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 transition-all delay-100 duration-300 hover:text-emerald-500"
                onClick={() => setEmail("")}
              >
                <HugeiconsIcon
                  icon={CancelCircleIcon}
                  size={24}
                  strokeWidth={2}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full h-14 sm:flex-1 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-500 hover:shadow-lg hover:shadow-gray-900/10 transition-all ease-in-out duration-300 cursor-pointer  disabled:cursor-not-allowed"
          >
            {loading ? "Joining..." : "Join Waitlist"}
          </button>
        </form>

        {/* Message display */}
        {message && (
          <div
            className={`text-center p-3 rounded-lg font-medium ${
              message.includes("Thank")
                ? "bg-emerald-50 text-emerald-700 "
                : "bg-red-50 text-red-500 "
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-4">
          <span className="text-xl font-medium text-gray-900">
            Launching soon
          </span>

          <p className="w-full text-base/8 leading-relaxed font-normal text-gray-900 text-center">
            <span className="opacity-50">
              We are wrapping things up and preparing to launch very soon. We
              would love for you to be part of our journey.
            </span>{" "}
            <span className="opacity-100 underline">Join our waitlist</span>{" "}
            <span className="opacity-50">
              to be among the first to know when we go live.
            </span>
            <span className="w-full text-base/8 leading-relaxed font-normal text-gray-900 opacity-50 text-center">
              If you have any questions, please feel free to send us an email.
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-4 text-sm sm:text-base">
          <div className="flex items-center justify-center gap-8">
            <a
              href="#"
              onClick={() =>
                (window.location.href =
                  "mailto:" + "hello" + "@" + "touript.com")
              }
              className="underline opacity-50 hover:opacity-100"
            >
              Send us Email
            </a>
            <a
              href="https://policies.google.com/terms?hl=en"
              className="opacity-50 hover:opacity-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>
            <a
              href="https://policies.google.com/privacy?hl=en"
              className="opacity-50 hover:opacity-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </div>
          <div className="h-px w-full bg-gray-300"></div>
          <span className="text-gray-900 opacity-50 text-sm">
            © Copyright 2025. All rights reserved.
          </span>
        </div>
      </div>
    </section>
  );
}

export default App;
