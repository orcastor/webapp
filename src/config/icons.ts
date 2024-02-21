const types:{[key: string]: string} = {
  "audio": "mp3,wma,wav,ape,flac,ogg,aac,lrc",
  "doc": "doc,docx,doct,wps,pages,xps",
  "cad": "dwg,dxf",
  "link": "lnk",
  "pdf": "pdf",
  "pic": "jpg,jpeg,png,gif,bmp,svg,tiff,webp",
  "ppt": "ppt,pptx,pps,key",
  "txt": "txt,php,js,ts,tsx,vue,py,cpp,c,h,md,htm,html,css,go,xml,json,toml,yml,sh,java",
  "video": "mp4,rmv,rm,rmvb,mkv,wmv,flv,avi,mov,3gp,mpeg",
  "xls": "csv,xls,xlsx,xlt,numbers",
  "zip": "rar,zip,7z,xz,gz,dmg,jar",
  "ico": "ico,icns,exe,dll,mui,mun,apk,ipa",
};

let mapping:{[key: string]: string} = {};

Object.keys(types).forEach(key => {
  types[key].split(',').forEach(ext => {
    mapping[ext.toLowerCase()] = key;
  });
});

const getType = (n: string): string => mapping[getExt(n)] || "none";

export const getExt = (n: string): string => (n.match(/\.([^.]+)$/) ?? [])[1]?.toLowerCase() || '';

import { store } from "@/store";
import { ResultEnum } from "@/api";

async function thumb(b:number, item:any, s:number, fail:string):Promise<string> {
  return fetch(`//${location.host}/prvw/api/thumb/png?b=${b}&i=${item.i}&w=${s}&h=${s}&token=${store.token}`)
    .then(response => {
      if (!response.ok || response.status != ResultEnum.SUCCESS) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.blob();
    })
    .then(blob => {
      if (typeof blob === 'string') {
        return fail;
      }
      return URL.createObjectURL(blob);
    })
    .catch(_ => fail);
}

export function toDefaultIcon(item:any):string {
  if (item.t == 1) {
    return '/icons/dir.svg';
  }
  return '/icons/' + getType(item.n) + '.svg';;
}

export async function toIcon(b:number, item:any, s:number):Promise<string> {
  let fail = '/icons/none.svg';
  if (item.t == 1) {
    fail = '/icons/dir.svg';
    if (item.n.endsWith('.app'))
        return await thumb(b, item, s, fail);
    return fail;
  }
  const type = getType(item.n);
  fail = '/icons/' + type + '.svg';
  switch (type) {
    case "pic":
    case "doc":
    case "ppt":
    case "xls":
    case "pdf":
    case "cad":
    case "ico":
      return await thumb(b, item, s, fail);
    default:
      return fail; 
  }
}
