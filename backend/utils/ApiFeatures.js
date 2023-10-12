class ApiFeatures {
 constructor(query, queryStr) {
  this.query = query;
  this.queryStr = queryStr;
  this.totalRecord;
 }

 search() {
  // const searchFields = Object.keys(this.query.schema.paths);
  // const stringFields = searchFields.filter((field) => this.query.schema.paths[field].instance === "String");
  // const searchFilters = this.queryStr.search ? stringFields.map((field) => ({ [field]: { $regex: `.*${this.queryStr.search?.trim()}.*`, $options: "i" } })) : [{}];
  const search = this.queryStr?.search || {};

  let obj = {};
  if (Object.keys(search).length !== 0) {
   Object.keys(search).map((x) => {
    if (search[x]) {
     if (/^\+\d+-?\d+$/.test(search[x])) {
      obj[x] = search[x];
     } else if (/^(\d{4})[\/-](0[1-9]|1[0-2])[\/-](0[1-9]|[12][0-9]|3[01])$/.test(search[x])) {
      obj[x] = { $gte: new Date(`${search[x]} 00:00:00 +00:00`), $lte: new Date(`${search[x]} 23:59:59 +00:00`) };
     } else if (!isNaN(Number(search[x]))) {
      obj[x] = Number(search[x]);
     } else {
      if (search[x][0] === "$") {
       obj[x] = search[x];
      } else {
       obj[x] = { $regex: new RegExp(".*" + search[x] + ".*", "i") };
      }
     }
    }
   });
  }

  this.query = this.query.find(obj);
  return this;
 }

 pagination() {
  const currentPage = Number(this.queryStr?.page) || 1;
  const limit = Number(this.queryStr?.sizePerPage) || 10;
  const skip = limit * (currentPage - 1);
  this.query = this.query.limit(+limit).skip(+skip);
  return this;
 }

 sort() {
  let val = this.queryStr?.order;
  let key = this.queryStr?.sort;
  this.query = this.query.sort({ [key]: val === "desc" ? -1 : 1 });
  return this;
 }

 calculateTotalPages(sizePerPage) {
  const tpage = this.totalRecord / sizePerPage;
  return Math.ceil(tpage);
 }

 get totalPage() {
  const sizePerPage = Number(this.queryStr?.sizePerPage) || 10;
  return this.calculateTotalPages(sizePerPage);
 }
}

module.exports = ApiFeatures;
