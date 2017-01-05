<div class="form-group sg-small-field-group {{$field}}-form-group col-md-12 {{$hidden ? "hidden" : ""}}">
    <label class="control-label col-md-5">{{$label}}:</label>
    <div class="col-md-7">
        @if ($mode == 'view')
        <p class="form-view-value {{$additionalClasses}}" {{$attributes}}>{{$value}}</p>
        @else      
        <input style="width: 100%; {{$hidden}}" type="{{$type}}" name="{{$field}}" class="form-control sg-small-field input-sm {{$additionalClasses}}" value="{{$value}}" {{$attributes}}>
        @endif
    </div>
</div>