import fs from 'fs';

const getHashManifest = () => {
	try {
		const baseUrl = __dirname.replace(/\/client(.*)/,'');
		const fullURL = `${baseUrl}/client/build/assets/manifest-hash.json` ;
		return JSON.parse(fs.readFileSync(fullURL));
	}catch(err){
		console.error(err);
	}
};

export default getHashManifest;
