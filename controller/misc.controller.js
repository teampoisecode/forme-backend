"use strict";
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const FileManager = require("../utils/fileManager");
const mime = require("mime-types");

const fileManager = new FileManager();

module.exports = {
	uploadImage: async (req, res) => {
		const { url } = req.body;

		// Delete the existing file if a URL is provided
		if (url) {
			fileManager.deleteFile(url);
		}

		const file = req.files[0];
		let key = null;

		if (file) {
			const fileExtension = path.extname(file.originalname);
			key = `${uuid()}${fileExtension}`; // Unique key using UUID
			await fileManager.uploadFile(key, file.buffer); // Save the file locally
		}

		return helpers.createResponse(
			res,
			constants.SUCCESS,
			"File uploaded successfully",
			key,
		);
	},

	getFile: async (req, res) => {
		try {
			const { fileName } = req.params;

			if (fileName && fileName !== "undefined" && fileName !== "null") {
				const filePath = path.join(
					__dirname,
					"..",
					process.env.LOCAL_FOLDER,
					fileName,
				);

				// Check if the file exists in local storage
				if (!fs.existsSync(filePath)) {
					return res
						.status(404)
						.json({ error: "File not found or cannot be read." });
				}

				const fileType = path.extname(fileName).substring(1);
				const contentDisposition = [
					"mp3",
					"mp4",
					"pdf",
					"jpg",
					"jpeg",
					"png",
					"svg",
					"gif",
				].includes(fileType)
					? `inline; filename="${fileName}"`
					: `attachment; filename="${fileName}"`;
				const contentType = mime.lookup(fileType) || "application/octet-stream";

				// Read the file and send it in the response
				const fileBuffer = fs.readFileSync(filePath);
				res.writeHead(200, {
					"Content-Type": contentType,
					"Content-Length": fileBuffer.length,
					"Content-Disposition": contentDisposition,
				});
				res.end(fileBuffer);
			} else {
				return helpers.createResponse(res, 400, "Invalid file name");
			}
		} catch (e) {
			console.error(e);
			return helpers.createResponse(
				res,
				constants.SERVER_ERROR,
				messages.SERVER_ERROR,
				{ error: e.message },
			);
		}
	},
};
