
/* global bootbox, globals, datatableInstance */

/**
 * 
 * @param {type} datatableInstance
 * The datatable instance.
 * IMPORTANT make sure this is not the jquery instance made from .dataTable({...
 * Use .DataTable({..., otherwise, the events will fire off a "Cannot read property 'reload' of undefined"
 * error
 * @param {type} module
 * The current module object. Get it with blade using @include("partials.module_js_info")
 * @param moduleProcessor
 * @returns {ModuleListProcessor}
 */
function ModuleListProcessor(datatableInstance, module, moduleProcessor) {

    this.module = module;
    this.datatableInstance = datatableInstance;
    this.moduleProcessor = moduleProcessor; //  required for batch functions

    this.csrfToken = $('meta[name=csrf]').attr('content');
    //  for batch functions
    this.checkboxSelector = ".doc:checked";
    this.setActiveFunction = "activate";
    this.setInactiveFunction = "deactivate";
}

(function () {

    ModuleListProcessor.prototype.initializeActions = function () {

        var moduleDescription = this.module.M_Description;
        var moduleTrigger = this.module.M_Trigger;
        var datatableInstance = this.datatableInstance;
        var csrfToken = this.csrfToken;

        $(document).on('click', '.module-item-delete', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            swal({
                title: "You are about to delete an entry",
                text: "Delete " + moduleDescription + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ed5565",
                confirmButtonText: "Yes, delete the document!",
                closeOnConfirm: true
            }, function () {
                $.ajax({
                    url: globals.baseUrl + "/" + moduleTrigger + "/" + id,
                    type: 'DELETE',
                    headers: {'X-CSRF-TOKEN': csrfToken},
                    success: function (response) {
                        console.log(response);
                        swal("Deleted!", "The document has been deleted.", "success");
                        datatableInstance.ajax.reload();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.error(xhr);
                        console.error(ajaxOptions);
                        console.error(thrownError);
                        swal("Error", "Failed to deleted the document, please try again later", "error");
                    }
                });
            });
        });
    };
    ModuleListProcessor.prototype.initializeBatchFunctions = function () {

        var instance = this;
        $('[data-trigger="activate"]').click(function (e) {
            e.preventDefault();
            instance.batchSetActive(true);
        });
        $('[data-trigger="deactivate"]').click(function (e) {
            e.preventDefault();
            instance.batchSetActive(false);
        });
    };
    ModuleListProcessor.prototype.batchSetActive = function (active) {

        //  get all selected records
        var documentIdList = [];
        var datatableInstance = this.datatableInstance;
        $(this.checkboxSelector).each(function () {
            documentIdList.push($(this).attr('id'));
        });
        if (documentIdList.length <= 0) {
            swal("Validation", "Please select documents to process", "error");
            return;
        }

        console.log(documentIdList);
        var formData = new FormData();
        formData.append("idList[]", documentIdList);
        var action = active ? this.setActiveFunction : this.setInactiveFunction;
        this.moduleProcessor.sendAction(action, null, {idList: documentIdList}, function (response) {
            console.log(response);
//            window.location.reload();
            datatableInstance.ajax.reload();
            $('.toggle-check').attr('checked', false);
        });
    };
})();