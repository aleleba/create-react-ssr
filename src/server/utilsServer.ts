import fs from 'fs';

export const getHashManifest = () => {
	try {
		const baseUrl = __dirname.replace(/\/server(.*)/,'');
		const fullURL = `${baseUrl}/assets/manifest-hash.json` ;
		return JSON.parse(fs.readFileSync(fullURL).toString());
	}catch(err){
		console.error(err);
	}
};

export const haveVendorsCss = () => {
	try {
		const baseUrl = __dirname.replace(/\/server(.*)/,'');
		const fullURL = `${baseUrl}/assets/vendors.css` ;
		fs.readFileSync(fullURL).toString();
		return true
	}catch(err){
		// console.error(err);
		return false
	}
};
