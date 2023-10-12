class ApiFeatures {
 constructor(query, queryStr) {
  this.query = query;
  this.queryStr = queryStr;
  this.totalRecord;
 }

 search() {
  const search = this.queryStr?.search || {};

  let obj = {};
  if (Object.keys(search).length !== 0) {
   Object.keys(search).map((x) => {
    if (search[x]) {
     if (/^\+\d+-?\d+$/.test(search[x])) {
      obj[x] = search[x];
     } else if (/(0?[1-9]|[12]\d|30|31)[^\w\d\r\n:](0?[1-9]|1[0-2])[^\w\d\r\n:](\d{4}|\d{2})/.test(search[x])) {
      const dateParts = search[x]?.split("-");
      const formattedDate = `${dateParts?.[2]}-${dateParts?.[1]}-${dateParts?.[0]}`;
      const parsedDate = new Date(formattedDate);
      const nextDay = new Date(formattedDate);
      nextDay.setDate(parsedDate.getDate() + 1);
      obj[x] = { $gte: parsedDate, $lte: nextDay };
     } else if (!isNaN(Number(search[x]))) {
      obj[x] = Number(search[x]);
     } else {
      if (search[x][0] === "$") {
       obj[x] = search[x];
      } else {
       if (x !== "createdAt") {
        obj[x] = { $regex: new RegExp(".*" + search[x] + ".*", "i") };
       }
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
