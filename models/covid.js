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

  save() {
    const db = getDb();
    return db
      .collection('covids')
      .insertOne({
        "_id": this._id,
        "companyId": this.companyId,
        "name": this.name,
        "imageUrl": this.imageUrl,
        "staffTemp": [],
        "staffVaccine": null,
        "staffPositive": []
      });
  }
  updateBodyTemp() {
    const db = getDb();
    db.collection('covids').findOne({ _id: this._id}).then(staff => {
      let oldStaffTemp = staff ? staff.staffTemp : [];
      const newStaffTemp = oldStaffTemp.concat([{"_id": new ObjectId(null), "bodyTemp": this.bodyTemperature, "dateTemp": this.dateTemperature}] );

      return db.collection('covids')
        .updateOne({_id: this._id },{$set:{"staffTemp": newStaffTemp}
      });
    })    
  }
  updateVaccine() {
    const db = getDb();
    const newStaffVaccine = {"_id": new ObjectId(null),"dateVac_1": this.dateFirstVaccine, "Vac_1":this.firstVaccine, "dateVac_2": this.dateSecondVaccine, "Vac_2":this.secondVaccine};

    return db.collection('covids')
      .updateOne({_id: this._id },{$set: {"staffVaccine": newStaffVaccine}
    });

  }
  updatePositive() {
    const db = getDb();
    db.collection('covids').findOne({ _id: this._id}).then(staff => {
      let oldStaffPos = staff ? staff.staffPositive : [];
      const newStaffPos = oldStaffPos.concat([{"_id": new ObjectId(null), "datePositive": this.datePositive, "treatmentPlace": this.treatmentPlace, "treatmentTime": this.treatmentTime}]);

      return db.collection('covids')
        .updateOne({_id: this._id },{$set:{"staffPositive": newStaffPos}
      });
    })    
  }
  
  static findById(companyId) {
    const db = getDb();
    return db
      .collection('covids')
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
      .collection('covids')
      .deleteOne({ companyId: companyId })
      .catch(err => console.log(err));
  }
}

module.exports = Covid;