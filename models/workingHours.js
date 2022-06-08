const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class WorkingHours {
    constructor(staffId, companyId, name, imageUrl, annualLeave, salaryScale, details, total) {
        this._id = staffId;
        this.companyId = companyId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.annualLeave = annualLeave;
        this.salaryScale = salaryScale;

        this.details = details;
        this.total = total;
    }

    //method get data tu database timekeeping de update len database workinghours
    static getDataTimekeepingByCompanyId(companyId){
        const db = getDb();
        return db
        .collection('timekeepings')
        .findOne({ companyId: companyId })
        .then(staff =>{return staff})
        .catch(err => console.log(err));
        
    }

    //method save and upload data
    save(){
        const db = getDb();
        return db.collection('workinghours')
        .insertOne({"_id": new ObjectId(this._id), "companyId": this.companyId,
        "name": this.name,
        "imageUrl": this.imageUrl,
        "annualLeave": this.annualLeave,
        "salaryScale": this.salaryScale})
    }
    updateData(){
        const db = getDb();
        return db.collection('workinghours')
        .updateOne({companyId: this.companyId},{$set: {
        "details": this.details, 
        "total": this.total}})
    }
    
    //method load data de hien thi danh sach staff trong database workinghours
    static fetchAll() {
        const db = getDb();
        return db
        .collection('workinghours')
        .find()
        .toArray()
        .then(staffs => {
            return staffs;
        })
        .catch(err => console.log(err));
    }

    //method find staffId de hien thi giao dien getinfo va getsalary
    static findById(companyId) {
        const db = getDb();
        return db
        .collection('workinghours')
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
        .collection('workinghours')
        .deleteOne({ companyId: companyId })
        .catch(err => console.log(err));
    }
}

module.exports = WorkingHours;