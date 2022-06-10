const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class Staff {
  constructor(staffId, companyId, name, imageUrl, annualLeave, salaryScale, status, dateTimekeeping, dataId, workplace, timeStart, timeEnd, workHours, dateLeave, hoursOff, reason, remainingDays) {
    this._id = staffId ? new ObjectId(staffId) : null;
    this.companyId = companyId;
    this.name = name;
    this.imageUrl = imageUrl;
    this.annualLeave = annualLeave;
    this.salaryScale = salaryScale;
    this.status = status;

    this.dateTimekeeping = dateTimekeeping;
    this.dataId = dataId;
    this.workplace = workplace;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.workHours = workHours;
    
    this.dateLeave = dateLeave;
    this.hoursOff = hoursOff;
    this.reason = reason;
    this.remainingDays = remainingDays;
  }

  checkin(){return new Promise((resolve, reject) => {
    const db = getDb();
    db.collection('timekeepings').findOne({_id: this._id, "timekeeping.date": this.dateTimekeeping}).then(staff => { 
      // Nếu không tìm được đúng staff + ngày chấm công thì tạo array = [id,date,data,workHours] rồi cập nhật timekeeping bằng array vừa tạo
      if(!staff) {
        const newStaffTk = {
          "dateId": new ObjectId(null), 
          "date": this.dateTimekeeping, 
          "data": [{"dataId": new ObjectId(null), "workplace": this.workplace, "timeStart": this.timeStart, "timeEnd": this.timeEnd, "workHours": this.workHours}]
        };
        db.collection('timekeepings').updateOne( {_id: this._id },{$set: {"status": this.status},$push: {"timekeeping": newStaffTk}} );
        // cập nhật luôn status các trang khác
        db.collection('staffs').updateOne({_id: this._id },{$set: {"status": this.status}});
        db.collection('workinghours').updateOne({_id: this._id },{$set: {"status": this.status}});
        db.collection('covids').updateOne({_id: this._id },{$set: {"status": this.status}});
        resolve();
      }
      //Nếu tìm được đúng staff + ngày chấm công thì kiểm tra xem đã checkout chưa 
      else {
        // nếu chưa thì ném lỗi
        if (staff.status == "Đang làm việc") {reject(new Error('Vui lòng checkout trước khi checkin mới!'))}
        // nếu rồi push một array là dữ liệu checkin mới vào timekeeping.data đã có
        else {
          db.collection('timekeepings').updateOne({_id: this._id, "timekeeping.date": this.dateTimekeeping},{$set: {"status": this.status},
          $push: {"timekeeping.$.data": {"dataId": new ObjectId(null), "workplace": this.workplace, "timeStart": this.timeStart, "timeEnd": this.timeEnd,"workHours": this.workHours}}});
          // cập nhật luôn status các trang khác
          db.collection('staffs').updateOne({_id: this._id },{$set: {"status": this.status}});
          db.collection('workinghours').updateOne({_id: this._id },{$set: {"status": this.status}});
          db.collection('covids').updateOne({_id: this._id },{$set: {"status": this.status}});
        }
        resolve();
      }
    })}).catch(error => console.log(error));
  }
  
  checkout(){return new Promise((resolve, reject) => {
    const db = getDb();
    db.collection('timekeepings').findOne({ _id: this._id, "timekeeping.date": this.dateTimekeeping}).then(staff => { 
      // Nếu không tìm được đúng staff + ngày chấm công thì báo lỗi chưa checkin vì nếu đã checkin sẽ tạo timekeeping chứa date
      if(!staff) {reject(new Error('Bạn chưa checkin trong ngày hiện tại, vui lòng checkin trước!'))}
      //Nếu tìm được đúng staff + ngày chấm công thì kiểm tra xem đã checkout chưa
      else {
        // nếu chưa thì ném lỗi
        if (staff.status == "Không làm việc" || staff.status == "--") {reject(new Error('Vui lòng checkin trước khi checkout mới!'))}
        // nếu rồi push một array là dữ liệu checkout mới vào timekeeping.data đã có
        else {
          db.collection('timekeepings').updateOne({_id: this._id},{$set: {"status": this.status, "timekeeping.$[i].data.$[j].timeEnd": this.timeEnd,"timekeeping.$[i].data.$[j].workHours": this.workHours}}, {arrayFilters: [{"i.date": this.dateTimekeeping},{"j.dataId": ObjectId(this.dataId)}]} );
          // cập nhật luôn status các trang khác
          db.collection('staffs').updateOne({_id: this._id },{$set: {"status": this.status}});      
          db.collection('workinghours').updateOne({_id: this._id },{$set: {"status": this.status}});
          db.collection('covids').updateOne({_id: this._id },{$set: {"status": this.status}});
        }
        resolve();
      }
    })}).catch(error => console.log(error));
  }

  registryLeave(){return new Promise((resolve, reject) => {
    const db = getDb();
    db.collection('timekeepings').findOne({_id: this._id}).then(() => { 
      const newStaffLeave = {
        "dataId": new ObjectId(null),
        "dateLeave": this.dateLeave, 
        "hoursOff": this.hoursOff, 
        "reason": this.reason, 
        "remainingDays": this.remainingDays
      };
      db.collection('timekeepings').updateOne( {_id: this._id },{$push: {"staffAnnualLeave": newStaffLeave}} );
      resolve();
    })}).catch(error => console.log(error));
  }

  //method load data de hien thi danh sach staff trong database timekeepings
  static fetchAll() {
    const db = getDb();
    return db.collection('timekeepings').find().toArray()
      .then(staffs => {return staffs})
      .catch(err => console.log(err));
  }

  //method find companyId de hien thi giao dien checkin, checkout theo companyId
  static findById(companyId) {
    const db = getDb();
    return db.collection('timekeepings').findOne({ companyId: companyId })
      .then(staff => {return staff})
      .catch(err => console.log(err));
  }
  
}

module.exports = Staff;