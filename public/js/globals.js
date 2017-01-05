
/* global bootbox */

var globals = {
    dateDataFormat: "YYYY-MM-DD",
    dateDisplayFormat: "MM/DD/YYYY"
};

globals.bootboxConfirm = function (options) {
    bootbox.dialog({
        message: options.message ? options.message : "Confirm?",
        title: options.title ? options.title : "Confirm",
        buttons: {
            success: {
                label: "Success!",
                className: "btn-success",
                callback: function () {
                    Example.show("great success");
                }
            },
            main: {
                label: "Click ME!",
                className: "btn-primary",
                callback: function () {
                    Example.show("Primary button");
                }
            }
        }
    });
};

globals.hexColor = function (colorval) {
    var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    delete(parts[0]);
    for (var i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) {
            parts[i] = '0' + parts[i];
        }
    }

    return '#' + parts.join('');
};