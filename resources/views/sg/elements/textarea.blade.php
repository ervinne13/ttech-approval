<div class="form-group sg-small-field-group {{$field}}-form-group col-md-12">
    <label class="control-label col-md-5">{{$label}}:</label>
    <div class="col-md-7">
        @if ($mode == 'view')
        <p class="form-view-value">{{$value}}</p>
        @else
        <textarea name="{{$field}}" class="form-control {{$additionalClasses}}" {{$attributes}}>{{$value}}</textarea>
        @endif
    </div>
</div>