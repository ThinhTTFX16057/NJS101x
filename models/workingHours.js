const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class WorkingHours {
    constructor(staffId, companyId, name, imageUrl, annualLeave, salaryScale, details, total, salary) {
        this._id = staffId ? new ObjectId(staffId) : null;
        this.companyId = companyId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.annualLeave = annualLeave;
        this.salaryScale = salaryScale;

        this.details = details;
        this.total = total;
        this.salary = salary;

    }
    // update data details, total, and salary 
    updateData(){return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection('workinghours').updateOne({companyId: this.companyId},{$set: {"details": this.details, "total": this.total, "salary": this.salary}});
        resolve();
        }).catch(error => console.log(error));
    }
    // update data details, total, and salary 
    searchData(){return new Promise((resolve, reject) => {
        const db = getDb();
        db.collection('workinghours').updateOne({companyId: this.companyId},{$set: {"search": {"_id": new ObjectId(this._id), "companyId": this.companyId,  "name": this.name, "imageUrl": this.imageUrl, "annualLeave": this.annualLeave, "salaryScale": this.salaryScale, "details": this.details, "total": this.total, "salary": this.salary}}});
        resolve();
        }).catch(error => console.log(error));
    }
    static fetchAll() {
        const db = getDb();
        return db.collection('workinghours').find().toArray()
            .then(staffs => {return staffs})
            .catch(err => console.log(err));
    }

    //method find companyId de hien thi giao dien getinfo va getsalary
    static findById(companyId) {
        const db = getDb();
        return db.collection('workinghours').findOne({ companyId: companyId })
            .then(staff => {return staff})
            .catch(err => console.log(err));
    }

}

module.exports = WorkingHours;