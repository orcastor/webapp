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
  "zip": "rar,zip,7z,xz,gz,bz2,br,zz,zst,lz4,tar,sz",
  "ico": "ico,icns,exe,dll,mui,mun,apk,ipa",
};

let mapping:{[key: string]: string} = {};

Object.keys(types).forEach(key => {
  types[key].split(',').forEach(ext => {
    mapping[ext.toLowerCase()] = key;
  });
});

export const isZip = (n: string):boolean => getType(n+'') == 'zip';

export const getType = (n: string):string => mapping[getExt(n+'')] || "none";

export const getExt = (n: string):string => ((n+'').match(/\.([^.]+)$/) ?? [])[1]?.toLowerCase() || '';

import { store } from "@/store";
import { ResultEnum } from "@/api";

async function thumb(b:number, item:any, i:number, r:any, s:number, fail:string):Promise<string> {
  let url;
  if (typeof r === 'string' && r != '') {
    let n = [r, item.n].join('/');
    url = `//${location.host}/prvw/api/thumb/png?b=${b}&i=${i}&r=${n}&w=${s}&h=${s}&token=${store.token}`
  } else {
    url = `//${location.host}/prvw/api/thumb/png?b=${b}&i=${item?.i}&w=${s}&h=${s}&token=${store.token}`;
  }
  return fetch(url)
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
  if (item?.t == 1) {
    return '/icons/dir.svg';
  }
  return '/icons/' + getType(item?.n) + '.svg';;
}

export async function toIcon(b:number, item:any, i:number, r:any, s:number):Promise<string> {
  if (item?.t == 1) {
    if (item?.n.endsWith('.app')) return await thumb(b, item, i, r, s, '/icons/dir.svg');
    return '/icons/dir.svg';
  }
  const t = getType(item?.n);
  switch (t) {
    case "pic":
    case "doc":
    case "ppt":
    case "xls":
    case "pdf":
    case "cad":
    case "ico":
      return await thumb(b, item, i, r, s, `/icons/${t}.svg`);
    default:
      return `/icons/${t}.svg`; 
  }
}
