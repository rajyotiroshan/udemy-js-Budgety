/**
 * Global App Controller
 */

 var controller = (function(budgetCtrl, UICtrl){
     //
    var setupEventListener = function() {
        var DOMStrings = UIController.getDOMStrings();
        document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.key === 13 || event.which === 13) {//Enter key is presed
                ctrlAddItem();
            }
        });
    }

    
    var ctrlAddItem = function() {
    //TODO
      //1. Get the field input data.
      var  input = UIController.getInput();
      console.log(input);

      //2. Add the item to the budget controller.
      //3. Add the item to the UI.
      //4. Calculate the budget
      //5. Display budget on the UI.
    }

    return {
        init: function(){
            console.log('Applicaiton has started.');
            setupEventListener();
        }
    }
 })(budgetController, UIController);
 
 /**
 * Budget Controller
 */

var budgetController = (function(){ 
})();

/**
 * UI Controller
 */

var UIController = (function(){
    var DOMStrings =  {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    return {
        getInput: function(){
            var type = document.querySelector(DOMStrings.inputType).value;//inc or exp
            var description = document.querySelector(DOMStrings.inputDescription).value;
            var value = document.querySelector(DOMStrings.inputValue).value;
            return {type, description, value};
        },
        getDOMStrings: function(){
            return DOMStrings;
        }
    }
})();

/**
 * initialize application.
 */

 controller.init();