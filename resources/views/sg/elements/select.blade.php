<div class="form-group {{$field}}-form-group sg-small-field-group col-md-12">
    <label class="control-label col-xs-5">{{$label}}:</label>
    <div class="col-xs-7">

        <?php
        if (!is_array($options)) {
            $options = $options->toArray();
        }
        ?>

        @if (isset($mode) && $mode == 'view')
        <p class="form-view-value">{{isset($value) ? $value : ""}}</p>        
        @else

        <select name="{{$field}}" style="width: 100%" class="chosen-select sg-small-field form-control {{$additionalClasses}}" {{$multipleProperty}} {{$attributes}}>
            @if (!$multiple)            
            <option value="" disabled {{isset($value) && $value ? "" : "selected"}}></option>
            @endif

            @foreach($options AS $key => $option)
            <?php
            if (is_object($option)) {
                $option = $option->toArray();
            }

            if (is_array($option) && !array_key_exists($optionValueField, $option)) {
                throw new Exception("The specified optionValueField {$optionValueField} does not exist in the options");
            }

            $optionValue = isset($optionValueField) && $optionValueField ? $option[$optionValueField] : $key;

            if ($multiple) {
                if (!is_array($value)) {
                    $value = explode(",", $value);
                }

                $selected = (isset($value) && in_array($optionValue, $value)) ? "selected" : "";
            } else {
                $selected = (isset($value) && $value == $optionValue) ? "selected" : "";
            }
            ?>

            <?php
            $dataProperties = "";

            foreach ($data AS $key => $optionField) {
                $dataProperties .= "data-{$key}=\"{$option[$optionField]}\"";
            }
            ?>

            <option value="{{$optionValue}}" {!!$dataProperties!!} {{$selected}}>
                {{isset($optionDisplayField) ? $option[$optionDisplayField] : $option}}
            </option>
            @endforeach
        </select>
        @endif        
    </div>
</div>