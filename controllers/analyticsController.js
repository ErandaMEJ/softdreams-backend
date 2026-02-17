import Order from "../models/order.js";
import Product from "../models/Product.js";

export async function getSalesAnalytics(req, res) {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const sales = await Order.aggregate([
            {
                $match: {
                    date: { $gte: last30Days },
                    status: { $ne: "Cancelled" } // Exclude cancelled orders
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    items: { $sum: { $size: "$orderedItems" } },
                    revenue: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing dates with 0 sales
        const filledSales = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            const dateString = d.toISOString().split('T')[0];

            const existing = sales.find(s => s._id === dateString);
            if (existing) {
                filledSales.push({ date: dateString, ...existing });
            } else {
                filledSales.push({ date: dateString, _id: dateString, items: 0, revenue: 0 });
            }
        }

        res.json(filledSales);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sales analytics", error: error.message });
    }
}

export async function getRevenueStats(req, res) {
    try {
        const revenueByCategory = await Order.aggregate([
            { $unwind: "$orderedItems" },
            {
                $lookup: {
                    from: "products", // Ensure this matches your collection name (usually lowercase plural)
                    localField: "orderedItems.productID",
                    foreignField: "productID",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.category",
                    revenue: { $sum: "$orderedItems.quantity" } // Approximation since order item doesn't always store price snapshot. 
                    // Better approach: sum (quantity * productDetails.price)
                    // Let's refine this to verify if orderedItems has price.
                }
            }
        ]);

        // Since original Order schema might not store price per item in orderedItems, 
        // effectively calculating revenue per category accurately requires joining with Product.
        // However, prices might change. 
        // For now, let's group by product category from the product details.

        const refinedRevenue = await Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            { $unwind: "$orderedItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "orderedItems.productID",
                    foreignField: "productID",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product.category",
                    value: { $sum: { $multiply: ["$orderedItems.quantity", "$product.price"] } }
                }
            }
        ]);

        const formattedRevenue = refinedRevenue.map(item => ({
            name: item._id || "Uncategorized",
            value: item.value
        }));

        res.json(formattedRevenue);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error fetching revenue stats", error: error.message });
    }
}
