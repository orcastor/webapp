const types:{[key: string]: string} = {
  "audio": "mp3,wav,ape",
  "doc": "doc,docx,doct,wps,pages",
  "link": "lnk",
  "pdf": "pdf",
  "pic": "jpg,jpeg,png,gif,bmp,svg,eps,ai,psd,ico",
  "ppt": "ppt,pptx,pps,keynote",
  "txt": "txt,php,js,ts,tsx,vue,py,cpp,c,h,md,htm,html,css,go,xml,json,toml,yml,sh,java",
  "video": "mp4,rmv,rm,rmvb,mkv,wmv,flv,avi,mov,3gp,mpeg",
  "xls": "csv,xls,xlsx,xlt,numbers",
  "zip": "rar,zip,7z,xz,gz,dmg,jar",
};

let mapping:{[key: string]: string} = {};

function getMapping():{[key: string]: string} {
  if(mapping.length) return mapping;
  Object.keys(types).forEach(key => {
    types[key].split(',').forEach(ext => {
      mapping[ext] = key;
    });
  });
  console.log(mapping);
  return mapping;
}

const extension = (ext: string) => {
  let t = getMapping()[ext.toLowerCase()];
  if(t) return t;
  return "none";
};

export function toIcon(item:any):string {
  if(item.type == 1) {return '/icons/dir.svg';}
  if(item.type == 2) {
    let pos = item.name.lastIndexOf('.');
    if(pos >= 0) { return '/icons/' + extension(item.name.substr(pos+1)) + '.svg'; }
  }
  return '/icons/none.svg';
}
