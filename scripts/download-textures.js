// 고품질 지구 텍스처 다운로드 스크립트
const https = require('https');
const fs = require('fs');
const path = require('path');

const TEXTURES = [
  {
    name: 'earth-day.jpg',
    urls: [
      'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg',
      'https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74393/world.topo.bathy.200401.3x5400x2700.jpg'
    ]
  },
  {
    name: 'earth-night.jpg',
    urls: [
      'https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg',
      'https://eoimages.gsfc.nasa.gov/images/imagerecords/55000/55167/earth_lights_lrg.jpg'
    ]
  },
  {
    name: 'earth-clouds.jpg',
    urls: [
      'https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg',
      'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg'
    ]
  }
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'textures');

// 출력 디렉토리 생성
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading: ${url}`);
    
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        file.close();
        fs.unlinkSync(dest);
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function downloadTexture(texture) {
  const dest = path.join(OUTPUT_DIR, texture.name);
  
  for (const url of texture.urls) {
    try {
      await downloadFile(url, dest);
      return;
    } catch (err) {
      console.log(`Failed to download from ${url}: ${err.message}`);
    }
  }
  
  console.error(`Failed to download ${texture.name} from all sources`);
}

async function main() {
  console.log('Downloading Earth textures...\n');
  
  for (const texture of TEXTURES) {
    await downloadTexture(texture);
  }
  
  console.log('\nDone!');
}

main().catch(console.error);

