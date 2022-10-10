const types:{[key: string]: string} = {
  "audio": "mp3,wav,ape",
  "doc": "doc,docx,doct,wps,pages",
  "link": "lnk",
  "pdf": "pdf",
  "pic": "jpg,jpeg,png,gif,bmp",
  "ppt": "ppt,pptx,pps,keynote",
  "txt": "txt",
  "video": "mp4,rmv,rm,rmvb,mkv,wmv,flv,avi,mov,3gp,mpeg",
  "xls": "csv,xls,xlsx,xlt,numbers",
  "zip": "rar,zip,7z,xz,gz",
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

export default extension;
