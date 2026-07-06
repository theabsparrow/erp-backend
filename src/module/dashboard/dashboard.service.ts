import Product from "../product/product.model.js";
import Sale from "../sale/sale.model.js";
import User from "../user/user.model.js";
import Category from "../category/category.model.js";

const LOW_STOCK_THRESHOLD = 5;

const getStats = async () => {
  const [
    totalProducts,
    totalSales,
    totalUsers,
    totalCategories,
    lowStockProducts,
    revenueResult,
    topSellingProducts,
    salesByDay,
  ] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),

    Sale.countDocuments(),

    User.countDocuments({ isDeleted: false }),

    Category.countDocuments({ isDeleted: false }),

    Product.find({ isDeleted: false, stockQuantity: { $lt: LOW_STOCK_THRESHOLD } })
      .select("name sku stockQuantity image")
      .sort({ stockQuantity: 1 }),

    Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$grandTotal" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$grandTotal" },
        },
      },
    ]),

    Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          sku: { $first: "$items.sku" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
    ]),

    Sale.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$grandTotal" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 7 },
    ]),
  ]);

  const revenue = revenueResult[0] ?? {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  };

  return {
    overview: {
      totalProducts,
      totalSales,
      totalUsers,
      totalCategories,
      totalRevenue: revenue.totalRevenue,
      totalOrders: revenue.totalOrders,
      averageOrderValue: Number(revenue.averageOrderValue?.toFixed(2) ?? 0),
    },
    lowStockProducts,
    topSellingProducts,
    salesByDay: salesByDay.reverse(),
  };
};

export const dashboardService = { getStats };
