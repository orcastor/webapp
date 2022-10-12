export class Cache {
    capacity: number;
    aging: any;
    hash: {[key:string]:any};
    length: number;
    head: {[key:string]:any};
  
    constructor(capacity:number, aging:any) {
      this.capacity = capacity || Number.MAX_VALUE;
      this.aging = aging || this.remove;
    
      this.hash = {};
      this.length = 0;
      this.head = {};
      this.head.p = this.head.n = this.head;
    }
  
    link = (n:any, p:any) => {
      p.n = n; n.p = p;
    }
  
    refresh = (head:any, e:any) => {
      if (e != head.n) {
        this.link(e.n, e.p);
        this.link(head.n, e);
        this.link(e, head);
      }
    }
  
    get = (k:any) => {
      let entry = this.hash[k];
      if (!entry) return null;
      this.refresh(this.head, entry);
      return entry.v;
    }
  
    put = (k:any, v:any) => {
      if (v === undefined) return this;
      let entry = this.hash[k];
      if (!entry) {
        entry = this.head.n.p = this.hash[k] = {k: k, v: v, p: this.head, n: this.head.n};
        this.head.n = entry;
        if (this.head.p == this.head) {this.head.p = entry;}
        if (++this.length > this.capacity) this.aging(this.head.p.k);
        return this;
      }
      this.refresh(this.head, entry);
      entry.v = v;
      return this;
    }
  
    remove = (k:any) => {
      let entry = this.hash[k];
      if (!entry) return this;
      this.link(entry.n, entry.p);
      delete this.hash[k];
      --this.length;
      return this;
    }
  
    clear = () => {
      this.hash = {};
      this.length = 0;
      this.head = {};
      this.head.p = this.head.n = this.head;
      return this;
    }
  };