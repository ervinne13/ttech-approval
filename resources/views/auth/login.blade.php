
<!DOCTYPE html>
<html>

    <head>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{Config::get('app.name')}}</title>

        <link href="/vendor/inspinia/css/bootstrap.min.css" rel="stylesheet">
        <link href="/vendor/font-awesome/css/font-awesome.css" rel="stylesheet">

        <link href="/vendor/inspinia/css/animate.css" rel="stylesheet">
        <link href="/vendor/inspinia/css/style.css" rel="stylesheet">
        <link href="/css/app.css" rel="stylesheet">

    </head>

    <body class="gray-bg">

        <div class="loginColumns animated fadeInDown">
            <div class="row">

                <div class="col-md-6">
                    <h1 class="no-margins pull-right" style="font-size: 65px;">
                        <!--<span class="large-text-blue">S</span><span class="large-text-ora                                    nge">G</span-->
                    </h1>
                    <h2 class="font-bold m-b-lg"> {!! Config::get('app.name_html') !!}</h2>

                    <h5>TTech Info Here</h5>

                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                </div>
                <div class="col-md-6">
                    <div class="ibox-content">
                        <form class="m-t" role="form" method="POST" action="{{ url('/login') }}">
                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                            <div class="form-group">
                                <input type="text" name="U_User_id" class="form-control" placeholder="Username" required="">
                                @if ($errors->has('U_User_id'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('U_User_id') }}</strong>
                                </span>
                                @endif
                            </div>
                            <div class="form-group">
                                <input type="password" name="password" class="form-control" placeholder="Password" required="">
                                @if ($errors->has('password'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                                @endif
                            </div>
                            <button type="submit" class="btn btn-primary block full-width m-b">Login</button>

                            <!--
                            <a href="#">
                                <small>Forgot password?</small>
                            </a>

                            <p class="text-muted text-center">
                                <small>Do not have an account?</small>
                            </p>
                            <a class="btn btn-sm btn-white btn-block" href="#">Request for an account</a>
                            -->
                        </form>
                        <p class="m-t">
                            <small>{{Config::get('app.name')}} &copy; 2016</small>
                        </p>
                    </div>
                </div>
            </div>
            <hr/>
            <div class="row">
                <div class="col-md-6">
                    Copyright  {!! env('APP_ORGANIZATION_NAME_HTML') !!}
                </div>
                <div class="col-md-6 text-right">
                    <small>© {{ env('APP_VERSION_COPYRIGHT_YEAR') }}</small>
                </div>
            </div>
        </div>

    </body>

</html>
