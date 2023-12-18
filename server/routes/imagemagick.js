// import express from 'express';
// import multer from 'multer';
// import im from 'imagemagick';
// import fs from 'fs';
// import path from 'path';
// import { users } from "../config/mongoCollections.js";
// const router = express.Router();
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


// if (process.platform == 'win32') {
// 	im.convert.path = 'C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\convert';
// 	im.identify.path = 'C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\identify';
// }
// const mimes = ['image/jpg', 'image/jpeg', 'image/png'];

// const acceptedImgs = (req, file, cb) => {
// 	console.log(file.mimetype);
// 	if (mimes.includes(file.mimetype)) cb(null, true);
// 	else cb(null, false);
// };

// const upload = multer({
// 	limits: { fileSize: '5MB', files: 1 },
// 	fileFilter: acceptedImgs,
// });

// const transformImage = (image) => {
// 	return new Promise((resolve, reject) => {
// 		im.crop(
// 			{ srcData: image, width: 256, height: 256, quality: 0.75 },
// 			(err, stdout) => {
// 				if (err) reject(err);

// 				resolve(stdout);
// 			}
// 		);
// 	});
// };

// router.post(
// 	'/user/:id/photo',
// 	upload.single('file'),
// 	async (req, res, next) => {
// 		console.log(req.body)
// 		console.log(JSON.stringify(req.body));
// 		console.log('in route image')
//         const id = req.params.id;
// 		let profilePictureUrl = '';
// 		if (req.file) {
// 			const fileBuffer = req.file.buffer;
// 			const fileName = `profile-pic-${Date.now()}.png`
// 			const filePath = path.join(__dirname, '../public/uploads/', fileName)
// 			fs.writeFileSync(filePath, fileBuffer);
// 			profilePictureUrl = `/uploads/${fileName}`
// 			const update = {};

// 			// Add 'profilePicture' field to the update object
// 			update['profilePicture'] = profilePictureUrl;
// 			console.log('ID:', id);
// 			// Use updateOne method to update the document
// 			const userCollection = await users();
// 			await userCollection.updateOne({ uid: id }, { $set: update });
// 		} else {
// 			res.status(400).json({ message: 'Error : No file attached' });
// 		}
// 	}
// );

// export default router;

import express from 'express';
import multer from 'multer';
import im from 'imagemagick';
import fs from 'fs';
import path from 'path';
import { users } from "../config/mongoCollections.js";
const router = express.Router();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.platform == 'win32') {
	im.convert.path = 'C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\convert';
	im.identify.path = 'C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\identify';
}

const mimes = ['image/jpg', 'image/jpeg', 'image/png'];

const acceptedImgs = (req, file, cb) => {
	if (mimes.includes(file.mimetype)) cb(null, true);
	else cb(null, false);
};

const upload = multer({
	limits: { fileSize: '5MB', files: 1 },
	fileFilter: acceptedImgs,
});

const transformImage = (imagePath) => {
	return new Promise((resolve, reject) => {
		const outputFilePath = path.join(__dirname, '../public/uploads/transformed-image.png');
		im.crop(
			{
				srcPath: imagePath,
				dstPath: outputFilePath,
				width: 256,
				height: 256,
				quality: 0.75,
			},
			(err, stdout) => {
				if (err) reject(err);
				resolve(outputFilePath);
			}
		);
	});
};

router.post(
	'/user/:id/photo',
	upload.single('file'),
	async (req, res, next) => {
		const id = req.params.id;
		if (req.file) {
			const fileBuffer = req.file.buffer;
			const fileName = `profile-pic-${Date.now()}.png`
			const filePath = path.join(__dirname, '../public/uploads/', fileName)
			fs.writeFileSync(filePath, fileBuffer);
			const transformedImagePath = await transformImage(filePath);
			const profilePictureUrl = `/uploads/transformed-image.png`;

			const update = {};
			update['profilePicture'] = profilePictureUrl;

			const userCollection = await users();
			await userCollection.updateOne({ uid: id }, { $set: update });

			res.status(200).json({ message: 'Image uploaded and transformed successfully' });
		} else {
			res.status(400).json({ message: 'Error: No file attached' });
		}
	}
);

export default router;
