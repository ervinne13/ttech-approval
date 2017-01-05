
var SGDateUtilities = {};

SGDateUtilities.monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

SGDateUtilities.getCurrentMonthName = function () {
    var currentDate = new Date();
    var currentMonthIndex = currentDate.getMonth();
    return SGDateUtilities.monthNames[currentMonthIndex];
};

SGDateUtilities.getMonthName = function (index) {
    return SGDateUtilities.monthNames[index];
};