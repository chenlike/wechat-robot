import fs from "fs";
import path from "path";
import axios from "axios"
/**
 * 解码微信图片
 * @param imagePath  图片地址
 * @returns 解码后的图片
 */
export function decodeImage(imagePath: string): Promise<string> {
  let absPath = imagePath;
  let extname = ".jpg";

  let base = 0xff;
  let next = 0xd8;
  let gifA = 0x47;
  let gifB = 0x49;
  let pngA = 0x89;
  let pngB = 0x50;
  let bmpA = 0x42;
  let bmpB = 0x4d;

  return new Promise((resolve, reject) => {
    fs.readFile(absPath, (err, content) => {
      if (err) {
        console.log("解码失败:" + absPath);
        reject();
      } else {
        let firstV = content[0],
            nextV = content[1],
            jT = firstV ^ base,
            jB = nextV ^ next,
            gT = firstV ^ gifA,
            gB = nextV ^ gifB,
            pT = firstV ^ pngA,
            pB = nextV ^ pngB,
            bT = firstV ^ bmpA,
            bB = nextV ^ bmpB;
        var v = firstV ^ base;
        if (jT == jB) {
          v = jT;
          extname = ".jpg";
        } else if (gT == gB) {
          v = gT;
          extname = ".gif";
        } else if (pT == pB) {
          v = pT;
          extname = ".png";
        } else if (bT == bB) {
          v = bT;
          extname = ".bmp";
        }
        let imgPath = path.join(
          path.dirname(absPath),
          path.basename(absPath) + extname
        );
        let bb = content.map((br) => {
          return br ^ v;
        });
        fs.writeFileSync(imgPath, bb);
        resolve(imgPath);
      }
    });
  });
}


export async function downloadFile(url: string, filepath: string, name: string) {
  if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
  }
  const mypath = path.resolve(filepath, name);
  const writer = fs.createWriteStream(mypath);
  const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
  });
}

/**
 * 生成guid
 * @returns 
 */
export function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}