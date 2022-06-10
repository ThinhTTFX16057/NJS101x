const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class StaffInfo {
  constructor(staffId, companyId, name, doB, salaryScale, startDate, department, annualLeave, imageUrl,status) {
    this._id = staffId ? new ObjectId(staffId) : null;
    this.companyId = companyId;// id tao tu dong bang Math.random() cho de nhin
    this.name = name;
    this.doB = doB;
    this.salaryScale = salaryScale;
    this.startDate = startDate;
    this.department = department;
    this.annualLeave = annualLeave;
    this.imageUrl = imageUrl;
    this.status = status;
  }

  // Lưu db khi tạo staff vào 4 collection covids, staffs, timekeepings, workinghours. Cho phép sửa imageUrl.
  save() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      if (this._id) {
        db.collection('covids').updateOne({ _id: this._id }, {$set: {"imageUrl": this.imageUrl}});
        db.collection('staffs').updateOne({ _id: this._id }, {$set: {"imageUrl": this.imageUrl}});
        db.collection('timekeepings').updateOne({ _id: this._id }, {$set: {"imageUrl": this.imageUrl}});
        db.collection('workinghours').updateOne({ _id: this._id }, {$set: {"imageUrl": this.imageUrl}});
        resolve();
      } 
      else {
        db.collection('covids').insertOne(this);
        db.collection('staffs').insertOne(this);
        db.collection('timekeepings').insertOne(this);
        db.collection('workinghours').insertOne(this);
        resolve();
      }
    }).catch(error => console.log(error));
  }
  
  
  //method load data de hien thi danh sach staff trong database staffs
  static fetchAll() {
    const db = getDb();
    return db.collection('staffs').find().toArray()
      .then(staffs => {return staffs})
      .catch(err => console.log(err));
  }

  //method find companyId de hien thi giao dien edit staff
  static findById(companyId) {
    const db = getDb();
    return db.collection('staffs').findOne({ companyId: companyId })
      .then(staff => {return staff})
      .catch(err => console.log(err));
  }

  //method delete theo companyId
  static deleteById(companyId) {
    const db = getDb();
    db.collection('staffs').deleteOne({ companyId: companyId });
    db.collection('covids').deleteOne({ companyId: companyId });
    db.collection('timekeepings').deleteOne({ companyId: companyId });
    db.collection('workinghours').deleteOne({ companyId: companyId });
  }
}

module.exports = StaffInfo;