/**
 * Budget Controller
 */

var budgetController = (function(){
   
    
})();

/**
 * UI Controller
 */

var UIController = (function(){
    //Code
})();


/**
 * Global App Controller
 */

 var controller = (function(budgetCtrl, UICtrl){
    var ctrlAddItem = function() {
    //TODO
      //1. Get the field input data.
      //2. Add the item to the budget controller.
      //3. Add the item to the UI.
      //4. Calculate the budget
      //5. Display budget on the UI.
      console.log('Add button')
    }


  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event){
    if(event.key === 13 || event.which === 13) {//Enter key is presed
        ctrlAddItem();
    }
  });

 })(budgetController, UIController);