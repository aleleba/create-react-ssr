import fs from 'fs';
import { config } from '../../config';

const { ENV } = config

export const getHashManifest = () => {
	try {
		const baseUrl = __dirname.replace(/\/server(.*)/,'');
		const fullURL = `${baseUrl}/assets/manifest-hash.json`;
		const readFileData = JSON.parse(fs.readFileSync(fullURL).toString());
		return readFileData
	}catch(err){
		console.error(err);
	}
};

export const haveVendorsCss = (manifest, memoryFs) => {
	try {
		const baseUrl = __dirname.replace(/\/server(.*)/,'');
		const fullURL = `${baseUrl}${manifest ? `/${manifest['vendors.css']}` : '/build/assets/vendors.css'}`;
		ENV === 'production' && fs.readFileSync(fullURL).toString();
		ENV === 'development' && memoryFs.readFileSync(fullURL).toString();
		return true
	}catch(err){
		// console.error(err);
		return false
	}
};