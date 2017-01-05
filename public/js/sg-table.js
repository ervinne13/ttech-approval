
/* global _, globals, SGFormatter */

(function ($) {

    "use strict";

    //  Static Views    
    var closeRowActionIcon = '<span class="fa fa-caret-down"></span>';
    var openRowActionIcon = '<span class="fa fa-edit"></span>';
    var removeRowActionIcon = '<span class="fa fa-remove"></span>';

    //  Events
    var EVENT_ON_OPEN_ROW = "openRow";

    //  Templates
    var dropdownRowTemplate;
    var dropdownRowCreateActionsTemplate;
    var dropdownRowEditActionsTemplate;

    //  States
    var columnCount;

    //  Custom lightweight highlight
    $.fn.highlight = function (color) {
        $(this).each(function () {
            var el = $(this);
            $("<div/>")
                    .width(el.outerWidth())
                    .height(el.outerHeight())
                    .css({
                        "position": "absolute",
                        "left": el.offset().left,
                        "top": el.offset().top,
                        "background-color": color,
                        "opacity": ".7",
                        "z-index": "9999999",
                        "border-top-left-radius": parseInt(el.css("borderTopLeftRadius"), 10),
                        "border-top-right-radius": parseInt(el.css("borderTopRightRadius"), 10),
                        "border-bottom-left-radius": parseInt(el.css("borderBottomLeftRadius"), 10),
                        "border-bottom-right-radius": parseInt(el.css("borderBottomRightRadius"), 10)
                    }).appendTo('body').fadeOut(1800).queue(function () {
                $(this).remove();
            });
        });
    };

    $.fn.SGTable = function (sgOptions) {
        this.sgOptions = validateAndInitializeOptions(this, sgOptions);

        var _this = this;
        this.indexedRowIdList = [];

        //      
        /*     * ************************************************************************* */
        //  <editor-fold defaultstate="collapsed" desc="Table Data Functions">

        this.getOpenRowData = function () {

            var cols = this.sgOptions.columns;

            var formData = {};

            for (var key in cols) {
                var value = $('[name=' + key + ']').val();
                if (cols[key].autoNumeric) {
                    value = $('[name=' + key + ']').autoNumeric('get');
                }

                formData[key] = value;
            }

            return formData;

        };

        this.getModifiedData = function () {
            var $modifiedRows = $('.' + _this.generateRowClassName()).filter('[data-state="updated"],[data-state="created"]');
            var modifiedRows = [];
            $modifiedRows.each(function () {
                var id = $(this).data('id');
                modifiedRows.push(_this.getRowData(id));
            });

            return modifiedRows;

        };

        this.getRowData = function (rowId) {
            var dataRowSelector = '.' + _this.generateRowClassName() + '[data-id=' + rowId + ']';
            var dataColSeletor = '.' + _this.generateRowClassName() + '[data-id=' + rowId + '] td.data-col';

            var data = {
                rowState: $(dataRowSelector).data('state')
            };

            $(dataColSeletor).each(function () {
                var name = $(this).data('name');
                var value = $(this).data('value');

                data[name] = value;
            });

            return data;
        };

        this.setData = function (data) {
            _this.clearTable();
            for (var i in data) {
                //  false = don't highlight
                _this.addRow(data[i], false, 'unmodified');
            }
        };

        this.indexRows = function () {
            var rowSelector = 'tr.' + _this.generateRowClassName();

            _this.indexedRowIdList = [];
            $(rowSelector).each(function () {
                _this.indexedRowIdList.push($(this).data('id'));
            });

        };

        this.updateRow = function (id, rowData, noHighlight) {
            var cols = _this.sgOptions.columns;
            var rowSelector = 'tr.' + _this.generateRowClassName() + '[data-id="' + id + '"]';

            $(rowSelector).replaceWith(_this.generateRowHtml(id, cols, rowData, 'updated'));

            _this.indexRows();

            if (noHighlight !== false) {
//                $(rowSelector).effect('highlight', {color: _this.sgOptions.highlightColor}, 1800);
                setTimeout(function () {
                    $(rowSelector).highlight(_this.sgOptions.highlightColor);
                }, 150);
            }

            if (_this.sgOptions.autoUpdateTableDataField) {
                _this.refreshTableDataField();
            }
        };

        this.addRow = function (rowData, noHighlight, state) {
            var cols = _this.sgOptions.columns;
            var id = rowData[_this.sgOptions.idColumn] ? rowData[_this.sgOptions.idColumn] : _this.generateTemporaryRowId();

            if ($(_this.selector + ' tbody').length === 0) {
                //  put a tbody tag if it's not present
                $(_this.selector).append('<tbody></tbody>');
            }

            if (!state) {
                state = 'created';
            }

            $(_this.selector + ' tbody').prepend(_this.generateRowHtml(id, cols, rowData, state));

            _this.indexRows();

            if (noHighlight !== false) {
                setTimeout(function () {
                    $('tr.' + _this.generateRowClassName() + '[data-id="' + id + '"]').highlight(_this.sgOptions.highlightColor);
                }, 150);
            }

            if (_this.sgOptions.autoUpdateTableDataField) {
                _this.refreshTableDataField();
            }
        };

        this.refreshTableDataField = function () {
            if (_this.sgOptions.updateTableDataToField) {
                var modifiedData = _this.getModifiedData();
                $(_this.sgOptions.updateTableDataToField).val(JSON.stringify(modifiedData));
            }
        };

        this.deleteRow = function (id) {

        };

        this.getDeletedRows = function () {
            var deletedRowsString = $(_this.selector).attr('data-deleted-rows');
            return JSON.parse(deletedRowsString);
        };

        //  </editor-fold>

        /*     * ************************************************************************* */
        //  <editor-fold defaultstate="collapsed" desc="Clear & Close Functions">

        this.clearTable = function () {
            $(_this.selector + ' tbody').html('');
        };

        this.closeOpenRow = function () {
            $('.dropdown-row').remove();
            $('.' + _this.getGeneratedRowEditButtonClassName()).removeClass('active');
            $('.' + _this.getGeneratedRowEditButtonClassName()).html(openRowActionIcon);
        };

        //  </editor-fold>

        /*     * ************************************************************************* */
        //  <editor-fold defaultstate="collapsed" desc="Html & Attribute Generator Functions">

        this.generateRowHtml = function (id, columns, rowData, state) {
            var rowHtml = '<tr class="' + _this.generateRowClassName() + ' " data-id=' + id + ' data-state="' + state + '">';

            if (!_this.sgOptions.viewOnlyMode) {
                rowHtml += '<td>' + _this.generateRowActions(id) + '</td>';
            }

            for (var key in columns) {
                var displayStyle = '';

                if (columns[key].hidden) {
                    displayStyle = ' style="display: none;"';
                }

                var value = rowData[key];
                var display;

                //  if the display should be different from the value
                if (columns[key].displaySourceField) {
                    display = rowData[columns[key].displaySourceField];
                } else {
                    display = value ? value : '';
                }

                if (columns[key].format) {
                    display = formatValue(columns[key], display, true);  //  true = format display                    
                }

                //  assign properties as data properties
                var propertiesHtml = "";
                for (var propertyKey in columns[key]) {
                    propertiesHtml += "data-" + propertyKey + '="' + columns[key][propertyKey] + '"';
                }

                rowHtml += '<td class="data-col" ' + propertiesHtml + ' data-name="' + key + '"' + displayStyle + ' data-value="' + value + '">' + display + '</td>';
            }

            rowHtml += "</tr>";

            return rowHtml;
        };

        this.generateRowClassName = function () {
            //  substring removes #
            return $(this).selector.substring(1) + '-row';
        };

        this.generateTemporaryRowId = function () {

            //  check if the id's are numeric, if yes, get the greatest id and
            //  add 1 to it, otherwise, just get the number of rows and add 1
            var lastRowId = $($(this).selector + ' tbody tr:last').data('id');

            if (isNaN(lastRowId)) {
                return $($(this).selector + ' tbody tr').length;
            } else {

                var greatestId = 0;
                $($(this).selector + ' tbody tr').each(function () {
                    var id = $(this).data('id');
                    if (greatestId < id) {
                        greatestId = id;
                    }
                });

                return greatestId + 1;
            }
        };

        this.generateRowActions = function (id) {
            var editButtonClass = _this.getGeneratedRowEditButtonClassName();
            var removeButtonClass = _this.getGeneratedRowDeleteButtonClassName();

            var editButton = '<a href="javascript:void(0)" class="' + editButtonClass + '" data-id="' + id + '" data-toggle="tooltip" title="Edit">' + openRowActionIcon + '</a>';
            var removeButton = '<a href="javascript:void(0)" class="' + removeButtonClass + '" data-id="' + id + '" data-toggle="tooltip" title="Remove">' + removeRowActionIcon + '</a>';

            return editButton + removeButton;
        };

        this.getGeneratedRowEditButtonClassName = function () {
            //  substring removes #
            return $(this).selector.substring(1) + '-action-edit-row';
        };

        this.getGeneratedRowDeleteButtonClassName = function () {
            return $(this).selector.substring(1) + '-action-remove-row';
        };

        //  </editor-fold>

        /*     * ************************************************************************* */
        //  <editor-fold defaultstate="collapsed" desc="Open Row Functions">

        this.openNextRow = function (currentRowId) {
            var currentRowIndex = _this.indexedRowIdList.indexOf(currentRowId);

            //  if a next row still exists, open it, otherwise, open a new row for
            //  creation
            if (currentRowIndex < _this.indexedRowIdList.length) {
                _this.openRowForEditing(_this.indexedRowIdList[currentRowIndex + 1]);
            } else {
                _this.openRowForCreate();
            }
        };

        this.openRowForCreate = function () {
            _this.closeOpenRow();
            $(_this.selector + ' .action-add-entry').closest('tr').after(createOpenRow(0, 'create'));
            onRowOpened(_this);
        };

        this.openRowForEditing = function (id) {
            var selector = '.' + _this.getGeneratedRowEditButtonClassName() + '[data-id=' + id + ']';
            var isActive = $(selector).hasClass('active');

            _this.closeOpenRow();

            if (!isActive) {
                $(selector).addClass('active');
                $(selector).html(closeRowActionIcon);
                $(selector).closest('tr').after(createOpenRow(id, 'edit'));
                assignValuesToDropdownRowFields(_this, _this.getRowData(id));
                onRowOpened(_this);
            }
        };

        //  </editor-fold>

        generateHeaderRow(this);
//        generateFooterRow(this);
        initializeComponents(this);

        if (!this.sgOptions.viewOnlyMode) {
            addDeletedDocumentsProperty(this);
            addCreateColumn(this);
        }

        initializeEvents(this);

        return this;
    };

    //      
    /*     * ************************************************************************* */
    //  <editor-fold defaultstate="collapsed" desc="Initializer Functions">

    function initializeComponents(sgTable) {
        //  values
        columnCount = $(sgTable.selector + ' thead tr th').length;

        if (columnCount <= 0) {
            columnCount = $(sgTable.selector + ' thead tr td').length;
        }

        //  templates
        if (!sgTable.sgOptions.viewOnlyMode) {
            dropdownRowTemplate = _.template($(sgTable.sgOptions.dropdownRowTemplate).html());

            if (sgTable.sgOptions.dropdownRowActionsTemplate) {
                dropdownRowCreateActionsTemplate = _.template($(sgTable.sgOptions.dropdownRowActionsTemplate).html());
                dropdownRowEditActionsTemplate = _.template($(sgTable.sgOptions.dropdownRowActionsTemplate).html());
            } else {
                if (sgTable.sgOptions.dropdownRowCreateActionsTemplate) {
                    dropdownRowCreateActionsTemplate = _.template($(sgTable.sgOptions.dropdownRowCreateActionsTemplate).html());
                }

                if (sgTable.sgOptions.dropdownRowEditActionsTemplate) {
                    dropdownRowEditActionsTemplate = _.template($(sgTable.sgOptions.dropdownRowEditActionsTemplate).html());
                }
            }
        }

    }

    function validateAndInitializeOptions(sgTable, options) {

        //  Note: errors are thrown instead of exception to force definition of 
        //  options and dropdownRowTemplate
        if (options === undefined) {
            throw new Error('options of SGTable is required!');
        }

        if (!options.viewOnlyMode) {
            options.viewOnlyMode = false;
        }

        if (options.dropdownRowTemplate === undefined && options.viewOnlyMode === false) {
            throw new Error('dropdownRowTemplate in options of SGTable is required!');
        }

        options.dropdownRowTemplate = options.dropdownRowTemplate ? options.dropdownRowTemplate : sgTable.selector + '-row';
        if (!$(options.dropdownRowTemplate).length && $(options.dropdownRowTemplate).html()) {
            throw new Error(options.dropdownRowTemplate + " does not exist");
        }

        //  optional options / defaults
        if (!options.columns) {
            options.columns = {};
        }

        if (!options.columnDefs) {
            options.columnDefs = [];
        }

        if (options.hideIdColumn === undefined) {
            options.hideIdColumn = true;
        }

        if (options.highlightColor === undefined) {
            //  default: violet
            options.highlightColor = "#605ca8";
        }

        return options;
    }

    function initializeEvents(sgTable) {
        $(sgTable.selector + ' .action-add-entry').click(function (e) {
            e.preventDefault;
            sgTable.openRowForCreate();
        });

        var editButton = sgTable.getGeneratedRowEditButtonClassName();
        $(document).on('click', '.' + editButton, function () {
            var id = $(this).data('id');
            sgTable.openRowForEditing(id);
        });

        var removeButton = sgTable.getGeneratedRowDeleteButtonClassName();
        $(document).on('click', '.' + removeButton, function () {
            var id = $(this).data('id');
            swal({
                title: "Delete Document?",
                text: "Are you sure you want to delete this document?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ed5565",
                confirmButtonText: "Yes, delete the document!",
                closeOnConfirm: true
            }, function () {
                var rowSelector = sgTable.selector + '-row[data-id=' + id + ']';
                var $row = $(rowSelector);
                if ($row.data('state') != 'created') {
                    //  delete in database
                }

                $(sgTable.selector).remove(rowSelector);
                console.log(sgTable.selector + " " + rowSelector);
                alert('asfdasdf');
            });
        });

    }

    //  </editor-fold>

    /*     * ************************************************************************* */
    //  <editor-fold defaultstate="collapsed" desc="HTML Generator Functions">

    function generateHeaderRow(sgTable) {
        var cols = sgTable.sgOptions.columns;
        var rowHtml = "<thead><tr>";

        //  add actions column
        if (!sgTable.sgOptions.viewOnlyMode) {
            rowHtml += '<th></th>';
        }

        //  add all columns
        for (var key in cols) {
            var displayStyle = '';

            if (cols[key].hidden) {
                displayStyle = ' style="display: none;"';
            }

            rowHtml += '<th' + displayStyle + '>' + cols[key].label + '</th>';

        }

        rowHtml += "</tr></thead>";
        $(sgTable.selector).html(rowHtml);
    }

    function generateFooterRow(sgTable) {

        if (sgTable.sgOptions.footer) {
            var cols = sgTable.sgOptions.columns;
            var footerColsData = sgTable.sgOptions.footer;

            var rowHtml = "<tfoot><tr>";

            //  add actions column
            if (!sgTable.sgOptions.viewOnlyMode) {
                rowHtml += '<td></td>';
            }

            //  add all columns
            for (var key in cols) {
                //  totals
                if (footerColsData.totals.indexOf(key) >= 0) {
                    rowHtml += '<td class="footer-total-col" data-column-name="' + key + '"></td>';
                } else {
                    rowHtml += '<td></td>';
                }
            }

            rowHtml += "</tr></tfoot>";

        }

        $(sgTable.selector).append(rowHtml);
    }

    function createOpenRow(id, mode) {
        var dropdownRow = dropdownRowTemplate({id: id});
        var actions = "";

        if (mode === 'edit') {
            actions = dropdownRowEditActionsTemplate({id: id, mode: 'edit'});
        } else if (mode === 'create') {
            actions = dropdownRowCreateActionsTemplate({id: id, mode: 'create'});
        }

        dropdownRow += actions;

        var dropdownRowWrapped = '<tr id="dropdown-row-' + id + '" class="dropdown-row"><td style="display: table-cell" colspan="' + columnCount + '">' + dropdownRow + '<div class="clearfix"></div></td></tr>';

        return dropdownRowWrapped;
    }

    function addDeletedDocumentsProperty(el) {
        $(el.selector).attr('data-deleted-rows', '[]');
    }

    function addCreateColumn(el) {
        var row = '<tfoot><tr><td colspan="' + columnCount + '" style="text-align: center;"><a href="javascript:void(0)" class="action-add-entry">Add Entry</a></td></tr></tfoot>';
        $(el.selector).append(row);
    }

    //  </editor-fold>

    /*     * ************************************************************************* */
    //  <editor-fold defaultstate="collapsed" desc="Event Functions">

    function onRowOpened(sgTable) {
        sgTable.trigger(EVENT_ON_OPEN_ROW);

        if (sgTable.sgOptions.autoFocusField) {
            $('[name=' + sgTable.sgOptions.autoFocusField + ']').focus();
        }
    }

    //  </editor-fold>

    /*     * ************************************************************************* */
    //  <editor-fold defaultstate="collapsed" desc="Data Functions">

    function assignValuesToDropdownRowFields(sgTable, rowValues) {
        var cols = sgTable.sgOptions.columns;

        for (var key in cols) {
            //  if the should be formatted (to valueFormat), format, otherwise, leave it as is
            var value = formatValue(cols[key], rowValues[key]);

            // lazy values are for fields that require somethings to be done first before setting their value            
            $('[name=' + key + ']').attr('data-lazy-value', value);
            $('[name=' + key + ']').val(value);

            if ($.fn.autoNumeric && cols[key].autoNumeric) {
                $('[name=' + key + ']').autoNumeric();
                $('[name=' + key + ']').focusout();
            }
        }
    }

    //  </editor-fold>

    /*     * ************************************************************************* */
    //  <editor-fold defaultstate="collapsed" desc="Formatter Functions">

    function formatValue(columnData, value, display) {

        display = display ? display : false;    //  avoid undefined
        columnDataFormat = display ? columnData.displayFormat : columnData.valueFormat;

        var columnDataFormat;
        var format;
        var formattedValue;

        //  use specific formatting (display or value), if not available, use
        //  generic formatting (format)
        if (columnDataFormat) {
            format = columnDataFormat;
        } else if (columnData.format) {
            format = columnData.format;
        }

        switch (format) {
            case 'integer' :
                formattedValue = Math.round(value);
                break;
            case 'numeric' :
                formattedValue = parseFloat(value);
                formattedValue = formattedValue.toFixed(2);
                break;
            case 'currency' :
                formattedValue = formatCurrency(value);
                break;
            default:
                formattedValue = value;
        }

        return formattedValue;
    }

    function formatCurrency(number, decimals, decimalSeparator, thousandsSeparator) {
        number = parseFloat(number);

        decimals = isNaN(decimals) ? 2 : Math.abs(decimals); //if decimal is zero we must take it, it means user does not want to show any decimal
        decimalSeparator = decimalSeparator || '.'; //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

        /*
         according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
         the fastest way to check for not defined parameter is to use typeof value === 'undefined' 
         rather than doing value === undefined.
         */
        thousandsSeparator = (typeof thousandsSeparator === 'undefined') ? ',' : thousandsSeparator; //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

        var sign = (number < 0) ? '-' : '';
        //extracting the absolute value of the integer part of the number and converting to string
        var absValue = parseInt(number = Math.abs(number).toFixed(decimals)) + '';
        var thousandCount = ((thousandCount = absValue.length) > 3) ? thousandCount % 3 : 0;

        return sign + (thousandCount ? absValue.substr(0, thousandCount) + thousandsSeparator : '') + absValue.substr(thousandCount).replace(/(\d{3})(?=\d)/g, "$1" + thousandsSeparator) + (decimals ? decimalSeparator + Math.abs(number - absValue).toFixed(decimals).slice(2) : '');
    }

    //  </editor-fold>

})(jQuery);