var Schedule = {

    motorizedMaxPerSchedule: 8,

    /**
     *
     * @param data
     * @returns {boolean}
     */
    selectSchedule: function (data) {
        let
            trigger = data.trigger,
            schedule = trigger.dataset.hour,
            selectUsers = document.getElementById('selectUsers'),
            selectedScheduleForUser = Users.isSelectedScheduleForUser(selectUsers.value, schedule),
            UsersLocalStorage,
            hourIndexTakenToRemove,
            userDataToModify;

        if (!selectedScheduleForUser && this.isOcupiedSchedule(schedule)) {
            toastr.error('Horario Ocupado');
            return false;
        }

        UsersLocalStorage = Users.getUsersToLocalStorage();
        UsersLocalStorage = UsersLocalStorage ? UsersLocalStorage : [];
        userDataToModify = UsersLocalStorage.find((e) => e.number == selectUsers.value);

        if (UsersLocalStorage.length === 0 || !userDataToModify) {

            UsersLocalStorage.push({
                'hour_taken': [schedule],
                'name': selectUsers.value,
                'number': selectUsers.value
            });

            this.onSelectedSchedule(trigger, UsersLocalStorage, schedule);
            return true;
        }



        if (!selectedScheduleForUser) {
            userDataToModify.hour_taken.push(schedule);
            this.onSelectedSchedule(trigger, UsersLocalStorage, schedule);

        } else {
            hourIndexTakenToRemove = userDataToModify.hour_taken.indexOf(schedule);

            if (hourIndexTakenToRemove !== -1) {
                userDataToModify.hour_taken.splice(hourIndexTakenToRemove, 1);
                this.onDeselectSchedule(trigger, UsersLocalStorage, schedule);
            }
        }
    },
    /**
     *
     * @param schedule
     */
    addMotorizedToSchedule: function (schedule) {

        let schedulesInStorage = this.getScheduleToLocalStorage(),
            scheduleItemFound;

        schedulesInStorage = schedulesInStorage ? schedulesInStorage : [];

        scheduleItemFound = schedulesInStorage
            .find((itemSchedules) => itemSchedules.hour == schedule);

        if (!!scheduleItemFound) {

            scheduleItemFound.motorized = scheduleItemFound.motorized + 1;
            this.setScheduleToLocalStorage(schedulesInStorage);

        } else {

            schedulesInStorage.push({
                motorized: 1,
                hour: schedule
            });

            this.setScheduleToLocalStorage(schedulesInStorage);
        }

        this.isOcupiedSchedule(schedule)
            ? this.checkScheduleOcuppied(schedule)
            : this.removeCheckScheduleOcuppied(schedule);
    },

    /**
     *
     * @param schedule
     * @returns {boolean}
     */
    removeMotorizedToSchedule: function (schedule) {

        let schedulesInStorage = this.getScheduleToLocalStorage(),
            scheduleItemFound;

        if (!schedulesInStorage)
            return false;

        scheduleItemFound = schedulesInStorage.find((itemSchedules) => itemSchedules.hour == schedule);

        if (!!scheduleItemFound) {
            scheduleItemFound.motorized = scheduleItemFound.motorized - 1;
            this.setScheduleToLocalStorage(schedulesInStorage);
        }

        this.isOcupiedSchedule(schedule)
            ? this.checkScheduleOcuppied(schedule)
            : this.removeCheckScheduleOcuppied(schedule);
    },

    /**
     *
     * @param schedules
     */
    setScheduleToLocalStorage: function (schedules) {
        localStorage.setItem('schedules', JSON.stringify(schedules))
    },

    /**
     *
     * @returns {any}
     */
    getScheduleToLocalStorage: function () {
        return JSON.parse(localStorage.getItem('schedules'));
    },

    /**
     *
     * @param schedule
     * @returns {boolean}
     */
    isOcupiedSchedule: function (schedule) {
        let schedulesInStorage = this.getScheduleToLocalStorage(),
            scheduleItemFound,
            status = false;

        if (!schedulesInStorage)
            return status;

        scheduleItemFound = schedulesInStorage.find((itemSchedules) => itemSchedules.hour == schedule);

        if (!!scheduleItemFound)
            status = scheduleItemFound.motorized == this.motorizedMaxPerSchedule;

        return status;
    },

    /**
     *
     * @param schedule
     */
    checkScheduleOcuppied: function (schedule) {

        document.getElementById('tableSchedule')
            .querySelector(`button[data-hour='${schedule}']`)
            .classList
            .add('--occupied');
    },

    /**
     *
     * @param schedule
     */
    removeCheckScheduleOcuppied: function (schedule) {

        document.getElementById('tableSchedule')
            .querySelector(`button[data-hour='${schedule}']`)
            .classList
            .remove('--occupied');
    },


    /**
     *
     * @returns {boolean}
     */
    validateAllScheduleAndCheckBusy: function () {

        let ScheduleStorage = this.getScheduleToLocalStorage(),
            itemSchedulesWithMotorizedNumberMax;

        if (!ScheduleStorage)
            return false;

        itemSchedulesWithMotorizedNumberMax = ScheduleStorage.filter((itemSchedule) => itemSchedule.motorized == this.motorizedMaxPerSchedule);

        if (!itemSchedulesWithMotorizedNumberMax)
            return false;

        itemSchedulesWithMotorizedNumberMax.forEach((itemScheduleWithMotorizedNumberMax) => {

            document.getElementById('tableSchedule')
                .querySelector(`button[data-hour='${itemScheduleWithMotorizedNumberMax.hour}']`)
                .classList
                .add('--occupied')

        });
    },

    /**
     *
     * @param buttonSchedule
     * @param itemStorageUsers
     * @param schedule
     */
    onSelectedSchedule: function (buttonSchedule, itemStorageUsers, schedule) {
        buttonSchedule.classList.add('--selected');
        buttonSchedule.innerText = 'Seleccionado';
        toastr.success('Se selecciono horario con éxito');
        Users.setUsersToLocalStorage(itemStorageUsers);
        Schedule.addMotorizedToSchedule(schedule);
    },

    /**
     *
     * @param buttonSchedule
     * @param itemStorageUsers
     * @param schedule
     */
    onDeselectSchedule: function (buttonSchedule, itemStorageUsers, schedule) {
        buttonSchedule.classList.remove('--selected');
        buttonSchedule.innerText = 'Seleccionar';
        Users.setUsersToLocalStorage(itemStorageUsers);
        Schedule.removeMotorizedToSchedule(schedule);
        toastr.warning('Se deselecciono horario');
    },

    initRenderScheduling: function ()  {
        
        let bodyTable = document.getElementById('tableScheduleBody');

        let date = new Date();

        date.setHours(8);

        date.setMinutes(00);

        [...Array(25).keys()].forEach(() => {

            let column = document.createElement("tr");

            let row = this.getRowSchedule(date.getHours(), date.getMinutes());

            column.innerHTML = row;

            bodyTable.append(column);

            date = new Date(date.getTime() + 30 * 60000);
        });

    },

    getRowSchedule: function (hour,minutes){

        return `<th scope="row">${hour}:${minutes}</th><td>` +
        `<div><button data-hour="${hour}${minutes}" onclick="Schedule.selectSchedule({ trigger : this})">Seleccionar` +
        '</button></div></td>';
    }
};