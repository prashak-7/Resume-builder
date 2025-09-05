import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, db) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.minetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png are allowed formats"), false);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;
