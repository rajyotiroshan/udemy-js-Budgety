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
 * Budget Controller
 */

var budgetController = (function(){ 
    
    //Expense Consrtuctor
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    //Income Constructor.
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    //store the App datas.
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }  
    };
    
    //Object containing all public method for budgetController module.
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            //Create new ID 
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            } else {
                ID = 0;
            }
            //new item based on 'inc' or 'exp' type.
              if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            }else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            //push it into the data structure.
            data.allItems[type].push(newItem);        
            return newItem;     
        } 
    }

})();


/**
 * Global App Controller
 */

 var controller = (function(budgetCtrl, UICtrl){
     //
    var setupEventListener = function() {
        var DOMStrings = UICtrl.getDOMStrings();
        document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.key === 13 || event.which === 13) {//Enter key is presed
                ctrlAddItem();
            }
        });
    }

    
    var ctrlAddItem = function() {
        var input, newItem;
    //TODO
      //1. Get the field input data.
      input = UICtrl.getInput();
      console.log(input);

      //2. Add the item to the budget controller.
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
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
 * initialize application.
 */

 controller.init();