import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadsDir = path.join(process.cwd(), "public", "uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  ensureUploadsDir();

  const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fieldsResult, filesResult) => {
        if (err) reject(err);
        else resolve({ fields: fieldsResult, files: filesResult });
      });
    });

    const file = files.file ?? files.avatar ?? files.image;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const data = Array.isArray(file) ? file[0] : file;
    const extension = path.extname(data.originalFilename || "").toLowerCase() || ".png";
    const fileName = `avatar_${Date.now()}${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.promises.copyFile(data.filepath, filePath);

    const publicUrl = `/uploads/${fileName}`;

    res.status(200).json({ success: true, url: publicUrl, fields });
  } catch (error) {
    console.error("Profile upload failed", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
}
