
/**
 * Functionalities that applies to the whole application are found here
 */

(function () {
    $(document).ready(function () {

        initializeUI();
        initializeTableEvents();

    });

    function initializeUI() {
        //  disable tooltips
//        $(':not(.tooltip)').tooltip({disabled: true});
//        $('.tooltip').tooltip();

        $('[data-toggle="tooltip"]').tooltip({container: 'body'});
        $(".chosen-select").chosen();
    }

    function initializeTableEvents() {
        $('.toggle-check').change(function () {
            $('input[type=checkbox].doc').prop('checked', this.checked);
        });
    }
})();

//  JQuery Extensions
jQuery.extend({
    put: function (url, data, callback) {
        return jQuery.ajax({
            url: url,
            type: 'PUT',
            data: data,
            success: callback
        });
    }
});

//  Native Objects Extensions
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};