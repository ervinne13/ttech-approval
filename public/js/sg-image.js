
(function ($) {

    $.fn.SGImage = function (options) {
        validateOptions(options);

        var $displayImageTo = $(options.displayImageTo);
        if (window.FileReader) {
            this.change(function () {
                var fileReader = new FileReader();

                if (!this.files.length) {
                    return;
                }

                var file = this.files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function () {
//                        $sgImage.val("");
                        $(options.setImageTo).val(this.result);
                        if ($displayImageTo.cropper) {
                            $displayImageTo.cropper("reset", true).cropper("replace", this.result);
                        } else {
                            $displayImageTo.attr('src', this.result);
                        }
                    };
                } else {
                    showMessage("Please choose an image file.");
                }
            });
        } else {
            $displayImageTo.addClass("hide");
        }

    };

    function validateOptions(options) {
        if (!options) {
            throw new Error("Options is required for SGImage");
        }

        if (!options.displayImageTo) {
            throw new Error("displayImageTo is required for SGImage");
        }
    }

})(jQuery);
