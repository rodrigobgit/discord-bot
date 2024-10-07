const fs = require("fs");
const path = require("path");

module.exports = (directory, directoryOnly = false) => {
	let fileList = [];
	const files = fs.readdirSync(directory, { withFileTypes: true });

	files.forEach((file) => {
		const filePath = path.join(directory, file.name);

		if (directoryOnly) {
			if (file.isDirectory()) {
				fileList.push(filePath);
			}
		} else {
			if (file.isFile()) {
				fileList.push(filePath);
			}
		}
	});

	return fileList;
};
