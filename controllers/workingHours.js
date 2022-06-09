const WorkingHours = require('../models/workingHours');
const Staff = require('../models/timekeeping');
const moment = require('moment');

//MENU:  WORKINGHOURS --> fetch staff
exports.getStaff = (req, res) =>{
  WorkingHours.fetchAll().then(staffs=>{res.render('workingHours/workingHours', {
    pageTitle: 'Tra cứu giờ làm',
    path: '/workinghours',
    staffs: staffs,
  })})
}


//MENU:  WORKINGHOURS --> getinfo from Timekeeping
exports.uploadData = (req, res) => {
  const companyId = req.params.companyId;
  // Tạo dữ liệu từ dữ liệu chấm công upload lên collection workinghours
  Staff.findById(companyId).then(staff => {
    let details=[];
    let total = [];
    let salary =[];
    //dữ liệu chấm công (nếu có)
    if(staff.timekeeping){
      for (let tk of staff.timekeeping){
        for (let dt of tk.data){details=details.concat({
          "date": tk.date, 
          "dateId": tk.dateId, 
          "dataId": dt.dataId,
          "workplace": dt.workplace,
          "timeStart": dt.timeStart, 
          "timeEnd": dt.timeEnd,
          "workHours": dt.workHours
      })}}
      for (let tk of staff.timekeeping){
        let date = tk.date;
        let value = 0;
        for (let dt of tk.data){value = value + parseFloat(dt.workHours)};
        total=total.concat({"date":date, "totalWorkHours":value, "totalOffHours": 0});
      }
    }
    // dữ liệu nghỉ phép (nếu có)
    if(staff.staffAnnualLeave) {
      for (let tt of total){
        for (let sal of staff.staffAnnualLeave){
          if(sal.dateLeave.start<=tt.date && tt.date<=sal.dateLeave.end){tt.totalOffHours=parseInt(tt.totalOffHours) + parseInt(sal.hoursOff)}
    }}}
    // dữ liệu salary tạo sau khi đã có dữ liệu chấm công và nghỉ phép
    if (total.length != 0 ){
      let month = [];
      for (let tt of total) {
        dateData = moment(new Date(tt.date)).format("MM-YYYY");
        if (month.indexOf(dateData) === -1){
          month.push(dateData);
        }
      };

      
      for (let mo of month) {
        let overTime = 0;
        let underTime = 0;
        let totalWorkHoursOfMonth = 0;
        for (tt of total){
          dateData = moment(new Date(tt.date)).format("MM-YYYY");
          if (dateData == mo) {
            let totalWorkHoursOfDay = parseFloat(tt.totalWorkHours) + parseFloat(tt.totalOffHours);
            if (totalWorkHoursOfDay >8) {overTime = overTime + totalWorkHoursOfDay - 8}
            else if (totalWorkHoursOfDay < 8) {underTime = underTime + 8 - totalWorkHoursOfDay};
            totalWorkHoursOfMonth = totalWorkHoursOfMonth + totalWorkHoursOfDay;
          }
        };
        salary = salary.concat({"monthOfYear": mo ,"totalWorkHoursOfMonth": totalWorkHoursOfMonth,"overTime": overTime, "underTime": underTime});
      }
    }

    //upload dữ liệu lên collection workinghours
    const updatedStaff = new WorkingHours(null, staff.companyId, null, null, null, null, details, total, salary);
    updatedStaff.updateData() // update dữ liệu "details", "total" và "salary"
      .then(() => {res.redirect(`/workinghours/viewinfo/${companyId}`)})
      .catch(err => console.log(err));
  })
}
//MENU:  WORKINGHOURS --> trang điều hướng sau khi tải dữ liệu lên database và trả về lại getInfo.ejs với dữ liệu đã cập nhât

exports.getViewInfo = (req, res) =>{
  const companyId = req.params.companyId;
  WorkingHours.findById(companyId).then((staff)=>{res.render('workingHours/getInfo', {
    pageTitle: 'Tra cứu giờ làm',
    path: '/workinghours',
    staff: staff,
    workHoursData: true,
    salaryData: false,
    error: false,
    searchError: false
  })})
}
exports.getViewSalary = (req, res) =>{
  const companyId = req.params.companyId;
  WorkingHours.findById(companyId).then((staff)=>{res.render('workingHours/getInfo', {
    pageTitle: 'Tra cứu lương',
    path: '/workinghours',
    staff: staff,
    workHoursData: false,
    salaryData: true,
    error: false,
    searchError: false
  })})
}

//MENU:  WORKINGHOURS --> trang điều hướng sau khi tải dữ liệu được tạo từ search keyword của người dùng và trả lại getInfo với dữ liệu này
exports.getViewSearchInfo = (req, res) =>{
  const companyId = req.params.companyId;
  WorkingHours.findById(companyId).then((staff)=>{res.render('workingHours/getInfo', {
    pageTitle: 'Tra cứu giờ làm',
    path: '/workinghours',
    staff: staff.search,
    workHoursData: true,
    salaryData: false,
    error: false,
    searchError: false
  })})
}
exports.getViewSearchSalary = (req, res) =>{
  const companyId = req.params.companyId;
  WorkingHours.findById(companyId).then((staff)=>{res.render('workingHours/getInfo', {
    pageTitle: 'Tra cứu giờ làm',
    path: '/workinghours',
    staff: staff.search,
    workHoursData: false,
    salaryData: true,
    error: false,
    searchError: false
  })})
}

//MENU:  WORKINGHOURS --> trang điều hướng khi người dùng nhập keyword không đúng cú pháp
exports.getSearchError = (req, res) =>{
  const companyId = req.params.companyId;
  WorkingHours.findById(companyId).then((staff)=>{res.render('workingHours/getInfo', {
    pageTitle: 'Tra cứu giờ làm',
    path: '/workinghours',
    staff: staff,
    workHoursData: false,
    salaryData: false,
    error: false,
    searchError: true
  })})
}