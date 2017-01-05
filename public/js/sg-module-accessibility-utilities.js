/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SGModuleAccessibilityUtilities = {};

SGModuleAccessibilityUtilities.excludeAccess = function (accessList, excludeList) {

    var filteredAccessList = [];

    for (var i in accessList) {
        if (excludeList.indexOf(accessList[i].access_name) === -1) {
            filteredAccessList.push(accessList[i]);
        }
    }

    return filteredAccessList;

};
