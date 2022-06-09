const Covid = require('../models/covid');

//MENU:  COVID --> fetch staff
exports.getStaff = (req, res) =>{
  Covid.fetchAll().then((staffs)=>{res.render('covid/covid', {
    pageTitle: 'Thông tin COVID',
    path: '/covid',
    staffs: staffs
  })}).catch(err => console.log(err));
};

//MENU:  COVID --> body temperature
exports.getBodyTemperature = (req, res) => {
  const companyId = req.params.companyId;
  Covid.findById(companyId).then(staff => {
    if(!staff.staffTemp){res.render('covid/bodytemp', {
      pageTitle: 'Thông tin thân nhiệt',
      path: '/covid',
      staff: staff,
      data: false //Dont show history
    })}
    else {res.render('covid/bodytemp', {
      pageTitle: 'Thông tin thân nhiệt',
      path: '/covid',
      staff: staff,
      data: true //Show history
    })}})
    .catch(err => console.log(err));
  };
exports.postBodyTemperature = (req, res) => {
    const staffId = req.body.staffId
    const companyId = req.body.companyId;
    const bodyTemperature = req.body.bodyTemperature;
    const dateTemperature = req.body.dateTemperature;

    const updatedStaff = new Covid(staffId, null, null, null, bodyTemperature, dateTemperature, null, null, null, null, null, null, null);

    updatedStaff.updateBodyTemp() // update dữ liệu "staffTemp"
      .then(() => {res.redirect(`/covid/viewbodytemp/${companyId}`)})
      .catch(err => console.log(err));
  };
exports.getViewBodyTemp = (req, res) => {
  const companyId = req.params.companyId;
  Covid.findById(companyId).then(staff => {
  if(!staff.staffTemp){res.render('covid/bodytemp', {
    pageTitle: 'Thông tin thân nhiệt',
    path: '/covid',
    staff: staff,
    data: false //Dont show history
  })}
  else {res.render('covid/bodytemp', {
    pageTitle: 'Thông tin thân nhiệt',
    path: '/covid',
    staff: staff,
    data: true //Show history
  })}})
  .catch(err => console.log(err));
};


//MENU:  COVID --> vaccine
exports.getVaccine = (req, res) => {
  const companyId = req.params.companyId;
  Covid.findById(companyId).then(staff => {
    if(!staff.staffVaccine){res.render('covid/vaccine', {
      pageTitle: 'Thông tin tiêm vaccine',
      path: '/covid',
      staff: staff,
      data: false //Dont show history
    })}
    else {res.render('covid/vaccine', {
      pageTitle: 'Thông tin tiêm vaccine',
      path: '/covid',
      staff: staff,
      data: true //Show history
    })}
  })
};
exports.postVaccine = (req, res) => {
  const staffId = req.body.staffId
  const companyId = req.body.companyId;
  const dateFirstVaccine = req.body.dateFirstVaccine;
  const firstVaccine = req.body.firstVaccine;
  const dateSecondVaccine = req.body.dateSecondVaccine;
  const secondVaccine = req.body.secondVaccine;

  const updatedStaff = new Covid(staffId, null, null, null, null, null, dateFirstVaccine, firstVaccine, dateSecondVaccine, secondVaccine, null, null, null);

  updatedStaff.updateVaccine()// update dữ liệu "staffVaccine"
    .then(() => {res.redirect(`/covid/viewvaccine/${companyId}`)})
    .catch(err => console.log(err));
}; 
exports.getViewVaccine = (req, res) => {
  const companyId = req.params.companyId;
  Covid.findById(companyId).then(staff => {
  if(!staff.staffVaccine){res.render('covid/vaccine', {
    pageTitle: 'Thông tin tiêm vaccine',
    path: '/covid',
    staff: staff,
    data: false //Dont show history
  })}
  else {res.render('covid/vaccine', {
    pageTitle: 'Thông tin tiêm vaccine',
    path: '/covid',
    staff: staff,
    data: true //Show history
  })}
})
};



//MENU:  COVID --> positive
exports.getPositive = (req, res) => {
  const companyId = req.params.companyId
  Covid.findById(companyId)
    .then(staff =>{
      if (!staff.staffPositive) {res.render('covid/positive', {
        pageTitle: 'Đăng kí dương tính COVID',
        path: '/covid',
        staff: staff,
        data: false //Dont show history
      })}
      else {res.render('covid/positive', {
        pageTitle: 'Đăng kí dương tính COVID',
        path: '/covid',
        staff: staff,
        data: true //Show history
      })}
    })
};
exports.postPositive = (req, res) => {
  const staffId = req.body.staffId
  const companyId = req.body.companyId;
  const datePositive = req.body.datePositive;
  const treatmentPlace = req.body.treatmentPlace;
  const treatmentTime = req.body.treatmentTime;

  const updatedStaff = new Covid(staffId, null, null, null, null, null, null, null, null, null, datePositive, treatmentPlace, treatmentTime);
  
  updatedStaff.updatePositive()// update dữ liệu "staffPositive"
    .then(() => {res.redirect(`/covid/viewpositive/${companyId}`)})
    .catch(err => console.log(err));
};
exports.getViewPositive = (req, res) => {
  const companyId = req.params.companyId;
  Covid.findById(companyId).then(staff => {
  if (!staff.staffPositive) {res.render('covid/positive', {
    pageTitle: 'Đăng kí dương tính COVID',
    path: '/covid',
    staff: staff,
    data: false //Dont show history
  })}
  else {res.render('covid/positive', {
    pageTitle: 'Đăng kí dương tính COVID',
    path: '/covid',
    staff: staff,
    data: true //Show history
  })}
})
};