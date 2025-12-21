import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { getProducts, searchProduct, advancesearchProduct, createProducts, getsingleProducts, updateProducts, destroyProducts  } from "../contoller/productController.js";
const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, upload.single("image"), createProducts)
router.route("/:id")
.get(getsingleProducts)
.patch(protect, admin, upload.single("image"), updateProducts)
.delete(protect, admin, destroyProducts)

router.route("/advance/search"). get(advancesearchProduct);
router.route("/normal/search"). get(searchProduct);

export default router;