const fs = require("fs");
const path = require("path");

const BASE_DIR = path.resolve(__dirname, ".." + env.LOCAL_FOLDER);

class FileManager {
	constructor() {
		// Ensure the base directory exists
		if (!fs.existsSync(BASE_DIR)) {
			fs.mkdirSync(BASE_DIR, { recursive: true });
		}
	}

	async uploadFile(key, fileData) {
		try {
			const filePath = path.join(BASE_DIR, key);
			const dir = path.dirname(filePath);

			// Ensure the target directory exists
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}

			// Write the file data to the target path
			fs.writeFileSync(filePath, fileData);
			console.log(`File uploaded successfully to: ${filePath}`);
		} catch (e) {
			console.error("Error uploading file: " + e.message);
		}
	}

	deleteFile(key) {
		try {
			const filePath = path.join(BASE_DIR, key);

			// Check if the file exists before attempting to delete
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
				console.log(`File deleted successfully: ${filePath}`);
			} else {
				console.warn(`File not found for deletion: ${filePath}`);
			}
		} catch (e) {
			console.error("Error deleting file: " + e.message);
		}
	}

	async getFileByKey(key, contentDisposition, contentType) {
		try {
			const filePath = path.join(BASE_DIR, key);

			if (fs.existsSync(filePath)) {
				const fileData = fs.readFileSync(filePath);

				// Mimicking the behavior of `getObject` for consistency
				return {
					Body: fileData,
					ContentLength: fileData.length,
					ContentType: contentType,
					ContentDisposition: contentDisposition,
				};
			} else {
				throw new Error("File not found");
			}
		} catch (e) {
			console.error("Error retrieving file: " + e.message);
			throw e;
		}
	}

	generatePresignedUrl(fileKey) {
		try {
			const filePath = path.join(BASE_DIR, fileKey);

			if (fs.existsSync(filePath)) {
				// Return a local file path as a "presigned URL" for local use
				return filePath;
			} else {
				throw new Error("File not found");
			}
		} catch (e) {
			console.error("Error generating presigned URL: " + e.message);
			throw e;
		}
	}

	streamToString(stream) {
		return new Promise((resolve, reject) => {
			const chunks = [];
			stream.on("data", (chunk) => chunks.push(chunk));
			stream.on("error", reject);
			stream.on("end", () => resolve(Buffer.concat(chunks)));
		});
	}
}

module.exports = FileManager;
