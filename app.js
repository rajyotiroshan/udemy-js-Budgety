/**
 * UI Controller
 */

var UIController = (function(){
    var DOMStrings =  {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: '.container'
    }
    return {
        getInput: function(){
            var type = document.querySelector(DOMStrings.inputType).value;//inc or exp
            var description = document.querySelector(DOMStrings.inputDescription).value;
            var value = parseFloat(document.querySelector(DOMStrings.inputValue).value) ;
            return {type, description, value};
        },
        addListItem: function(itemObj, type){
            var html, newHtml,element;
            //create HTML string with placeholder text.
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-%id%">
                                    <div class="item__description">%description%</div>
                                    <div class="right clearfix">
                                        <div class="item__value">%value%</div>
                                        <div class="item__delete">
                                            <button class="item__delete--btn">
                                                <i class="ion-ios-close-outline"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
            }else if(type === 'exp') {
                element = DOMStrings.expensesContainer;
                html =`<div class="item clearfix" id="exp-%id%">
                                <div class="item__description">%description%</div>
                                <div class="right clearfix">
                                    <div class="item__value">%value%</div>
                                    <div class="item__percentage">21%</div>
                                    <div class="item__delete">
                                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                    </div>
                                </div>
                            </div>`;
            }
            
            //Replace the placeholder text with some actual data.
            newHtml = html.replace('%id%', itemObj.id);
            newHtml = newHtml.replace('%description%', itemObj.description);
            newHtml = newHtml.replace('%value%', itemObj.value);
            
            //insert the HTML into the DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function(){
            var fields, fieldArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription +','+ DOMStrings.inputValue);

            fieldArray = Array.prototype.slice.call(fields);

            fieldArray.forEach(function(current, index, array) {
                current.value = '';             
            });
            
        fieldArray[0].focus();
            
        },
        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent= obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent= obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent= obj.totalExp;
            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent= obj.percentage + "%";
            }else {
                document.querySelector(DOMStrings.percentageLabel).textContent= "---";
            }
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
    
    //calculate total

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach((d)=>{
            sum += d.value;
        });
        data.totals[type] = sum;
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
        },
        budget: 0 ,
        percentage: -1 
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
        },
        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map((d)=>{
                return d.id;
            });

            index = ids.indexOf(id);
            if(index !== -1) {
                data.allItems[type].splice(index,1);
            }
        },
        calculateBudget: function() {
            //calculate total income and expenses.
                calculateTotal('exp');
                calculateTotal('inc');
            //calculate the budget: income-expenses.
                data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent.
                data.percentage = data.totals.inc>0? Math.round((data.totals.exp/data.totals.inc * 100)):-1; 
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function(){
            console.log(data);
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

        //event listener on container of income and expenses list.
        document.querySelector(DOMStrings.container).addEventListener('click',ctrlDeleteItem);
    }

    //calculate and update budget.

    var updateBudget = function(){
        //1. CAlculate the budget.
        budgetCtrl.calculateBudget();
        //2.Return the budget.
        var budget = budgetCtrl.getBudget();
        //3.Display the budget on the UI.
        UICtrl.displayBudget(budget);
    }
    
    var ctrlAddItem = function() {
        var input, newItem;
    //TODO
      //1. Get the field input data.
      input = UICtrl.getInput();
      //console.log(input);
        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. Add the item to the UI.
            UICtrl.addListItem(newItem, input.type);
            //4. clear the fields.
            UICtrl.clearFields();
            //5. Calculate and update budget.
            updateBudget();
        }
     
    }

    //listener for delete item

    var ctrlDeleteItem = function(event) {
        var itemID,splitID,type,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
            // format inc-0 or exp-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //TODO
            //1. delete the item from the data structure.
            budgetCtrl.deleteItem(type,ID);
            //2. Delete the item from the UI.

            //3. Update and show the new budget.
        }
    }

    return {
        init: function(){
            console.log('Applicaiton has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: "---"
            });
            setupEventListener();
        }
    }
 })(budgetController, UIController);
 

/**
 * initialize application.
 */

 controller.init();