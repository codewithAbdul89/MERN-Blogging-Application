import "dotenv/config";
import Category from "../Models/category.model.js";
import connectDB from "../config/db.config.js";


const categories =[
    {
        "name": "Technology",
        "slug": "technology",
        "description": "Technology news, gadgets, software, hardware, cloud computing, and emerging innovations."
    },
    {
        "name": "Programming",
        "slug": "programming",
        "description": "Programming languages, frameworks, web development, mobile apps, and software engineering."
    },
    {
        "name": "Artificial Intelligence",
        "slug": "artificial-intelligence",
        "description": "Machine learning, deep learning, generative AI, robotics, automation, and AI tools."
    },
    {
        "name": "Cybersecurity",
        "slug": "cybersecurity",
        "description": "Ethical hacking, cybersecurity, privacy, network security, and digital safety."
    },
    {
        "name": "Business",
        "slug": "business",
        "description": "Entrepreneurship, startups, leadership, management, and business growth."
    },
    {
        "name": "Finance",
        "slug": "finance",
        "description": "Personal finance, investing, banking, insurance, cryptocurrency, and wealth management."
    },
    {
        "name": "Education",
        "slug": "education",
        "description": "Learning resources, online education, academic guidance, and career preparation."
    },
    {
        "name": "Science",
        "slug": "science",
        "description": "Physics, chemistry, biology, astronomy, mathematics, and scientific discoveries."
    },
    {
        "name": "Health & Fitness",
        "slug": "health-fitness",
        "description": "Nutrition, exercise, wellness, mental health, and healthy lifestyle."
    },
    {
        "name": "Lifestyle",
        "slug": "lifestyle",
        "description": "Daily life, habits, productivity, minimalism, relationships, and self-improvement."
    },
    {
        "name": "Travel",
        "slug": "travel",
        "description": "Travel destinations, guides, experiences, hotels, and tourism."
    },
    {
        "name": "Food & Cooking",
        "slug": "food-cooking",
        "description": "Recipes, cooking tips, restaurants, beverages, and food culture."
    },
    {
        "name": "Sports",
        "slug": "sports",
        "description": "Football, cricket, basketball, tennis, Olympics, esports, and sports news."
    },
    {
        "name": "Entertainment",
        "slug": "entertainment",
        "description": "Movies, TV shows, celebrities, streaming platforms, and pop culture."
    },
    {
        "name": "Gaming",
        "slug": "gaming",
        "description": "PC gaming, console gaming, mobile gaming, reviews, and esports."
    },
    {
        "name": "Fashion & Beauty",
        "slug": "fashion-beauty",
        "description": "Fashion trends, clothing, beauty, makeup, grooming, and personal style."
    },
    {
        "name": "Photography",
        "slug": "photography",
        "description": "Photography techniques, editing, cameras, videography, and visual storytelling."
    },
    {
        "name": "Books & Literature",
        "slug": "books-literature",
        "description": "Book reviews, literature, poetry, novels, and reading recommendations."
    },
    {
        "name": "History",
        "slug": "history",
        "description": "Ancient civilizations, world history, biographies, and historical events."
    },
    {
        "name": "Politics",
        "slug": "politics",
        "description": "Politics, government, public policy, elections, and international relations."
    },
    {
        "name": "Environment",
        "slug": "environment",
        "description": "Climate change, sustainability, renewable energy, wildlife, and conservation."
    },
    {
        "name": "Religion & Spirituality",
        "slug": "religion-spirituality",
        "description": "Religious teachings, spirituality, philosophy, and moral discussions."
    },
    {
        "name": "Career",
        "slug": "career",
        "description": "Jobs, interviews, freelancing, resume writing, and professional development."
    },
    {
        "name": "News",
        "slug": "news",
        "description": "Breaking news, world affairs, local news, and current events."
    },
    {
        "name": "Automobiles",
        "slug": "automobiles",
        "description": "Cars, motorcycles, electric vehicles, maintenance, and automotive news."
    },
    {
        "name": "Real Estate",
        "slug": "real-estate",
        "description": "Property buying, selling, renting, architecture, and home investment."
    },
    {
        "name": "Parenting & Family",
        "slug": "parenting-family",
        "description": "Parenting advice, childcare, family relationships, and child development."
    },
    {
        "name": "Pets & Animals",
        "slug": "pets-animals",
        "description": "Pet care, animal welfare, wildlife, and veterinary guidance."
    },
    {
        "name": "Art & Design",
        "slug": "art-design",
        "description": "Painting, graphic design, illustration, creativity, and digital art."
    },
    {
        "name": "DIY & Home Improvement",
        "slug": "diy-home-improvement",
        "description": "Home renovation, DIY projects, interior design, and home maintenance."
    },
    {
        "name": "Others",
        "slug": "others",
        "description": "Topics that do not belong to any specific category."
    }
]


await connectDB();

// await Category.deleteMany();

await Category.insertMany(categories);

console.log("Categories inserted successfully.");

process.exit();

// node src/seeds/category.seed.js