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

  save() {
    const db = getDb();
    return db
      .collection('timekeepings')
      .insertOne({
        "_id": this._id,
        "companyId": this.companyId,
        "name": this.name,
        "imageUrl": this.imageUrl,
        "annualLeave": this.annualLeave,
        "salaryScale": this.salaryScale,
        "status": "--"
        // "timekeeping": [ {dateId, date, data: [{dataId, workplace, timeStart, timeEnd}, {...}] , totalWorkHours}, {...} ]
        // "staffAnnualLeave": [ {dataId, dateLeave, hoursOff, reason, remainingDays}, {...} ]
      });
  }

  checkin(){
    const db = getDb();
    db.collection('timekeepings')
      .findOne({_id: this._id, "timekeeping.date": this.dateTimekeeping})
      .then(staff => { 
        
        // Nếu không tìm được đúng staff hoặc đúng ngày chấm công thì tạo array = [id,date,data,totalWorkHours] rồi cập nhật timekeeping bằng array vừa tạo
        if(!staff) {
          const newStaffTk = 
            {
              "dateId": new ObjectId(null), 
              "date": this.dateTimekeeping, 
              "data": [{"dataId": new ObjectId(null), "workplace": this.workplace, "timeStart": this.timeStart, "timeEnd": this.timeEnd,
              "workHours": this.workHours}]
            };
          db.collection('timekeepings')
            .updateOne( {_id: this._id },{$set: {"status": this.status},$push: {"timekeeping": newStaffTk}} );
          db.collection('staffs').updateOne({_id: this._id },{$set: {"status": this.status}})
        }
        //Nếu tìm được đúng staff và đúng ngày chấm công thì kiểm tra xem đã checkout chưa, nếu rồi push một array là dữ liệu checkin mới vào timekeeping.data đã có
        else {
          if (staff.status == "Đang làm việc") {return console.log('Vui lòng checkout trước khi checkin mới')}
          else {
            db.collection('timekeepings').updateOne(
            {_id: this._id, "timekeeping.date": this.dateTimekeeping},
            {$set: {"status": this.status},
            $push: {"timekeeping.$.data": {"dataId": new ObjectId(null), "workplace": this.workplace, "timeStart": this.timeStart, "timeEnd": this.timeEnd,"workHours": this.workHours}}});
            db.collection('staffs').updateOne({_id: this._id },{$set: {"status": this.status}})
          }
        }
      })
  }
  
  checkout(){
    const db = getDb();
    db.collection('timekeepings')
      .findOne({ _id: this._id, "timekeeping.date": this.dateTimekeeping})
      .then(staff => { 
        // Nếu không tìm được đúng staff + ngày chấm công thì báo lỗi chưa checkin vì một khi đã checkin sẽ được tạo timekeeping là  "date":___, "data": [{"workplace":___, "timeStart":___, "timeEnd":___, "workHours":___}]
        if(!staff) {
          return console.log('Bạn chưa checkin trong ngày hiện tại, vui lòng checkin trước')
        }
        //Nếu tìm được đúng staff + ngày chấm công thì kiểm tra xem đã checkout chưa, nếu rồi push một array là dữ liệu checkin mới vào timekeeping.data đã có
        else {
          if (staff.status == "Không làm việc" || staff.status == "--") {return console.log('Vui lòng checkin trước khi checkout mới')}
          else {db.collection('timekeepings').updateOne(
              {_id: this._id},
              {$set: {"status": this.status, "timekeeping.$[i].data.$[j].timeEnd": this.timeEnd,"timekeeping.$[i].data.$[j].workHours": this.workHours}}, 
              {arrayFilters: [{"i.date": this.dateTimekeeping},{"j.dataId": ObjectId(this.dataId)}]} );
              db.collection('staffs').updateOne({_id: this._id },{$set: {"status": this.status}})
          }
        }
      })
  }

  registryLeave(){
      const db = getDb();
      db.collection('timekeepings')
        .findOne({_id: this._id})
        .then(() => { 
          const newStaffLeave = 
            {
              "dataId": new ObjectId(null),
              "dateLeave": this.dateLeave, "hoursOff": this.hoursOff, "reason": this.reason, "remainingDays": this.remainingDays
            }
          return db.collection('timekeepings')
            .updateOne( {_id: this._id },{$push: {"staffAnnualLeave": newStaffLeave}} );
        })

  }

  //method load data de hien thi danh sach staff trong database timekeepings
  static fetchAll() {
    const db = getDb();
    return db
      .collection('timekeepings')
      .find()
      .toArray()
      .then(staffs => {
        return staffs;
      })
      .catch(err => console.log(err));
  }

  //method find staffId de hien thi giao dien checkin, checkout theo staffId
  static findById(companyId) {
    const db = getDb();
    return db
      .collection('timekeepings')
      .findOne({ companyId: companyId })
      .then(staff => {
        return staff;
      })
      .catch(err => console.log(err));
  }
  
  //method delete theo staffId
  static deleteById(companyId) {
    const db = getDb();
    return db
      .collection('timekeepings')
      .deleteOne({ companyId: companyId })
      .catch(err => console.log(err));
  }
}

module.exports = Staff;