var Users = {

    quantityUsers : 10,

    createUserIntoSelect : function (quantityUsers = null) {

        let selectUsers = document.getElementById("selectUsers"),
            quantityUsersToCreate = quantityUsers ? quantityUsers : this.quantityUsers;

        [...Array(quantityUsersToCreate).keys()].forEach((numberUser) => {

            let optionUser = document.createElement("option");
            let numberUserFinal = numberUser + 1;

            optionUser.appendChild(document.createTextNode(`Usuario ${numberUserFinal}`));
            optionUser.setAttribute("value", numberUserFinal);
            selectUsers.appendChild(optionUser);
        });

    },

    /**
     *
     * @param jsonUsers
     */
    setUsersToLocalStorage: function (jsonUsers) {
        localStorage.setItem('users', JSON.stringify(jsonUsers))
    },

    /**
     *
     * @returns {any}
     */
    getUsersToLocalStorage: function () {

        return JSON.parse(localStorage.getItem('users'));
    },

    isEmptyUsersLocalStorage: function (){
        return this.getUsersToLocalStorage();
    },

    /**
     *
     * @param userNumber
     * @returns {boolean}
     */
    checkScheduleSelectedByUser: function (userNumber) {

        let dataUser;

        dataUser = this.findUserDataByNumberInLocalStorage(userNumber);

        document.getElementById('tableSchedule')
            .querySelectorAll(`button[data-hour]`)
            .forEach((buttonSchedule) => {

                buttonSchedule
                    .classList
                    .remove('--selected');

                buttonSchedule.innerText = 'Seleccionar';
            });

        if(!dataUser)
            return false;

        dataUser.hour_taken.forEach((hour) => {

            let ButtonSchedule = document.getElementById('tableSchedule')
                .querySelector(`button[data-hour='${hour}']`);

            ButtonSchedule
                .classList
                .add('--selected');

            ButtonSchedule.innerText = 'Seleccionado';
        });
    },

    /**
     *
     * @param userNumber
     * @param schedule
     * @returns {boolean}
     */
    isSelectedScheduleForUser: function (userNumber, schedule) {

        let itemUser;

        itemUser = this.findUserDataByNumberInLocalStorage(userNumber);

        return !!itemUser ? itemUser.hour_taken.includes(schedule) : false;
    },

    /**
     *
     */
    findUserDataByNumberInLocalStorage: function (userNumber){

        let UsersStorage = Users.getUsersToLocalStorage();

        return !!UsersStorage
            ? UsersStorage.find((itemUsers) => itemUsers.number == userNumber)
            : null;
    }
};