const Covid = require('../models/covid');
const StaffInfo = require('../models/info');

//MENU:  COVID --> fetch staff
exports.getStaff = (req, res) =>{
  StaffInfo.fetchAll()
    .then((staffs)=>{
      res.render('covid/covid', {
        pageTitle: 'Thông tin COVID',
        display: true,
        path: '/covid',
        staffs: staffs
      });
    })
    .catch(err => console.log(err));
};

//MENU:  COVID --> body temperature
exports.getBodyTemperature = (req, res) => {
  const companyId = req.params.companyId;
  Covid.findById(companyId)
    .then(staff => {
      if(!staff){StaffInfo.findById(companyId)
        .then(staff=>{
          res.render('covid/bodytemp', {
            pageTitle: 'Thông tin thân nhiệt',
            display: true,
            path: '/covid',
            staff: staff,
            data: false
          });
        })
      }
      else {
        res.render('covid/bodytemp', {
          pageTitle: 'Thông tin thân nhiệt',
          display: true,
          path: '/covid',
          staff: staff,
          data: true
        });
      }
    })
    .catch(err => console.log(err));
  };
exports.postBodyTemperature = (req, res) => {
    const staffId = req.body.staffId
    const companyId = req.body.companyId;
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;

    const bodyTemperature = req.body.bodyTemperature;
    const dateTemperature = req.body.dateTemperature;

    const updatedStaff = new Covid(staffId, companyId, name, imageUrl, bodyTemperature, dateTemperature, null, null, null, null, null, null, null);

    Covid.findById(companyId)
      .then((staff)=>{
        if (!staff) {updatedStaff.save()} // chưa có thông tin tại DB Covid thì tạo mới
        else {return staff}
      })
      .then(()=>{updatedStaff.updateBodyTemp()}) // update dữ liệu "staffTemp"})
      .then(() => {res.redirect('/covid')})
      .catch(err => console.log(err));
  };

//MENU:  COVID --> vaccine
exports.getVaccine = (req, res) => {
  const companyId = req.params.companyId;
  Covid.findById(companyId)
  .then(staff => {
    if(!staff){StaffInfo.findById(companyId)
      .then(staff=>{
        res.render('covid/vaccine', {
          pageTitle: 'Thông tin tiêm vaccine',
          display: true,
          path: '/covid',
          staff: staff,
          data: false
        });
      })
    }
    else {
      res.render('covid/vaccine', {
        pageTitle: 'Thông tin tiêm vaccine',
        display: true,
        path: '/covid',
        staff: staff,
        data: true
      });
    }
  })
};
exports.postVaccine = (req, res) => {
  const staffId = req.body.staffId
  const companyId = req.body.companyId;
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;

  const dateFirstVaccine = req.body.dateFirstVaccine;
  const firstVaccine = req.body.firstVaccine;
  const dateSecondVaccine = req.body.dateSecondVaccine;
  const secondVaccine = req.body.secondVaccine;

  const updatedStaff = new Covid(staffId, companyId, name, imageUrl, null, null, dateFirstVaccine, firstVaccine, dateSecondVaccine, secondVaccine, null, null, null);

  Covid.findById(companyId)
    .then((staff)=>{
      if (!staff) {updatedStaff.save()} // chưa có thông tin tại DB Covid thì tạo mới
      else {return staff}
    })
    .then(()=>{updatedStaff.updateVaccine()})// update dữ liệu "staffVaccine"
    .then(() => {res.redirect('/covid')})
    .catch(err => console.log(err));
}; 

//MENU:  COVID --> positive
exports.getPositive = (req, res) => {
  const companyId = req.params.companyId
  Covid.findById(companyId)
    .then(staff =>{
      if (!staff) {
        StaffInfo.findById(companyId).then(staff=>{
          res.render('covid/positive', {
            pageTitle: 'Thông tin dương tính với Covid',
            display: true,
            path: '/covid',
            staff: staff,
            data: false
          });
        })
      }
      else {
        res.render('covid/positive', {
          pageTitle: 'Thông tin dương tính với Covid',
          display: true,
          path: '/covid',
          staff: staff,
          data: true
        });
      }
    })
    .catch(err => console.log(err));
};
exports.postPositive = (req, res) => {
  const staffId = req.body.staffId
  const companyId = req.body.companyId;
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;

  const datePositive = req.body.datePositive;
  const treatmentPlace = req.body.treatmentPlace;
  const treatmentTime = req.body.treatmentTime;

  const updatedStaff = new Covid(staffId, companyId, name, imageUrl, null, null, null, null, null, null, datePositive, treatmentPlace, treatmentTime);
  
  Covid.findById(companyId)
    .then((staff)=>{
      if (!staff) {updatedStaff.save()} // chưa có thông tin tại DB Covid thì tạo mới
      else {return staff}
    })
    .then(()=>{updatedStaff.updatePositive()})// update dữ liệu "staffPositive"
    .then(() => {res.redirect('/covid')})
    .catch(err => console.log(err));
};