const StaffInfo = require('../models/info');
const Staff = require('../models/timekeeping');
const Covid = require('../models/covid');
const WorkingHours = require('../models/workingHours');

//MENU:  STAFFINFO --> fetch staff
exports.getStaff = (req, res) =>{
  StaffInfo.fetchAll()
    .then(staffs => {
      res.render('info/staffInfo', {
        pageTitle: 'Thông tin nhân viên',
        display: true,
        path: '/staffinfo',
        staffs: staffs,
      });
    })
    .catch(err => console.log(err));
};
//MENU:  STAFFINFO --> add staff
exports.getAddStaff = (req, res) => {
    res.render('info/addStaffInfo', {
        pageTitle: 'Thông tin nhân viên',
        display: true,
        path: '/staffinfo'
    });
  };
exports.postAddStaff = (req, res) => {
    const companyId = req.body.companyId;
    const name = req.body.name;
    const doB = req.body.doB;
    const salaryScale = req.body.salaryScale;
    const startDate = req.body.startDate;
    const department = req.body.department;
    const annualLeave = req.body.annualLeave;
    const imageUrl = req.body.imageUrl;
    const status = '--';

    const product = new StaffInfo(null, companyId, name, doB, salaryScale, startDate, department, annualLeave, imageUrl, status);
    product
      .save()
      .then(() => {
        res.redirect('/');
      })
      .catch(err => console.log(err));
  };

//MENU:  STAFFINFO --> edit staff
exports.getEditStaff = (req, res) => {
  const companyId = req.params.companyId
  StaffInfo.findById(companyId)
    .then(staff =>{
      if (!staff) {return console.log('No staff found!')}
      res.render('info/editStaffInfo', {
        pageTitle: 'Thông tin nhân viên',
        display: true,
        path: '/staffinfo',
        staff: staff,
      });
    })
    .catch(err => console.log(err));
};
exports.postEditStaff = (req, res) => {
  //Các req.body dưới đây ko được lấy vì input là disabled
  const companyId = req.body.companyId;
  const name = req.body.name;
  const doB = req.body.doB;
  const salaryScale = req.body.salaryScale;
  const startDate = req.body.startDate;
  const department = req.body.department;
  const annualLeave = req.body.annualLeave;
  //Các req.body dưới đây được lấy từ input
  const staffId = req.body.staffId;
  const imageUrl = req.body.imageUrl;
  const staff = new StaffInfo(staffId, companyId, name, doB, salaryScale, startDate, department, annualLeave, imageUrl);
  staff.save()
    .then(()=>{
      res.redirect('/');
    })
    .catch(err => console.log(err));
};
//MENU:  STAFFINFO --> delete staff
exports.postDeleteStaff = (req, res) => {
  const companyId = req.body.companyId;
  StaffInfo.deleteById(companyId)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
};