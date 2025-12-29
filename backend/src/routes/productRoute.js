import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { getProducts, searchProduct, advancesearchProduct, createProducts, getsingleProducts, updateProducts, destroyProducts  } from "../contoller/productController.js";
const router = express.Router();

router.route("/").get(getProducts).post(protect, upload.single("image"), createProducts)
router.route("/advance/search"). get(advancesearchProduct);
router.route("/normal/search"). get(searchProduct);

router.route("/:id")
.get(getsingleProducts)
.patch(protect, upload.single("image"), updateProducts)
.delete(protect, admin, destroyProducts)

export default router;
