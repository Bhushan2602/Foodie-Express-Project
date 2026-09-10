import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Hyderabad",
    avatar: "👩‍💼",
    rating: 5,
    text: "Foodie Express has the best biryani delivery in Hyderabad! The Paradise Biryani arrives hot and fresh every time. Absolutely love the quick delivery.",
    restaurant: "Paradise Biryani"
  },
  {
    name: "Rahul Mehta",
    city: "Mumbai",
    avatar: "👨‍💻",
    rating: 5,
    text: "The UI is so smooth and the live tracking is amazing. I can see exactly when my food will arrive. Best food app in Mumbai!",
    restaurant: "Trishna"
  },
  {
    name: "Ananya Patel",
    city: "Bangalore",
    avatar: "👩‍🎓",
    rating: 5,
    text: "From Vidyarthi Bhavan's dosa to Toit's pizza, I can order everything from one app. The variety is incredible and prices are very reasonable.",
    restaurant: "Vidyarthi Bhavan"
  },
  {
    name: "Vikram Singh",
    city: "Delhi",
    avatar: "🧑‍💼",
    rating: 5,
    text: "The admin dashboard is next level! As a restaurant owner, I can manage all my orders from one place. Game changer for my business.",
    restaurant: "Karim's"
  },
  {
    name: "Meera Reddy",
    city: "Chennai",
    avatar: "👩‍🔬",
    rating: 5,
    text: "Finally an app that delivers authentic Dindigul biryani! The payment process is seamless and customer support is very responsive.",
    restaurant: "Dindigul Thalappakatti"
  },
  {
    name: "Arjun Kumar",
    city: "Pune",
    avatar: "👨‍🏫",
    rating: 5,
    text: "From Vohuman's bun maska to Malaka Spice's Thai curry, Foodie Express covers all of Pune. Love the restaurant variety!",
    restaurant: "Vohuman Cafe"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider mb-4">
            ❤️ Loved by foodies
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            What our customers say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative"
            >
              <Quote size={24} className="text-orange-200 absolute top-4 right-4" />
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{testimonial.avatar}</span>
                <div>
                  <h4 className="font-black text-gray-800 text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.city}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} size={14} fill="#f97316" className="text-orange-500" />
                ))}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                "{testimonial.text}"
              </p>

              <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">
                Ordered from: {testimonial.restaurant}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
