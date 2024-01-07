function toggleLanguage() {
  var englishLabel = document.getElementById("english-label");
  var urduLabel = document.getElementById("urdu-label");
  var toggleInput = document.getElementById("toggle-1");

  if (toggleInput.checked) {
    englishLabel.classList.remove("active");
    urduLabel.classList.add("active");
  } else {
    englishLabel.classList.add("active");
    urduLabel.classList.remove("active");
  }
}

//helper function for getting 
function getValue(id) {
  var value = document.getElementById(id).value;
  if (value == "" || isNaN(value)) {
    return 0;
  } else {
    return parseFloat(value);
  }
}

function calculate() {

  // The price of about 3oz of gold
  var amt_nisab = 5301; 
  var amt_home = getValue("amount_home");
  var amt_bank = getValue("amount_bank");
  var amt_shares = getValue("amount_shares");
  var amt_merchandise = getValue("amount_merchandise");
  var amt_gold = getValue("amount_gold");
  var amt_silver = getValue("amount_silver");
  var amt_property = getValue("amount_property");
  var amt_other = getValue("amount_other");
  
  // The sum of all of your different assets that you've had for the last
  // lunar year
  var amt_assets_gross = amt_home + amt_bank + amt_shares + amt_merchandise + amt_gold + amt_silver + amt_property + amt_other;
  
  // Gross assets minus the liabilities you have. Again these are typically
  // immediate liabilities. Not the totality of a large loan like a mortgage
   var amt_assets_net = amt_assets_gross; 
  var amt_eligable = 0; 

  // If this net amount is bigger than the nisab, then it's eligible
  // to have Zakat assessed against it
  if (amt_assets_net > amt_nisab ); {
    amt_eligable = Math.ceil(amt_assets_net);
  }

  // Zakat is 2.5% of ones eligible wealth if it above 
  // Nisab
  var amt_zakat = amt_eligable * .025;

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  });

  // Write the values back for the user
  document.getElementById("amount_eligable").value = formatter.format(amt_eligable);
  document.getElementById("amount_zakat").value = formatter.format(amt_zakat);

  // If the user is eligible to contribute Zakat, set up a Funraise donation
  // button with their Zakat amount. Else, just ask them for a $50 one time donation
}


function initializeDonationModal(amount) {
  // Set the initial values for the donate button
  document.getElementById("donate_now_button").textContent = 'Donate Now';
  document.getElementById("amount_input").value = amount;

  // Add a click event listener to the donate now button
  document.getElementById("donate_now_button").addEventListener("click", function() {
    // Show the donation form
    document.getElementById("donate_modal").modal('show');
  });

  // Donation form submit handler
  document.getElementById("donation_form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting and refreshing the page

    // Get the values of the form fields
    var name = document.getElementById("name_input").value;
    var mobileNumber = document.getElementById("mobile_input").value;
    var amount = document.getElementById("amount_input").value;

    // Send the form data to the backend server via AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "backend.php");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function() {
      // Handle the server response
      if (xhr.status >= 200 && xhr.status < 300) {
        // Show the success message
        $('#donate_modal').modal('hide');
        $('#myModal').modal('show');
      } else {
        // Show the error message
        document.getElementById("donation_error").style.display = "block";
        document.getElementById("donation_form").style.display = "none";
      }
    };
    xhr.send(JSON.stringify({name: name, mobileNumber: mobileNumber, amount: amount}));
  });

  // Donation form cancel button click handler
  document.getElementById("donation_cancel_button").addEventListener("click", function() {
    // Hide the donation form and show the modal content
    document.getElementById("donate_modal").modal('hide');
  });
}





function closeModal() {
    $('#donate_modal').modal('hide');
    $('#upipopup').modal('hide');
}



  




window.onload = function() {
    
    
var name, mobile, amount;

$("#donate_now_button").click(function() {
  // Get the form data
  name = $("#name_input").val();
  mobile = $("#mobile_input").val();
  amount = $("#amount_input").val();

  // Send an AJAX request to the PHP script
  $.ajax({
    type: "POST",
    url: "donate.php",
    data: { name: name, mobile: mobile, amount: amount },
    success: function(response) {
      // If the donation was successfully saved in the database
      if (response.success) {
        // Update the modal content
        $("#donate_now_button").text("Request Receipt");
        $("#donate_now_button").attr("id", "get_receipt");
        $(".modal-title").text("Thank You!");
        $(".modal-body").html('<div class="row"><div class="col-md-6"><img src="zakatqr.png" alt="Qr Image"></div><div class="col-md-6"><h4>Thank you for your donation, ' + name + '!</h4><p>Account Name: <strong>Jamia Mohammedia Konkan Mhasla</strong><br>Current Account No: <strong>750541101000172</strong><br>IFSC Code: KKBK <span style="color:red;">0</span> KMCB <span style="color:red;">0</span> 2 <span style="color:red;">{ZERO}</span></p><br><span style="color:red;"><p>Only Indian Bank Accounts. No International Payments</p><br><h4>UPI - <span style="color:red;">7559325290@ybl</span></h4></div></div><hr>Your donation will go towards supporting our mission and helping those in need.</p>');
      }
      // If there was an error while saving the donation in the database
      
    }
  });
});

$(document).on("click", "#get_receipt", function() {
  // Retrieve the form data from session storage
  
  // Redirect to WhatsApp chat with message
  var message = "Assalamu Alaikum, I want my zakat receipt.";
  var encodedMessage = encodeURIComponent(message);
  var url = "https://wa.me/917057058365?text=" + encodedMessage;
  window.location.href = url;
});



   
 document.getElementById("donate_button").addEventListener("click", function() {
        // Show the Bootstrap modal
        $('#donate_modal').modal('show');
var zakatAmount = document.getElementById("amount_zakat").value;
zakatAmount = zakatAmount.replace('₹', '');
        // Set the value of "amount_input" to "zakatAmount"
        document.getElementById("amount_input").value = zakatAmount;
    });



// get reference to "Generate Image" button and canvas element
const generateButton = document.getElementById('generate_button');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// function to draw labels and values on canvas, with amount to donate highlighted
function drawCanvas() {
  // set canvas dimensions
  canvas.width = 600;
  canvas.height = 500;

  // get values from input fields
  const cashAtHome = document.getElementById('amount_home').value || 0;
  const bankAccount = document.getElementById('amount_bank').value || 0;
  const stocks = document.getElementById('amount_shares').value || 0;
  const inventory = document.getElementById('amount_merchandise').value || 0;
  const goldAndSilver = document.getElementById('amount_gold').value || 0;
  const Silver = document.getElementById('amount_silver').value || 0;
  const investmentProperty = document.getElementById('amount_property').value || 0;
  const otherIncome = document.getElementById('amount_other').value || 0;
  const totalIncome = parseFloat(cashAtHome) + parseFloat(bankAccount) + parseFloat(stocks) + parseFloat(inventory)  + parseFloat(Silver) + parseFloat(goldAndSilver) + parseFloat(investmentProperty) + parseFloat(otherIncome);

 
  // calculate amount eligible for Zakat and Zakat total
  const amountEligible = Math.max(totalIncome, 0);
  const zakatTotal = amountEligible * 0.025;

  // clear canvas
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

 

  // set text styles
  ctx.font = 'bold 20px Arial';
  ctx.fillStyle = '#1399a3';

  

  
  // draw labels and values
  let y = 150;
  ctx.fillText('Cash at Home:', 100, y);
  ctx.fillText("₹ " + cashAtHome, 400, y);
  y += 30;
  ctx.fillText('Bank Account Balance:', 100, y);
  ctx.fillText("₹ " +  bankAccount, 400, y);
  y += 30;
  ctx.fillText('Stocks and Shares:', 100, y);
  ctx.fillText("₹ " + stocks, 400, y);
  y += 30;
  ctx.fillText('Profits & Inventory:', 100, y);
  ctx.fillText("₹ " + inventory, 400, y);
  y += 30;
  ctx.fillText('Gold:', 100, y);
  ctx.fillText("₹ " + goldAndSilver, 400, y);
  y += 30;
  ctx.fillText('Silver:', 100, y);
  ctx.fillText("₹ " + Silver, 400, y);
  y += 30;
  ctx.fillText('Investment Property:', 100, y);
  ctx.fillText("₹ " + investmentProperty, 400, y);
  y += 30;
  ctx.fillText('Any Other Income:', 100, y);
  ctx.fillText("₹ " + otherIncome, 400, y);

  y += 50;

  // highlight amount eligible for Zakat
  ctx.fillStyle = '#b92526';
  ctx.fillText('Amount Eligible for Zakat:', 100, y);
  ctx.fillText("₹ " + amountEligible.toFixed(2), 400, y);

  y += 30;
  
 
// draw Zakat total
ctx.fillStyle = '#b92526';
ctx.fillText('Zakat Amount Payable:', 100, y);
ctx.fillText("₹ " + zakatTotal.toFixed(2), 400, y);
   // highlight Website name
  ctx.fillStyle = '#1399a3';
  ctx.fillText('www.kewa.education/zakat', (canvas.width / 2) - 120 , 490, y);
  

  y += 30;

  
  
// add logo at bottom of image
const logoBottom = new Image();
logoBottom.src = 'https://kewa.education/wp-content/uploads/2022/04/cropped-jamia-logo-original-PNG-1.png';
logoBottom.onload = function() {
const x = (canvas.width / 2) - 40; // center the logo horizontally
const y = canvas.height - 480;
ctx.drawImage(logoBottom, x, y, 80, 80);
}

}

// call drawCanvas function when "Generate Image" button is clicked
generateButton.addEventListener('click', function() {
  drawCanvas();

  // show the "Download Image" button
  const downloadButton = document.getElementById('download_button');
  downloadButton.style.display = 'block';

  // enable the "Download Image" button
  downloadButton.addEventListener('click', function() {
    // download the image
    const link = document.createElement('a');
    link.download = 'zakat_calculator.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});



const englishLabels = {
  amount_home: 'Cash at Home',
  amount_bank: 'Bank Account Balance',
  amount_shares: 'Stocks and Shares',
  amount_merchandise: 'Profits & Inventory',
  amount_gold: 'Gold (In rupees)',
  amount_silver: 'Silver (In rupees)',
  amount_property: 'Investment Property',
  amount_other: 'Any Other Income',
  amount_debts: 'Loan',
  amount_expenses: 'Expenses',
  amount_eligable: 'Total Amount',
  amount_zakat: 'Your Zakat Total (2.5% of Total Amount)',
  donate_button: 'Donate For Madrasa',
  generate_button: 'Generate Image',
  fatwa: 'Fatwa',
  fatwa1: 'Fatwa'
};

const urduLabels = {
  amount_home: 'گھر میں موجود رقم',
  amount_bank: 'بینک حساب کی رقم',
  amount_shares: 'اسٹاک اور شئیرز کی قیمت',
  amount_merchandise: 'مصنوعات کی منافع اور اسٹاک',
  amount_gold: 'سونے (روپے میں)',
  amount_silver: 'چاندی (روپے میں)',
  amount_property: 'پراپرٹی کا سرمایہ کاری',
  amount_other: 'دیگر کسی قسم کی آمدنی',
  amount_debts: 'قرضے',
  amount_expenses: 'خرچے',
  amount_eligable: 'زکاۃ کے لیے اہل رقم',
  amount_zakat: 'آآپ کی کل زکات ( 2.5 % )',
  donate_button: 'مدرسہ کے لئے دانش کریں',
  generate_button: 'تصویر بنائیں',
  fatwa: 'فتویٰ',
  fatwa1: 'فتویٰ'
};

function toggleLanguage() {
  const toggleSwitch = document.getElementById('toggle-1');
  const labels = toggleSwitch.checked ? urduLabels : englishLabels;

  // Update labels
  for (const id in labels) {
    const element = document.querySelector(`[for="${id}"]`);
    if (element ) {
      element.textContent = labels[id];
    }
  }

  // Update links
  const links = document.querySelectorAll(`a[href*="/en/"], a[href*="/ur/"]`);
  if (links.length > 0) {
    links.forEach((link) => {
      if (link.getAttribute('id') === 'fatwa') {
        link.textContent = labels.fatwa;
        link.href = link.href.replace(toggleSwitch.checked ? '/en/' : '/ur/', toggleSwitch.checked ? '/ur/' : '/en/');
      }
      if (link.getAttribute('id') === 'fatwa1') {
        link.textContent = labels.fatwa1;
      }
    });
  }
}



toggleLanguage(); // initialize labels based on default language
document.getElementById('toggle-1').addEventListener('change', toggleLanguage);
}