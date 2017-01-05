
/* global _class, base_url, _module, globals */

/**
 * @class ModuleProcessor
 * @param {Object} configs 
 *  The configuration of the module header. 
 * @description 
 *  Abstracts out the functionality of processing saving and updating header records of a module.
 *  IMPORTANT! This class is dependent on certain DOM elements as specified in the configuration or by 
 *  default, only call it's custructor when the document/DOM is ready, otherwise, events and ui 
 *  modifications will not apply!
 * 
 */
function ModuleProcessor(configs, module) {

    if (!configs) {
        configs = {};   //  avoid undefined exceptions
    }

    this.form = configs.form ? configs.form : '#' + module.M_Module_id + "-form";
    this.detailTable = configs.detailTable ? configs.detailTable : null;
    this.moduleURL = configs.moduleURL ? configs.moduleURL : globals.baseUrl + "/" + module.M_Trigger;
    this.createModuleURL = configs.createModuleURL ? configs.createModuleURL : globals.baseUrl + "/" + module.M_Trigger + "/create";
    this.processURL = configs.processURL ? configs.processURL : this.moduleURL + '/process';
    this.waitTimeBeforeRedirect = configs.waitTimeBeforeRedirect ? configs.waitTimeBeforeRedirect : 1000

    //  if set to true, serial number generation will be required and if generation fails,
    //  the module will redirect back to the view to prevent creation of documents that
    //  do not conform to the series setup
    this.isTransactionModule = configs.isTransactionModule ? configs.isTransactionModule : false;

    //  Events will be registred automatically to the action buttons if this config
    //  is set to true. Auto initialization happens on intialize() method and switchToUpdateMode
    this.autoInitializesActions = configs.autoInitializesActions !== undefined ? configs.autoInitializesActions : true;

//    this.saveButton = configs.saveButton ? configs.saveButton : "save";
    this.saveNewButton = configs.saveNewButton ? configs.saveNewButton : "action-save-new";
    this.saveCloseButton = configs.saveCloseButton ? configs.saveCloseButton : "action-save-close";
    this.updateNewButton = configs.updateNewButton ? configs.updateNewButton : "action-update-new";
    this.updateCloseButton = configs.updateCloseButton ? configs.updateCloseButton : "action-update-close";

    this.errorMessageContainer = configs.errorMessageContainer ? configs.errorMessageContainer : "#error-message-container";
    this.errorMessageText = configs.errorMessageText ? configs.errorMessageText : "#error-message";

    this.processDetailsData = configs.processDetailsData ? configs.processDetailsData : function (details) {
        return JSON.stringify(details);
    };

    this.onPreSave = configs.onPreSave;

    this.preprocessFormData = configs.preprocessFormData ? configs.preprocessFormData : function (formData) {
        return formData;
    };

    //  make sure that the default action buttons have an action-button class
//    $('#' + this.saveButton).addClass('action-button');
    $('#' + this.saveNewButton).addClass('action-button');
    $('#' + this.saveCloseButton).addClass('action-button');
    $('#' + this.updateNewButton).addClass('action-button');
    $('#' + this.updateCloseButton).addClass('action-button');
}

(function () {

    //
    //  <editor-fold defaultstate="collapsed" desc="Public UI Utility Functions">      
    ModuleProcessor.prototype.enableActionButtons = function (enable) {
        if (enable) {
            $('.action-button').removeAttr('disabled');
        } else {
            $('.action-button').attr('disabled', 'disabled');
        }
    };

    ModuleProcessor.prototype.showError = function (show, message) {
        if (show) {
            $(this.errorMessageContainer).css("display", "block");
            $(this.errorMessageText).html(message);
        } else {
            $(this.errorMessageContainer).css("display", "none");
            $(this.errorMessageText).html("");
        }
    };

    ModuleProcessor.prototype.switchToUpdateMode = function (uniqueId) {
        $('#' + this.saveNewButton).attr({'disabled': false, 'id': this.updateNewButton});
        $('#' + this.saveCloseButton).attr({'disabled': false, 'id': this.updateCloseButton});
        $('#' + this.updateNewButton).attr('data-id', uniqueId);
        $('#' + this.updateCloseButton).attr('data-id', uniqueId);

        if (this.autoInitializesActions) {
            this.initializeActions();
        }

    };

    ModuleProcessor.prototype.redirectBack = function () {
        var _this = this;
        setTimeout(function () {
            window.location = _this.moduleURL;
        }, 1000);
    };

    //  </editor-fold>

    //  
    //  <editor-fold defaultstate="collapsed" desc="Public API Functions">

    //  Facade function, initializeDatepickers + initializeActions
    ModuleProcessor.prototype.initialize = function () {
        this.initializeDatepickers();

        if (this.autoInitializesActions) {
            this.initializeActions();
        }
    };

    ModuleProcessor.prototype.initializeDatepickers = function () {
        $('.datepicker').datepicker({
            dateFormat: 'mm/dd/yy'
        });
    };

    ModuleProcessor.prototype.initializeActions = function () {

        //  context reference
        var _this = this;

        $('#' + this.saveNewButton).unbind('click');
        $('#' + this.saveNewButton).click(function () {
            swal({
                title: "Save Document?",
                text: "Your document will now be saved to the server",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "Yes, save the document!",
                closeOnConfirm: true
            }, function () {
                _this.enableActionButtons(false);
                //  null x2 - no id, auto compute form data
                _this.sendAction('store', null, null, function () {
                    swal("Updated!", "Your document is now saved to the server.", "success");
                    setTimeout(function () {
                        location.href = _this.createModuleURL;
                    }, _this.waitTimeBeforeRedirect);
                });
            });
        });

        $('#' + this.saveCloseButton).unbind('click');
        $('#' + this.saveCloseButton).click(function () {
            swal({
                title: "Save Document?",
                text: "Your document will now be saved to the server",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "Yes, save the document!",
                closeOnConfirm: true
            }, function () {
                _this.enableActionButtons(false);
                //  null x2 - no id, auto compute form data
                _this.sendAction('store', null, null, function () {
                    swal("Updated!", "Your document is now saved to the server.", "success");
                    setTimeout(function () {
                        location.href = _this.moduleURL;
                    }, _this.waitTimeBeforeRedirect);
                });
            });
        });

        $('#' + this.updateNewButton).unbind('click');
        $('#' + this.updateNewButton).click(function () {
            var uniqueId = $(this).data('id');

            swal({
                title: "Update Document?",
                text: "Your updates will now be sent to the server",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "Yes, update the document!",
                closeOnConfirm: true
            }, function () {
                _this.enableActionButtons(false);
                //  null - auto compute form data
                _this.sendAction('update', uniqueId, null, function () {
                    swal("Updated!", "Your updates has been sent to the server.", "success");
                    setTimeout(function () {
                        location.href = _this.createModuleURL;
                    }, _this.waitTimeBeforeRedirect);
                });
            });
        });

        $('#' + this.updateCloseButton).unbind('click');
        $('#' + this.updateCloseButton).click(function () {
            var uniqueId = $(this).data('id');

            swal({
                title: "Update Document?",
                text: "Your updates will now be sent to the server",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "Yes, update the document!",
                closeOnConfirm: true
            }, function () {
                _this.enableActionButtons(false);
                //  null - auto compute form data
                _this.sendAction('update', uniqueId, null, function () {
                    swal("Updated!", "Your updates has been sent to the server.", "success");
                    setTimeout(function () {
                        location.href = _this.moduleURL;
                    }, _this.waitTimeBeforeRedirect);
                });
            });
        });

    };

    ModuleProcessor.prototype.showErrors = function (show, errors) {

        if (show) {
            for (var key in errors) {
                if ($('[name=' + key + ']').length) {
                    $('.' + key + '-form-group').addClass('has-error');
                    $('.' + key + '-error-container').removeAttr('hidden');
                    $('.' + key + '-error').text(errors[key][0]);
                }
            }
        } else {
            $('.error-container').attr('hidden');
            $('.form-group').removeClass('has-error');
        }

    };

    ModuleProcessor.prototype.showErrorMessage = function (show, message) {

        if (show) {
            $(this.errorMessageContainer).css("display", "block");
            $(this.errorMessageText).html(message);
        } else {
            $(this.errorMessageContainer).css("display", "none");
            $(this.errorMessageText).html("");
        }

    };

    ModuleProcessor.prototype.showBatchSaveErrors = function (batchSaveErrors) {

        for (var i in batchSaveErrors) {
            var referenceId = batchSaveErrors[i].reference_id;
            var errors = batchSaveErrors[i].errors;

            for (var fieldName in errors) {
                $('#label_error_' + referenceId + "_" + fieldName).attr('title', errors[fieldName]);
                $('#label_error_' + referenceId + "_" + fieldName).css('display', 'inline');
            }

        }

    };

    ModuleProcessor.prototype.getCSRF = function () {
        return $('meta[name=csrf]').attr('content');
    };

    ModuleProcessor.prototype.getFormData = function () {

        var formData = {};

        $(this.form + ' :input').each(function () {
            var fieldName = $(this).attr('name');
            var value = $(this).val();

            if (fieldName) {
                formData[fieldName] = value;
            }

        });

        return this.preprocessFormData(formData);
    };

    ModuleProcessor.prototype.sendAction = function (action, id, formData, method, onFinishCallback) {
        var _this = this;
        var url;

        if (typeof method === "function" && onFinishCallback === undefined) {
            onFinishCallback = method;
            method = null;
        }

        if (action === 'update') {
            //  document updates
            if (!id) {
                console.error("Failed updating document, id is undefined");
                return;
            }
            url = _this.moduleURL + "/" + id;
            method = "PUT";
        } else if (action === 'store') {
            //  document creation
            url = _this.moduleURL;
            method = "POST";
        } else {

            //  special functions / actions, like:
            //  activate, deactivate, approve, post, etc.

            if (!method) {
                method = "PUT";
            }

            if (id && id.length > 0) {
                url = _this.moduleURL + "/" + id + "/" + action;
            } else {
                url = _this.moduleURL + "/" + action;
            }
        }

//        var formData = this.getFormData();

        if (_this.detailTable) {
            _this.detailTable.refreshTableDataField();
        }

        //  execute implemented pre save actions
        if (this.onPreSave) {
            this.onPreSave();
        }

        //  auto compute form data if not specified
        if (!formData) {
            formData = $(this.form).serialize();
        }

        console.log(formData);
        $.ajax({
            url: url,
            headers: {
                'X-CSRF-TOKEN': _this.getCSRF()
            },
            type: method,
            data: formData,
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

                if (_this.detailTable && data.batch_save_errors) {
                    _this.showBatchSaveErrors(data.batch_save_errors);
                }

                _this.enableActionButtons(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);

                if (jqXHR.responseJSON) {
                    _this.showErrors(true, jqXHR.responseJSON);
                    swal("Opps!", "You have invalid field(s)", "error");
                } else if (jqXHR.responseText) {
                    _this.showErrorMessage(true, jqXHR.responseText);
                    
                    var errorDisplayText = "Something went wrong, please let your administrator know";
                    
                    //  Error text will only be displayed if it's less than 200 characters
                    if (errorDisplayText.length < 200) {
                        errorDisplayText = jqXHR.responseText;
                    }
                    
                    swal("Opps!", errorDisplayText, "error");
                } else if (errorThrown) {
                    swal("Opps!", errorThrown, "error");
                } else {
                    //  alert('Error!');
                    swal("Opps!", "Something went wrong, please let your administrator know", "error");
                }

                _this.enableActionButtons(true);
            }
        });

        this.enableActionButtons(false);
        this.showErrors(false);
        this.showErrorMessage(false);
    };

    // </editor-fold>
})();
