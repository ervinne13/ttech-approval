@extends('layouts.inspinia-top-nav-bar')

@section('css')
<style>
    .center-icon{
        display:inline-block;               
    }

    .grid-item {
        width: 300px;
    }

    .grid {
        width: 1000px;
        margin: auto;
    }
</style>
@endsection

@section('js')  
<script src="/vendor/inspinia/js/plugins/masonary/masonry.pkgd.min.js"></script>
<script type="text/javascript">
    $(document).ready(function () {
        $('.grid').masonry({
            // options
            itemSelector: '.grid-item',
            columnWidth: 300,
            gutter: 25
        });
    });
</script>
@endsection

@section('content')

@endsection