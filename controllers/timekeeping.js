const Staff = require('../models/timekeeping');
const moment = require('moment');
const daterange = require('daterange');

//MENU:  TIMEKEEPING --> fetch staff
exports.getStaff = (req, res) =>{
  Staff.fetchAll().then(staffs=>{res.render('timekeeping/timekeeping', {
    pageTitle: 'Chấm công',
    path: '/timekeeping',
    staffs: staffs
  })})
}


//MENU:  TIMEKEEPING --> checkin
exports.getCheckIn = (req, res) => {
  const companyId = req.params.companyId;
  Staff.findById(companyId).then(staff => {
    if(!staff.timekeeping){res.render('timekeeping/checkIn', {
      pageTitle: 'Điểm danh',
      path: '/timekeeping',
      staff: staff,
      data: false, //Dont show history
      exit: false // Button go to checkout
    })}
    else {res.render('timekeeping/checkIn', {
      pageTitle: 'Điểm danh',
      path: '/timekeeping',
      staff: staff,
      data: true, // Show history
      exit: false // Button go to checkout
    })}
  })
};
exports.postCheckIn = (req, res) => {
  const staffId = req.body.staffId;
  const companyId = req.body.companyId;
  const status = "Đang làm việc";
  const dateTimekeeping = moment().format("L");
  const dataId = req.body.dataId;
  const workplace = req.body.workplace;
  const timeStart = moment().format('HH:mm:ss');
  const workHours = 0;

  const updatedStaff = new Staff(staffId, companyId, null, null, null, null, status, dateTimekeeping, dataId, workplace, timeStart, null, workHours, null, null, null, null);

  updatedStaff.checkin()// update dữ liệu "timkeeping"
    .then(() => {res.redirect(`/timekeeping/viewcheckin/${companyId}`)})
    .catch(err => console.log(err));
};
exports.getViewCheckIn = (req, res) =>{
  const companyId = req.params.companyId;
  Staff.findById(companyId).then((staff)=>{res.render('timekeeping/checkIn', {
    pageTitle: 'Điểm danh',
    path: '/timekeeping',
    staff: staff,
    data: true, //Show history with last updated data
    exit: true // Button go to checkout
  })})
}

//MENU:  TIMEKEEPING --> checkout
exports.getCheckOut = (req, res) => {
  const companyId = req.params.companyId;
  Staff.findById(companyId).then(staff => {
    if(!staff.timekeeping) {res.render('timekeeping/checkOut', {
      pageTitle: 'Kết thúc làm',
      path: '/timekeeping',
      staff: staff,
      data: false, //Dont show history
      exit: false // Button go to checkin
    })} 
    else {res.render('timekeeping/checkOut', {
      pageTitle: 'Kết thúc làm',
      path: '/timekeeping',
      staff: staff,
      data: true, // Show history
      exit: false // Button go to checkin
    })}
  })
};

exports.postCheckOut = (req, res) => {
  const staffId = req.body.staffId;
  const companyId = req.body.companyId;
  const status = "Không làm việc";
  const dateTimekeeping = moment().format("L");
  const dataId = req.body.dataId;
  const timeEnd = moment().format('HH:mm:ss');
  const workHours = moment.duration(moment(timeEnd, 'HH:mm:ss').diff( moment(req.body.timeStart, 'HH:mm:ss') )).asHours();
  
  const updatedStaff = new Staff(staffId, companyId, null, null, null, null, status, dateTimekeeping, dataId, null, null, timeEnd, workHours, null, null, null, null);

  updatedStaff.checkout() // update dữ liệu "timkeeping"
    .then(() => {res.redirect(`/timekeeping/viewcheckout/${companyId}`)})
    .catch(err => console.log(err));
};
exports.getViewCheckOut = (req, res) =>{
  const companyId = req.params.companyId;
  Staff.findById(companyId).then((staff)=>{res.render('timekeeping/checkOut', {
    pageTitle: 'Kết thúc làm',
    path: '/timekeeping',
    staff: staff,
    data: true, //Show history with last updated data
    exit: true // Button go to checkin
  })})
}

//MENU:  TIMEKEEPING --> leave
exports.getLeave = (req, res) => {
  const companyId = req.params.companyId
  Staff.findById(companyId).then(staff =>{
      if (!staff.staffAnnualLeave) {res.render('timekeeping/leave', {
        pageTitle: 'Nghỉ phép',
        path: '/timekeeping',
        staff: staff,
        data: false, //Dont show history
        error: false // Dont show error
      })}
      else {res.render('timekeeping/leave', {
        pageTitle: 'Nghỉ phép',
        path: '/timekeeping',
        staff: staff,
        data: true, // Show history
        error: false // Dont show error
      })}
    })
  };

exports.postLeave = (req, res) => {
  const staffId = req.body.staffId;
  const companyId = req.body.companyId;
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const annualLeave = req.body.annualLeave;
  const salaryScale = req.body.salaryScale;
  const dateLeave = daterange.create( moment(req.body.startLeave).format('L'), moment(req.body.endLeave).format('L') );
  const hoursOff = req.body.hoursOff;
  const reason = req.body.reason;
  const remainingDays = req.body.remainingDays - ((new Date(req.body.endLeave).getTime() - new Date(req.body.startLeave).getTime())/86400000+1)*hoursOff/8;

  const updatedStaff = new Staff(staffId, companyId, null, null, annualLeave, salaryScale, null, null, null, null, null, null, null, dateLeave, hoursOff, reason, remainingDays);
    
  // Kiểm tra ngày bắt đầu nghỉ phải <= ngày kết thúc nghỉ
  if (new Date(req.body.startLeave)>new Date(req.body.endLeave)) {Staff.findById(companyId).then((staff) => {res.render('timekeeping/leave', {
    pageTitle: 'Nghỉ phép',
    path: '/timekeeping',
    staff: staff,
    data: true, // Show history
    error: 'Ngày bắt đầu > Ngày kết thúc!' // Show error
  })})}
  // Kiểm tra số ngày đăng kí nghỉ có vượt quá số ngày phép còn lại không
  else if (remainingDays<=0) 
  {Staff.findById(companyId).then(staff =>{res.render('timekeeping/leave', {
    pageTitle: 'Nghỉ phép',
    path: '/timekeeping',
    staff: staff,
    data: true, // Show history
    error: 'Số giờ đăng kí nghỉ vượt quá số giờ phép còn lại!' // Show error
  })})}
  // Nếu không có lỗi nhập liệu, tiến hành update dữ liệu
  else {updatedStaff.registryLeave()
    .then(() => {res.redirect(`/timekeeping/viewleave/${companyId}`)})
    .catch(err => console.log(err));
  }
};
exports.getViewLeave = (req, res) =>{
  const companyId = req.params.companyId;
  Staff.findById(companyId).then((staff)=>{res.render('timekeeping/leave', {
    pageTitle: 'Nghỉ phép',
    path: '/timekeeping',
    staff: staff,
    data: true, //Show history with last updated data
    error: false // Dont show error
  })})
}