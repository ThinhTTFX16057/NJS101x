const StaffInfo = require('../models/info');

//MENU:  STAFFINFO --> fetch staff
exports.getStaff = (req, res) =>{
  StaffInfo.fetchAll().then(staffs => {res.render('info/staffInfo', {
    pageTitle: 'Thông tin nhân viên',
    path: '/staffinfo',
    staffs: staffs,
  })}).catch(err => console.log(err));
};


//MENU:  STAFFINFO --> add staff
exports.getAddStaff = (req, res) => {
    res.render('info/addStaffInfo', {
        pageTitle: 'Thông tin nhân viên',
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
    
    product.save().then(() => {res.redirect('/')})
  };


//MENU:  STAFFINFO --> edit staff
exports.getEditStaff = (req, res) => {
  const companyId = req.params.companyId
  StaffInfo.findById(companyId)
    .then(staff =>{
      res.render('info/editStaffInfo', {
        pageTitle: 'Thông tin nhân viên',
        path: '/staffinfo',
        staff: staff,
      });
    })
};
exports.postEditStaff = (req, res) => {
  const staffId = req.body.staffId;
  const imageUrl = req.body.imageUrl;
  const staff = new StaffInfo(staffId, null, null, null, null, null, null, null, imageUrl);
  staff.save().then(()=>{res.redirect('/')})
};


//MENU:  STAFFINFO --> delete staff
exports.postDeleteStaff = (req, res) => {
  const companyId = req.body.companyId;
  StaffInfo.deleteById(companyId).then(() => {res.redirect('/')})
};