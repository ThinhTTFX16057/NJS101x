const WorkingHours = require('../models/workingHours');
const moment = require('moment');

//MENU:  SEARCH
exports.getSearch = (req, res) =>{res.render('search.ejs', {
    pageTitle: 'Tìm kiếm thông tin',
    path: '/search',
  })
}

exports.postSearch = (req, res) => {
    const subject = req.body.subject;
    const companyId = req.body.companyId;
    res.redirect(`/${subject}/${companyId}`)
}

exports.searchWithKeywords = (req, res) => {
    const fieldname = req.query.keyword.split("=")[0];
    const value = req.query.keyword.split("=")[1]

    //search theo name='Nguyen Van A'
    if(fieldname == "name"){
        WorkingHours.fetchAll().then(staffs=>{
            let companyId = null;
            for (let staff of staffs){
                if(staff.name.toLowerCase() == value.toLowerCase()){
                    return companyId = staff.companyId
                 }
            }
            return companyId;
        }).then((companyId)=>{
            res.redirect(`/workinghours/viewinfo/${companyId}`)})
    }
    
    //search theo workplace
    else if(fieldname == "workplace"){
        const companyId = req.params.companyId;
        WorkingHours.findById(companyId)
        .then(staff =>{
            let newDetails = [];
            for (let d of staff.details) {
                if (d.workplace == value) {
                    newDetails.push({"date": d.date, "workplace": d.workplace, "timeStart": d.timeStart, "timeEnd": d.timeEnd, "workHours": d.workHours});
                }
            }

            const searchStaff = new WorkingHours(staff._id, staff.companyId, staff.name, staff.imageUrl, staff.annualLeave, staff.salaryScale, newDetails, null, null);
            searchStaff.searchData()
                .then(()=>{res.redirect(`/workinghours/searchinfo/${companyId}`)})
                .catch(err => console.log(err)); 
        })
    }

    //search theo date
    else if (fieldname == "date"){
        const companyId = req.params.companyId;
        WorkingHours.findById(companyId)
        .then(staff =>{
            let newDetails = [];
            let newTotal = [];
            for (let d of staff.details) {
                if (new Date(d.date).getTime() == new Date(value).getTime()) {
                    newDetails.push({"date": d.date, "workplace": d.workplace, "timeStart": d.timeStart, "timeEnd": d.timeEnd, "workHours": d.workHours});
                }
            }
            for (let tt of staff.total) {
                if (new Date(tt.date).getTime() == new Date(value).getTime()) {
                    newTotal.push({"date": tt.date, "totalWorkHours": tt.totalWorkHours, "totalOffHours": tt.totalOffHours});
                }
            }

            const searchStaff = new WorkingHours(staff._id, staff.companyId, staff.name, staff.imageUrl, staff.annualLeave, staff.salaryScale, newDetails, newTotal, null);
            searchStaff.searchData()
                .then(()=>{res.redirect(`/workinghours/searchinfo/${companyId}`)})
                .catch(err => console.log(err));
        })
    }
    //search theo month
    else if (fieldname == "month"){
        const companyId = req.params.companyId;
        WorkingHours.findById(companyId)
        .then(staff =>{
            let newDetails = [];
            let newTotal = [];
            for (let d of staff.details) {
                if (new Date(d.date).getMonth() == new Date(value).getMonth()) {
                    newDetails.push({"date": d.date, "workplace": d.workplace, "timeStart": d.timeStart, "timeEnd": d.timeEnd, "workHours": d.workHours});
                }
            }
            for (let tt of staff.total) {
                if (new Date(tt.date).getMonth() == new Date(value).getMonth()) {
                    newTotal.push({"date": tt.date, "totalWorkHours": tt.totalWorkHours, "totalOffHours": tt.totalOffHours});
                }
            }

            const searchStaff = new WorkingHours(staff._id, staff.companyId, staff.name, staff.imageUrl, staff.annualLeave, staff.salaryScale, newDetails, newTotal, null);
            searchStaff.searchData()
                .then(()=>{res.redirect(`/workinghours/searchinfo/${companyId}`)})
                .catch(err => console.log(err));
        })
    }
    //search theo salarymonth
    else if(fieldname == "salarymonth"){
        const companyId = req.params.companyId;
        WorkingHours.findById(companyId)
        .then(staff =>{
            let salary = [];
            for (let s of staff.salary) {
                if (s.monthOfYear == value){
                    salary.push({"monthOfYear": s.monthOfYear,"salaryScale": staff.salaryScale, "overTime": s.overTime, "underTime": s.underTime})
                }
            }
            const searchStaff = new WorkingHours(staff._id, staff.companyId, staff.name, staff.imageUrl, staff.annualLeave, staff.salaryScale, null, null, salary);
            searchStaff.searchData()
                .then(()=>{res.redirect(`/workinghours/searchsalary/${companyId}`)})
                .catch(err => console.log(err));
        })
    }

    // nếu nhập sai cú pháp keyword
    else {
        const companyId = req.params.companyId;
        res.redirect(`/workinghours/error/${companyId}`)
    }

}
    
      
    
    
