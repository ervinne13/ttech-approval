
<div class="table-responsive">
    <table class="table table-striped">
        <thead>
            <tr>
                <th></th>
                <th>Entry Date</th>
                <th>Approver Position</th>
                <th>Approver</th>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            <% _.each(documentTrackList, function(documentTrack) { %>

            <%
            var statusLabelColorClass = "label-primary";

            switch(documentTrack.DT_Status) {
            case "Pending":
            statusLabelColorClass = "label-warning";
            break;
            case "Skipped":
            statusLabelColorClass = "label-default";
            break;
            case "Rejected":
            statusLabelColorClass = "label-danger";
            break;
            case "Approved":
            statusLabelColorClass = "label-primary";
            break;
            default:             
            statusLabelColorClass = "label-blue";            
            }

            %>

            <tr>
                <td></td>
                <td>
                    <%= moment(documentTrack.DT_EntryDate).format("MM/DD/YYYY") %>
                </td>
                <td style="text-align: left;"><%= documentTrack.approver_position.P_Position %></td>
                <td style="text-align: left;"><%= documentTrack.approved_by ? documentTrack.approved_by.U_Username : "" %></td>
                <td style="text-align: left;"><%= documentTrack.DT_ApprovedDate %></td>
                <td style="text-align: left;">
                    <span class="label <%= statusLabelColorClass %>">
                        <%= documentTrack.DT_Status %>
                    </span>                    
                </td>
                <td><%= documentTrack.DT_Remarks %></td>
            </tr>
            <% }); %>
        </tbody>
    </table>
</div>
