const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongodb.ObjectId;

class Covid {
  constructor(staffId, companyId, name, imageUrl, bodyTemperature, dateTemperature, dateFirstVaccine, firstVaccine, dateSecondVaccine, secondVaccine, datePositive, treatmentPlace, treatmentTime) {
    this._id = staffId ? new ObjectId(staffId) : null;
    this.companyId = companyId;
    this.name = name;
    this.imageUrl = imageUrl;

    this.bodyTemperature = bodyTemperature;
    this.dateTemperature = dateTemperature;

    this.dateFirstVaccine = dateFirstVaccine;
    this.firstVaccine = firstVaccine;
    this.dateSecondVaccine = dateSecondVaccine;
    this.secondVaccine = secondVaccine;

    this.datePositive = datePositive;
    this.treatmentPlace = treatmentPlace;
    this.treatmentTime = treatmentTime;
  }

  updateBodyTemp() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.collection('covids').findOne({ _id: this._id}).then(staff => {
        let oldStaffTemp = staff.staffTemp ? staff.staffTemp : [];
        const newStaffTemp = oldStaffTemp.concat([{"_id": new ObjectId(null), "bodyTemp": this.bodyTemperature, "dateTemp": this.dateTemperature}] );

        db.collection('covids').updateOne({_id: this._id },{$set:{"staffTemp": newStaffTemp}});
        resolve();
      })
      
    }).catch(error => console.log(error));
  }

  updateVaccine() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      const newStaffVaccine = {"_id": new ObjectId(null),"dateVac_1": this.dateFirstVaccine, "Vac_1":this.firstVaccine, "dateVac_2": this.dateSecondVaccine, "Vac_2":this.secondVaccine};

      db.collection('covids').updateOne({_id: this._id },{$set: {"staffVaccine": newStaffVaccine}});
      resolve();
    }).catch(error => console.log(error));
  }

  updatePositive() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.collection('covids').findOne({ _id: this._id}).then(staff => {
        let oldStaffPos = staff.staffPositive ? staff.staffPositive : [];
        const newStaffPos = oldStaffPos.concat([{"_id": new ObjectId(null), "datePositive": this.datePositive, "treatmentPlace": this.treatmentPlace, "treatmentTime": this.treatmentTime}]);

        db.collection('covids').updateOne({_id: this._id },{$set:{"staffPositive": newStaffPos}});
        resolve();
      })    
    }).catch(error => console.log(error));
  }

  //method load data de hien thi danh sach staff trong database covids
  static fetchAll() {
    const db = getDb();
    return db.collection('covids').find().toArray()
      .then(staffs => {return staffs})
      .catch(err => console.log(error));
  }
  //method find companyId de hien thi giao dien body temperature, vaccine, positive theo companyId
  static findById(companyId) {
    const db = getDb();
    return db.collection('covids').findOne({ companyId: companyId })
      .then(staff => {return staff})
      .catch(err => console.log(err));
  }

}

module.exports = Covid;