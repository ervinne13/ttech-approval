
/**
 * <pre>
 * --------------------------------
 * JQuery Plugin SGSelect
 * 
 *  Adds binding functionality to a select element.
 *  Ex.
 *  
 *       var $customerName = $('[name=SI_CustomerName]').SGSelect();
 *       $customerName.bind([
 *         {
 *              selector: "[name=SI_CustomerID]",
 *              type: "input",
 *              attribute: "C_Id"
 *         }
 *       ]);
 * 
 * Everytime [name=SI_CustomerName] changes, [name=SI_CustomerID]'s value will
 * be equal to [name=SI_CustomerName] data-c_id attribute
 *  
 * --------------------------------
 * </pre>
 * 
 * @author Ervinne Sodusta
 */

(function ($) {
    "use strict";

    $.fn.SGSelect = function (sgOptions) {

        //  prevent undefined options for checking
        if (!sgOptions) {
            sgOptions = {};
        }

        var _this = this;
        this.sgOptions = sgOptions;

        this.bind = function (bindElements) {
            _this.boundDependents = bindElements;
            $(_this).on('change', function () {

                //  avoid leak, use boundDependents as the bound elements
                var boundElements = _this.boundDependents;
                for (var i in boundElements) {

                    var didSomething = false;

                    if (bindElements[i].selector) {
                        _this.updateDependent(bindElements[i]);
                        didSomething = true;
                    }

                    if (bindElements[i].onChange) {
                        bindElements[i].onChange(_this);
                        didSomething = true;
                    }

                    if (!didSomething) {
                        console.warn('SGSelect', 'Untriggered ' + JSON.stringify(boundElements[i]));
                    }

                }
            });

            for (var i in bindElements) {
                if (_this.val()) {
                    if (bindElements[i].selector) {
                        _this.updateDependent(bindElements[i]);
                    }

                    if (bindElements[i].onChange) {
                        bindElements[i].onChange(_this);
                    }
                }
            }

        };

        this.getSelectedDataAttributeValue = function (dataAttribute) {
            return $(_this).find(":selected").data(dataAttribute.toLowerCase());
        };

        this.updateDependent = function (bindElement) {
            bindElement.type = bindElement.type ? bindElement.type : 'input';   //  defaults to input

            switch (bindElement.type) {
                case "input":
                case "textarea":
                    _this.updateInput(bindElement);
                    break;
                case "select":
                    _this.updateSelect(bindElement);
                    break;
            }
        };

        this.updateInput = function (el) {
            if (el.attribute) {
                var attributeValue = _this.getSelectedDataAttributeValue(el.attribute);
                $(el.selector).val(attributeValue).trigger("change");
            }
        };

        this.updateSelect = function (el) {
            if (el.optionsDataUrl || el.optionsDataUrlSource) {

                var dataUrl;

                if (el.optionsDataUrl) {
                    dataUrl = el.optionsDataUrl;
                } else if (el.optionsDataUrlSource) {
                    dataUrl = el.optionsDataUrlSource(_this);
                }

                if (!dataUrl || !el.sgSelectInstance) {
                    console.error('SGSelect', 'optionsDataUrl or optionsDataUrlSource and sgSelectInstance are required when binding select elements');
                    return;
                }

                _this.setOptionsByAjax(el, dataUrl);
            }

            if (el.attribute) {
                var attributeValue = _this.getSelectedDataAttributeValue(el.attribute);
                $(el.selector).val(attributeValue).trigger("change");
            }
        };

        //
        /*     * ************************************************************************* */
        //  <editor-fold defaultstate="collapsed" desc="Element Setter Functions">

        this.setOptionsByAjax = function (bindElementData, url) {
            var getRequest = $.get(url, function (response) {
//                bindElementData.sgSelectInstance.prop('disabled', false);
                try {
                    if (typeof response === "string") {
                        response = JSON.parse(response);
                    }

                    bindElementData.sgSelectInstance.setOptions(response);
                } catch (e) {
                    //  in case of unparseable JSON response
                    if (bindElementData.onAjaxFail) {
                        bindElementData.onAjaxFail("Invalid JSON response: " + response);
                    }

                    console.error('SGSelect', e);
                }
            });

//            bindElementData.sgSelectInstance.prop('disabled', true);

            if (bindElementData.onAjaxFail) {
//                bindElementData.sgSelectInstance.prop('disabled', false);
                getRequest.fail(bindElementData.onAjaxFail);
            }

        };

        this.setOptions = function (objectOptions) {
            console.log(objectOptions);

            //  required valueKey, textKey
            if (!sgOptions.valueKey) {
                sgOptions.valueKey = "id";
            }

            if (!sgOptions.textKey) {
                sgOptions.textKey = "text";
            }

            _this.html('');
            var items = [];
            for (var i in objectOptions) {
                items.push({
                    id: objectOptions[i][sgOptions.valueKey],
                    text: objectOptions[i][sgOptions.textKey]
                });

                //  will automatically add data attributes if the option dataAttributes
                //  is filled up with ids of attributes
                var attributes = "";
                if (sgOptions.dataAttributes) {
                    var dataAttributes = sgOptions.dataAttributes;
                    for (var k in dataAttributes) {
                        attributes += 'data-' + dataAttributes[k] + '="' + objectOptions[i][dataAttributes[k]] + '" ';
                    }
                }

                console.log(_this.selector);

                _this.append('<option value="' + objectOptions[i][sgOptions.valueKey] + '" ' + attributes + '>' + objectOptions[i][sgOptions.textKey] + '</option>');
            }

            var lazyVal = _this.data('lazy-value');
            if (lazyVal) {
                _this.val(lazyVal);
                _this.removeAttr('data-lazy-value');
            }

            _this.trigger('change');
            console.log('sg-select change');
            _this.trigger('chosen:updated');

        };

        // </editor-fold>

        return this;
    };

})(jQuery);
