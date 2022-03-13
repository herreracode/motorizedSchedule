const QuantityUsers = 20;

Schedule.initRenderScheduling();
Users.createUserIntoSelect(QuantityUsers);
Users.checkScheduleSelectedByUser(document.getElementById('selectUsers').value);
Schedule.validateAllScheduleAndCheckBusy();