(function(){
  'use strict';

  angular.module('officeAddin')
         .controller('homeController', ['$http', '$q', '$scope', homeController]);

  /**
   * Controller constructor
   */
  function homeController($http, $q, $scope){
    var vm = this;
    
    vm.min = 3;
    vm.max = 20;
    vm.makeSmart = makeSmart;
    vm.result;
    
    /////////////////////////////////////////
		// End of exposed properties and methods. 
    
    var messageBody;
    
    function makeSmart() {
      // Get target words from email body.
      getTargetWordsAsync()
      .then(function(targetWords) {

        // Get smarter words.
        getSmartWordsAsync(targetWords)
          .then(function(smartWords) {

            // Replace target words with smart words.
            for (var i = 0; i < smartWords.length; i++) {
              messageBody = messageBody.replace(smartWords[i].target, smartWords[i].smart);
            }

            Office.context.mailbox.item.body.setAsync(messageBody, function(result) {
              $scope.$apply(function() {
                vm.result = 'Changed ' + smartWords.length + ' words to make you sound smarter.';  
              });
            });
          });
      });
    };

    /**
     * Gets target words to synonymize from email using
     * the minimum and maximum character counts specified
     * by the user.
     */
    function getTargetWordsAsync() {
      var deferred = $q.defer();
      
      var targetWords = [];
      
      // Get the text of the body email.
      Office.context.mailbox.item.body.getAsync({ coercionType: "text" }, function(result) {
        messageBody = result.value;
        var bodyTokenized = messageBody.split(' ');
        
        // Iterate over each word in the email and check to see if its fits length parameters.
        for (var i = 0; i < bodyTokenized.length; i++) {
          var word = bodyTokenized[i];
          word = word.trim();
          word = word.replace(/[.:*!?()#-]/g, '');
          
          // Don't add duplicate words.
          if(targetWords.indexOf(word) > -1) {
            continue;
          }
          
          if (word.length >= vm.min && word.length <= vm.max) {
            targetWords.push(word);
          }
        } 
        
        deferred.resolve(targetWords);
      });
      
      return deferred.promise; 
    };
    
    /**
     * Take the list of target words and get the smartest (i.e. longest) synonym 
     * that we can find.
     */
    function getSmartWordsAsync(targetWords) {
      var deferred = $q.defer();
      
      var smartWords = [];
      var targetWordsProcessed = 0;
      var endpointTemplate = 'https://words.bighugelabs.com/api/2/' + apiKey + '/<word>/json';
     
      for (var i = 0; i < targetWords.length; i++) {
        var endpoint = endpointTemplate.replace('<word>', targetWords[i]);
        
        $http.get(endpoint)
          .then(function(response) {
            var target = response.config.url.split('/')[6];
            
            if (response.data.adjective) {
              smartWords.push({
                'target': target,
                'smart': getLongest(response.data.adjective.syn)
              });
            } else if (response.data.verb) {
              smartWords.push({
                'target': target,
                'smart': getLongest(response.data.verb.syn)
              });
            } else if (response.data.noun) {
              smartWords.push({
                'target': target,
                'smart': getLongest(response.data.noun.syn)
              });
            } else {
              smartWords.push({
                'target': target,
                'smart': target
              });
            }
            
            targetWordsProcessed++;
            if (targetWordsProcessed === targetWords.length) {
              deferred.resolve(smartWords);
            }
            
          }, function(error) {  
            targetWordsProcessed++;
            if (targetWordsProcessed === targetWords.length) {
              deferred.resolve(smartWords);
            }
          });
      }
      
      return deferred.promise;
    };
    
    /**
     * Probably a better way to do this, but I tried like 5 things
     * and it wasn't working. This works.
     */
    function addValue(key, value, smartWords) {
      for (var i = 0; i < smartWords.length; i++) {
        if (smartWords[i].target === key) {
          smartWords[i].smart = value;
          break;
        }
      }
    };
    
    /**
     * Gets the longest synonym we can find to make
     * the user sound extra smart.
     */
    function getLongest(synonyms) {
      if (synonyms === undefined) {
        return 'whimsical';
      }
      
      var longest = synonyms[0];
      for (var i = 1; i < synonyms.length; i++) {
        if (synonyms[i].length > longest.length) {
          longest = synonyms[i];
        }
      }
      
      return longest;
    }
  };

})();
