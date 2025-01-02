import fs from 'fs';
import path from 'path';

/**
 * Deletes an image from the local filesystem.
 * @param {string} filePath - The full path to the file to be deleted.
 * @returns {Promise<void>} - Resolves if the file is deleted successfully; rejects otherwise.
 */
const deleteImage = (filePath) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    reject(err);
                } else {
                    console.log(`File deleted: ${filePath}`);
                    resolve();
                }
            });
        } else {
            console.warn(`File not found: ${filePath}`);
            resolve(); // Resolve even if the file doesn't exist to avoid breaking the flow.
        }
    });
};

export default deleteImage
