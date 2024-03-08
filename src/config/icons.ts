const types:{[key: string]: string} = {
  "audio.svg": "mp3,wma,wav,ape,flac,ogg,aac,lrc",
  "doc.svg": "doc,docx,doct,wps,pages,xps",
  "cad.svg": "dwg,dxf",
  "link.svg": "lnk",
  "pdf.svg": "pdf",
  "pic.svg": "jpg,jpeg,png,gif,bmp,svg,tiff,webp",
  "ppt.svg": "ppt,pptx,pps,key",
  "txt.svg": "txt,php,js,ts,tsx,vue,py,cpp,c,h,md,htm,html,css,go,xml,json,toml,yml,sh,java",
  "video.svg": "mp4,rmv,rm,rmvb,mkv,wmv,flv,avi,mov,3gp,mpeg",
  "xls.svg": "csv,xls,xlsx,xlt,numbers",
  "zip.svg": "rar,zip,7z,xz,gz,bz2,br,zz,zst,lz4,tar,sz",
  "ico.svg": "ico,icns,exe,dll,mui,mun,apk,ipa",
  "dll.png": "dll",
  "msi.png": "msi",
};

let mapping:{[key: string]: string} = {};

Object.keys(types).forEach(key => {
  types[key].split(',').forEach(ext => {
    mapping[ext.toLowerCase()] = key;
  });
});

export const isZip = (n: string):boolean => getType(n+'') == 'zip.svg';

export const getType = (n: string):string => mapping[getExt(n+'')] || "none.svg";

export const getExt = (n: string):string => ((n+'').match(/\.([^.]+)$/) ?? [])[1]?.toLowerCase() || '';

import { store } from "@/store";
import { ResultEnum } from "@/api";

async function thumb(b:number, item:any, i:number, r:any, s:number, fail:string):Promise<string> {
  let url;
  if (typeof r === 'string' && r != '') {
    let n = [r, item.n].join('/');
    url = `//${location.host}/prvw/api/thumb/jpg?b=${b}&i=${i}&r=${n}&w=${s}&h=${s}&token=${store.token}`
  } else {
    url = `//${location.host}/prvw/api/thumb/jpg?b=${b}&i=${item?.i}&w=${s}&h=${s}&token=${store.token}`;
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
  return '/icons/' + getType(item?.n);
}

export async function toIcon(b:number, item:any, i:number, r:any, s:number):Promise<string> {
  if (item?.t == 1) {
    if (item?.n.endsWith('.app')) return await thumb(b, item, i, r, s, '/icons/dir.svg');
    return '/icons/dir.svg';
  }
  const t = getType(item?.n);
  switch (t) {
    case "pic.svg":
    case "doc.svg":
    case "ppt.svg":
    case "xls.svg":
    case "pdf.svg":
    case "cad.svg":
    case "ico.svg":
    case "video.svg":
      return await thumb(b, item, i, r, s, `/icons/${t}`);
    default:
      return `/icons/${t}`; 
  }
}
