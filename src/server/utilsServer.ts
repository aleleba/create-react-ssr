import fs from 'fs';
import { config } from '../../config';

const { ENV } = config;

const isWin = process.platform === 'win32';

export const getHashManifest = () => {
	try {
		const baseUrl = __dirname.replace(/\/server(.*)/,'');
		const baseUrlWin = __dirname.replace(/\\server(.*)/,'');
		const fullURL = `${baseUrl}/assets/manifest-hash.json`;
		const fullURLWin = `${baseUrlWin}\\assets\\manifest-hash.json`;
		const readFileData = isWin ? JSON.parse(fs.readFileSync(fullURLWin).toString()) : JSON.parse(fs.readFileSync(fullURL).toString());
		return readFileData;
	}catch(err){
		console.error(err);
	}
};

export const haveVendorsCss = (manifest, memoryFs) => {
	try {
		const baseUrl = __dirname.replace(/\/server(.*)/,'');
		const baseUrlWin = __dirname.replace(/\\server(.*)/,'');
		const fullURL = `${isWin ? baseUrlWin : baseUrl}${manifest ? `/${manifest['vendors.css']}` : '/build/assets/vendors.css'}`;
		ENV === 'production' && fs.readFileSync(fullURL).toString();
		ENV === 'development' && memoryFs.readFileSync(fullURL).toString();
		return true;
	}catch(err){
		// console.error(err);
		return false;
	}
};
