package com.foodieexpress.restaurant_service.config;

import com.foodieexpress.restaurant_service.entity.MenuItem;
import com.foodieexpress.restaurant_service.entity.Restaurant;
import com.foodieexpress.restaurant_service.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;

    @Override
    public void run(String... args) {
        if (restaurantRepository.count() > 0) {
            return;
        }

        List<Restaurant> restaurants = List.of(
            // ==================== HYDERABAD (5) ====================
            new Restaurant(null, "Paradise Biryani", "Opposite Paradise Hotel, RTC Cross Roads",
                "Hyderabadi", "Hyderabad",
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chicken Biryani", "Hyderabadi dum biryani with tender chicken", 320, false),
                    new MenuItem(null, "Mutton Biryani", "Slow-cooked mutton biryani with aromatic spices", 420, false),
                    new MenuItem(null, "Veg Biryani", "Fragrant rice with mixed vegetables", 250, true),
                    new MenuItem(null, "Double Ka Meetha", "Classic Hyderabadi bread pudding dessert", 120, true),
                    new MenuItem(null, "Mirchi Ka Salan", "Spicy chili curry side dish", 90, true)
                )),
            new Restaurant(null, "Bawarchi", "Near RTC Bus Stand, Koti",
                "Biryani", "Hyderabad",
                "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=500",
                List.of(
                    new MenuItem(null, "Special Chicken Biryani", "Bawarchi's signature biryani", 350, false),
                    new MenuItem(null, "Prawn Biryani", "Fresh prawns cooked to perfection", 450, false),
                    new MenuItem(null, "Mutton Haleem", "Rich slow-cooked haleem with wheat and lentils", 380, false),
                    new MenuItem(null, "Chicken 65", "Spicy deep-fried chicken appetizer", 280, false)
                )),
            new Restaurant(null, "Pista House", "Himayat Nagar, Near Liberty",
                "Biryani", "Hyderabad",
                "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chicken Dum Biryani", "Authentic dum style biryani", 300, false),
                    new MenuItem(null, "Zafrani Pulao", "Saffron rice with dry fruits", 280, true),
                    new MenuItem(null, "Pathar Ka Gosht", "Mutton cooked on a hot stone", 420, false),
                    new MenuItem(null, "Irani Chai", "Traditional Irani-style tea", 50, true)
                )),
            new Restaurant(null, "Shah Ghouse Cafe", "Tolichowki, Salarjung Colony",
                "Mughlai", "Hyderabad",
                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500",
                List.of(
                    new MenuItem(null, "Tandoori Chicken", "Whole chicken marinated and grilled", 380, false),
                    new MenuItem(null, "Butter Naan", "Soft buttery leavened bread", 60, true),
                    new MenuItem(null, "Mutton Korma", "Rich creamy mutton curry", 350, false),
                    new MenuItem(null, "Phirni", "Creamy rice pudding dessert", 100, true)
                )),
            new Restaurant(null, "Chutneys", "Ameerpet, Near Metro Station",
                "South Indian", "Hyderabad",
                "https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=500",
                List.of(
                    new MenuItem(null, "Masala Dosa", "Crispy dosa with spiced potato filling", 150, true),
                    new MenuItem(null, "Idli Sambar", "Steamed rice cakes with lentil soup", 100, true),
                    new MenuItem(null, "Rava Dosa", "Semolina crispy crepe", 160, true),
                    new MenuItem(null, "Medu Vada", "Crispy lentil donut", 80, true),
                    new MenuItem(null, " filter Coffee", "Strong South Indian filter coffee", 40, true)
                )),

            // ==================== MUMBAI (5) ====================
            new Restaurant(null, "Leopold Cafe", "Colaba Causeway, Near Gateway of India",
                "Continental", "Mumbai",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chicken Schnitzel", "Breaded chicken cutlet with fries", 450, false),
                    new MenuItem(null, "Fish and Chips", "Beer-battered fish with tartar sauce", 480, false),
                    new MenuItem(null, "Penne Arrabiata", "Spicy tomato pasta", 320, true),
                    new MenuItem(null, "Tiramisu", "Classic Italian coffee dessert", 250, true)
                )),
            new Restaurant(null, "Trishna", "Fort, K. Dubash Marg",
                "Seafood", "Mumbai",
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=500",
                List.of(
                    new MenuItem(null, "Butter Garlic Crab", "Famous Mumbai style garlic butter crab", 650, false),
                    new MenuItem(null, "Tandoori Prawns", "Jumbo prawns grilled in tandoor", 550, false),
                    new MenuItem(null, "Fish Tikka", "Marinated fish cubes grilled", 400, false),
                    new MenuItem(null, "Sol Kadhi", "Coconut and kokum digestive drink", 80, true)
                )),
            new Restaurant(null, "Mumbai Matka", "Linking Road, Santacruz",
                "Street Food", "Mumbai",
                "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=500",
                List.of(
                    new MenuItem(null, "Matka Biryani", "Biryani served in clay pot", 280, false),
                    new MenuItem(null, "Pav Bhaji", "Classic Mumbai street food", 160, true),
                    new MenuItem(null, "Vada Pav", "Mumbai style spiced potato fritter in bun", 40, true),
                    new MenuItem(null, "Kulfi", "Indian ice cream with cardamom and pistachio", 80, true),
                    new MenuItem(null, "Bhel Puri", "Crunchy rice puffed snack", 70, true)
                )),
            new Restaurant(null, "Cannon Pav Bhaji", "Talaao Pali, near Gateway of India",
                "Street Food", "Mumbai",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500",
                List.of(
                    new MenuItem(null, "Butter Pav Bhaji", "Loaded butter pav bhaji", 180, true),
                    new MenuItem(null, "Cheese Pav Bhaji", "Pav bhaji topped with cheese", 220, true),
                    new MenuItem(null, "Misal Pav", "Spicy sprout curry with bread", 140, true),
                    new MenuItem(null, "Masala Chai", "Spiced Mumbai-style tea", 30, true)
                )),
            new Restaurant(null, "Sardar Pav Bhaji", "Tardeo, Tardeo Road",
                "Street Food", "Mumbai",
                "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500",
                List.of(
                    new MenuItem(null, "Sardar Special Pav Bhaji", "Extra butter, extra spicy", 200, true),
                    new MenuItem(null, "Paneer Pav Bhaji", "Rich paneer bhaji with butter pav", 230, true),
                    new MenuItem(null, "Jumbo Vada Pav", "Double fried potato vada", 50, true)
                )),

            // ==================== DELHI (5) ====================
            new Restaurant(null, "Karim's", "16, Gali Kababian, Jama Masjid",
                "Mughlai", "Delhi",
                "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500",
                List.of(
                    new MenuItem(null, "Mutton Korma", "Rich Mughlai mutton curry", 400, false),
                    new MenuItem(null, "Butter Chicken", "Creamy rich gravy with tandoori chicken", 380, false),
                    new MenuItem(null, "Seekh Kebab", "Minced mutton skewers grilled in tandoor", 320, false),
                    new MenuItem(null, "Biryani", "Fragrant Mughlai-style rice dish", 350, false)
                )),
            new Restaurant(null, "Bukhara", "ITC Maurya, Diplomatic Enclave",
                "North Indian", "Delhi",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=500",
                List.of(
                    new MenuItem(null, "Dal Bukhara", "Signature slow-cooked black lentil", 450, true),
                    new MenuItem(null, "Tandoori Lamb Chops", "Grilled lamb chops", 850, false),
                    new MenuItem(null, "Naan", "Fresh tandoor-baked bread", 80, true),
                    new MenuItem(null, "Sikandari Raan", "Marinated whole leg of lamb", 1200, false)
                )),
            new Restaurant(null, "Saravana Bhavan", "Connaught Place, Block A",
                "South Indian", "Delhi",
                "https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=500",
                List.of(
                    new MenuItem(null, "Paper Roast Dosa", "Extra crispy paper-thin dosa", 180, true),
                    new MenuItem(null, "Mini Tiffin", "Combo of idli, vada, pongal", 200, true),
                    new MenuItem(null, "Meals", "Full South Indian thali", 250, true),
                    new MenuItem(null, "Badam Milk", "Almond flavored milk", 60, true)
                )),
            new Restaurant(null, "Wenger's", "Connaught Place, A-16",
                "Bakery", "Delhi",
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chocolate Truffle Cake", "Rich chocolate layered cake", 350, true),
                    new MenuItem(null, "Chicken Patty", "Flaky pastry with chicken filling", 80, false),
                    new MenuItem(null, "Croissant", "Buttery French croissant", 90, true),
                    new MenuItem(null, "Apple Pie", "Classic apple cinnamon pie", 200, true)
                )),
            new Restaurant(null, "Rajdhani", "B-3/63, Ajmeri Gate",
                "Gujarati", "Delhi",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
                List.of(
                    new MenuItem(null, "Unlimited Thali", "Complete Gujarati-Rajasthani thali", 450, true),
                    new MenuItem(null, "Dal Baati Churma", "Rajasthani special", 280, true),
                    new MenuItem(null, "Kadhi Khichdi", "Comfort food combo", 200, true)
                )),

            // ==================== BANGALORE (5) ====================
            new Restaurant(null, "Vidyarthi Bhavan", "38, Sankarapura Road, Basavanagudi",
                "South Indian", "Bangalore",
                "https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=500",
                List.of(
                    new MenuItem(null, "Masala Dosa", "Iconic crispy masala dosa", 120, true),
                    new MenuItem(null, "Rava Vada", "Semolina crispy vada", 80, true),
                    new MenuItem(null, "Filter Coffee", "Authentic Karnataka filter coffee", 40, true),
                    new MenuItem(null, "Chiroti", "Flaky layered pastry with sugar", 70, true)
                )),
            new Restaurant(null, "Toit Brewpub", "298, 100 Feet Road, Indiranagar",
                "Continental", "Bangalore",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500",
                List.of(
                    new MenuItem(null, "Toit Veg Pizza", "Wood-fired artisan pizza", 380, true),
                    new MenuItem(null, "BBQ Chicken Wings", "Smoky BBQ glazed wings", 420, false),
                    new MenuItem(null, "Fish Tacos", "Baja-style fish tacos", 450, false),
                    new MenuItem(null, "Craft Beer Sampler", "Try 4 signature brews", 500, true)
                )),
            new Restaurant(null, "MTR 1924", "14, Lalbagh Road",
                "South Indian", "Bangalore",
                "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=500",
                List.of(
                    new MenuItem(null, "Bisi Bele Bath", "Karnataka's signature rice dish", 150, true),
                    new MenuItem(null, "Ragi Mudde", "Finger millet balls with sambar", 120, true),
                    new MenuItem(null, "Pongal", "Comfort rice and lentil dish", 100, true),
                    new MenuItem(null, "Kesari Bath", "Semolina halwa sweet", 60, true)
                )),
            new Restaurant(null, "Empire Restaurant", "54, Church Street",
                "North Indian", "Bangalore",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chicken Shawarma", "Middle Eastern wrap", 180, false),
                    new MenuItem(null, "Tandoori Chicken", "Half chicken grilled", 280, false),
                    new MenuItem(null, "Butter Naan", "Soft butter naan bread", 50, true),
                    new MenuItem(null, "Phirni", "Creamy dessert", 80, true)
                )),
            new Restaurant(null, "Kramer Twist", "Koramangala 4th Block",
                "Chinese", "Bangalore",
                "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=500",
                List.of(
                    new MenuItem(null, "Schezwan Fried Rice", "Spicy Indo-Chinese rice", 220, true),
                    new MenuItem(null, "Chilli Paneer", "Cottage cheese in spicy sauce", 250, true),
                    new MenuItem(null, "Momos", "Steamed dumplings with chutney", 150, true),
                    new MenuItem(null, "Manchurian Gravy", "Veg balls in dark soy gravy", 200, true)
                )),

            // ==================== PUNE (4) ====================
            new Restaurant(null, "Vohuman Cafe", "6, Koregaon Road, Near Symbiosis",
                "Cafe", "Pune",
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500",
                List.of(
                    new MenuItem(null, "Bun Maska", "Toasted bun with butter", 60, true),
                    new MenuItem(null, "Keema Pav", "Spiced minced meat with bread", 180, false),
                    new MenuItem(null, "Irani Chai", "Classic Irani-style tea", 40, true),
                    new MenuItem(null, "Bread Omelette", "Fluffy egg omelette with bread", 80, false)
                )),
            new Restaurant(null, "Bedekar Misal", "Narayan Peth, Near Tilak Road",
                "Street Food", "Pune",
                "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500",
                List.of(
                    new MenuItem(null, "Misal Pav", "Pune's famous spicy sprout curry", 120, true),
                    new MenuItem(null, "Tarri Poha", "Flattened rice with spicy gravy", 80, true),
                    new MenuItem(null, "Sabudana Khichdi", "Tapioca pearl stir fry", 100, true),
                    new MenuItem(null, "Sol Kadhi", "Refreshing kokum drink", 40, true)
                )),
            new Restaurant(null, "Shabree", "1107, Apte Road, Deccan",
                "North Indian", "Pune",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
                List.of(
                    new MenuItem(null, "Pune Special Thali", "Maharashtrian unlimited thali", 350, true),
                    new MenuItem(null, "Paneer Tikka", "Grilled cottage cheese", 280, true),
                    new MenuItem(null, "Dal Tadka", "Tempered yellow lentils", 180, true),
                    new MenuItem(null, "Gulab Jamun", "Deep-fried milk dumplings in syrup", 100, true)
                )),
            new Restaurant(null, "Malaka Spice", "11, Kunjir Corner, Koregaon Park",
                "Thai", "Pune",
                "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=500",
                List.of(
                    new MenuItem(null, "Thai Green Curry", "Coconut-based curry with vegetables", 350, true),
                    new MenuItem(null, "Pad Thai", "Stir-fried rice noodles", 320, true),
                    new MenuItem(null, "Chicken Satay", "Grilled chicken skewers", 380, false),
                    new MenuItem(null, "Mango Sticky Rice", "Sweet Thai dessert", 200, true)
                )),

            // ==================== KOLKATA (4) ====================
            new Restaurant(null, "Peter Cat", "18A, Sudder Street",
                "Continental", "Kolkata",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chelo Kebab", "Rice with butter and seekh kebab", 350, false),
                    new MenuItem(null, "Fish Finger", "Crispy battered fish fingers", 320, false),
                    new MenuItem(null, "Chicken A La Kiev", "Stuffed chicken breast", 420, false),
                    new MenuItem(null, "Caramel Custard", "Classic egg custard dessert", 150, true)
                )),
            new Restaurant(null, "6 Ballygunge Place", "6, Ballygunge Place",
                "Bengali", "Kolkata",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chingri Malai Curry", "Prawn coconut curry", 450, false),
                    new MenuItem(null, "Kosha Mangsho", "Slow-cooked mutton curry", 380, false),
                    new MenuItem(null, "Luchi-Alur Dom", "Fried bread with potato curry", 180, true),
                    new MenuItem(null, "Mishti Doi", "Bengali sweet yogurt", 80, true)
                )),
            new Restaurant(null, "Nizam's Kathi Rolls", "4, Park Street Area",
                "Street Food", "Kolkata",
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chicken Kathi Roll", "Paratha wrapped chicken roll", 150, false),
                    new MenuItem(null, "Mutton Kathi Roll", "Paratha wrapped mutton roll", 200, false),
                    new MenuItem(null, "Paneer Kathi Roll", "Cottage cheese roll", 120, true),
                    new MenuItem(null, "Egg Roll", "Egg-wrapped paratha roll", 80, false)
                )),
            new Restaurant(null, "Flurys", "14, Park Street",
                "Bakery", "Kolkata",
                "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500",
                List.of(
                    new MenuItem(null, "Pineapple Cake", "Signature Flurys cake", 400, true),
                    new MenuItem(null, "Chicken Patty Puff", "Flaky puff pastry", 90, false),
                    new MenuItem(null, "Plum Cake", "Rich Christmas plum cake", 350, true),
                    new MenuItem(null, "English Breakfast Tea", "Premium blended tea", 120, true)
                )),

            // ==================== CHENNAI (4) ====================
            new Restaurant(null, "Saravana Bhavan Express", "T. Nagar, Near Pondy Bazaar",
                "South Indian", "Chennai",
                "https://images.unsplash.com/photo-1630383249896-424e482df921?q=80&w=500",
                List.of(
                    new MenuItem(null, "Ghee Roast Dosa", "Crispy dosa with ghee", 170, true),
                    new MenuItem(null, "Meals", "Full South Indian banana leaf meal", 220, true),
                    new MenuItem(null, "Vada", "Crispy lentil donut", 60, true),
                    new MenuItem(null, "Rasam", "Tangy pepper soup", 50, true)
                )),
            new Restaurant(null, "Dindigul Thalappakatti", "Express Avenue Mall, Royapettah",
                "Biryani", "Chennai",
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500",
                List.of(
                    new MenuItem(null, "Mutton Biryani", "Dindigul-style mutton biryani", 300, false),
                    new MenuItem(null, "Chicken Biryani", "Seeraga samba rice biryani", 260, false),
                    new MenuItem(null, "Parotta", "Flaky layered bread", 40, true),
                    new MenuItem(null, "Chicken 65", "Spicy deep-fried chicken", 220, false)
                )),
            new Restaurant(null, "Murugan Idli Shop", "No.1, Usman Road, T. Nagar",
                "South Indian", "Chennai",
                "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=500",
                List.of(
                    new MenuItem(null, "Soft Idli", "Steamed fluffy rice cakes", 80, true),
                    new MenuItem(null, "Kanchipuram Idli", "Spiced temple-style idli", 100, true),
                    new MenuItem(null, "Pongal", "Ven pongal with sambar", 90, true),
                    new MenuItem(null, "Filter Coffee", "Strong Madras coffee", 35, true)
                )),
            new Restaurant(null, "Anjappar", "Egmore, Near Egmore Railway Station",
                "Chettinad", "Chennai",
                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chettinad Chicken", "Spicy Chettinad chicken curry", 320, false),
                    new MenuItem(null, "Mutton Chukka", "Dry-fried mutton pieces", 380, false),
                    new MenuItem(null, "Parotta Salna", "Flaky bread with curry", 100, true),
                    new MenuItem(null, "Fish Curry", "Tangy tamarind fish curry", 350, false)
                )),

            // ==================== JAIPUR (3) ====================
            new Restaurant(null, "LMB (Laxmi Mishthan Bhandar)", "Johari Bazaar, Near Hawa Mahal",
                "Rajasthani", "Jaipur",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
                List.of(
                    new MenuItem(null, "Rajasthani Thali", "Grand royal thali", 450, true),
                    new MenuItem(null, "Dal Baati Churma", "Three-piece Rajasthani special", 250, true),
                    new MenuItem(null, "Pyaaz Kachori", "Stuffed onion pastry", 80, true),
                    new MenuItem(null, "Ghevar", "Traditional Rajasthani sweet", 120, true)
                )),
            new Restaurant(null, "Tapri Central", "C-Scheme, Near Central Park",
                "Cafe", "Jaipur",
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500",
                List.of(
                    new MenuItem(null, "Masala Chai", "Special masala tea", 50, true),
                    new MenuItem(null, "Vada Pav", "Mumbai-style vada pav", 40, true),
                    new MenuItem(null, "Samosa", "Crispy fried pastry", 30, true),
                    new MenuItem(null, "Chocolate Shake", "Thick chocolate milkshake", 120, true)
                )),
            new Restaurant(null, "Chokhi Dhani", "Tonk Road, Near Patrakar Colony",
                "Rajasthani", "Jaipur",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500",
                List.of(
                    new MenuItem(null, "Grand Village Thali", "Authentic village-style thali", 600, true),
                    new MenuItem(null, "Ker Sangri", "Desert bean and berry curry", 220, true),
                    new MenuItem(null, "Bajra Roti", "Millet flatbread", 40, true),
                    new MenuItem(null, "Mawa Kachori", "Sweet stuffed pastry", 80, true)
                )),

            // ==================== AHMEDABAD (3) ====================
            new Restaurant(null, "Agashiye", "The House of MG, Bhadra",
                "Gujarati", "Ahmedabad",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
                List.of(
                    new MenuItem(null, "Unlimited Gujarati Thali", "Traditional thali with 25+ items", 550, true),
                    new MenuItem(null, "Dhokla", "Steamed fermented rice cake", 80, true),
                    new MenuItem(null, "Undhiyu", "Mixed vegetable winter dish", 200, true),
                    new MenuItem(null, "Shrikhand", "Sweetened yogurt dessert", 100, true)
                )),
            new Restaurant(null, "Honest", "Near Lal Darwaja, Old City",
                "Street Food", "Ahmedabad",
                "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500",
                List.of(
                    new MenuItem(null, "Masala Dosa", "Crispy dosa with masala", 120, true),
                    new MenuItem(null, "Gujarati Khichdi", "Comfort rice and lentil dish", 100, true),
                    new MenuItem(null, "Fafda-Jalebi", "Crispy gram flour snack with sweet", 70, true),
                    new MenuItem(null, "Cold Coffee", "Creamy chilled coffee", 80, true)
                )),
            new Restaurant(null, "Patang Hotel", "Near Nehru Bridge, Income Tax",
                "Gujarati", "Ahmedabad",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=500",
                List.of(
                    new MenuItem(null, "Unlimited Thali", "Rooftop rotating thali", 400, true),
                    new MenuItem(null, "Sev Tameta", "Tomato curry with crispy sev", 150, true),
                    new MenuItem(null, "Thepla", "Spiced fenugreek flatbread", 60, true)
                )),

            // ==================== LUCKNOW (3) ====================
            new Restaurant(null, "Tunday Kababi", "Chowk, Near Akbari Gate",
                "Mughlai", "Lucknow",
                "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=500",
                List.of(
                    new MenuItem(null, "Tunday Kebab", "Famous one-handed minced kebab", 200, false),
                    new MenuItem(null, "Biryani", "Awadhi-style dum biryani", 280, false),
                    new MenuItem(null, "Rumali Roti", "Paper-thin handkerchief bread", 40, true),
                    new MenuItem(null, "Sheermal", "Saffron-flavored flatbread", 50, true)
                )),
            new Restaurant(null, "Dastarkhwan-e-Awadh", "Hazratganj, Near Mahatma Gandhi Marg",
                "Awadhi", "Lucknow",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500",
                List.of(
                    new MenuItem(null, "Galouti Kebab", "Melt-in-mouth minced kebab", 280, false),
                    new MenuItem(null, "Nihari", "Slow-cooked meat stew", 350, false),
                    new MenuItem(null, "Roomali Roti", "Thin handkerchief bread", 40, true),
                    new MenuItem(null, "Kulfi Nakh", "Traditional kulfi dessert", 120, true)
                )),
            new Restaurant(null, "Royal Cafe", "Hazratganj, Near Omaxe Mall",
                "North Indian", "Lucknow",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=500",
                List.of(
                    new MenuItem(null, "Basket Chaat", "Crispy basket with chaat", 150, true),
                    new MenuItem(null, "Butter Chicken", "Creamy butter chicken", 320, false),
                    new MenuItem(null, "Shahi Tukda", "Bread pudding dessert", 180, true),
                    new MenuItem(null, "Lassi", "Thick creamy yogurt drink", 60, true)
                )),

            // ==================== GOA (3) ====================
            new Restaurant(null, "Gunpowder", "Assagao, near St. Cajetan Church",
                "Goan", "Goa",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500",
                List.of(
                    new MenuItem(null, "Prawn Balchao", "Goan prawn pickle curry", 450, false),
                    new MenuItem(null, "Chicken Xacuti", "Goan coconut chicken curry", 380, false),
                    new MenuItem(null, "Fish Curry Rice", "Classic Goan fish curry", 320, false),
                    new MenuItem(null, "Bebinca", "Traditional Goan layered pudding", 180, true)
                )),
            new Restaurant(null, "Britto's", "Baga Beach, Bardez",
                "Seafood", "Goa",
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=500",
                List.of(
                    new MenuItem(null, "Grilled Pomfret", "Whole fish grilled with spices", 550, false),
                    new MenuItem(null, "Prawn Risotto", "Creamy prawn risotto", 420, false),
                    new MenuItem(null, "Fish Fry", "Rawa-fried kingfish", 380, false),
                    new MenuItem(null, "Coconut Feni Cocktail", "Traditional Goan drink", 200, true)
                )),
            new Restaurant(null, "Vinayak Family Restaurant", "Assagao, Anjuna",
                "North Indian", "Goa",
                "https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=500",
                List.of(
                    new MenuItem(null, "Chicken Thali", "Goan-style chicken thali", 280, false),
                    new MenuItem(null, "Paneer Butter Masala", "Rich paneer curry", 250, true),
                    new MenuItem(null, "Naan Basket", "Assorted naan breads", 120, true),
                    new MenuItem(null, "Gulab Jamun", "Sweet dumplings", 80, true)
                )),

            // ==================== CHANDIGARH (3) ====================
            new Restaurant(null, "Pal Dhaba", "Sector 28, Near Madhya Marg",
                "Punjabi", "Chandigarh",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=500",
                List.of(
                    new MenuItem(null, "Butter Chicken", "Punjabi-style butter chicken", 350, false),
                    new MenuItem(null, "Dal Makhani", "Creamy black lentils", 220, true),
                    new MenuItem(null, "Tandoori Roti", "Clay oven bread", 30, true),
                    new MenuItem(null, "Lassi", "Thick Punjabi lassi", 60, true)
                )),
            new Restaurant(null, "Sector 17 Social", "Sector 17, Chandigarh",
                "Continental", "Chandigarh",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500",
                List.of(
                    new MenuItem(null, "Wood-fired Pizza", "Artisan pizza with fresh toppings", 400, true),
                    new MenuItem(null, "Grilled Chicken Burger", "Juicy chicken patty burger", 350, false),
                    new MenuItem(null, "Nachos Supreme", "Loaded nachos with salsa", 280, true),
                    new MenuItem(null, "Mud Cake", "Rich chocolate mud cake", 200, true)
                )),
            new Restaurant(null, "Amritsari Kulcha", "Sector 9, Madhya Marg",
                "Punjabi", "Chandigarh",
                "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=500",
                List.of(
                    new MenuItem(null, "Amritsari Kulcha", "Stuffed crispy bread", 80, true),
                    new MenuItem(null, "Chole", "Spiced chickpea curry", 100, true),
                    new MenuItem(null, "Aloo Kulcha", "Potato stuffed kulcha", 70, true),
                    new MenuItem(null, "Paneer Kulcha", "Cottage cheese stuffed kulcha", 100, true)
                )),

            // ==================== JALGAON (4 - Original) ====================
            new Restaurant(null, "Shree Thaali", "MG Marg, New Market",
                "Gujarati", "Jalgaon",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
                List.of(
                    new MenuItem(null, "Gujarati Thali", "Full thali with unlimited servings", 299, true),
                    new MenuItem(null, "Dal Baati Churma", "Rajasthani special platter", 249, true),
                    new MenuItem(null, "Kadhi Pakora", "Yogurt-based curry with fried dumplings", 180, true),
                    new MenuItem(null, "Thepla", "Spiced flatbread with fenugreek", 50, true)
                )),
            new Restaurant(null, "The Pizza Project", "Nath Corner, Navi Peth",
                "Italian", "Jalgaon",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500",
                List.of(
                    new MenuItem(null, "Margherita Pizza", "Classic cheese and tomato", 399, true),
                    new MenuItem(null, "Pepperoni Pizza", "Spicy pepperoni with mozzarella", 499, false),
                    new MenuItem(null, "Garlic Bread", "Crusty bread with garlic butter", 149, true),
                    new MenuItem(null, "Pasta Alfredo", "Creamy white sauce pasta", 299, true)
                )),
            new Restaurant(null, "Bombay Shoppe", "Near Zilla Parishad, Shani Mandir Road",
                "Fast Food", "Jalgaon",
                "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500",
                List.of(
                    new MenuItem(null, "Vada Pav", "Mumbai style vada pav with chutney", 30, true),
                    new MenuItem(null, "Pav Bhaji", "Mixed vegetables with butter pav", 180, true),
                    new MenuItem(null, "Frankie", "Egg roll with vegetables", 90, false),
                    new MenuItem(null, "Cold Coffee", "Creamy chocolate cold coffee", 80, true)
                )),
            new Restaurant(null, "New Punjab Restaurant", "Bus Stand Road, Civil Lines",
                "North Indian", "Jalgaon",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=500",
                List.of(
                    new MenuItem(null, "Butter Chicken", "Creamy tomato gravy with tender chicken", 320, false),
                    new MenuItem(null, "Dal Makhani", "Slow-cooked black lentils", 220, true),
                    new MenuItem(null, "Naan Platter", "Assorted bread basket", 180, true),
                    new MenuItem(null, "Rasmalai", "Soft cheese balls in saffron milk", 120, true)
                ))
        );

        restaurantRepository.saveAll(restaurants);
    }
}
