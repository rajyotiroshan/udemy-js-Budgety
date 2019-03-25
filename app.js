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
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var nodeListForEach = function(list, callback){
        for(var i =0; i< list.length; i++) {
            callback(list[i],i)
        }
    };

  

    var formatNumber =  function(num, type){
        /*
            1. + or - before number 
            2. exactly 2 decimal point
            3.comma seperating the thousands.
            2310.4567-> + 2,310.46
        */
       var numSplit, int, dec;
       num= Math.abs(num);
       num = num.toFixed(2);// decimal point.
       numSplit = num.split('.');
       int = numSplit[0];
       dec = numSplit[1];
       if(int.length > 3){//more than thousand.
           int =  int.substr(0, int.length-3)+ ','+ int.substr(int.length-3,3);
       }
       dec  = numSplit[1];
       return (type === 'exp'?'-':'+')+' '+ int + '.' +dec;
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
            newHtml = newHtml.replace('%value%',formatNumber(itemObj.value,type));
            
            //insert the HTML into the DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el)
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
            var type;
            obj.budget>0? type='inc': type='exp';
            document.querySelector(DOMStrings.budgetLabel).textContent= formatNumber(obj.budget, type) ;
            document.querySelector(DOMStrings.incomeLabel).textContent= formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent= formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent= obj.percentage + "%";
            }else {
                document.querySelector(DOMStrings.percentageLabel).textContent= "---";
            }
        },
        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);
        
            nodeListForEach(fields, function(current,index){
                if(percentages[index]>0){
                   current.textContent= percentages[index]+"%"; 
                }else {
                    current.textContent = "---";
                }
                
            });


        },
        displayMonth: function(){
            var now, year, month, months;
            months = ['January', 'February', 'March', 'April','May','June','July','August','September','October','November','December'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' +year
        },
        changedType:function(){
            var fields = document.querySelectorAll(
                DOMStrings.inputType+','+
                DOMStrings.inputDescription+','+
                DOMStrings.inputValue
            );
    
            nodeListForEach(fields, (curr)=>{
                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
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
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round(((this.value / totalIncome) * 100));
        }else {
            this.percentage= -1;
        }   
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

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
        calculatePercentages: function(){
            data.allItems.exp.forEach((d)=>{
                d.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPercentages = data.allItems.exp.map((d)=>{
                return d.getPercentage();
            });
            return allPercentages;
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
        
        //
        document.querySelector(DOMStrings.inputType).addEventListener('change', UICtrl.changedType);
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
    
    // calculate and update percentages.

    var updatePercentages = function(){
        //1. Calculate percentages.
        budgetCtrl.calculatePercentages();
        //2.Readpercentages from the budget controller.
        var percentages = budgetCtrl.getPercentages();
        //3. Update the UI with the new percentages.
        UICtrl.displayPercentages(percentages);
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
            //6. calculate and update percentages.
            updatePercentages();
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
            UICtrl.deleteListItem(itemID);
            //3. Update and show the new budget.
            updateBudget();
            //4. update percentages.
            updatePercentages();
        }
    }

    return {
        init: function(){
            console.log('Applicaiton has started.');
            UICtrl.displayMonth();
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