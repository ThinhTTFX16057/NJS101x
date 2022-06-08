const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class StaffInfo {
  constructor(staffId, companyId, name, doB, salaryScale, startDate, department, annualLeave, imageUrl,status) {
    this._id = staffId ? new ObjectId(staffId) : null;// id tao tu dong tren mongoDB
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

  
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('staffs').updateOne({ _id: this._id }, {$set: {"imageUrl": this.imageUrl}});// method edit staff, chi cho update field: imageUrl
    } 
    else {
     dbOp = db.collection('staffs').insertOne(this);// method add staff
    }
    return dbOp.catch(err => console.log(err));
  }
  
  
  //method load data de hien thi danh sach staff trong database staffs
  static fetchAll() {
    const db = getDb();
    return db
      .collection('staffs')
      .find()
      .toArray()
      .then(staffs => {
        return staffs;
      })
      .catch(err => console.log(err));
  }

  //method find staffId de hien thi giao dien edit staff
  static findById(companyId) {
    const db = getDb();
    return db
      .collection('staffs')
      .find({ companyId: companyId })
      .next()
      .then(staff => {
        return staff;
      })
      .catch(err => console.log(err));
  }

  //method delete theo staffId
  static deleteById(companyId) {
    const db = getDb();
    return db
      .collection('staffs')
      .deleteOne({ companyId: companyId })
      .catch(err => console.log(err));
  }
}

module.exports = StaffInfo;