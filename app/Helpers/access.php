<?php

function SGGetDocumentViewURL($docNo) {
    $NSCode    = explode("-", $docNo)[0];
    $moduleURL = "";


    switch ($NSCode) {
        case "PO":
            $moduleURL = "/purchase-order/";
            break;
        default:
//            throw new Exception("The module for document {$docNo} was not found or is not supported");
            return "/module-unsupported/{$docNo}";
    }

    return $moduleURL . $docNo;
}
