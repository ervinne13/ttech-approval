
/* global baseURL, sgdatatable */

function SGApproval(options) {

    this.initializeOptions(options);

}

(function () {

    SGApproval.prototype.initializeOptions = function (options) {
        //  avoid undefined object
        this.options = options ? options : {};

        //  TODO: add validation that the following values exist

        this.model = this.options.modelName ? this.options.modelName : $('#model_name').val();
        this.identifierFields = this.options.identifierFields ? this.options.identifierFields : JSON.parse($('#identifier_fields').val());
        this.identifier = this.options.identifier ? this.options.identifier : JSON.parse($('#identifier').val());

    };

    SGApproval.prototype.initializeDocTracking = function (docNo) {
        var _this = this;
        $('.function[data-trigger="track-document"]').click(function () {
            $('#modal-track-document').modal('show');
            $('#modal-track-document-number').html(docNo);
            _this.initializeDocTrackingTable(docNo);
        });
    };

    SGApproval.prototype.initializeDocTrackingTable = function (docNo) {
        $('#track-document-table').dataTable({
            processing: true,
            serverSide: true,
            search: {
                caseInsensitive: true
            },
            ajax: {
                url: "/system/approval/trackDataTable/" + docNo,
                contentType: 'application/datatable'
            },
            order: [1, "desc"],
            columns: [
//                {data: 'DT_DocNo'},
                {data: 'DT_EntryDate'},
                {data: 'DT_SenderName'},
                {data: 'DT_LocationName'},
                {data: 'DT_ApproverPositionName'},
                {data: 'DT_ApprovedBy'},
                {data: 'DT_DateApproved'},
                {data: 'DT_Status'},
                {data: 'DT_Remarks'}
            ],
            columnDefs: [
                {
                    targets: 6,
                    render: function (columnData, type, rowData, meta) {
                        return sgdatatable.generateStatus(columnData);
                    }
                }
            ]
        });

    };

    SGApproval.prototype.initializeApprovalFunctionEvents = function () {

        //  scope reference
        var _this = this;

        //  initialize events      
        $('.function[data-trigger="send-approval-request"]').click(function () {

            var url = baseURL + '/system/approval/sendApprovalRequest';
            var data = _this.getData();

            _this.sendAction(url, data, function (response) {
                console.log(response);
                swal('Success', 'Approval Request Sent', 'success');
            });

        });

        $('.function[data-trigger="approve"]').click(function () {
            var url = baseURL + '/system/approval/approve';
            var data = _this.getData();

            _this.sendAction(url, data, function (response) {
                console.log(response);
                swal('Success', 'Document Approved', 'success');
            });

        });
    };

    SGApproval.prototype.getData = function () {
        return {
            model: this.model,
            identifier_fields: this.identifierFields,
            identifier: this.identifier
        };

    };

    SGApproval.prototype.getCSRF = function () {
        return $('meta[name=csrf]').attr('content');
    };

    SGApproval.prototype.showErrors = function (show, errors) {

    };

    SGApproval.prototype.showErrorMessage = function (errorMessage) {
        var defaultErrorMessage = "Something went wrong, please let your administrator know";

        //  use the default error message if the message is too long
        if (errorMessage.length > 200) {
            console.log(errorMessage);
            errorMessage = defaultErrorMessage;
        }

        swal("Opps!", errorMessage, "error");
    };

    SGApproval.prototype.sendAction = function (url, data, onFinishCallback) {

        var _this = this;
        var csrf = this.getCSRF();

        $.ajax({
            url: url,
            headers: {
                'X-CSRF-TOKEN': csrf
            },
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function (data) {
                console.log(data);

                if (data.errors) {
                    swal("Error(s)!", data.errors, "error");
                } else {
                    if (onFinishCallback) {
                        onFinishCallback(data);
                    }
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);

                if (jqXHR.responseJSON) {
                    _this.showErrors(true, jqXHR.responseJSON);
                    swal("Opps!", "You have invalid field(s)", "error");
                } else if (jqXHR.responseText) {
                    _this.showErrorMessage(jqXHR.responseText);
                } else if (errorThrown) {
                    swal("Opps!", errorThrown, "error");
                } else {
                    alert('Error!');
                }
            }
        });
    };

})();

