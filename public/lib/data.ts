export const TRAVEL_DATA = [
  { id: 1, title: "High-Altitude Tea Trails", location: "Nuwara Eliya", price: 120, tags: ["cold","nature","hiking"], image: "/assets/High-Altitude Tea Trails.jpg" },
  { id: 2, title: "Coastal Heritage Wander", location: "Galle Fort", price: 45, tags: ["history","culture","walking"], image: "/assets/Coastal Heritage Wander.jpg" },
  { id: 3, title: "Wild Safari Expedition", location: "Yala", price: 250, tags: ["animals","adventure","photography"], image: "/assets/Wild Safari Expedition.jpg" },
  { id: 4, title: "Surf & Chill Retreat", location: "Arugam Bay", price: 80, tags: ["beach","surfing","young-vibe"], image: "/assets/Surf & Chill Retreat.jpg" },
  { id: 5, title: "Ancient City Exploration", location: "Sigiriya", price: 110, tags: ["history","climbing","view"], image: "/assets/Ancient City Exploration.jpg" },
  { id: 6, title: "Mountain Sunrise Hike", location: "Ella", price: 90, tags: ["nature","hiking","sunrise"], image: "/assets/Mountain Sunrise Hike.jpg" },
  { id: 7, title: "Whale Watching Odyssey", location: "Mirissa", price: 95, tags: ["ocean","whales","boat"], image: "/assets/Whale Watching Mirissa.jpg" },
  { id: 8, title: "Temple of the Tooth", location: "Kandy", price: 35, tags: ["culture","buddhist","history"], image: "/assets/Temple of the Tooth.jpg" },
  { id: 9, title: "Tea Factory Tour", location: "Nuwara Eliya", price: 65, tags: ["tea","culture","food"], image: "/assets/Tea Factory Tour.jpg" },
  { id: 10, title: "Jungle River Kayaking", location: "Kithulgala", price: 75, tags: ["adventure","rafting","nature"], image: "/assets/Kithulgala Kayaking.jpg" },
  { id: 11, title: "Botanical Garden Walk", location: "Peradeniya", price: 25, tags: ["nature","plants","relax"], image: "/assets/Peradeniya Gardens.jpg" },
  { id: 12, title: "Beach Hopping Escape", location: "Unawatuna", price: 55, tags: ["beach","relax","swim"], image: "/assets/Unawatuna Beach.jpg" },
  { id: 13, title: "Elephant Safari", location: "Udawalawe", price: 85, tags: ["animals","elephants","safari"], image: "/assets/Udawalawe Elephants.jpg" },
  { id: 14, title: "Spice Garden Tour", location: "Matale", price: 40, tags: ["culture","food","spices"], image: "/assets/Spice Garden.jpg" },
  { id: 15, title: "Waterfall Chasing", location: "Ravana Falls", price: 60, tags: ["nature","waterfall","hiking"], image: "/assets/Ravana Falls.jpg" },
  { id: 16, title: "Colonial Train Ride", location: "Ella", price: 70, tags: ["train","scenic","culture"], image: "/assets/Ella Train.jpg" },
  { id: 17, title: "Night Safari Adventure", location: "Wilpattu", price: 180, tags: ["animals","night","wildlife"], image: "/assets/Wilpattu Night.jpg" },
  { id: 18, title: "Ayurveda Wellness", location: "Bentota", price: 130, tags: ["wellness","spa","relax"], image: "/assets/Bentota Ayurveda.jpg" },
  { id: 19, title: "Rock Fortress Climb", location: "Dambulla", price: 50, tags: ["history","climbing","cave"], image: "/assets/Dambulla Rock.jpg" },
  { id: 20, title: "Surf Lessons Paradise", location: "Weligama", price: 65, tags: ["surfing","beach","lessons"], image: "/assets/Weligama Surf.jpg" },
  { id: 21, title: "Sacred City Pilgrimage", location: "Anuradhapura", price: 55, tags: ["history","buddhist","ancient"], image: "/assets/Anuradhapura.jpg" },
  { id: 22, title: "Turtle Hatching Experience", location: "Kosgoda", price: 45, tags: ["animals","turtles","nature"], image: "/assets/Kosgoda Turtles.jpg" },
  { id: 23, title: "Tea Country Cycle", location: "Hatton", price: 105, tags: ["cycling","tea","nature"], image: "/assets/Hatton Cycling.jpg" },
  { id: 24, title: "Golden Temple Visit", location: "Dambulla", price: 30, tags: ["culture","buddhist","cave"], image: "/assets/Dambulla Golden.jpg" },
  { id: 25, title: "Coral Reef Snorkel", location: "Hikkaduwa", price: 70, tags: ["ocean","snorkel","coral"], image: "/assets/Hikkaduwa Snorkel.jpg" },
];

export type TravelItem = {
  id: number;
  title: string;
  location: string;
  price: number;
  tags: string[];
  image: string;
  reason?: string;  
};
