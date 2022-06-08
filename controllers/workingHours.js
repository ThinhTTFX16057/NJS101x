const WorkingHours = require('../models/workingHours');
const Staff = require('../models/timekeeping');
const StaffInfo = require('../models/info');
const moment = require('moment');

//MENU:  WORKINGHOURS --> fetch staff
exports.getStaff = (req, res) =>{
  StaffInfo.fetchAll()
  .then(staffs=>{
    res.render('workingHours/workingHours', {
      pageTitle: 'Tra cứu giờ làm',
      display: true,
      path: '/workinghours',
      staffs: staffs,
    })
  })
  .catch(err => console.log(err))
}




//MENU:  WORKINGHOURS --> getinfo from Timekeeping
exports.getInfo = (req, res) => {
  const companyId = req.params.companyId;
  //Chưa có thông tin tại db workinghours thì tạo data thông tin nhân viên
  WorkingHours.findById(companyId).then((staff)=>{
    if(!staff){
      Staff.findById(companyId).then((staff)=>{
        if(!staff){
          res.render('workingHours/getInfo', {
            pageTitle: 'Tra cứu giờ làm',
            display: true,
            path: '/workinghours',
            staff: staff,
            data: false
          });
        }
        else {
          const updatedStaff = new WorkingHours(staff.staffId, staff.companyId, staff.name, staff.imageUrl, staff.annualLeave, staff.salaryScale, null, null);
        return updatedStaff.save()
        }
      })
    }
  })
  // Thêm data details và totalWorkHours
  Staff.findById(companyId).then(staff => {
    // Tạo dữ liệu details và totalWorkHours update lên db
    let details=[];
    for (let tk of staff.timekeeping){
      for (let dt of tk.data){details=details.concat({
        "date": tk.date, 
        "dateId": tk.dateId, 
        "dataId": dt.dataId,
        "workplace": dt.workplace,
        "timeStart": dt.timeStart, 
        "timeEnd": dt.timeEnd,
        "workHours": dt.workHours
        })}
    }
    // Tính tổng totalWorkHours theo ngày
    let total = [];
    for (let tk of staff.timekeeping){
      let date = tk.date
      let value = 0;
      for (let dt of tk.data)
        {value = value + parseFloat(dt.workHours)}
        total=total.concat({"date":date, "totalWorkHours":value, "totalOffHours": 0})
    }
    // Nếu có đăng kí nghỉ phép thì cập nhật hoursOff
    if(staff.staffAnnualLeave) {
      for (let tt of total){
        for (let sal of staff.staffAnnualLeave){
          if(sal.dateLeave.start<=tt.date && tt.date<=sal.dateLeave.end){
            tt.totalOffHours=parseInt(tt.totalOffHours) + parseInt(sal.hoursOff);
    }}}}
    //upload dữ liệu lên database workinghours
    const updatedStaff = new WorkingHours(staff.staffId, staff.companyId, staff.name, staff.imageUrl, staff.annualLeave, staff.salaryScale, details, total);
    return updatedStaff.updateData();  
  })    
  //Hiển thị thông tin ra trang getInfo
  WorkingHours.findById(companyId).then(staff=>{
    res.render('workingHours/getInfo', {
      pageTitle: 'Tra cứu giờ làm',
      display: true,
      path: '/workinghours',
      staff: staff,
      data: true,
    });
  })

};

// exports.postConfirm = (req, res) => {
//   const staffId = req.body.staffId;
//   const companyId = req.body.companyId;
//   const name = req.body.name;
//   const imageUrl = req.body.imageUrl;
//   const annualLeave = req.body.annualLeave;
//   const salaryScale = req.body.salaryScale;

  
//   .then(()=>{
//     WorkingHours.findById(companyId)
//     })
//   })
// }

//MENU:  WORKINGHOURS --> getsalary
// exports.getSalary = (req, res) => {
//   const companyId = req.params.companyId;
//   Staff.findById(companyId)
//   .then(staff => {
//     if(!staff){
//       res.render('workingHours/getSalary', {
//         pageTitle: 'Tra cứu lương',
//         display: true,
//         path: '/workinghours',
//         staff: staff,
//         data: false
//       });
//     }
//     else {
//       res.render('workingHours/getSalary', {
//         pageTitle: 'Tra cứu lương',
//         display: true,
//         path: '/workinghours',
//         staff: staff,
//         data: true
//       });
//     }
//   })
//   .catch(err => console.log(err));
// };

