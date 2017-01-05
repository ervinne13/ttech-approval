
/* global swal */

(function () {

    var documentTrackingTableTemplate;

    $(document).ready(function () {

        documentTrackingTableTemplate = _.template($('#document-tracking-template').html());

        initializeEvents();
    });

    function getDocNo() {
        return $('#sg-approval-function-container').data('document-number');
    }

    function initializeEvents() {

        $('#action-track').click(function () {
            showTrack();
        });

        $('.sg-approval-function:not(.sg-requires-remarks)').click(function (e) {
            e.preventDefault();

            var action = getActionObj($(this));
            sendAction(action);
        });

        $('.sg-approval-function.sg-requires-remarks').click(function (e) {
            e.preventDefault();

            var action = getActionObj($(this));

            askRemarks(action, function (remarks) {
                if (remarks === false) {    //  pressed the negative button
                    return false;
                }

                if (remarks === "") {
                    swal.showInputError("You need to write something!");
                    return false;
                }

                action.remarks = remarks;

                sendAction(action);

            });

        });
    }

    function getActionObj($approvalAction) {

        var action = {
            id: $approvalAction.attr('id'),
            action: $approvalAction.data('action'),
            moduleId: $('#sg-approval-function-container').data('module-id'),
            displayName: $approvalAction.html(),
            remarks: null
        };

        return action;

    }

    function showTrack() {

        swal({
            title: '<i class="fa fa-info-circle"></i> Document Tracking',
            customClass: 'swal-wide',
            text: documentTrackingTableTemplate({
                documentTrackList: documentTrackList
            }),
            html: true
        });

    }

    function askRemarks(action, callback) {

        var actionTextBundle = getActionTextBundle(action.id);

        if (!actionTextBundle) {
            throw new Error("action bundle for " + action.id + " not found");
        }

        swal({
            title: action.displayName,
            text: actionTextBundle.askingText,
            html: true,
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Remarks"
        }, callback);
    }

    function getActionTextBundle(actionId) {
        switch (actionId) {
            case "action-approve":
                return {
                    askingText: "",
                    errorText: "Approval Failed",
                    confirmingText: "Approved"
                };
            case "action-reject":
                return {
                    askingText: "Tell us why you're rejecting this",
                    errorText: "Rejection Failed",
                    confirmingText: "Rejected"
                };
            default:
                return null;
        }
    }

    function sendAction(action) {

        var url = "/approval/" + action.moduleId + "/" + action.action;
        var data = {
            documentNumber: getDocNo(),
            remarks: action.remarks
        };

        var actionTextBundle = getActionTextBundle(action.id);
        if (!actionTextBundle) {
            throw new Error("action bundle for " + action.id + " not found");
        }

        $.post(url, data, function (response) {
            console.log(response);

            if (action.remarks) {
                swal(actionTextBundle.confirmingText, "You wrote: " + action.remarks, "success");
            } else {
                swal(actionTextBundle.confirmingText, "Thank you", "success");
            }

            setTimeout(function () {
                location.href = "/tracking";
            }, 2000);

        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            console.error("XMLHttpRequest", XMLHttpRequest);
            console.error("textStatus", textStatus);
            console.error("errorThrown", errorThrown);

            if (XMLHttpRequest.status === 500) {
                swal(actionTextBundle.errorText, XMLHttpRequest.responseText, "error");
            } else if (XMLHttpRequest.status === 404) {
                swal(actionTextBundle.errorText, "This action was not found in the server, please contact your administrator.", "error");
            } else if (XMLHttpRequest.status === 403) {
                swal(actionTextBundle.errorText, "Sorry, you are not authorized to do this.", "error");
            }

        });
    }

})();
