@extends('layouts.top-nav')

@section('js')
<script src="{{ url("js/pages/change-password/form.js") }}"></script>
@endsection

@section('page-content')
<div class="row">

    <div class="col-lg-6 col-lg-offset-3">
        <div class="ibox float-e-margins">            
            <div class="ibox-content">
                <div class="row m-b-lg">
                    <div class="col-sm-12">
                        <h1 class="text-navy pull-right">
                            {{Auth::user()->U_Username}}
                        </h1>
                        <div class="font-bold">Change Password</div>                
                    </div>
                </div>

                <div class="row m-t-lg">
                    <div class="col-sm-12">                    
                        <input type="password" name="old_password" class="form-control" placeholder="Type in your current password">
                    </div>
                </div>

                <div class="row m-t-lg">
                    <div class="col-sm-12">                    
                        <input type="password" name="new_password" class="form-control" placeholder="Type in your new password">
                    </div>                    

                    <div class="col-sm-12 m-t-sm">                    
                        <input type="password" name="new_password_repeat" class="form-control" placeholder="Repeat your new password">
                    </div>

                </div>

                <div class="m-t-md"></div>

                <button class="btn btn-primary col-lg-6" id="action-update-password">Update Password</button>
                <a href="/" class="btn btn-default col-lg-6">Cancel</a>                

                <div class="clearfix"></div>
            </div>
        </div>
    </div>

</div>

@endsection