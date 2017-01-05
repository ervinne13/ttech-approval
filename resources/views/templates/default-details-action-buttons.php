<div class="pull-right m-b-lg">
    <% if(mode == "create") { %>
    <button id="action-save-new-detail" type="button" class="btn btn-sm btn-primary btn-flat">
        <i class="fa fa-plus"></i> Save And New
    </button>
    <button id="action-save-close-detail" type="button" class="btn btn-sm btn-info btn-flat">
        <i class="fa fa-save"></i> Save And Close
    </button>
    <% } else if (mode == "edit") { %>
    <button id="action-update-next-detail" type="button" class="btn btn-sm btn-success btn-flat" data-id="<%=id%>">
        <i class="fa fa-check"></i> Update And Next
    </button>
    <button id="action-update-close-detail" type="button" class="btn btn-sm btn-primary btn-flat" data-id="<%=id%>">
        <i class="fa fa-save"></i> Update And Close
    </button>
    <% } %>

    <button id="action-close-detail" type="button" class="btn btn-sm btn-default btn-flat">
        <i class="fa fa-close"></i> Close
    </button>

</div>

<div class="clearfix"></div>