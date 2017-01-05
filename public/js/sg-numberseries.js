/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function ($) {

    var RESERVE_NS_URL = "/administration/no-series/reserve/";
    $.fn.SGNumberSeries = function (options) {

        //  avoid undefined exception
        if (!options) {
            options = {};
        }

        this.moduleId = $(this).data('module-id');
        this.$heading = $(this.selector + ' .doc-no-label');
        this.$spinner = $(this.selector + ' .sk-spinner');
        this.$actionUseNSId = $('#action-use-ns-id').ladda();
        this.$NSSelectorContainer = $(this.selector + ' .doc-no-id-selection');
        this.$NSSelector = $(this.selector + ' .doc-no-id-selection select').SGSelect({
            valueKey: 'NS_Id',
            textKey: 'NS_Description',
            dataAttributes: [
                'NS_LastNoUsed'
            ]
        });

        var _this = this;

        this.showLoading = function (show) {

            if (show) {
                _this.$heading.css('display', 'none');
                _this.$spinner.css('display', 'block');
            } else {
                _this.$heading.css('display', 'inline');
                _this.$spinner.css('display', 'none');
            }
        };

        this.setNSSelectorOptions = function (options) {
            _this.$NSSelector.setOptions(options);
            _this.$NSSelector.trigger('chosen:updated');
        };

        this.showNSSelector = function (show) {
            if (show) {
                _this.$NSSelectorContainer.css('display', 'block');
                _this.$heading.css('display', 'none');
            } else {
                _this.$NSSelectorContainer.css('display', 'none');
                _this.$heading.css('display', 'block');
            }
        };

        this.getNumberSeries = function (callbacks, NSId) {
            var url = RESERVE_NS_URL + _this.moduleId;

            if (NSId) {
                url += "?NSId=" + NSId;
            }

            $.get(url, function (response) {
                callbacks.always(response);
                if (response.result == "NS_ID_GENERATED") {
                    callbacks.onNumberSeriesGenerated(response.generatedNumberSeries);
                } else if (response.result == "MULTIPLE_NS_ID") {
                    callbacks.onMultipleNumberSeriesDetected(response.numberSeriesIdList);
                }
            });
        };

        this.getNumberSeriesWithNSId = function (NSId) {
            _this.getNumberSeries({
                onNumberSeriesGenerated: function (generatedNumber) {
                    $(_this.selector + ' h4 span').html(generatedNumber);
                    _this.showNSSelector(false);

                    if (options.updateField) {
                        $(options.updateField).val(generatedNumber);
                    }
                },
                onMultipleNumberSeriesDetected: function (NSIdList) {
                    _this.setNSSelectorOptions(NSIdList);
                    _this.showNSSelector(true);
                },
                always: function () {
                    _this.showLoading(false);
                    _this.$actionUseNSId.ladda('stop');
                }
            }, NSId);
        };

        this.$actionUseNSId.click(function () {
            var NSId = _this.$NSSelector.val();
            _this.$actionUseNSId.ladda('start');
            _this.getNumberSeriesWithNSId(NSId);
        });

        if (!this.data('number')) {
            this.getNumberSeriesWithNSId(null);
            this.showLoading(true);
        }        

    };
})(jQuery);