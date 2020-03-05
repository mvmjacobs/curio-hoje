var inputCurio = getElementById('curio');
var inputHilux = getElementById('hilux');
var spans = [inputCurio.parentElement, inputHilux.parentElement];
var isActivated = false;

setInputsWidth();

function getElementById(id) {
  return document.getElementById(id);
}

function formatMoney(amount) {
  var decimalCount = 2;
  var decimal = ',';
  var thousands = '.';
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    var negativeSign = amount < 0 ? '-' : '';

    var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    var j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '');
  } catch (e) {
    console.log(e);
  }
};

function split(str, token) {
  var parts = str.split(token);
  if (parts[1] === undefined)
    return str;
  else
    return parts.slice(0, -1).join('') + token + parts.slice(-1);
}

function setValue(currentEl, targetEl) {
  var formattedNumber = currentEl.value;
  formattedNumber = formattedNumber.replace(/\.$/g, '');
  formattedNumber = formattedNumber.replace(/\./g, ',');
  formattedNumber = formattedNumber.replace(/[^0-9\.,]/g, '');
  formattedNumber = formattedNumber.replace(/(\d+)\.(\d+),/g, '$1$2,');
  formattedNumber = split(formattedNumber, ',');
  currentEl.value = formattedNumber;

  var value = parseFloat(currentEl.value.replace(',', '.'));
  if (isNaN(value)) {
    targetEl.value = '0,00';
    return;
  }

  var hiluxPrice = 122590.00;
  var result = currentEl == inputHilux ? (value / hiluxPrice) : (value * hiluxPrice);
  result = formatMoney(result);
  targetEl.value = result;
}

function deactivateInputs() {
  document.body.className = document.body.className.replace(/activated/g, '');
}

function activateInputs() {
  if (!document.body.className.match(/activated/))
    document.body.className += ' activated';
}

function setInputWidth(el) {
  if (el.value.length > 10)
    el.style.width = '6.7em';
  else if (el.value.length < 3)
    el.style.width = (el.value.length * 0.65) + 'em';
  else
    el.style.width = (el.value.length * 0.65 - 0.3) + 'em';
}

function setInputsWidth() {
  setInputWidth(inputCurio);
  setInputWidth(inputHilux);
}

function setInputMask(el) {
  if (!el.value.match(/\d/))
    el.value = '0,00';
  else if (el.value.match(/^\d+(,\d*)?$/))
    el.value = parseFloat(el.value.replace(',', '.')).toFixed(2).replace('.', ',');
}

inputCurio.onfocus = inputHilux.onfocus = function () {
  inputCurio.style.width = inputHilux.style.width = 6.6 + 'em';
  activateInputs();
  isActivated = true;
  var $this = this;
  window.setTimeout(function () {
    $this.select();
  }, 300);
};

inputCurio.onblur = inputHilux.onblur = function () {
  setInputMask(this);
  window.setTimeout(function () {
    if (!isActivated) {
      setInputsWidth();
      deactivateInputs();
    }
  }, 300);
  isActivated = false;
};

spans[0].onmouseover = spans[1].onmouseover = function () {
  if (!isActivated)
    activateInputs();
};

spans[0].onmousedown = spans[1].onmousedown = spans[0].onclick = spans[1].onclick = function (event) {
  if (event.target.tagName != 'INPUT') {
    var input = event.currentTarget.getElementsByTagName('input')[0];
    window.setTimeout(function () {
      input.select();
      input.focus()
    }, 100);
  }
};

spans[0].onmouseout = spans[1].onmouseout = function () {
  if (!isActivated)
    deactivateInputs();
};

inputCurio.onkeyup = function (event) {
  if (!event)
    event = window.event;
  if (event.keyCode != 9)
    setValue(this, inputHilux);
};

inputHilux.onkeyup = function (event) {
  if (!event)
    event = window.event;
  if (event.keyCode != 9)
    setValue(this, inputCurio);
};
