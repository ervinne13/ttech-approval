<!DOCTYPE html>
<html>

    <head>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        @include('layouts.parts.head')
        @yield('css')

    </head>

    <body class="top-navigation">

        <div id="wrapper">
            <div id="page-wrapper" class="gray-bg">
                <div class="row border-bottom white-bg">
                    <nav class="navbar navbar-static-top" role="navigation">
                        <div class="navbar-header">
                            <button aria-controls="navbar" aria-expanded="false" data-target="#navbar" data-toggle="collapse" class="navbar-toggle collapsed" type="button">
                                <i class="fa fa-reorder"></i>                                
                            </button>
                            <a href="#" class="navbar-brand">{!! Config::get('app.name') !!}</a>                            
                        </div>                        
                        <div class="navbar-collapse collapse" id="navbar">
                            <ul class="nav navbar-nav">
                                <li class="active">
                                    <!--<a aria-expanded="false" role="button" href="{{url('/administration/users')}}/{{Auth::user()->U_User_id}}/edit">--> 
                                    <a aria-expanded="false" role="button" href="#"> 
                                        Welcome {{Auth::user()->U_Username}}
                                    </a>
                                </li>
                                <li class="dropdown">
                                    <a aria-expanded="false" role="button" href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        Options
                                        <span class="caret"></span>
                                    </a>
                                    <ul role="menu" class="dropdown-menu">
                                        <li><a href="{{url('/change-password')}}">Change My Password</a></li>
                                    </ul>
                                </li>
                            </ul>
                            <ul class="nav navbar-top-links navbar-right">
                                <li>
                                    <a href="/logout">
                                        <i class="fa fa-sign-out"></i> Log out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div class="wrapper wrapper-content">
                    <div class="container">
                        @yield('page-content')
                    </div>

                </div>
                <div class="footer">
                    <div class="pull-right">                        
                    </div>
                    <div>
<!--                        <strong>Copyright</strong> Example Company &copy; 2014-2017-->
                    </div>
                </div>

            </div>
        </div>

        @include('layouts.parts.default-js')
        @yield('js')

    </body>

</html>
