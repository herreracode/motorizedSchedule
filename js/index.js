const QuantityUsers = 20;

Users.createUserIntoSelect(QuantityUsers);
Users.checkScheduleSelectedByUser(document.getElementById('selectUsers').value);
Schedule.validateAllScheduleAndCheckBusy();