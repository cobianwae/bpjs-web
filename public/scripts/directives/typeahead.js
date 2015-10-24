angular.module('bpjs.directives')
.directive('typeahead', ['$parse', function($parse) {
  return {
    require: '?ngModel',
    link: function(scope, elm, attr, ngModel) {
      elm.typeahead({
        source: function (query, process) {
          return scope.$apply(function(self) {
            self[attr.src](query, process);
          });
        },
        displayText : function(item){
          return item.unsur;
        },
        afterSelect : function(item){
         scope.$apply(function(self) {
          self[attr.onSelect](item);
        });
       }
     });
    }
  };
}]);