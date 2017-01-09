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
                <h5>Purchase Order</h5>
                <!--                <div class="ibox-tools">
                                    <a class="dropdown-toggle m-r-md" data-toggle="dropdown" href="#">
                                        <i class="fa fa-bolt"></i>
                                        Functions
                                    </a>
                                    <ul class="dropdown-menu dropdown-user" id="sg-approval-function-container" data-module-id="{{$moduleId}}" data-document-number="{{$PO->PO_DocNo}}">
                                        @if ($PO->PO_Status == "Pending")
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
                            {{$PO->PO_DocNo}}
                        </h1>
                        <div class="font-bold pull-left">
                            Created By: {{$PO->createdByUser->U_Username}} ({{$PO->CreatedBy}})
                        </div>
                    </div>

                    <div class="col-lg-3 col-lg-offset-5">
                        <h2 class="no-margins text-navy pull-right">
                            P {{number_format($PO->PO_Amount, 2)}}                    
                        </h2>
                        <div class="font-bold pull-right">Document Total Amount of {{count($PO->details)}} Item(s)</div>
                    </div>
                </div>

                <hr>

                <div class="row">

                    <!--Column 1-->

                    <div class="col-lg-6">
                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Supplier Name:</label>
                            <div class="col-md-7">
                                <p>{{$PO->PO_SupplierName}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Supplier ID:</label>
                            <div class="col-md-7">
                                <p>{{$PO->PO_SupplierID}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Supplier Address:</label>
                            <div class="col-md-7">
                                <p>{{$PO->PO_SupplierAddress}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Payment Terms:</label>
                            <div class="col-md-7">
                                <p>{{$PO->paymentTerm->PT_Desc}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Due Date:</label>
                            <div class="col-md-7">
                                <p>{{date('m/d/Y', strtotime($PO->PO_DueDate))}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Remarks:</label>
                            <div class="col-md-7">
                                <p>{{$PO->PO_Remarks}}</p>
                            </div>
                        </div>

                    </div>

                    <!--End of column 1-->

                    <!--Column 2-->

                    <div class="col-lg-6">
                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Document Date:</label>
                            <div class="col-md-7">
                                <p>{{date('m/d/Y', strtotime($PO->PO_DocDate))}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Validity Date:</label>
                            <div class="col-md-7">
                                <p>{{date('m/d/Y', strtotime($PO->PO_ValidityDate))}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Expected Delivery Date:</label>
                            <div class="col-md-7">
                                <p>{{date('m/d/Y', strtotime($PO->PO_ExpectedDeliveryDate))}}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">External Doc. No:</label>
                            <div class="col-md-7">
                                <p>{{ $PO->PO_ShipmentNo }}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Supplier Ref.No:</label>
                            <div class="col-md-7">
                                <p>{{ $PO->PO_SupplierInvoice }}</p>
                            </div>
                        </div>

                        <div class="form-group sg-small-field-group col-md-12">
                            <label class="control-label col-md-5">Status:</label>
                            <div class="col-md-7">
                                <p class="text-navy">{{ $PO->PO_Status }}</p>
                            </div>
                        </div>


                    </div>

                    <!--End of Column 2-->
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
                                <th>Unit Cost</th>
                                <th>Total Cost</th>
                                <th>Comment</th>
                                <th>Ref. From</th>
                                <th>Ref. To</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($PO->details AS $detail)
                            <tr>
                                <td></td>
                                <td>{{ $detail->POD_ItemNo }}</td>
                                <td>{{ $detail->POD_ItemDescription }}</td>
                                <td>{{ number_format($detail->POD_Qty) }}</td>
                                <td>{{ $detail->UOMAttribute->AD_Desc }}</td>
                                <td>{{  number_format($detail->POD_UnitPrice, 2) }}</td>
                                <td>{{  number_format($detail->POD_Total, 2) }}</td>
                                <td>{{ $detail->POD_Comments }}</td>
                                <td>{{ $detail->POD_RefFrom }}</td>
                                <td>{{ $detail->POD_RefTo }}</td>
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
                <div class="pull-right" id="sg-approval-function-container" data-module-id="{{$moduleId}}" data-document-number="{{$PO->PO_DocNo}}">
                    @if ($PO->PO_Status == "Pending")
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