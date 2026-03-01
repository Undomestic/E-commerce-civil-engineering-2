const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// Serve static files
app.use(express.static('.'));

// 1. Data Structure
const products = [
    {
        id: "p1",
        name: "SS 304 D Type Handle with Brass Bush",
        category: "SS HARDWARE",
        short_desc: "Heavy-duty 304-grade stainless steel pull handles designed for industrial metal doors.",
        features: ["304 Grade Stainless Steel", "Brass bush fixture for stability", "Anti-corrosive & Zero maintenance", "For Metal Doors"],
        models: ["DSH 3019", "DBH 3019", "DSH 2519", "DBH 2519"],
        views: 1500, units_sold: 350, date_added: "2023-01-15T00:00:00Z",
        image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "p2",
        name: "SS 304 Ball Bearing Hinges",
        category: "SS HARDWARE",
        short_desc: "Certified fire-rated hinges engineered for high-frequency usage. Compliant with BS EN 1634 standards.",
        features: ["2 Ball Bearings / 180° opening", "Fire rated 120 minutes", "1,000,000 cycles tested", "Non-Magnetic hinges and bearing"],
        models: ["DFH 4335", "DFH 4336"],
        views: 2100, units_sold: 800, date_added: "2023-02-20T00:00:00Z",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "p3",
        name: "Heavy Duty Door Closer",
        category: "DOOR CONTROL",
        short_desc: "Industrial-grade hydraulic door closers featuring a rack and pinion mechanism.",
        features: ["Aluminium die-cast body", "Climate-resistant hydraulic oil", "100,000 cycles tested", "Weight capacity 80 - 100 Kg"],
        models: ["DDC 90", "DDC 70"],
        views: 3500, units_sold: 1200, date_added: "2023-05-10T00:00:00Z",
        image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "p4",
        name: "Pure Grade Aluminium Coving",
        category: "CLEANROOM",
        short_desc: "Hygienic aluminium coving system (Alloy 6063) for cleanroom applications.",
        features: ["Aluminium 6063 Grade", "Hygienic wall transitions", "Powder coated / Anodized options", "Sizes available radius R50 mm & R70 mm"],
        models: ["DAC"],
        views: 1200, units_sold: 450, date_added: "2024-01-05T00:00:00Z",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "p5",
        name: "Perimeter Door Seals",
        category: "DOOR CONTROL",
        short_desc: "High-grade EPDM self-adhesive seal for superior acoustic and smoke containment.",
        features: ["High-quality EPDM Rubber", "Anti-UV & Weather Resistant", "Self-adhesive backing", "Food grades as per WHO, USFDA"],
        models: ["DPS"],
        views: 800, units_sold: 150, date_added: "2024-02-15T00:00:00Z",
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80"
    }
];

// Helper to calculate badges dynamically
const calculateBadges = (product) => {
    const badges = [];
    
    // Logic: Units sold > 1000 = MOST SELLING
    if (product.units_sold > 1000) badges.push("MOST SELLING");

    // Logic: Added within last 6 months = NEW
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    if (new Date(product.date_added) >= sixMonthsAgo) badges.push("NEW");

    // Logic: Views > 2000 = MOST VIEWED
    if (product.views > 2000) badges.push("MOST VIEWED");

    return badges;
};

// Route: GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    // Add dynamic badges to response
    const responseData = { ...product, badges: calculateBadges(product) };
    
    res.json(responseData);
});

app.listen(port, () => {
    console.log(`Dormount API running at http://localhost:${port}`);
});