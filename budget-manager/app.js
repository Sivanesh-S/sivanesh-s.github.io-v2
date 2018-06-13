var l = {
  title: '.budget__title',
  month: '.budget__title--month',
  total: '.budget__value',
  incomeTotal: '.budget__income--value',
  incomePercentage: '.budget__income--percentage',
  expenseTotal: '.budget__expenses--value',
  expensePercentage: '.budget__expenses--percentage',
  choice: '.add__type',
  desc: '.add__description',
  value: '.add__value',
  btn: '.add__btn',
  incomeList: '.income__list',
  expenseList: '.expenses__list'
}

// Global variables
var i, id_inc, id_dec;

id_inc = 0;
id_dec = 0;


var date = new Date();
var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
document.querySelector(l.month).textContent = month[date.getMonth() - 1] + ' / ' + date.getFullYear();

// Clearing all fields using ==> DRY Principle, IIFE
(function() {
  var a = document.querySelectorAll(l.total + ',' + l.incomeTotal + ',' + l.expenseTotal + ',' + l.expensePercentage);

  for(i = 0; i < a.length; i++) {
    if(i != (a.length - 1)) {
      a[i].textContent = "0.00 ₹";
    } else {
      a[i].textContent = "0.00 %"
    }

  }
})()

// init project variables
var data = {
  arr: {
    inc: {
      id: [],
      desc: [],
      value: []
    },
    exp: {
      id: [],
      desc: [],
      value: []
    }
  },
  tot: {
    inc: 0,
    exp: 0
  },
  total: 0,
  percentage: 0
}

// Manipulations

  // Button can be pressed or press enter key
document.querySelector(l.btn).addEventListener('click',addItem);
document.addEventListener('keypress', function(event) {
  if(event.keyCode === 13) {
    addItem();
  }
})

function addItem() {
    // GetInput
    var type = document.querySelector(l.choice).value;
    var desc = document.querySelector(l.desc).value;
    var value = parseFloat(document.querySelector(l.value).value);
    if(value > 0 && desc != '') {
      console.log(value);
      data.arr[type].id.push(data.arr[type].id.length);
      data.arr[type].desc.push(desc);
      data.arr[type].value.push(value);
      calculations();
      addItemToUI(type, desc, value);

      // Clears input field after submission.
      clearFields();

    }
}


function calculations () {

  // 1. GetTotals for Incomes and expenses
  data.tot.inc = 0;
  data.arr.inc.value.forEach(function(item) {
    data.tot.inc += item;
  })

  data.tot.exp = 0;
  data.arr.exp.value.forEach(function(item) {
    data.tot.exp += item;
  })

  // 2. Get WHole GetTotals
  data.total = data.tot.inc - data.tot.exp;

  // 3. Get Percentages
  data.percentage = (data.tot.exp / data.tot.inc) * 100;
}

function addItemToUI(type, desc, value) {
  var html, selector, expPer;

  if(type === 'inc') {
    html = '<div class="item clearfix" id="income-' + id_inc++ + '"><div class="item__description">' + desc + '</div><div class="right clearfix"><div class="item__value">+ ' + value.toFixed(2) + ' ₹' + '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    selector = l.incomeList;
  } else {
    expPer = ((value / data.tot.inc) * 100).toFixed(1) + '%';
    html = '<div class="item clearfix" id="expense-'+ id_dec++ + '"><div class="item__description">' + desc +'</div><div class="right clearfix"><div class="item__value">- ' + value.toFixed(2) + ' ₹' + '</div><div class="item__percentage">' + expPer + '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    selector = l.expenseList;
  }
  document.querySelector(selector).insertAdjacentHTML('beforeend', html);
  UIChange();


}

function UIChange() {
  // 2. Change totals in income and expense
  document.querySelector(l.incomeTotal).textContent = data.tot.inc.toFixed(2) + ' ₹';
  document.querySelector(l.expenseTotal).textContent = data.tot.exp.toFixed(2) + ' ₹';

  // 3. Change Overall total
  document.querySelector(l.total).textContent = data.total.toFixed(2) + ' ₹';

  // 4. Change Percentage
  document.querySelector(l.expensePercentage).textContent = ((data.tot.exp / data.tot.inc) * 100).toFixed(1) + '%';
}

function clearFields() {
  document.querySelector(l.value).value = ""
  document.querySelector(l.desc).value = ""
  document.querySelector(l.desc).focus();
}

document.querySelector('.container').addEventListener('click', function(event) {
  // Remove from ui
  var id = event.target.parentNode.parentNode.parentNode.id;
  var deleteItem = document.getElementById(id);
  deleteItem.parentNode.removeChild(deleteItem);

  // Remove from Manipulations
  var idnum, type, ls, ii = -1, obj;
  idnum = parseInt(id.split('-')[1]);
  type = id.split('-')[0].slice(0, 3);
  ls = data.arr[type].id;
  obj = data.arr[type];


  for(i = 0; i < data.arr[type].id.length; i++) {
    if(ls[i] === idnum) {
      ii = i;
      break;
    }
  }

  obj.id.splice(ii, 1);
  obj.desc.splice(ii, 1);
  obj.value.splice(ii, 1);

  // Recalculate all stuffs
  calculations();

  UIChange();





})
