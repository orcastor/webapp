const types:{[key: string]: string} = {
  "audio": "mp3,wav,ape",
  "doc": "doc,docx,doct,wps,pages",
  "link": "lnk",
  "pdf": "pdf",
  "pic": "jpg,jpeg,png,gif,bmp,svg,eps,ai,psd,ico",
  "ppt": "ppt,pptx,pps,key",
  "txt": "txt,php,js,ts,tsx,vue,py,cpp,c,h,md,htm,html,css,go,xml,json,toml,yml,sh,java",
  "video": "mp4,rmv,rm,rmvb,mkv,wmv,flv,avi,mov,3gp,mpeg",
  "xls": "csv,xls,xlsx,xlt,numbers",
  "zip": "rar,zip,7z,xz,gz,dmg,jar",
};

let mapping:{[key: string]: string} = {};

function getMapping():{[key: string]: string} {
  if (mapping.length) return mapping;
  Object.keys(types).forEach(key => {
    types[key].split(',').forEach(ext => {
      mapping[ext] = key;
    });
  });
  return mapping;
}

const extension = (ext: string) => {
  let t = getMapping()[ext.toLowerCase()];
  if (t) return t;
  return "none";
};

export function toIcon(item:any):string {
  if (item.t == 1) {return '/icons/dir.svg';}
  if (item.t == 2) {
    let pos = item.n.lastIndexOf('.');
    if (pos >= 0) { return '/icons/' + extension(item.n.substr(pos+1)) + '.svg'; }
  }
  return '/icons/none.svg';
}
