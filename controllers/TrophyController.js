import { trophyValidation } from "../middlewares/schemaValidator.js";
import Trophy from "../models/trophy.js";

/* ================= CREATE TROPHY ================= */
export const createTrophy = async (req, res) => {
  const {
    name,
    shortDescription,
    description,
    category,
    price,
    discountPrice,
    stock,
    height
  } = req.body;

  try {
    // 1️⃣ Validate body
    const { error } = trophyValidation.validate(
      {
        name,
        shortDescription,
        description,
        category,
        price,
        discountPrice,
        stock,
        height
      },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((d) => d.message),
      });
    }

    // 2️⃣ Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least 1 image is required",
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 images allowed",
      });
    }

    // 3️⃣ Prepare image URLs
    const imageUrls = req.files.map((file) => file.path);

    // 4️⃣ Create trophy
    const trophy = await Trophy.create({
      name,
      shortDescription,
      description,
      height,
      category,
      price,
      discountPrice,
      stock,
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Trophy created successfully",
      trophy,
    });
  } catch (error) {
    console.error("Create trophy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create trophy",
      error: error.message,
    });
  }
};

/* ================= GET ALL TROPHIES ================= */
export const getAllTrophies = async (req, res) => {
  try {
    const trophies = await Trophy.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, trophies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET SINGLE TROPHY ================= */
export const getTrophyById = async (req, res) => {
  try {
    const trophy = await Trophy.findById(req.params.id);

    if (!trophy) {
      return res.status(404).json({
        success: false,
        message: "Trophy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: trophy,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= HOME TROPHIES (RANDOM) ================= */
export const getHomeTrophies = async (req, res) => {
  try {
    const limit = 10;
    const trophies = await Trophy.aggregate([
      { $sample: { size: limit } },
    ]);

    res.status(200).json({
      success: true,
      count: trophies.length,
      data: trophies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch home trophies",
    });
  }
};

/* ================= GET TROPHY BY CATEGORY ================= */
export const getTrophyByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log("Fetching trophies for category:", category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const trophies = await Trophy.find({ category })
      .lean()
      .sort({ createdAt: -1 });

    if (trophies.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No trophies found for category: ${category}`,
      });
    }

    res.status(200).json({
      success: true,
      count: trophies.length,
      data: trophies,
    });
  } catch (error) {
    console.error("Get trophy by category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trophies",
      error: error.message,
    });
  }
};

export const getFullTrophyByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const trophies = await Trophy.find({ category })
      .lean()
      .sort({ createdAt: -1 });

    if (trophies.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No trophies found for category: ${category}`,
      });
    }

    res.status(200).json({
      success: true,
      count: trophies.length,
      data: trophies,
    });
  } catch (error) {
    console.error("Get trophy by category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trophies",
      error: error.message,
    });
  }
};


/* ================= UPDATE TROPHY ================= */
export const updateTrophy = async (req, res) => {
  try {
    const { id } = req.params;
    const trophy = await Trophy.findById(id);

    if (!trophy) {
      return res.status(404).json({
        success: false,
        message: "Trophy not found",
      });
    }

    // Existing images
    let existingImages = Array.isArray(trophy.images)
      ? trophy.images
      : [];

    // New images
    const newImages = req.files?.map((file) => file.path) || [];

    const finalImages = [...existingImages, ...newImages];

    if (finalImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least 1 image is required",
      });
    }

    if (finalImages.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 images allowed",
      });
    }

    // Update fields
    const updatableFields = [
      "name",
      "shortDescription",
      "description",
      "category",
      "price",
      "discountPrice",
      "stock",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        trophy[field] = req.body[field];
      }
    });

    trophy.images = finalImages;
    await trophy.save();

    res.status(200).json({
      success: true,
      message: "Trophy updated successfully",
      trophy,
    });
  } catch (error) {
    console.error("Update trophy error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update trophy",
      error: error.message,
    });
  }
};

/* ================= DELETE TROPHY ================= */
export const deleteTrophy = async (req, res) => {
  try {
    const trophy = await Trophy.findByIdAndDelete(req.params.id);

    if (!trophy) {
      return res.status(404).json({
        success: false,
        message: "Trophy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trophy deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
