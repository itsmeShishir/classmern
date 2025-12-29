"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/app/utils/axios";
import { Product } from "@/app/types";
import ProductCard from "@/app/component/productCard";

interface Category {
  _id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("");
  const [inStock, setInStock] = useState(false);

  const loadProducts = async () => {
    try {
      const { data } = await api.get("products");
      const list = Array.isArray(data.data) ? data.data : data?.data?.products || [];
      setProducts(list);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await api.get("category");
      setCategories(data.data || []);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleNormalSearch = async () => {
    if (!search.trim()) {
      loadProducts();
      return;
    }
    setFilterLoading(true);
    try {
      const { data } = await api.get("products/normal/search", {
        params: { search },
      });
      setProducts(data.product || []);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Search failed");
    } finally {
      setFilterLoading(false);
    }
  };

  const handleAdvancedSearch = async () => {
    setFilterLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (search.trim()) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (rating) params.rating = rating;
      if (sort) params.sort = sort;
      if (inStock) params.stock = 1;

      const { data } = await api.get("products/advance/search", { params });
      setProducts(data.product || []);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Advanced search failed");
    } finally {
      setFilterLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setSort("");
    setInStock(false);
    loadProducts();
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="container mx-auto my-10 px-4">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Products</h1>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full md:flex-1 border rounded p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleNormalSearch}
            disabled={filterLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {filterLoading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-6 bg-white p-4 rounded border">
          <select
            className="border rounded p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min price"
            className="border rounded p-2"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max price"
            className="border rounded p-2"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <select
            className="border rounded p-2"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Any rating</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>
          <select
            className="border rounded p-2"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Default sort</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
            <option value="-name">Name: Z-A</option>
            <option value="rating">Rating: Low to High</option>
            <option value="-rating">Rating: High to Low</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            In stock only
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAdvancedSearch}
            disabled={filterLoading}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-black disabled:bg-gray-400"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            disabled={filterLoading}
            className="text-gray-700 hover:underline"
          >
            Reset
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
