
const mongoConnect = require('./util/database').mongoConnect;
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//routes
const timekeepingRoutes = require('./routes/timekeeping');
const staffInfoRoutes = require('./routes/info');
const workingHoursRoutes = require('./routes/workingHours');
const covidRoutes = require('./routes/covid');
const searchRoutes = require('./routes/search');

app.use('/timekeeping', timekeepingRoutes); //Routes chấm công gồm: điểm danh, kết thúc làm, nghỉ phép
app.use(staffInfoRoutes); // Routes thông tin nhân viên gồm: xem, sửa, xoá thông tin
app.use('/workinghours',workingHoursRoutes); // Routes thông tin nhân viên gồm: xem giờ làm, lương
app.use('/covid',covidRoutes); // Routes covid gồm: thân nhiệt, vaccin, dương tính 
app.use('/search',searchRoutes); //Routes search

//middleware for 404 page
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' })
});

mongoConnect(() => {
  app.listen(3000);
});
