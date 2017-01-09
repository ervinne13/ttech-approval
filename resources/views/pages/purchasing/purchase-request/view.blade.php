@extends('layouts.top-nav')

@section('css')

<style>
    .form-group {
        margin-bottom: 4px;
    }
</style>

@endsection

@section('js')

<script src="{{ url("js/sg-approval-functions.js") }}"></script>

<script type="text/javascript">
var documentTrackList = {!! $documentTrackList !!}
;
</script>

<script type="text/html" id="document-tracking-template">
    @include('templates.document-tracking-table')
</script>

@endsection

@section('page-content')
<div class="row">

    <div class="col-lg-12">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h5>Purchase Request</h5>
                <!--                <div class="ibox-tools">
                                    <a class="dropdown-toggle m-r-md" data-toggle="dropdown" href="#">
                                        <i class="fa fa-bolt"></i>
                                        Functions
                                    </a>
                                    <ul class="dropdown-menu dropdown-user" id="sg-approval-function-container" data-module-id="{{$moduleId}}" data-document-number="{{$PR->PR_DocNo}}">
                                        @if ($PR->PR_Status == "Pending")
                                        <li>
                                            <a href="#" id="action-approve" data-action="approve" class="text-navy sg-approval-function">
                                                <i class="fa fa-check"></i>
                                                Approve
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" id="action-reject" data-action="reject" class="text-danger sg-approval-function sg-requires-remarks">
                                                <i class="fa fa-remove"></i>
                                                Reject
                                            </a>
                                        </li>
                                        @endif
                                        <li>
                                            <a href="#" id="action-track" class="text-blue">
                                                <i class="fa fa-book"></i>
                                                Track Document
                                            </a>
                                        </li>
                                    </ul>
                
                                    <a class="collapse-link">
                                        <i class="fa fa-chevron-up"></i>
                                    </a>
                
                                </div>-->
            </div>
            <div class="ibox-content">

                <div class="row m-b-md">
                    <div class="col-lg-4">
                        <h1 class="no-margins text-navy pull-left">
                            {{$PR->PR_DocNo}}
                        </h1>
                        <div class="font-bold pull-left">
                            Created By: {{$PR->createdByUser->U_Username}} ({{$PR->CreatedBy}})
                        </div>
                    </div>                      

                    <div class="col-lg-3 col-lg-offset-5">
                        <h2 class="no-margins text-navy pull-right">
                            P {{number_format($PR->PR_Amount, 2)}}                    
                        </h2>
                        <div class="font-bold pull-right">Document Total Amount of {{count($PR->details)}} Item(s)</div>
                    </div>

                </div>

                <hr>

                <div class="row">

                    <!--Column 1-->
                    <div class="col-lg-4">
                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Ext. Doc. No.:</label>
                            <div class="col-md-7">
                                <p>{{$PR->PR_ExtDocNo}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Remarks:</label>
                            <div class="col-md-7">
                                <p>{{$PR->PR_Remarks}}</p>
                            </div>
                        </div>
                    </div>

                    <!--End of column 1-->

                    <!--Column 2-->

                    <div class="col-lg-4">
                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Doc. Date:</label>
                            <div class="col-md-7">
                                <p>{{date('m/d/Y', strtotime($PR->PR_DocDate))}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Date Needed:</label>
                            <div class="col-md-7">
                                <p>{{date('m/d/Y', strtotime($PR->PR_DateRequired))}}</p>
                            </div>
                        </div>
                    </div>
                    <!--End of Column 2-->

                    <!--Column 3-->
                    <div class="col-lg-4">
                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Company:</label>
                            <div class="col-md-7">
                                <p>{{$PR->location->company->COM_Name}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Location:</label>
                            <div class="col-md-7">
                                <p>{{$PR->location->SP_StoreName}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Status:</label>
                            <div class="col-md-7">
                                <p>{{$PR->PR_Status}}</p>
                            </div>
                        </div>
                    </div>

                    <!--End of column 3-->

                </div>

            </div>
        </div>
    </div>


    <div class="col-lg-12">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h5>Purchase Order Details</h5>
                <div class="ibox-tools">
                    <a class="collapse-link">
                        <i class="fa fa-chevron-up"></i>
                    </a>
                </div>
            </div>
            <div class="ibox-content">

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>

                                <th></th>
                                <th>Item Number</th>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>UOM</th>
                                <th>Unit Price</th>
                                <th>Total Cost</th>
                                <th>Comment</th>
                                <th>Ref. To</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($PR->details AS $detail)
                            <tr>
                                <td></td>
                                <td>{{ $detail->PRD_ItemNo }}</td>
                                <td>{{ $detail->PRD_ItemDescription }}</td>
                                <td>{{ number_format($detail->PRD_Qty) }}</td>
                                <td>{{ $detail->UOMAttribute->AD_Desc }}</td>
                                <td>{{ number_format($detail->PRD_UnitPrice, 2) }}</td>
                                <td>{{ number_format($detail->PRD_Amount, 2) }}</td>
                                <td>{{ $detail->PRD_Comments }}</td>                                
                                <td>{{ $detail->PRD_RefTo }}</td>
                            </tr>
                            @endforeach                            
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>            

    <div class="col-lg-12">
        <div class="ibox float-e-margins">            
            <div class="ibox-content">
                <div class="pull-right" id="sg-approval-function-container" data-module-id="{{$moduleId}}" data-document-number="{{$PR->PR_DocNo}}">
                    @if ($PR->PR_Status == "Pending")
                    <button id="action-approve" data-action="approve" class="btn btn-sm btn-primary m-t-n-xs sg-approval-function" type="button">
                        <strong>
                            <i class="fa fa-check"></i> Approve
                        </strong>
                    </button>

                    <button id="action-reject" data-action="reject" class="btn btn-sm btn-danger m-t-n-xs sg-approval-function sg-requires-remarks" type="button">
                        <i class="fa fa-remove"></i>
                        Reject
                    </button>
                    @endif

                    <button id="action-track" data-action="track" class="btn btn-sm btn-info m-t-n-xs sg-approval-function sg-requires-remarks" type="button">
                        <i class="fa fa-book"></i>
                        Track Document
                    </button>
                </div>

                <div class="clearfix"></div>
            </div>
        </div>
    </div>

</div>


@endsection