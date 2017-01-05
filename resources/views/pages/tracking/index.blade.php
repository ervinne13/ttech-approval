@extends('layouts.top-nav')

@section('page-content')
<div class="row">

    <div class="col-lg-12">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
                <h5>Document Tracking</h5>              
            </div>
            <div class="ibox-content">

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>

                                <th></th>
                                <!--<th>Document Type</th>-->
                                <th>Document Number</th>
                                <th>Document Date</th>
                                <th>Sender</th>                                
                                <th>Approver</th>                                
                                <th>Status</th>
                                <th>Location</th>
                                <th>Entry Date</th>
                                <th>Viewed?</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($docTrackList AS $docTrack)

                            @if ($docTrack->currentDocumentTrack->approverPosition->P_Position_id == $docTrack->DT_Approver || $docTrack->DT_Unlimited == 1)

                            <?php
                            //  Compute date difference from today
                            $today   = new DateTime();
                            $docDate = new DateTime($docTrack->DT_DocDate);
                            // reset time part, to prevent partial comparison
                            $today->setTime(0, 0, 0);
                            $docDate->setTime(0, 0, 0);

                            $diff     = $docDate->diff($today);
                            $diffDays = (integer) $diff->format("%R%a"); // Extract days count in interval                           
                            ?>

                            <tr>
                                <td>                                   
                                    <a href="{{ url(SGGetDocumentViewURL($docTrack->DT_DocNo)) }}">
                                        <i class="fa fa-search"></i>
                                    </a>
                                </td>                                
                                <!--<td>{{$docTrack->DT_DocType}}</td>-->
                                <td>{{$docTrack->DT_DocNo}}</td>
                                <td>
                                    {{date('m/d/Y', strtotime($docTrack->DT_DocDate)) }}
                                    @if ($diffDays == 0)
                                    <span class="label label-primary">Today</span>
                                    @elseif ($diffDays == 1)
                                    <span class="label label-primary">Yesterday</span>
                                    @elseif ($diffDays < 4))
                                    <span class="label label-warning">{{$diffDays}} days ago</span>
                                    @else
                                    <span class="label label-danger">{{$diffDays}} days ago</span>
                                    @endif                                    
                                </td>
                                <td>{{$docTrack->sender->P_Position}}</td>                                
                                <td>{{$docTrack->currentDocumentTrack->approverPosition->P_Position}}</td>
                                <td>{{$docTrack->DT_Status}}</td>
                                <td>{{$docTrack->DT_Location}}</td>
                                <td>{{$docTrack->DT_EntryDate}}</td>
                                <td>
                                    @if ($docTrack->DT_Viewed == '1')
                                    <a href="#"><i class="fa fa-check text-navy"></i></a>
                                    @else
                                    <a href="#"><i class="fa fa-circle text-primary"></i></a>
                                    @endif
                                </td>
                            </tr>

                            @endif

                            @endforeach                            
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>

</div>

@endsection