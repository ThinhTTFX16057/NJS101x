const Staff = require('../models/timekeeping');
const StaffInfo = require('../models/info');
const moment = require('moment');
const daterange = require('daterange');

//MENU:  TIMEKEEPING --> fetch staff
exports.getStaff = (req, res) =>{
  StaffInfo.fetchAll()
  .then(staffs=>{
    res.render('timekeeping/timekeeping', {
      pageTitle: 'Chấm công',
      display: true,
      path: '/timekeeping',
      staffs: staffs,
    })
  })
}


//MENU:  TIMEKEEPING --> checkin
exports.getCheckIn = (req, res) => {
  const companyId = req.params.companyId;
  Staff.findById(companyId)
    .then(staff => {
      if(!staff){StaffInfo.findById(companyId)
        .then(staff=>{
          res.render('timekeeping/checkIn', {
            pageTitle: 'Điểm danh',
            display: true,
            path: '/timekeeping',
            staff: staff,
            data: false,
            exit: false
          });
        })
      }
      else {
        res.render('timekeeping/checkIn', {
          pageTitle: 'Điểm danh',
          display: true,
          path: '/timekeeping',
          staff: staff,
          data: true,
          exit: false
        });
      }
    })
};

exports.postCheckIn = (req, res) => {
  const staffId = req.body.staffId;
  const companyId = req.body.companyId;
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const annualLeave = req.body.annualLeave;
  const salaryScale = req.body.salaryScale;
  const status = "Đang làm việc";
  const dateTimekeeping = moment().format("L");
  const dataId = req.body.dataId;
  const workplace = req.body.workplace;

  const timeStart = moment().format('HH:mm:ss');
  const workHours = 0;

  const updatedStaff = new Staff(staffId, companyId, name, imageUrl, annualLeave, salaryScale, status, dateTimekeeping, dataId, workplace, timeStart, null, workHours, null, null, null, null);

  Staff.findById(companyId)
      .then((staff)=>{
        // chưa có thông tin tại DB timekeepings (vì chưa chấm công lần nào) thì tạo mới
        if (!staff) {return updatedStaff.save()}
        else {return staff}
      })
      .then(() => {return updatedStaff.checkin()})
      .then(() => {res.redirect(`/timekeeping/viewcheckin/${companyId}`)})
};
exports.getViewCheckIn = (req, res) =>{
  const companyId = req.params.companyId;
  Staff.findById(companyId).then((staff)=>{
    console.log(staff)
    res.render('timekeeping/checkIn', {
      pageTitle: 'Điểm danh',
      display: true,
      path: '/timekeeping',
      staff: staff,
      data: true,
      exit: true
    });
  })
}

//MENU:  TIMEKEEPING --> checkout
exports.getCheckOut = (req, res) => {
  const companyId = req.params.companyId;
  Staff.findById(companyId)
  .then(staff => {
    if(!staff) {StaffInfo.findById(companyId)
      .then(staff=>{
        res.render('timekeeping/checkOut', {
          pageTitle: 'Điểm danh',
          display: true,
          path: '/timekeeping',
          staff: staff,
          data: false,
          exit: false
        });
      })
    }
    else {
      res.render('timekeeping/checkOut', {
        pageTitle: 'Kết thúc làm',
        display: true,
        path: '/timekeeping',
        staff: staff,
        data: true,
        exit: false
      });
    }
  })
};

exports.postCheckOut = (req, res) => {
  const staffId = req.body.staffId;
  const companyId = req.body.companyId;
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const status = "Không làm việc";
  const dateTimekeeping = moment().format("L");
  const dataId = req.body.dataId;

  const timeEnd = moment().format('HH:mm:ss');
  const workHours = moment.duration(moment(timeEnd, 'HH:mm:ss').diff( moment(req.body.timeStart, 'HH:mm:ss') )).asHours()
  
  const updatedStaff = new Staff(staffId, companyId, name, imageUrl, null, null, status, dateTimekeeping, dataId, null, null, timeEnd, workHours, null, null, null, null);

  Staff.findById(companyId).then(() => {return updatedStaff.checkout()}).then(() => {res.redirect(`/timekeeping/viewcheckout/${companyId}`)})
};
exports.getViewCheckOut = (req, res) =>{
  const companyId = req.params.companyId;
  Staff.findById(companyId).then((staff)=>{
    console.log(staff)
    res.render('timekeeping/checkOut', {
      pageTitle: 'Điểm danh',
      display: true,
      path: '/timekeeping',
      staff: staff,
      data: true,
      exit: true
    });
  })
}

//MENU:  TIMEKEEPING --> leave
exports.getLeave = (req, res) => {
  const companyId = req.params.companyId
  Staff.findById(companyId)
    .then(staff =>{
      if (!staff) {
        StaffInfo.findById(companyId).then(staff=>{
          res.render('timekeeping/leave', {
            pageTitle: 'Nghỉ phép',
            display: true,
            path: '/timekeeping',
            staff: staff,
            data: false,
            error: false
          });
        })
      }
      else {
        res.render('timekeeping/leave', {
          pageTitle: 'Nghỉ phép',
          display: true,
          path: '/timekeeping',
          staff: staff,
          data: true,
          error: false
        });
      }
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

  const updatedStaff = new Staff(staffId, companyId, name, imageUrl, annualLeave, salaryScale, null, null, null, null, null, null, null, dateLeave, hoursOff, reason, remainingDays);

  Staff.findById(companyId)
    .then(staff =>{
      // chưa có thông tin tại DB timekeepings (vì chưa chấm công lần nào) thì tạo mới
      if (!staff) {updatedStaff.save()}
      else {return staff}
    })
    .then(() =>{
      // Kiểm tra ngày bắt đầu nghỉ phải <= ngày kết thúc nghỉ
      if (new Date(req.body.startLeave)>new Date(req.body.endLeave)) { 
        Staff.findById(companyId)
        .then((staff) => {
          res.render('timekeeping/leave', {
            pageTitle: 'Nghỉ phép',
            display: true,
            path: '/timekeeping',
            staff: staff,
            data: true,
            error: 'Ngày bắt đầu > Ngày kết thúc!'
          });
        })
      }
      // Kiểm tra số ngày đăng kí nghỉ có vượt quá số ngày phép còn lại không
      else if (remainingDays<=0) {
        Staff.findById(companyId)
        .then(staff =>{
          res.render('timekeeping/leave', {
            pageTitle: 'Nghỉ phép',
            display: true,
            path: '/timekeeping',
            staff: staff,
            data: true,
            error: 'Số giờ đăng kí nghỉ vượt quá số giờ phép còn lại!'
          });
        })
      }
      // Nếu không có lỗi nhập liệu, tiến hành update dữ liệu
      else {Staff.findById(companyId).then(() => { updatedStaff.registryLeave()}).then(() => {res.redirect('/timekeeping')})}
    })
  };