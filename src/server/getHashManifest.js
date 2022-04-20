import fs from 'fs';

const getHashManifest = () => {
	try {
		return JSON.parse(fs.readFileSync(`${__dirname}/../build/assets/manifest-hash.json`));
	}catch(err){
		console.error(err);
	}
};

export default getHashManifest;
