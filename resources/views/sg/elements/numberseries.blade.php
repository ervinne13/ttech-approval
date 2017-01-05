<div id="generated-doc-no-container" class="pull-left" data-module-id="{{$module->M_Module_id}}" data-number="{{$number}}">

    @include('sg.spinners.cube-grid')

    @if (isset($number) && $number)
    <h4 class="doc-no-label text-muted">{{$module->M_Description}} <span class="text-navy">{{$number}}</span></h4>
    @else
    <h4 class="doc-no-label text-muted"> {{$module->M_Description}} <span class="text-navy"></span>
    </h4>
    @endif    

    <h4 class="doc-no-id-selection text-muted" style="display: none">
        Select Number Series ID to Use
        <select name="select-number-series-id" class="sg-small-field">
        </select>

        <button id="action-use-ns-id" class="ladda-button btn btn-sm btn-primary"  data-style="zoom-in">Use</button>
    </h4>

</div>